// ==UserScript==
// @name         一觉醒来，我成站长了？
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在Bangumi用户页面添加一个管理按钮，模拟用户封禁功能。
// @author       zhangxianzhong
// @match        *://bangumi.tv/user/*
// @match        *://bgm.tv/user/*
// @match        *://chii.in/user/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551336/%E4%B8%80%E8%A7%89%E9%86%92%E6%9D%A5%EF%BC%8C%E6%88%91%E6%88%90%E7%AB%99%E9%95%BF%E4%BA%86%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/551336/%E4%B8%80%E8%A7%89%E9%86%92%E6%9D%A5%EF%BC%8C%E6%88%91%E6%88%90%E7%AB%99%E9%95%BF%E4%BA%86%EF%BC%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前用户ID
    const currentUserId = window.location.pathname.split('/user/')[1];
    if (!currentUserId) return;

    const BANNED_USERS_KEY = 'bangumi_banned_users';
    const GUIDELINE_LINK = '/about/guideline';

    // 存储和加载封禁用户列表
    function getBannedUsers() {
        try {
            const bannedUsersJson = localStorage.getItem(BANNED_USERS_KEY);
            return bannedUsersJson ? new Map(JSON.parse(bannedUsersJson)) : new Map();
        } catch (e) {
            console.error("Error loading banned users from localStorage:", e);
            return new Map();
        }
    }

    function saveBannedUsers(bannedUsersMap) {
        try {
            localStorage.setItem(BANNED_USERS_KEY, JSON.stringify(Array.from(bannedUsersMap.entries())));
        } catch (e) {
            console.error("Error saving banned users to localStorage:", e);
        }
    }

    let bannedUsers = getBannedUsers();

    // 格式化日期时间
    function formatDateTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // 检查页面是否已经是官方封禁状态
    function isOfficiallyBannedPage() {
        const mainWrapper = document.getElementById('main');
        if (mainWrapper) {
            const tipIntro = mainWrapper.querySelector('.tipIntro');
            if (tipIntro && tipIntro.querySelector('h3') && tipIntro.querySelector('h3').innerText === '用户已封禁') {
                return true;
            }
        }
        return false;
    }

    // 检查并更新用户封禁状态 (仅限脚本层面的封禁)
    function checkAndUnbanUser() {
        if (bannedUsers.has(currentUserId)) {
            const banInfo = bannedUsers.get(currentUserId);
            // 如果是脚本层面的封禁，并且有解封时间，且时间已到
            // 注意：这里我们只处理脚本封禁的自动解封，不触及官方封禁
            if (!banInfo.isOfficialBanned && !banInfo.isOfficialUnban && banInfo.unbanTime && new Date().getTime() >= new Date(banInfo.unbanTime).getTime()) {
                // 时间到了，解除封禁
                bannedUsers.delete(currentUserId);
                saveBannedUsers(bannedUsers);
                console.log(`用户 ${currentUserId} 已自动解除脚本封禁。`);
                return true; // 已解封
            }
        }
        return false; // 未解封或没有脚本封禁信息
    }

    // 渲染用户状态
    function renderUserStatus() {
        const mainWrapper = document.getElementById('main');
        if (!mainWrapper) return;

        const isOfficiallyBanned = isOfficiallyBannedPage();
        const banInfo = bannedUsers.get(currentUserId);
        const isScriptUnbannedOfficial = banInfo && banInfo.isOfficialUnban;
        const isUserBannedByScript = banInfo && !banInfo.isOfficialUnban && !banInfo.isOfficialBanned; // 明确是脚本封禁的

        // 查找可能由脚本添加的封禁提示（ID为script-ban-tipIntro）
        let scriptAddedBanTip = document.getElementById('script-ban-tipIntro');
        if (scriptAddedBanTip) {
            scriptAddedBanTip.remove(); // 总是先移除旧的脚本提示，避免重复
        }

        // 情况1: 用户被脚本封禁 (最高优先级)
        if (isUserBannedByScript) {
            const currentBanInfo = bannedUsers.get(currentUserId);
            let banReason = currentBanInfo.reason || '违反社区指导原则';
            const banDuration = currentBanInfo.duration || '永久';
            const unbanTime = currentBanInfo.unbanTime;

            if (banReason.includes('违反社区指导原则') && !banReason.includes(GUIDELINE_LINK)) {
                banReason = banReason.replace('违反社区指导原则', `违反<a href="${GUIDELINE_LINK}" class="l">社区指导原则</a>`);
            }
            if (banReason.includes('严重违反社区指导原则') && !banReason.includes(GUIDELINE_LINK)) {
                banReason = banReason.replace('严重违反社区指导原则', `严重违反<a href="${GUIDELINE_LINK}" class="l">社区指导原则</a>`);
            }

            let banMessage;
            if (banDuration === '永久') {
                banMessage = `该用户因「${banReason}」，已被永久禁用。`;
            } else {
                banMessage = `该用户因「${banReason}」，已被禁用 ${banDuration}，恢复日期：${formatDateTime(new Date(unbanTime))}。`;
            }

            const banHtml = `
                <div class="tipIntro" id="script-ban-tipIntro">
                    <div class="musume"></div>
                    <div class="inner">
                        <a href="/group/forum" target="_blank" class="btnPink rr">获取帮助</a>
                        <h3>用户已封禁</h3>
                        <p class="tip">
                            ${banMessage}
                        </p>
                    </div>
                </div>
            `;
            mainWrapper.insertAdjacentHTML('afterbegin', banHtml); // 插入脚本自己的封禁提示
            console.log(`用户 ${currentUserId} 已被脚本模拟封禁，显示脚本封禁提示。`);

            // 如果此时页面是官方封禁页面，且官方提示还存在，我们应该隐藏它
            let existingOfficialBanTip = mainWrapper.querySelector('.tipIntro:not(#script-ban-tipIntro)');
            if (existingOfficialBanTip) {
                existingOfficialBanTip.style.display = 'none';
            }
            return; // 脚本封禁状态已处理
        }

        // 情况2: 用户被官方封禁，且脚本模拟解除了官方封禁
        if (isOfficiallyBanned && isScriptUnbannedOfficial) {
            // 隐藏官方的封禁提示
            let existingOfficialBanTip = mainWrapper.querySelector('.tipIntro');
            if (existingOfficialBanTip) {
                existingOfficialBanTip.style.display = 'none';
            }
            console.log(`用户 ${currentUserId} 被官方封禁但已被脚本模拟解除，隐藏官方封禁提示。`);
            return; // 已处理模拟解除官方封禁
        }

        // 情况3: 用户被官方封禁，但脚本未曾操作或未模拟解除
        if (isOfficiallyBanned && !isScriptUnbannedOfficial) {
            // 确保官方提示是可见的
            let existingOfficialBanTip = mainWrapper.querySelector('.tipIntro');
            if (existingOfficialBanTip) {
                existingOfficialBanTip.style.display = ''; // 确保显示
            }
            // 确保在localStorage中记录这个官方封禁状态，用于后续“解除封禁”按钮的判断
            if (!banInfo || !banInfo.isOfficialBanned) {
                 bannedUsers.set(currentUserId, { isOfficialBanned: true, isOfficialUnban: false });
                 saveBannedUsers(bannedUsers);
            }
            console.log(`用户 ${currentUserId} 被官方封禁，显示官方封禁提示。`);
            return; // 已处理官方封禁
        }

        // 情况4: 用户正常 (未被任何方式封禁)
        // 此时，确保页面上没有任何封禁提示 (包括官方的和脚本的)
        let existingOfficialBanTip = mainWrapper.querySelector('.tipIntro'); // 再次尝试获取，防止有遗漏
        if (existingOfficialBanTip) {
            existingOfficialBanTip.style.display = 'none'; // 隐藏所有非脚本添加的tipIntro
        }
        console.log(`用户 ${currentUserId} 状态正常，确保无封禁提示。`);
    }

    // 在页面加载时检查并渲染用户状态
    // 这里先执行自动解封，如果自动解封成功，会触发一次 renderUserStatus
    // 否则，也会在页面加载完毕后立即调用 renderUserStatus 确保初始显示正确。
    checkAndUnbanUser();
    renderUserStatus();


    // 查找“发送短消息”按钮的父元素
    const pmButton = document.querySelector('a[href*="/pm/compose/"]');
    if (pmButton && pmButton.parentNode) {
        const parentDiv = pmButton.parentNode;

        // 创建“大杀器”按钮
        const killerButton = document.createElement('a');
        killerButton.href = 'javascript:void(0);'; // 禁用默认链接行为
        killerButton.className = 'chiiBtn';
        killerButton.id = 'killerBtn';
        killerButton.innerHTML = '<span>大杀器</span>';
        killerButton.style.marginLeft = '5px'; // 添加一点间距

        // 插入到“发送短消息”按钮后面
        parentDiv.insertBefore(killerButton, pmButton.nextSibling);

        // 创建弹窗
        const modal = document.createElement('div');
        modal.id = 'killerModal';
        GM_addStyle(`
            #killerModal, #banReasonModal {
                display: none;
                position: fixed;
                z-index: 10000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.4);
            }
            #banReasonModal {
                z-index: 10001; /* 比主弹窗高 */
                background-color: rgba(0,0,0,0.6); /* 更深的背景 */
            }
            #killerModalContent, #banReasonModalContent {
                background-color: #fefefe;
                margin: 15% auto;
                padding: 20px;
                border: 1px solid #888;
                width: 80%;
                max-width: 400px;
                border-radius: 8px;
                position: relative;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            #banReasonModalContent {
                margin: 10% auto;
                max-width: 500px;
            }
            #killerModalContent h3, #banReasonModalContent h3 {
                margin-top: 0;
                color: #333;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            #killerModalContent .button-group, #banReasonModalContent .button-group {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 15px;
            }
            #killerModalContent .button-group button, #banReasonModalContent .button-group button {
                flex: 1 1 calc(50% - 5px); /* 两列布局 */
                padding: 10px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                text-align: center;
                transition: background-color 0.2s ease;
                min-width: fit-content;
            }
            #killerModalContent .button-group button:hover, #banReasonModalContent .button-group button:hover {
                opacity: 0.9;
            }
            #killerModalContent .button-group button.primary, #banReasonModalContent .button-group button.confirm-ban {
                background-color: #f09199; /* 接近chiiBtn的粉色 */
                color: white;
            }
            #killerModalContent .button-group button.danger {
                background-color: #e74c3c;
                color: white;
            }
            #killerModalContent .button-group button.secondary, #banReasonModalContent .button-group button.cancel-ban {
                background-color: #ccc;
                color: #333;
            }
            #killerModalContent .close, #banReasonModalContent .close {
                color: #aaa;
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }
            #killerModalContent .close:hover,
            #killerModalContent .close:focus,
            #banReasonModalContent .close:hover,
            #banReasonModalContent .close:focus {
                color: black;
                text-decoration: none;
                cursor: pointer;
            }

            #banReasonModalContent label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #555;
            }
            #banReasonModalContent select,
            #banReasonModalContent input[type="number"],
            #banReasonModalContent input[type="text"],
            #banReasonModalContent textarea {
                width: calc(100% - 20px);
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 14px;
                box-sizing: border-box; /* 包含padding在内的宽度 */
            }
            #banReasonModalContent input[type="checkbox"] {
                margin-right: 8px;
            }
            #banReasonModalContent .checkbox-group {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 15px;
                font-size: 14px;
            }
            #banReasonModalContent .checkbox-group label {
                font-weight: normal;
                display: flex;
                align-items: center;
                margin-bottom: 0;
            }
            #banReasonModalContent .checkbox-group label.disabled {
                color: #999;
                cursor: not-allowed;
            }
            #banReasonModalContent .checkbox-group input[type="checkbox"]:disabled {
                cursor: not-allowed;
            }
            #banReasonModalContent textarea {
                resize: vertical;
                min-height: 60px;
            }
            #banReasonModalContent textarea:disabled {
                background-color: #f0f0f0;
                cursor: not-allowed;
            }
        `);

        modal.innerHTML = `
            <div id="killerModalContent">
                <span class="close">&times;</span>
                <h3>用户管理选项</h3>
                <div class="button-group">
                    <button id="banUserBtn" class="primary">${(isOfficiallyBannedPage() && (!bannedUsers.has(currentUserId) || (bannedUsers.has(currentUserId) && !bannedUsers.get(currentUserId).isOfficialUnban))) || (bannedUsers.has(currentUserId) && bannedUsers.get(currentUserId).isOfficialBanned && !bannedUsers.get(currentUserId).isOfficialUnban) || (bannedUsers.has(currentUserId) && !bannedUsers.get(currentUserId).isOfficialUnban && !bannedUsers.get(currentUserId).isOfficialBanned) ? '解除封禁用户' : '封禁用户'}</button>
                    <button class="secondary" disabled>永久封禁用户并清除账号数据</button>
                </div>
                <div class="button-group">
                    <button class="secondary" disabled>封禁用户 IP</button>
                    <button class="secondary" disabled>注销用户账号</button>
                </div>
                <div class="button-group">
                    <button class="secondary" disabled>取消回复提醒</button>
                    <button class="secondary" disabled>限制发言功能</button>
                </div>
                 <div class="button-group">
                    <button class="secondary" disabled>限制私信功能</button>
                 </div>
                 <div class="button-group" style="margin-top: 20px;">
                    <button id="cancelModalBtn" class="secondary" style="flex: 1 1 100%;">取消</button>
                 </div>
            </div>
        `;
        document.body.appendChild(modal);

        // 创建封禁原因弹窗
        const banReasonModal = document.createElement('div');
        banReasonModal.id = 'banReasonModal';
        banReasonModal.innerHTML = `
            <div id="banReasonModalContent">
                <span class="close">&times;</span>
                <h3>选择封禁原因和时长</h3>

                <label>封禁原因:</label>
                <div class="checkbox-group" id="generalBanReasons">
                    <label><input type="checkbox" name="banReasonGeneral" value="违反社区指导原则">违反<a href="${GUIDELINE_LINK}" class="l" target="_blank">社区指导原则</a></label>
                    <label><input type="checkbox" name="banReasonGeneral" value="严重违反社区指导原则">严重违反<a href="${GUIDELINE_LINK}" class="l" target="_blank">社区指导原则</a></label>
                </div>
                <div class="checkbox-group" id="detailedBanReasons">
                    <label><input type="checkbox" name="banReasonDetailed" value="人身攻击">人身攻击</label>
                    <label><input type="checkbox" name="banReasonDetailed" value="不雅词句">不雅词句</label>
                    <label><input type="checkbox" name="banReasonDetailed" value="骚扰用户">骚扰用户</label>
                    <label><input type="checkbox" name="banReasonDetailed" value="私信辱骂">私信辱骂</label>
                    <label><input type="checkbox" name="banReasonDetailed" value="仇恨言论">仇恨言论</label>
                    <label><input type="checkbox" name="banReasonDetailed" value="引流纠纷">引流纠纷</label>
                </div>
                <label>其他自定义原因:</label>
                <textarea id="customReasonInput" placeholder="请输入自定义原因"></textarea>

                <label>封禁时长:</label>
                <select id="banDurationSelect">
                    <option value="7D">7天</option>
                    <option value="30D">30天</option>
                    <option value="60D">60天</option>
                    <option value="180D">180天</option>
                    <option value="365D">365天</option>
                    <option value="Permanent">永久</option>
                    <option value="Custom">自定义 (分钟)</option>
                </select>
                <input type="number" id="customDurationInput" placeholder="请输入分钟数 (至少1分钟)" min="1" style="display: none;">

                <div class="button-group" style="margin-top: 20px;">
                    <button id="confirmBanBtn" class="confirm-ban">确认封禁</button>
                    <button id="cancelReasonBtn" class="cancel-ban">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(banReasonModal);


        // 获取元素
        const killerModal = document.getElementById('killerModal');
        const killerModalContent = document.getElementById('killerModalContent');
        const closeButtons = killerModalContent.querySelectorAll('.close');
        const banUserBtn = document.getElementById('banUserBtn');
        const cancelModalBtn = document.getElementById('cancelModalBtn');

        const banReasonModalElem = document.getElementById('banReasonModal');
        const banReasonModalContentElem = document.getElementById('banReasonModalContent');
        const closeReasonButtons = banReasonModalContentElem.querySelectorAll('.close');
        const confirmBanBtn = document.getElementById('confirmBanBtn');
        const cancelReasonBtn = document.getElementById('cancelReasonBtn');

        const generalReasonCheckboxes = document.querySelectorAll('input[name="banReasonGeneral"]');
        const detailedReasonCheckboxes = document.querySelectorAll('input[name="banReasonDetailed"]');
        const customReasonInput = document.getElementById('customReasonInput');
        const banDurationSelect = document.getElementById('banDurationSelect');
        const customDurationInput = document.getElementById('customDurationInput');

        // 封禁原因互斥逻辑
        function updateReasonCheckboxState() {
            let generalReasonChecked = false;
            generalReasonCheckboxes.forEach(cb => {
                if (cb.checked) {
                    generalReasonChecked = true;
                }
            });

            // 禁用/启用详细原因复选框
            detailedReasonCheckboxes.forEach(cb => {
                if (generalReasonChecked) {
                    cb.checked = false; // 取消勾选
                    cb.disabled = true; // 禁用
                    cb.parentNode.classList.add('disabled'); // 样式变灰
                } else {
                    cb.disabled = false; // 启用
                    cb.parentNode.classList.remove('disabled'); // 恢复样式
                }
            });

            // 禁用/启用自定义原因输入框并清空内容
            if (generalReasonChecked) {
                customReasonInput.value = ''; // 清空内容
                customReasonInput.disabled = true;
                customReasonInput.style.backgroundColor = '#f0f0f0'; // 变灰背景
            } else {
                customReasonInput.disabled = false;
                customReasonInput.style.backgroundColor = ''; // 恢复背景
            }


            // 禁用/启用通用原因中的另一个
            generalReasonCheckboxes.forEach(cb1 => {
                generalReasonCheckboxes.forEach(cb2 => {
                    if (cb1 !== cb2) {
                        if (cb1.checked) {
                            cb2.disabled = true;
                            cb2.parentNode.classList.add('disabled');
                        } else if (!generalReasonChecked) { // 如果都没有勾选通用原因，则都启用
                            cb2.disabled = false;
                            cb2.parentNode.classList.remove('disabled');
                        }
                    }
                });
            });
        }

        generalReasonCheckboxes.forEach(cb => cb.addEventListener('change', updateReasonCheckboxState));
        detailedReasonCheckboxes.forEach(cb => cb.addEventListener('change', updateReasonCheckboxState));
        // 自定义原因输入框变化时不需要额外处理互斥，只在通用原因变化时处理


        // 切换自定义时长输入框显示
        banDurationSelect.addEventListener('change', () => {
            if (banDurationSelect.value === 'Custom') {
                customDurationInput.style.display = 'block';
            } else {
                customDurationInput.style.display = 'none';
            }
        });

        // 打开“大杀器”弹窗
        killerButton.addEventListener('click', () => {
            killerModal.style.display = 'block';
            // 更新按钮文本
            const banInfo = bannedUsers.get(currentUserId);
            // 修正判断 shouldUnban 的逻辑，使其与 renderUserStatus 的判断保持一致
            const shouldUnban = (isOfficiallyBannedPage() && (!banInfo || (banInfo && !banInfo.isOfficialUnban))) || (banInfo && banInfo.isOfficialBanned && !banInfo.isOfficialUnban) || (banInfo && !banInfo.isOfficialUnban && !banInfo.isOfficialBanned);

            if (shouldUnban) {
                banUserBtn.innerText = '解除封禁用户';
            } else {
                banUserBtn.innerText = '封禁用户';
            }
        });

        // 关闭主弹窗的事件
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                killerModal.style.display = 'none';
            });
        });
        cancelModalBtn.addEventListener('click', () => {
            killerModal.style.display = 'none';
        });

        // 点击外部区域关闭主弹窗
        window.addEventListener('click', (event) => {
            if (event.target == killerModal) {
                killerModal.style.display = 'none';
            }
            if (event.target == banReasonModalElem) { // 只有在点击到封禁原因弹窗的背景时才关闭
                banReasonModalElem.style.display = 'none';
            }
        });


        // “封禁用户”/“解除封禁用户”按钮点击事件
        banUserBtn.addEventListener('click', () => {
            const banInfo = bannedUsers.get(currentUserId);
            // 重新计算 shouldUnban，以确保在当前页面状态下做出正确判断
            const shouldUnban = (isOfficiallyBannedPage() && (!banInfo || (banInfo && !banInfo.isOfficialUnban))) || (banInfo && banInfo.isOfficialBanned && !banInfo.isOfficialUnban) || (banInfo && !banInfo.isOfficialUnban && !banInfo.isOfficialBanned);


            if (shouldUnban) {
                // 解除封禁逻辑
                // 如果页面是官方封禁或者localStorage中标记为官方封禁，则记录为“已在脚本层面解除官方封禁”
                if (isOfficiallyBannedPage() || (banInfo && banInfo.isOfficialBanned)) {
                    bannedUsers.set(currentUserId, { isOfficialUnban: true });
                } else { // 否则是解除脚本层面的封禁
                    bannedUsers.delete(currentUserId);
                }
                saveBannedUsers(bannedUsers);
                renderUserStatus(); // 更新页面显示
                killerModal.style.display = 'none'; // 关闭主弹窗
                alert('用户已解除封禁！');
            } else {
                // 重置所有封禁原因和时长选择
                generalReasonCheckboxes.forEach(cb => { cb.checked = false; cb.disabled = false; cb.parentNode.classList.remove('disabled'); });
                detailedReasonCheckboxes.forEach(cb => { cb.checked = false; cb.disabled = false; cb.parentNode.classList.remove('disabled'); });
                customReasonInput.value = '';
                customReasonInput.disabled = false; // 确保自定义原因输入框启用
                customReasonInput.style.backgroundColor = ''; // 恢复背景
                banDurationSelect.value = '7D';
                customDurationInput.value = '';
                customDurationInput.style.display = 'none';

                // 确保互斥逻辑在弹窗打开时也应用一次，以防状态不正确
                updateReasonCheckboxState();

                // 显示封禁原因弹窗
                banReasonModalElem.style.display = 'block';
            }
        });

        // 关闭封禁原因弹窗的事件
        closeReasonButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                banReasonModalElem.style.display = 'none';
            });
        });
        cancelReasonBtn.addEventListener('click', () => {
            banReasonModalElem.style.display = 'none';
        });

        // 确认封禁按钮点击事件
        confirmBanBtn.addEventListener('click', () => {
            // 获取封禁原因
            let selectedReasons = [];
            let generalReasonChecked = false;
            generalReasonCheckboxes.forEach(cb => {
                if (cb.checked) {
                    selectedReasons.push(cb.value);
                    generalReasonChecked = true;
                }
            });

            if (!generalReasonChecked) { // 如果没有勾选通用原因，才检查详细原因和自定义原因
                 detailedReasonCheckboxes.forEach(cb => {
                    if (cb.checked) selectedReasons.push(cb.value);
                });

                const customReason = customReasonInput.value.trim();
                if (customReason) {
                    selectedReasons.push(customReason);
                }
            }


            if (selectedReasons.length === 0) {
                alert('请至少选择或输入一个封禁原因！');
                return;
            }

            let fullReason = selectedReasons.join('、');


            // 获取封禁时长
            const durationType = banDurationSelect.value;
            let banDurationText;
            let unbanTime = null; // 解封时间戳

            if (durationType === 'Permanent') {
                banDurationText = '永久';
            } else if (durationType === 'Custom') {
                const customMinutes = parseInt(customDurationInput.value, 10);
                if (isNaN(customMinutes) || customMinutes < 1) {
                    alert('自定义时长至少为1分钟！');
                    return;
                }
                const now = new Date();
                unbanTime = new Date(now.getTime() + customMinutes * 60 * 1000);
                banDurationText = `${customMinutes} 分钟`;
            } else {
                // 7D, 30D, etc.
                const days = parseInt(durationType.replace('D', ''), 10);
                const now = new Date();
                unbanTime = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
                banDurationText = `${days} 天`;
            }

            // 存储封禁信息
            bannedUsers.set(currentUserId, {
                reason: fullReason,
                duration: banDurationText,
                banTime: new Date().toISOString(), // 记录封禁时间
                unbanTime: unbanTime ? unbanTime.toISOString() : null, // 记录解封时间，如果是永久则为null
                isOfficialBanned: false, // 明确标记这不是官方封禁
                isOfficialUnban: false // 明确标记不是解除官方封禁
            });
            saveBannedUsers(bannedUsers);

            renderUserStatus(); // 更新页面显示
            killerModal.style.display = 'none'; // 关闭主弹窗
            banReasonModalElem.style.display = 'none'; // 关闭原因弹窗
            alert('用户已成功封禁！');
        });
    }

})();