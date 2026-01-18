// ==UserScript==
// @name         KillUser-SmartTeach
// @namespace    https://apanzinc.top/
// @version      2.0
// @description  屏蔽智教联盟论坛上不想看到的用户（帖子、月活榜单、通知、评论）
// @author       apanzinc
// @match        https://forum.smart-teach.cn/
// @match        https://forum.smart-teach.cn/notifications
// @match        https://forum.smart-teach.cn/d/*
// @match        https://forum.smart-teach.cn/settings
// @icon         http://youke.xn--y7xa690gmna.cn/s1/2026/01/18/696c93287a4a6.webp
// @grant        none
// @homepage     https://github.com/apanzinc/ST-KillUser
// @source       https://github.com/apanzinc/ST-KillUser
// @license GPL3
// @contributionURL https://afdian.com/a/apanzinc
// @contributionAmount 0.00¥
// @downloadURL https://update.greasyfork.org/scripts/563136/KillUser-SmartTeach.user.js
// @updateURL https://update.greasyfork.org/scripts/563136/KillUser-SmartTeach.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('  /$$$$$$  /$$$$$$$$         /$$   /$$ /$$ /$$ /$$ /$$   /$$                              ');
    console.log(' /$$__  $$|__  $$__/        | $$  /$$/|__/| $$| $$| $$  | $$                              ');
    console.log('| $$  \__/   | $$           | $$ /$$/  /$$| $$| $$| $$  | $$  /$$$$$$$  /$$$$$$   /$$$$$$ ');
    console.log('|  $$$$$$    | $$    /$$$$$$| $$$$$/  | $$| $$| $$| $$  | $$ /$$_____/ /$$__  $$ /$$__  $$');
    console.log(' \____  $$   | $$   |______/| $$  $$  | $$| $$| $$| $$  | $$|  $$$$$$ | $$$$$$$$| $$  \__/');
    console.log(' /$$  \ $$   | $$           | $$\\  $$ | $$| $$| $$| $$  | $$ \____  $$| $$_____/| $$      ');
    console.log('|  $$$$$$/   | $$           | $$ \  $$| $$| $$| $$|  $$$$$$/ /$$$$$$$/|  $$$$$$$| $$      ');
    console.log(' \______/    |__/           |__/  \__/|__/|__/|__/ \______/ |_______/  \_______/|__/      ');
    console.log('____________');
    console.log('𝐊𝐢𝐥𝐥𝐔𝐬𝐞𝐫-𝐒𝐦𝐚𝐫𝐭𝐓𝐞𝐚𝐜𝐡 v1.0');
    console.log('𝐁𝐲 𝐚𝐩𝐚𝐧𝐳𝐢𝐧𝐜');
    console.log('如遇问题欢迎反馈');
    
    // 要屏蔽的用户名列表，使用localStorage持久化存储Z
    let blockedUsers = JSON.parse(localStorage.getItem('killUserSmartTeachBlockedUsers')) || ['默认用户'];
    
    // 日志开关，默认关闭
    let enableLogs = JSON.parse(localStorage.getItem('killUserSmartTeachEnableLogs')) === true;
    
    // 自定义日志函数，根据开关状态决定是否输出
    function log(...args) {
        if (enableLogs) {
            // 获取当前时间
            const now = new Date();
            const timeString = now.toLocaleTimeString('zh-CN', { hour12: false });
            
            // 统一日志格式，添加时间戳和前缀
            console.log(`[${timeString}] 🛡️  KillUser:`, ...args);
        }
    }
    
    // 操作日志，用于记录用户操作
    function logAction(action) {
        if (enableLogs) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('zh-CN', { hour12: false });
            console.log(`[${timeString}] ✨  Action: ${action}`);
        }
    }
    
    // 屏蔽日志，用于记录屏蔽操作
    function logBlock(action, username, details = '') {
        if (enableLogs) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('zh-CN', { hour12: false });
            console.log(`[${timeString}] 🔴  Block: ${action} - ${username} ${details}`);
        }
    }
    
    log(`当前屏蔽用户列表: ${blockedUsers.join(', ')}`);
    log(`日志输出: ${enableLogs ? '开启' : '关闭'}`);
    
    // 保存屏蔽用户列表到localStorage
    function saveBlockedUsers() {
        localStorage.setItem('killUserSmartTeachBlockedUsers', JSON.stringify(blockedUsers));
        log(`屏蔽用户列表已保存: ${blockedUsers.join(', ')}`);
    }
    
    // 保存日志开关状态到localStorage
    function saveEnableLogs() {
        localStorage.setItem('killUserSmartTeachEnableLogs', JSON.stringify(enableLogs));
        log(`日志开关状态已保存: ${enableLogs ? '开启' : '关闭'}`);
    }
    
    // 在设置页面添加图形界面
    function addSettingsUI() {
        // 检查是否是设置页面
        if (window.location.pathname !== '/settings') {
            return;
        }
        
        console.log('在设置页面添加图形界面...');
        
        // 创建UI容器
        const uiContainer = document.createElement('div');
        uiContainer.innerHTML = `
            <div class="killuser-ui">
                <h3>🔪 𝐊𝐢𝐥𝐥𝐔𝐬𝐞𝐫-𝐒𝐦𝐚𝐫𝐭𝐓𝐞𝐚𝐜𝐡 设置</h3>
                
                <div style="margin: 15px 0;">
                    <strong>当前屏蔽用户列表:</strong>
                    <div id="killuser-blocked-list" style="margin: 10px 0;">
                        <!-- 动态生成 -->
                    </div>
                </div>
                
                <div style="margin: 15px 0;">
                    <strong>添加屏蔽用户:</strong>
                    <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                        <input type="text" id="killuser-add-input" class="killuser-ui-input" placeholder="输入用户名" style="padding: 10px 15px; border: 1px solid #e9ecef; border-radius: 6px; width: 250px; font-size: 14px; transition: all 0.2s ease;">
                        <button id="killuser-add-btn" class="killuser-ui-add" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s ease;">添加</button>
                    </div>
                </div>
                
                <div style="margin: 15px 0;">
                    <strong>高级设置:</strong>
                    <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0; padding: 12px 15px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                        <span style="font-size: 14px;">控制台日志输出:</span>
                        <button id="killuser-logs-btn" style="padding: 8px 16px; border: 1px solid #e9ecef; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s ease; background: ${enableLogs ? '#28a745' : '#6c757d'}; color: white;">${enableLogs ? '开启' : '关闭'}</button>
                    </div>
                </div>
                
                <div style="color: #666; font-size: 14px;">
                    <p>💡 提示: 保存设置后刷新页面生效</p>
                    <p>📝 支持的屏蔽类型: 帖子、月活榜单、在线榜单、管理员列表、通知、评论、@提及</p>
                    <p>🔧 作者: apanzinc | 版本: v1.0 | <a href="https://github.com/apanzinc/ST-KillUser" target="_blank" style="color: #007bff; text-decoration: none;">GitHub仓库</a></p>
                </div>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .killuser-ui {
                margin: 20px 0;
                padding: 20px 0;
                background: transparent;
                border-radius: 0;
                box-shadow: none;
            }
            .killuser-ui h3 {
                margin-top: 0;
                color: #333;
            }
            .killuser-ui-input {
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                width: 200px;
            }
            .killuser-ui-add {
                background: #28a745;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 10px;
            }
            .killuser-ui-delete {
                background: #dc3545;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(style);
        
        // 尝试将UI放置在"关注标签"部分下方
        const followTagsSection = document.querySelector('.item-fof-follow-tags');
        
        if (followTagsSection) {
            // 将UI插入到关注标签部分的下方
            followTagsSection.insertAdjacentElement('afterend', uiContainer);
            console.log('UI已添加到关注标签部分下方');
        } else {
            // 找不到关注标签部分，尝试其他容器
            let container = document.querySelector('.container');
            let containerFound = false;
            
            // 如果找不到container，尝试其他可能的容器
            if (!container) {
                container = document.querySelector('#app');
                if (container) {
                    console.log('找到app容器，将UI添加到app容器中');
                    containerFound = true;
                }
            } else {
                containerFound = true;
                console.log('找到container容器，将UI添加到container容器中');
            }
            
            // 如果还是找不到，使用body
            if (!containerFound) {
                container = document.body;
                console.log('使用body作为容器，将UI添加到body中');
            }
            
            // 添加到页面底部
            if (container) {
                container.appendChild(uiContainer);
                console.log('UI已添加到页面');
            }
        }
        
        // 更新用户列表
        updateBlockedUsersList();
        
        // 添加事件监听
        const addBtn = document.getElementById('killuser-add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', addBlockedUser);
            log('添加按钮事件监听已绑定');
        } else {
            log('未找到添加按钮');
        }
        
        // 添加日志开关按钮事件监听
        const logsBtn = document.getElementById('killuser-logs-btn');
        if (logsBtn) {
            logsBtn.addEventListener('click', toggleLogs);
            log('日志开关按钮事件监听已绑定');
        } else {
            log('未找到日志开关按钮');
        }
        
        // 切换日志开关状态
        function toggleLogs() {
            enableLogs = !enableLogs;
            saveEnableLogs();
            
            // 更新按钮样式和文本
            const logsBtn = document.getElementById('killuser-logs-btn');
            if (logsBtn) {
                logsBtn.textContent = enableLogs ? '开启' : '关闭';
                logsBtn.style.background = enableLogs ? '#28a745' : '#6c757d';
            }
            
            log(`日志输出已${enableLogs ? '开启' : '关闭'}`);
        }
        
        // 更新屏蔽用户列表
        function updateBlockedUsersList() {
            const listContainer = document.getElementById('killuser-blocked-list');
            if (!listContainer) {
                log('未找到用户列表容器');
                return;
            }
            
            let html = '';
            if (blockedUsers.length === 0) {
                html = '<p style="color: #666; font-style: italic;">(暂无屏蔽用户)</p>';
            } else {
                html = '<div style="display: flex; flex-direction: column; gap: 8px; margin: 10px 0;">';
                blockedUsers.forEach((user, index) => {
                    html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                        <span style="font-weight: 500;">${user}</span>
                        <button class="killuser-ui-delete" data-index="${index}" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;">删除</button>
                    </div>`;
                });
                html += '</div>';
            }
            listContainer.innerHTML = html;
            log('用户列表已更新');
            
            // 添加删除按钮事件监听
            document.querySelectorAll('.killuser-ui-delete').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    removeBlockedUser(index);
                });
            });
        }
        
        // 添加屏蔽用户
        function addBlockedUser() {
            const input = document.getElementById('killuser-add-input');
            if (!input) {
                log('未找到输入框');
                return;
            }
            
            const username = input.value.trim();
            if (username && !blockedUsers.includes(username)) {
                blockedUsers.push(username);
                saveBlockedUsers();
                updateBlockedUsersList();
                input.value = '';
                log(`已添加屏蔽用户: ${username}`);
            }
        }
        
        // 删除屏蔽用户
        function removeBlockedUser(index) {
            const username = blockedUsers[index];
            blockedUsers.splice(index, 1);
            saveBlockedUsers();
            updateBlockedUsersList();
            log(`已删除屏蔽用户: ${username}`);
        }
    }
    
    // 调用添加UI函数
    setTimeout(addSettingsUI, 500);
    
    // 监听页面URL变化，处理单页应用路由切换
    let currentUrl = window.location.href;
    setInterval(function() {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            log(`检测到URL变化: ${currentUrl}`);
            // 检查是否切换到设置页面
            if (window.location.pathname === '/settings') {
                log('切换到设置页面，重新添加UI');
                // 移除已存在的UI，避免重复添加
                const existingUI = document.querySelector('.killuser-ui');
                if (existingUI) {
                    existingUI.remove();
                    log('已移除旧UI');
                }
                // 重新添加UI
                addSettingsUI();
            }
        }
    }, 500);

    // 屏蔽用户帖子的函数
    function blockUsers(isDynamic = false) {
        let totalBlockedCount = 0;
        
        if (!isDynamic) {
            log('开始执行用户屏蔽操作...');
        }
        
        // 1. 处理帖子列表
        const discussionItems = document.querySelectorAll('.DiscussionListItem-content');
        let postBlockedCount = 0;
        
        discussionItems.forEach(item => {
            // 查找作者链接
            const authorLink = item.querySelector('.DiscussionListItem-author');
            if (authorLink) {
                // 从链接中提取用户名
                const authorHref = authorLink.getAttribute('href');
                const username = authorHref.replace('/u/', '');
                
                // 获取帖子标题
                const titleElement = item.querySelector('.DiscussionListItem-title');
                const title = titleElement ? titleElement.textContent.trim() : '未找到标题';
                
                // 如果用户名在屏蔽列表中，隐藏该帖子
                if (blockedUsers.includes(username)) {
                    item.style.display = 'none';
                    postBlockedCount++;
                    totalBlockedCount++;
                    if (!isDynamic) {
                        logBlock('帖子', username, `- "${title}"`);
                    }
                }
            }
        });
        
        // 2. 处理各种榜单（月活榜单 + 在线榜单 + 管理员列表）
        const allWidgetItems = document.querySelectorAll('.Afrux-TopPostersWidget-users-item, .Afrux-OnlineUsersWidget-users-item, .Widget-users-item, .OnlineUsers-widget-item, .staff-members-flex, [class*="widget"] [class*="user"][class*="item"], [class*="staff"] [class*="member"]');
        let widgetBlockedCount = 0;
        
        allWidgetItems.forEach(item => {
            // 方法1: 从用户名文本获取
            let username = '';
            
            // 尝试从多种可能的位置获取用户名
            const userNameElement = item.querySelector('.Afrux-TopPostersWidget-users-item-name, .username, [class*="name"], [class*="username"], .staffmemberslink, .staff-members-details a, .staffmemberslink strong');
            
            if (userNameElement) {
                username = userNameElement.textContent.trim();
            } 
            // 方法2: 从头像的alt属性或title属性获取
            else {
                const avatarElement = item.querySelector('img.Avatar');
                if (avatarElement) {
                    // 从alt或title属性获取用户名
                    username = avatarElement.alt || avatarElement.title || avatarElement.getAttribute('aria-label') || '';
                    // 清理用户名（移除可能的空格和特殊字符）
                    username = username.trim();
                }
            }
            
            if (username && blockedUsers.includes(username)) {
                item.style.display = 'none';
                widgetBlockedCount++;
                totalBlockedCount++;
                if (!isDynamic) {
                    logBlock('榜单用户', username);
                }
            }
        });
        
        // 3. 处理通知
        const notifications = document.querySelectorAll('.Notification');
        let notificationBlockedCount = 0;
        
        notifications.forEach(item => {
            // 获取用户名
            const userNameElement = item.querySelector('.username');
            if (userNameElement) {
                const username = userNameElement.textContent.trim();
                
                if (blockedUsers.includes(username)) {
                    item.style.display = 'none';
                    notificationBlockedCount++;
                    totalBlockedCount++;
                    if (!isDynamic) {
                        logBlock('通知', username);
                    }
                }
            }
        });
        
        // 4. 处理帖子详情页评论
        const commentPosts = document.querySelectorAll('.CommentPost');
        let commentBlockedCount = 0;
        
        commentPosts.forEach(item => {
            // 获取用户名
            const userNameElement = item.querySelector('.PostUser-name .username');
            if (userNameElement) {
                const username = userNameElement.textContent.trim();
                
                if (blockedUsers.includes(username)) {
                    item.style.display = 'none';
                    commentBlockedCount++;
                    totalBlockedCount++;
                    if (!isDynamic) {
                        logBlock('评论', username);
                    }
                }
            }
        });
        
        // 5. 处理帖子内容中的用户提及 (@用户名)
        const postMentions = document.querySelectorAll('.PostMention');
        let mentionBlockedCount = 0;
        
        postMentions.forEach(item => {
            // 获取提及的用户名
            const username = item.textContent.trim();
            
            if (blockedUsers.includes(username)) {
                item.style.display = 'none';
                mentionBlockedCount++;
                totalBlockedCount++;
                if (!isDynamic) {
                    logBlock('提及', username);
                }
            }
        });
        
        // 6. 处理"回复了此帖"部分
        const repliedByElements = document.querySelectorAll('.Post-mentionedBy-summary');
        let repliedByBlockedCount = 0;
        
        repliedByElements.forEach(item => {
            // 获取用户名
            const userNameElement = item.querySelector('.username');
            if (userNameElement) {
                const username = userNameElement.textContent.trim();
                
                if (blockedUsers.includes(username)) {
                    item.style.display = 'none';
                    repliedByBlockedCount++;
                    totalBlockedCount++;
                    if (!isDynamic) {
                        logBlock('回复提示', username);
                    }
                }
            }
        });
        
        // 7. 输出日志
        if (isDynamic) {
            // 动态执行，一行输出
            log(`🔄 动态屏蔽完成: 帖子(${discussionItems.length}个)屏蔽${postBlockedCount}个, 榜单(${allWidgetItems.length}个)屏蔽${widgetBlockedCount}个, 通知(${notifications.length}条)屏蔽${notificationBlockedCount}个, 评论(${commentPosts.length}条)屏蔽${commentBlockedCount}个, 提及(${postMentions.length}个)屏蔽${mentionBlockedCount}个, 回复提示(${repliedByElements.length}个)屏蔽${repliedByBlockedCount}个, 总计${totalBlockedCount}项`);
        } else {
            // 初始执行，详细输出
            log(`找到 ${discussionItems.length} 个帖子, ${allWidgetItems.length} 个榜单用户, ${notifications.length} 条通知, ${commentPosts.length} 条评论, ${postMentions.length} 个用户提及, ${repliedByElements.length} 个回复提示`);
            log(`屏蔽操作完成，共屏蔽 ${totalBlockedCount} 项 (帖子: ${postBlockedCount} 个, 榜单用户: ${widgetBlockedCount} 个, 通知: ${notificationBlockedCount} 条, 评论: ${commentBlockedCount} 条, 提及: ${mentionBlockedCount} 个, 回复提示: ${repliedByBlockedCount} 个)`);
        }
    }

    // 页面加载完成后执行一次
    window.addEventListener('load', function() {
        log('页面加载完成，执行初始屏蔽');
        blockUsers();
    });

    // 监听页面动态内容变化（针对可能的AJAX加载）
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                blockUsers(true); // 传递参数表示是动态执行
            }
        });
    });

    // 观察目标节点
    const targetNode = document.body;
    const config = {
        childList: true,
        subtree: true
    };

    // 开始观察
    observer.observe(targetNode, config);
    log('已启动页面内容变化监听');
    
    // 添加页面可见性监听，当用户切换回标签页时重新执行屏蔽
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            log('页面重新可见，执行屏蔽检查');
            blockUsers(true); // 使用动态执行模式
        }
    });
    
    // 添加页面导航监听，处理浏览器前进后退和hash变化
    window.addEventListener('popstate', function() {
        log('检测到页面导航（前进/后退），执行屏蔽检查');
        blockUsers(true);
    });
    
    // 添加hash变化监听，处理页面内导航
    window.addEventListener('hashchange', function() {
        log('检测到hash变化，执行屏蔽检查');
        blockUsers(true);
    });
    
    // 监听页面焦点事件
    window.addEventListener('focus', function() {
        log('页面获得焦点，执行屏蔽检查');
        blockUsers(true);
    });


})();
