// ==UserScript==
// @name         随机自动登录系统
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  随机尝试多个账号密码进行登录，间隔2秒
// @author       LoginMaster
// @match        *://*/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/549197/%E9%9A%8F%E6%9C%BA%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/549197/%E9%9A%8F%E6%9C%BA%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 账号密码键值对
 const accounts = [
    { username: "2208441001", password: "010548" },
    { username: "2208441002", password: "03782X" },
    { username: "2208441003", password: "022084" },
    { username: "2208441004", password: "032120" },
    { username: "2208441005", password: "29332X" },
    { username: "2208441006", password: "200317" },
    { username: "2208441007", password: "01729X" },
    { username: "2208441008", password: "131278" },
    { username: "2208441009", password: "217463" },
    { username: "2208441010", password: "25797X" },
    { username: "2208441011", password: "175217" },
    { username: "2208441012", password: "204419" },
    { username: "2208441013", password: "170214" },
    { username: "2208441014", password: "115619" },
    { username: "2208441015", password: "212135" },
    { username: "2208441016", password: "207468" },
    { username: "2208441017", password: "105832" },
    { username: "2208441018", password: "016216" },
    { username: "2208441019", password: "317914" },
    { username: "2208441020", password: "041778" },
    { username: "2208441021", password: "263217" },
    { username: "2208441022", password: "22253X" },
    { username: "2208441023", password: "026253" },
    { username: "2208441024", password: "084350" },
    { username: "2208441025", password: "264552" },
    { username: "2208441026", password: "180011" },
    { username: "2208441027", password: "202362" },
    { username: "2208441028", password: "161536" },
    { username: "2208441029", password: "071010" },
    { username: "2208441030", password: "273629" },
    { username: "2208441031", password: "125610" },
    { username: "2208441032", password: "027118" },
    { username: "2208441033", password: "267237" },
    { username: "2208441034", password: "063596" },
    { username: "2208441035", password: "250823" },
    { username: "2208441036", password: "302036" },
    { username: "2208441037", password: "158910" },
    { username: "2208441038", password: "175213" },
    { username: "2208441039", password: "122416" },
    { username: "2208441040", password: "152014" },
    { username: "2208441041", password: "020036" },
    { username: "2208441042", password: "124035" },
    { username: "2208441043", password: "242813" },
    { username: "2208441044", password: "234010" },
    { username: "2208441045", password: "082682" },
    { username: "2208441046", password: "206203" },
    { username: "2208441047", password: "171916" },
    { username: "2208441048", password: "298026" },
    { username: "2208441049", password: "062057" },
    { username: "2208441050", password: "176634" },
    { username: "2208441051", password: "192510" },
    { username: "2208441052", password: "266816" },
    { username: "2208441053", password: "241810" },
    { username: "2208441054", password: "020024" },
    { username: "2208441055", password: "084927" },
    { username: "2208441056", password: "280152" },
    { username: "2208441057", password: "095814" },
    { username: "2208441058", password: "116919" },
    { username: "2208441059", password: "256054" },
    { username: "2208441060", password: "244922" },
    { username: "2208411001", password: "100910" },
    { username: "2208411003", password: "183946" },
    { username: "2208411005", password: "110615" },
    { username: "2208411007", password: "274587" },
    { username: "2208411011", password: "023319" },
    { username: "2208411013", password: "121037" },
    { username: "2208411015", password: "174223" },
    { username: "2208411017", password: "287418" },
    { username: "2208411019", password: "250840" },
    { username: "2208411021", password: "317412" },
    { username: "2208411023", password: "278194" },
    { username: "2208411025", password: "072227" },
    { username: "2208411027", password: "168934" },
    { username: "2208411029", password: "053416" },
    { username: "2208411031", password: "094514" },
    { username: "2208411033", password: "203111" },
    { username: "2208411035", password: "251414" },
    { username: "2208411037", password: "274239" },
    { username: "2208411039", password: "080338" },
    { username: "2208411041", password: "053114" },
    { username: "2208411043", password: "247009" },
    { username: "2208411045", password: "22820X" },
    { username: "2208411047", password: "170075" },
    { username: "2208411049", password: "078927" },
    { username: "2208411051", password: "05521X" },
    { username: "2208411053", password: "160034" },
    { username: "2208411055", password: "104616" },
    { username: "2208411057", password: "020059" },
    { username: "2208411059", password: "159028" },
    { username: "2208411061", password: "216245" },
    { username: "2208411063", password: "220613" },
    { username: "2208411065", password: "04481X" },
    { username: "2208411067", password: "263277" },
    { username: "2208411069", password: "230991" },
    { username: "2208411071", password: "093750" },
    { username: "2208411073", password: "030611" },
    { username: "2208411075", password: "013224" },
    { username: "2208411077", password: "11130X" },
    { username: "2208411079", password: "042429" },
    { username: "2208411081", password: "110093" },
    { username: "2208411083", password: "100075" },
    { username: "2208411085", password: "010133" },
    { username: "2208411087", password: "200016" },
    { username: "2208411089", password: "120117" },
    { username: "2208411091", password: "29652X" },
    { username: "2208411093", password: "232885" },
    { username: "2208411095", password: "070829" },
    { username: "2208411097", password: "112517" },
    { username: "2208411099", password: "230044" },
    { username: "2208411002", password: "261027" },
    { username: "2208411004", password: "090020" },
    { username: "2208411006", password: "146836" },
    { username: "2208411008", password: "24003X" }
];

    // 创建UI界面
    function createLoginUI() {
        // 检查是否已经存在UI
        if (document.getElementById('autoLoginContainer')) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'autoLoginContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: Arial, sans-serif;
            max-height: 80vh;
            overflow-y: auto;
        `;

        container.innerHTML = `
            <div style="padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px 10px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 18px;">随机自动登录系统</h2>
                <span id="closeAutoLogin" style="cursor: pointer; font-size: 20px;">&times;</span>
            </div>
            <div style="padding: 15px;">
                <div style="margin-bottom: 15px;">
                    <button id="startAutoLogin" style="background: linear-gradient(to right, #4facfe, #00f2fe); color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-right: 10px; font-weight: bold;">开始自动登录</button>
                    <button id="stopAutoLogin" style="background: #ff4757; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">停止</button>
                    <div style="margin-top: 10px;">
                        <label style="display: flex; align-items: center;">
                            <input type="checkbox" id="randomOrder" checked style="margin-right: 5px;"> 随机顺序尝试
                        </label>
                    </div>
                </div>
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 5px; color: #333;">登录状态</div>
                    <div id="loginStatus" style="min-height: 80px; padding: 10px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #4facfe; font-size: 14px;">
                        等待开始自动登录...
                    </div>
                </div>
                <div>
                    <div style="font-weight: bold; margin-bottom: 5px; color: #333;">账号列表 (共${accounts.length}个)</div>
                    <div id="accountList" style="max-height: 200px; overflow-y: auto;">
                        <!-- 账号列表将由JavaScript生成 -->
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // 初始化账号列表
        initAccountList();

        // 添加事件监听器
        document.getElementById('startAutoLogin').addEventListener('click', startAutoLogin);
        document.getElementById('stopAutoLogin').addEventListener('click', stopAutoLogin);
        document.getElementById('closeAutoLogin').addEventListener('click', function() {
            container.style.display = 'none';
        });

        // 添加拖拽功能
        makeDraggable(container);
    }

    // 初始化账号列表显示
    function initAccountList() {
        const accountList = document.getElementById('accountList');
        accountList.innerHTML = '';

        accounts.forEach((account, index) => {
            const accountItem = document.createElement('div');
            accountItem.className = 'account-item';
            accountItem.id = `account-${index}`;
            accountItem.style.cssText = `
                padding: 8px;
                margin-bottom: 5px;
                background: #f8f9fa;
                border-radius: 5px;
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                transition: all 0.3s ease;
            `;
            accountItem.innerHTML = `
                <span>${account.username}</span>
                <span>${'*'.repeat(account.password.length)}</span>
            `;
            accountList.appendChild(accountItem);
        });
    }

    // 更新当前尝试的账号高亮
    function updateCurrentAccountHighlight(index) {
        // 移除所有高亮
        document.querySelectorAll('.account-item').forEach(item => {
            item.style.background = '#f8f9fa';
            item.style.borderLeft = 'none';
        });

        // 添加当前高亮
        const currentAccountElement = document.getElementById(`account-${index}`);
        if (currentAccountElement) {
            currentAccountElement.style.background = '#e6f7ff';
            currentAccountElement.style.borderLeft = '3px solid #4facfe';

            // 滚动到可见区域
            currentAccountElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // 查找登录表单
    function findLoginForm() {
        // 尝试常见的选择器
        const possibleSelectors = [
            'input[type="password"]',
            'input[name*="pass"]',
            'input[id*="pass"]',
            'input[name*="user"]',
            'input[id*="user"]',
            'input[name*="login"]',
            'input[id*="login"]'
        ];

        for (const selector of possibleSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                return elements[0].form || findParentForm(elements[0]);
            }
        }

        return null;
    }

    // 查找父级表单
    function findParentForm(element) {
        while (element && element.nodeName !== 'FORM') {
            element = element.parentElement;
        }
        return element;
    }

    // 尝试登录
    function tryLogin(account, index) {
        const loginForm = findLoginForm();
        if (!loginForm) {
            updateStatus('未找到登录表单', 'error');
            return false;
        }

        // 查找用户名和密码输入框
        const usernameInput = findUsernameField(loginForm);
        const passwordInput = findPasswordField(loginForm);

        if (!usernameInput || !passwordInput) {
            updateStatus('未找到用户名或密码输入框', 'error');
            return false;
        }

        // 填充表单
        usernameInput.value = account.username;
        passwordInput.value = account.password;

        // 触发输入事件以确保React等框架能检测到值变化
        triggerInputEvent(usernameInput);
        triggerInputEvent(passwordInput);

        // 更新状态
        updateStatus(`尝试登录: ${account.username} / ${account.password}`, 'info');

        // 更新高亮
        updateCurrentAccountHighlight(index);

        // 提交表单
        try {
            loginForm.submit();
            return true;
        } catch (e) {
            // 如果直接提交失败，尝试查找提交按钮并点击
            const submitButton = findSubmitButton(loginForm);
            if (submitButton) {
                submitButton.click();
                return true;
            } else {
                updateStatus('无法提交表单', 'error');
                return false;
            }
        }
    }

    // 查找用户名字段
    function findUsernameField(form) {
        const possibleNames = ['username', 'user', 'login', 'email', 'account'];
        for (const name of possibleNames) {
            const input = form.querySelector(`input[name*="${name}"], input[id*="${name}"]`);
            if (input && input.type !== 'password') {
                return input;
            }
        }
        return form.querySelector('input[type="text"], input:not([type="password"])');
    }

    // 查找密码字段
    function findPasswordField(form) {
        return form.querySelector('input[type="password"]');
    }

    // 查找提交按钮
    function findSubmitButton(form) {
        const possibleTypes = ['submit', 'button'];
        for (const type of possibleTypes) {
            const button = form.querySelector(`input[type="${type}"], button[type="${type}"]`);
            if (button) return button;
        }
        return form.querySelector('button, input[type="submit"]');
    }

    // 触发输入事件
    function triggerInputEvent(input) {
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);

        const changeEvent = new Event('change', { bubbles: true });
        input.dispatchEvent(changeEvent);
    }

    // 更新状态显示
    function updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('loginStatus');
        const time = new Date().toLocaleTimeString();
        const color = type === 'error' ? '#ff4757' : (type === 'success' ? '#2ed573' : '#3742fa');

        statusElement.innerHTML += `<div style="margin: 5px 0; color: ${color};"><small>[${time}]</small> ${message}</div>`;
        statusElement.scrollTop = statusElement.scrollHeight;
    }

    // 开始自动登录过程
    function startAutoLogin() {
        if (window.autoLoginInterval) {
            clearInterval(window.autoLoginInterval);
        }

        updateStatus('开始自动登录过程...', 'info');

        const randomOrder = document.getElementById('randomOrder').checked;
        let currentAccountIndex = 0;
        let triedIndices = [];

        // 立即尝试第一个账号
        let indexToTry;
        if (randomOrder) {
            indexToTry = Math.floor(Math.random() * accounts.length);
            triedIndices.push(indexToTry);
        } else {
            indexToTry = currentAccountIndex;
            currentAccountIndex = (currentAccountIndex + 1) % accounts.length;
        }

        const success = tryLogin(accounts[indexToTry], indexToTry);

        // 设置定时器，每隔2秒尝试下一个账号
        window.autoLoginInterval = setInterval(() => {
            if (!randomOrder && currentAccountIndex === 0) {
                updateStatus('所有账号已尝试完毕，重新开始循环', 'info');
            }

            if (randomOrder) {
                // 随机模式：确保不重复尝试，除非所有账号都已尝试
                if (triedIndices.length >= accounts.length) {
                    triedIndices = [];
                }

                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * accounts.length);
                } while (triedIndices.includes(newIndex));

                indexToTry = newIndex;
                triedIndices.push(indexToTry);
            } else {
                // 顺序模式
                indexToTry = currentAccountIndex;
                currentAccountIndex = (currentAccountIndex + 1) % accounts.length;
            }

            tryLogin(accounts[indexToTry], indexToTry);
        }, 2000); // 2秒间隔
    }

    // 停止自动登录
    function stopAutoLogin() {
        if (window.autoLoginInterval) {
            clearInterval(window.autoLoginInterval);
            updateStatus('自动登录已停止', 'info');
        }
    }

    // 使元素可拖拽
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('div:first-child');

        if (header) {
            header.style.cursor = 'move';
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标初始位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新的光标位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.right = "unset";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 初始化
    function init() {
        createLoginUI();

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .account-item.current {
                background: #e6f7ff !important;
                border-left: 3px solid #4facfe !important;
            }
            #startAutoLogin:hover, #stopAutoLogin:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
        `;
        document.head.appendChild(style);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();