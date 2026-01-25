// ==UserScript==
// @name         智能整合复制面板
// @namespace    https://greasyfork.org/users/1564293
// @version      1.0.5
// @description  强大的全局复制工具，支持拖动和搜索首尾文字复制。个人使用免费，基于MIT许可证。商业使用需要购买商业许可证。
// @author       琪琪
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT; Commercial
// @supportURL   https://greasyfork.org/zh-CN/users/1564293-雨落倾城梦之夏
// @homepageURL  https://greasyfork.org/zh-CN/users/1564293-雨落倾城梦之夏
// @downloadURL https://update.greasyfork.org/scripts/563960/%E6%99%BA%E8%83%BD%E6%95%B4%E5%90%88%E5%A4%8D%E5%88%B6%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/563960/%E6%99%BA%E8%83%BD%E6%95%B4%E5%90%88%E5%A4%8D%E5%88%B6%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 在开头添加许可证和商业授权信息
    console.log(`
    ============================================
    智能整合复制面板 v1.0.1
    作者: 琪琪 (雨落倾城梦之夏)
    GreasyFork: https://greasyfork.org/zh-CN/users/1564293
    
    许可证: MIT (个人使用免费)
    商业授权: 商业使用需要购买许可证
    
    功能特点:
    1. 面板和按钮自由拖动
    2. 文字搜索和高亮匹配
    3. 首尾文字定位复制
    4. 智能导航(上一个/下一个)
    5. 基础复制功能
    6. 匹配文本实时预览
    
    商业授权请联系: 通过GreasyFork页面联系
    ============================================
    `);
    
    // 1. 样式
    GM_addStyle(`
        /* 主面板 */
        #smart-copy-panel {
            position: fixed !important;
            width: 220px !important; /* 稍微加宽以容纳显示框 */
            background: #2c3e50 !important;
            color: white !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
            z-index: 10000 !important;
            font-family: Arial !important;
            overflow: hidden !important;
            border: 1px solid #34495e !important;
        }
        
        /* 标题栏 - 拖动区域 */
        .panel-header {
            background: #34495e !important;
            padding: 10px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            cursor: move !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
        }
        
        .panel-title {
            font-size: 14px !important;
            font-weight: bold !important;
        }
        
        .close-btn {
            background: none !important;
            border: none !important;
            color: white !important;
            font-size: 18px !important;
            cursor: pointer !important;
            padding: 0 !important;
            width: 20px !important;
            height: 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        
        .close-btn:hover {
            background: rgba(255,255,255,0.1) !important;
            border-radius: 50% !important;
        }
        
        /* 内容区 */
        .panel-content {
            padding: 10px !important;
        }
        
        /* 按钮 */
        .btn {
            width: 100% !important;
            background: #3498db !important;
            border: none !important;
            color: white !important;
            padding: 8px !important;
            margin-bottom: 6px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 12px !important;
        }
        
        .btn:hover {
            background: #2980b9 !important;
        }
        
        .btn.green {
            background: #27ae60 !important;
        }
        
        .btn.green:hover {
            background: #219653 !important;
        }
        
        /* 输入框 */
        .input {
            width: 100% !important;
            padding: 6px !important;
            border: 1px solid #ddd !important;
            border-radius: 4px !important;
            margin-bottom: 8px !important;
            box-sizing: border-box !important;
            font-size: 12px !important;
        }
        
        /* 导航按钮 */
        .nav-row {
            display: flex !important;
            gap: 5px !important;
            margin: 8px 0 !important;
        }
        
        .nav-btn {
            flex: 1 !important;
            padding: 6px !important;
            font-size: 11px !important;
        }
        
        /* 状态信息 */
        .status-info {
            font-size: 11px !important;
            color: rgba(255,255,255,0.8) !important;
            text-align: center !important;
            margin-top: 8px !important;
            padding-top: 8px !important;
            border-top: 1px solid rgba(255,255,255,0.2) !important;
        }
        
        /* 快捷按钮 */
        #toggle-panel {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 40px !important;
            height: 40px !important;
            background: #27ae60 !important;
            color: white !important;
            border: none !important;
            border-radius: 50% !important;
            cursor: move !important;
            z-index: 9999 !important;
            font-size: 18px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
            user-select: none !important;
        }
        
        /* 选项卡 */
        .tab-buttons {
            display: flex !important;
            margin-bottom: 10px !important;
            border-bottom: 1px solid rgba(255,255,255,0.2) !important;
        }
        
        .tab-btn {
            flex: 1 !important;
            background: none !important;
            border: none !important;
            color: rgba(255,255,255,0.7) !important;
            padding: 6px 0 !important;
            cursor: pointer !important;
            font-size: 11px !important;
            border-bottom: 2px solid transparent !important;
        }
        
        .tab-btn.active {
            color: white !important;
            border-bottom-color: #27ae60 !important;
        }
        
        /* 选项卡内容 */
        .tab-content {
            display: none !important;
        }
        
        .tab-content.active {
            display: block !important;
        }
        
        /* 搜索结果高亮 */
        .search-match {
            background: rgba(255, 235, 59, 0.3) !important;
            border: 1px solid #FFC107 !important;
            border-radius: 3px !important;
            padding: 1px 2px !important;
        }
        
        .current-match {
            background: rgba(39, 174, 96, 0.7) !important;
            border: 2px solid #27ae60 !important;
            border-radius: 3px !important;
            padding: 1px 2px !important;
        }
        
        /* 临时通知 */
        .temp-notice {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background: #27ae60 !important;
            color: white !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            z-index: 10001 !important;
            font-size: 12px !important;
        }
        
        /* 匹配文本展示框样式 */
        .match-display-container {
            margin: 10px 0 !important;
            background: rgba(255, 255, 255, 0.05) !important;
            border-radius: 6px !important;
            padding: 8px !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        
        .match-display-title {
            font-size: 10px !important;
            color: rgba(255, 255, 255, 0.6) !important;
            margin-bottom: 4px !important;
        }
        
        .match-display-box {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 4px !important;
            padding: 8px !important;
            font-size: 11px !important;
            color: rgba(255, 255, 255, 0.9) !important;
            max-height: 100px !important;
            overflow-y: auto !important;
            white-space: pre-wrap !important;
            word-break: break-word !important;
            line-height: 1.4 !important;
            user-select: text !important;
            cursor: text !important;
        }
        
        .match-display-box::-webkit-scrollbar {
            width: 6px !important;
        }
        
        .match-display-box::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2) !important;
            border-radius: 3px !important;
        }
        
        .match-display-info {
            font-size: 9px !important;
            color: rgba(255, 255, 255, 0.5) !important;
            text-align: right !important;
            margin-top: 4px !important;
        }
        
        /* 商业授权按钮 */
        .license-btn {
            background: linear-gradient(45deg, #9C27B0, #673AB7) !important;
            color: white !important;
            border: none !important;
            padding: 8px !important;
            margin-top: 5px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 11px !important;
            text-align: center !important;
        }
        
        .license-btn:hover {
            background: linear-gradient(45deg, #7B1FA2, #512DA8) !important;
        }
        
        /* 作者信息 */
        .author-info {
            font-size: 10px !important;
            color: rgba(255,255,255,0.6) !important;
            text-align: center !important;
            margin-top: 10px !important;
            padding-top: 10px !important;
            border-top: 1px solid rgba(255,255,255,0.1) !important;
        }
    `);
    
    // 2. 全局变量
    let panel = null;
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let allMatches = [];
    let currentMatchIndex = -1;
    let panelCreated = false;
    let originalHTML = '';
    let panelPosition = { left: '100px', top: '100px' };
    let currentTab = 'search';
    
    // 3. 初始化
    function init() {
        if (panelCreated) {
            console.log('面板已存在，跳过创建');
            return;
        }
        
        console.log('🚀 初始化智能复制面板');
        
        panelCreated = true;
        
        createPanel();
        createToggleButton();
        unlockCopy();
        
        setTimeout(setupToggleButtonDrag, 100);
        
        if (panel) {
            panel.style.display = 'none';
        }
    }
    
    // 4. 创建面板 - 添加关于和授权信息
    function createPanel() {
        const existing = document.getElementById('smart-copy-panel');
        if (existing) existing.remove();
        
        panel = document.createElement('div');
        panel.id = 'smart-copy-panel';
        
        panel.style.left = panelPosition.left;
        panel.style.top = panelPosition.top;
        
        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-title">📋 智能复制面板</div>
                <button class="close-btn" id="close-btn">×</button>
            </div>
            <div class="panel-content">
                <!-- 选项卡 -->
                <div class="tab-buttons">
                    <button class="tab-btn ${currentTab === 'basic' ? 'active' : ''}" data-tab="basic">基础功能</button>
                    <button class="tab-btn ${currentTab === 'search' ? 'active' : ''}" data-tab="search">文字搜索</button>
                    <button class="tab-btn" data-tab="about">关于</button>
                </div>
                
                <!-- 基础功能选项卡 -->
                <div class="tab-content ${currentTab === 'basic' ? 'active' : ''}" id="basic-tab">
                    <button class="btn green" id="select-all-btn">全选页面</button>
                    <button class="btn" id="copy-selected-btn">复制选中</button>
                    <button class="btn" id="copy-all-btn">复制全文</button>
                </div>
                
                <!-- 搜索选项卡 -->
                <div class="tab-content ${currentTab === 'search' ? 'active' : ''}" id="search-tab">
                    <input class="input" id="start-text" placeholder="开头文字（可选）">
                    <input class="input" id="end-text" placeholder="结尾文字（可选）">
                    
                    <button class="btn green" id="search-btn">开始搜索</button>
                    
                    <div class="nav-row">
                        <button class="btn nav-btn" id="prev-btn">上一个</button>
                        <button class="btn nav-btn" id="next-btn">下一个</button>
                    </div>
                    
                    <!-- 新增：匹配文本展示框 -->
                    <div class="match-display-container">
                        <div class="match-display-title">当前匹配文本：</div>
                        <div class="match-display-box" id="match-display-box">
                            搜索后匹配文本将在这里完整显示...
                        </div>
                        <div class="match-display-info">
                            字符数: <span id="match-char-count">0</span>
                        </div>
                    </div>
                    
                    <button class="btn" id="copy-match-btn">复制匹配</button>
                    <button class="btn" id="clear-btn">清除搜索</button>
                    
                    <div class="status-info" id="status-info">
                        找到: <span id="match-count">0</span> 个 | 
                        当前: <span id="current-index">0</span>
                    </div>
                </div>
                
                <!-- 关于选项卡 -->
                <div class="tab-content" id="about-tab">
                    <div style="font-size: 10px; color: rgba(255,255,255,0.8); margin-bottom: 10px; line-height: 1.4;">
                        <p><strong>智能整合复制面板 v1.0.1</strong></p>
                        <p>作者: 琪琪 (雨落倾城梦之夏)</p>
                        <p>许可证: MIT (个人使用免费)</p>
                        
                        <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px; margin: 8px 0;">
                            <p style="color: #4CAF50; font-weight: bold;">✨ 功能特点:</p>
                            <ul style="margin: 5px 0; padding-left: 15px;">
                                <li>面板和按钮自由拖动</li>
                                <li>文字搜索和高亮匹配</li>
                                <li>首尾文字定位复制</li>
                                <li>智能导航(上一个/下一个)</li>
                                <li>基础复制功能</li>
                                <li>匹配文本实时预览</li>
                            </ul>
                        </div>
                        
                        <div style="background: rgba(156, 39, 176, 0.2); padding: 8px; border-radius: 4px; margin: 8px 0;">
                            <p style="color: #9C27B0; font-weight: bold;">💰 商业授权:</p>
                            <p style="font-size: 9px;">本脚本个人使用免费，商业使用(公司、团队、盈利项目)需要购买商业许可证。</p>
                        </div>
                    </div>
                    
                    <button class="license-btn" id="license-btn">🛒 商业授权咨询</button>
                    
                    <div class="author-info">
                        GreasyFork: 雨落倾城梦之夏<br>
                        更新日期: 2025.01.25
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        setTimeout(() => {
            setupDrag();
            console.log('✅ 面板创建完成，拖动功能已设置');
        }, 0);
    }
    
    // 5. 拖动功能
    function setupDrag() {
        const header = panel.querySelector('.panel-header');
        
        if (!header) {
            console.error('未找到标题栏');
            return;
        }
        
        header.replaceWith(header.cloneNode(true));
        const newHeader = panel.querySelector('.panel-header');
        
        newHeader.addEventListener('mousedown', startDrag);
        
        function startDrag(e) {
            if (e.target && (e.target.id === 'close-btn' || e.target.classList.contains('close-btn'))) {
                console.log('点击了关闭按钮，不拖动');
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const panelRect = panel.getBoundingClientRect();
            
            offsetX = mouseX - panelRect.left;
            offsetY = mouseY - panelRect.top;
            
            isDragging = true;
            panel.style.opacity = '0.8';
            panel.style.transition = 'none';
            
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
        }
        
        function onDrag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            
            const maxLeft = window.innerWidth - panel.offsetWidth;
            const maxTop = window.innerHeight - panel.offsetHeight;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            
            panelPosition.left = newLeft + 'px';
            panelPosition.top = newTop + 'px';
        }
        
        function stopDrag() {
            if (!isDragging) return;
            
            isDragging = false;
            panel.style.opacity = '1';
            panel.style.transition = 'opacity 0.2s';
            
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
        }
        
        // 触摸屏支持
        newHeader.addEventListener('touchstart', function(e) {
            if (e.target && (e.target.id === 'close-btn' || e.target.classList.contains('close-btn'))) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            const touch = e.touches[0];
            const panelRect = panel.getBoundingClientRect();
            
            offsetX = touch.clientX - panelRect.left;
            offsetY = touch.clientY - panelRect.top;
            
            isDragging = true;
            panel.style.opacity = '0.8';
            panel.style.transition = 'none';
            
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', stopTouchDrag);
        });
        
        function onTouchMove(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            const touch = e.touches[0];
            let newLeft = touch.clientX - offsetX;
            let newTop = touch.clientY - offsetY;
            
            const maxLeft = window.innerWidth - panel.offsetWidth;
            const maxTop = window.innerHeight - panel.offsetHeight;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            panelPosition.left = newLeft + 'px';
            panelPosition.top = newTop + 'px';
        }
        
        function stopTouchDrag() {
            isDragging = false;
            panel.style.opacity = '1';
            panel.style.transition = 'opacity 0.2s';
            
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', stopTouchDrag);
        }
    }
    
    // 6. 设置全局事件
    function setupGlobalEvents() {
        document.removeEventListener('click', handleGlobalClick, true);
        document.addEventListener('click', handleGlobalClick, true);
        
        document.addEventListener('keypress', function(e) {
            if ((e.target.id === 'start-text' || e.target.id === 'end-text') && e.key === 'Enter') {
                performSearch();
                e.preventDefault();
            }
        }, true);
    }
    
    // 7. 处理全局点击事件
    function handleGlobalClick(e) {
        const target = e.target;
        
        // 关闭按钮
        if (target.id === 'close-btn' || (target.classList.contains('close-btn') && target.closest('#smart-copy-panel'))) {
            panel.style.display = 'none';
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        
        // 切换按钮
        if (target.id === 'toggle-panel') {
            togglePanel();
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        
        // 选项卡切换
        if (target.classList.contains('tab-btn') && target.closest('#smart-copy-panel')) {
            const tabId = target.getAttribute('data-tab');
            switchTab(tabId);
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        
        // 商业授权按钮
        if (target.id === 'license-btn') {
            showLicenseInfo();
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        
        // 搜索按钮
        if (target.id === 'search-btn' || (target.classList.contains('btn') && target.id === 'search-btn')) {
            performSearch();
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        
        // 导航按钮
        if (target.id === 'prev-btn') {
            navigateMatch(-1);
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        
        if (target.id === 'next-btn') {
            navigateMatch(1);
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        
        // 复制匹配按钮
        if (target.id === 'copy-match-btn') {
            copyCurrentMatch();
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        
        // 清除搜索按钮
        if (target.id === 'clear-btn') {
            clearSearch();
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        
        // 基础功能按钮
        if (target.id === 'select-all-btn') {
            selectAll();
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        
        if (target.id === 'copy-selected-btn') {
            copySelected();
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
        
        if (target.id === 'copy-all-btn') {
            copyAll();
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }
    
    // 8. 显示商业授权信息
    function showLicenseInfo() {
        const licenseInfo = `
        📧 商业授权咨询
        
        脚本名称: 智能整合复制面板
        作者: 琪琪 (GreasyFork: 雨落倾城梦之夏)
        
        🎯 适用场景:
        - 公司内部使用
        - 团队协作使用
        - 盈利性项目集成
        - 商业软件/网站
        
        📋 授权流程:
        1. 通过GreasyFork页面联系作者
        2. 提供公司/个人信息
        3. 说明使用场景和规模
        4. 获取报价和授权协议
        
        💰 授权费用:
        根据用户数量和使用场景定价
        一般从$50-$500/年不等
        
        ⚖️ 授权条款:
        - 获得商业使用权利
        - 技术支持服务
        - 版本更新支持
        - 定制功能可选
        
        联系方式: 通过GreasyFork作者页面发送消息
        链接: https://greasyfork.org/zh-CN/users/1564293-雨落倾城梦之夏
        `;
        
        showNotice('请查看控制台获取商业授权信息');
        console.log(licenseInfo);
        
        // 弹窗提示
        alert("商业授权咨询\n\n请通过GreasyFork作者页面联系\nhttps://greasyfork.org/zh-CN/users/1564293\n\n腾讯QQ:2188721988");
    }
    
    // 9. 切换选项卡
    function switchTab(tabId) {
        currentTab = tabId;
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            }
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
    }
    
    // 10. 切换面板
    function togglePanel() {
        if (!panel) {
            createPanel();
            return;
        }
        
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    }
    
    // 11. 基础功能函数
    function selectAll() {
        document.execCommand('selectAll');
        showNotice('已全选页面内容');
    }
    
    function copySelected() {
        const text = window.getSelection().toString();
        if (text) {
            copyText(text);
            showNotice(`已复制 ${text.length} 个字符`);
        } else {
            showNotice('请先选中文字');
        }
    }
    
    function copyAll() {
        const text = document.body.innerText || document.body.textContent;
        copyText(text);
        showNotice(`已复制全文 (${text.length} 字符)`);
    }
    
    // 12. 搜索功能 - 修复：保持当前选项卡 (已修复多区间匹配问题)
    function performSearch() {
        const startText = document.getElementById('start-text').value.trim();
        const endText = document.getElementById('end-text').value.trim();
        
        // 清理之前的搜索结果
        clearSearchResults();
        
        // 保存原始HTML
        originalHTML = document.body.innerHTML;
        
        // 获取页面文本
        const pageText = document.body.innerText || document.body.textContent;
        allMatches = [];
        currentMatchIndex = -1;
        
        // 用于文本内容去重的Set
        const uniqueTexts = new Set();
        
        let searchText = '';
        if (startText) {
            searchText = startText;
        } else if (endText) {
            searchText = endText;
        } else {
            showNotice('请输入搜索文字');
            return;
        }
        
        // ========== 情况1：仅搜索单个词 (开头或结尾) ==========
        if ((startText && !endText) || (!startText && endText)) {
            let searchPos = 0;
            while (searchPos < pageText.length) {
                const startIndex = pageText.indexOf(searchText, searchPos);
                if (startIndex === -1) break;
                
                // 去重检查：如果这个文本还没出现过
                if (!uniqueTexts.has(searchText)) {
                    uniqueTexts.add(searchText);
                    allMatches.push({
                        text: searchText,
                        start: startIndex,
                        end: startIndex + searchText.length,
                        exactMatch: true,
                        index: allMatches.length
                    });
                }
                
                searchPos = startIndex + searchText.length;
            }
        }
        // ========== 情况2：搜索"开头词"到"结尾词"的区间 ==========
        else if (startText && endText) {
            let searchPos = 0;
            
            // 第一层循环：查找所有的"开头词"
            while (searchPos < pageText.length) {
                const startIndex = pageText.indexOf(startText, searchPos);
                if (startIndex === -1) break;
                
                let matchSearchPos = startIndex + startText.length;
                let matchFoundInThisSegment = false;
                
                // 第二层循环：从当前"开头词"后面查找所有的"结尾词"
                while (true) {
                    const endIndex = pageText.indexOf(endText, matchSearchPos);
                    if (endIndex === -1) break;
                    
                    // 获取匹配文本
                    const matchText = pageText.substring(startIndex, endIndex + endText.length);
                    
                    // 关键去重：检查是否已存在相同文本内容
                    if (!uniqueTexts.has(matchText)) {
                        uniqueTexts.add(matchText); // 记录这个文本
                        allMatches.push({
                            text: matchText,
                            start: startIndex,
                            end: endIndex + endText.length,
                            exactMatch: false,
                            index: allMatches.length
                        });
                    }
                    
                    matchFoundInThisSegment = true;
                    matchSearchPos = endIndex + endText.length;
                }
                
                searchPos = startIndex + startText.length;
            }
        }
        
        // ========== 后续通用处理 ==========
        updateResultDisplay();
        
        if (allMatches.length === 0) {
            showNotice('未找到匹配的文字');
            return;
        }
        
        // 高亮匹配
        highlightExactMatches(searchText);
        
        currentMatchIndex = 0;
        highlightCurrentResult();
        
        showNotice(`找到 ${allMatches.length} 个不重复结果`);
        
        // 更新匹配文本显示框
        updateMatchDisplay();
        
        // 修复：确保保持在搜索选项卡
        if (currentTab !== 'search') {
            switchTab('search');
        }
        
        // 重新设置全局事件
        setTimeout(setupGlobalEvents, 100);
        setTimeout(setupToggleButtonDrag, 200);
    }
    
    // 13. 高亮功能
    function highlightExactMatches(searchText) {
        if (!originalHTML || !searchText) return;
        
        let html = originalHTML;
        const escapedText = escapeRegExp(searchText);
        let matchCount = 0;
        
        html = html.replace(new RegExp(escapedText, 'g'), function(match) {
            const result = `<span class="search-match" data-match-id="${matchCount}">${match}</span>`;
            matchCount++;
            return result;
        });
        
        document.body.innerHTML = html;
        
        setTimeout(() => {
            createPanel();
            setTimeout(setupGlobalEvents, 100);
            setTimeout(setupToggleButtonDrag, 200);
        }, 100);
    }
    
    // 14. 导航功能
    function navigateMatch(direction) {
        if (allMatches.length === 0) {
            showNotice('请先搜索文字');
            return;
        }
        
        document.querySelectorAll('.current-match').forEach(span => {
            span.classList.remove('current-match');
            span.classList.add('search-match');
        });
        
        currentMatchIndex += direction;
        
        if (currentMatchIndex < 0) {
            currentMatchIndex = allMatches.length - 1;
        } else if (currentMatchIndex >= allMatches.length) {
            currentMatchIndex = 0;
        }
        
        highlightCurrentResult();
        updateResultDisplay();
        
        const match = allMatches[currentMatchIndex];
        const matchText = match.text;
        const displayText = matchText.length > 50 ? matchText.substring(0, 47) + '...' : matchText;
        showNotice(`第 ${currentMatchIndex + 1} / ${allMatches.length} 个结果: ${displayText}`);
        
        // 更新匹配文本显示框
        updateMatchDisplay();
    }
    
    function highlightCurrentResult() {
        if (currentMatchIndex < 0 || currentMatchIndex >= allMatches.length) {
            return;
        }
        
        // 找到当前索引的匹配
        const currentSpan = document.querySelector(`[data-match-id="${currentMatchIndex}"]`);
        if (currentSpan) {
            // 移除所有current-match
            document.querySelectorAll('.current-match').forEach(span => {
                span.classList.remove('current-match');
                span.classList.add('search-match');
            });
            
            // 高亮当前
            currentSpan.classList.remove('search-match');
            currentSpan.classList.add('current-match');
            
            // 滚动到可见区域
            currentSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // 自动选中整个匹配文本
            selectMatchText(currentSpan);
        }
    }
    
    // 15. 光标位置函数
    function placeCursorAtExactText(element) {
        try {
            const selection = window.getSelection();
            const range = document.createRange();
            
            if (element.firstChild) {
                range.setStart(element.firstChild, 0);
                range.setEnd(element.firstChild, 0);
                
                selection.removeAllRanges();
                selection.addRange(range);
            }
        } catch (e) {
            console.log('光标设置失败:', e);
        }
    }
    
    // 16. 选中匹配文本函数
    function selectMatchText(element) {
        try {
            const selection = window.getSelection();
            const range = document.createRange();
            
            // 设置范围：选中这个元素内的所有文本
            range.selectNodeContents(element);
            
            // 清除旧的选择并应用新选择
            selection.removeAllRanges();
            selection.addRange(range);
            
            // 可选：提供视觉反馈
            showNotice(`已选中匹配文本，可直接复制 (${selection.toString().length} 字符)`);
            
        } catch (e) {
            console.error('文本选择失败:', e);
            // 如果自动选中失败，至少把光标放过去
            placeCursorAtExactText(element);
        }
    }
    
    // 17. 更新匹配文本显示框
    function updateMatchDisplay() {
        const displayBox = document.getElementById('match-display-box');
        const charCountSpan = document.getElementById('match-char-count');
        
        if (currentMatchIndex >= 0 && currentMatchIndex < allMatches.length) {
            const match = allMatches[currentMatchIndex];
            const matchText = match.text;
            
            // 更新显示框内容
            if (displayBox) {
                // 如果文本太长，添加提示并适当截断
                if (matchText.length > 10000) {
                    displayBox.title = `文本过长，已截断显示前10000字符。完整文本长度：${matchText.length} 字符`;
                    displayBox.textContent = matchText.substring(0, 10000) + '...【文本过长，已截断】';
                } else {
                    displayBox.textContent = matchText;
                    displayBox.title = `完整匹配文本 (${matchText.length} 字符)`;
                }
            }
            
            // 更新字符数
            if (charCountSpan) {
                charCountSpan.textContent = matchText.length;
            }
        } else {
            // 没有匹配时的显示
            if (displayBox) {
                displayBox.textContent = '无匹配文本或尚未搜索...';
                displayBox.title = '';
            }
            if (charCountSpan) {
                charCountSpan.textContent = '0';
            }
        }
    }
    
    function clearSearchResults() {
        if (originalHTML) {
            document.body.innerHTML = originalHTML;
            setTimeout(() => {
                createPanel();
                setTimeout(setupGlobalEvents, 100);
                setTimeout(setupToggleButtonDrag, 200);
            }, 100);
        }
        allMatches = [];
        currentMatchIndex = -1;
        updateResultDisplay();
        // 清除显示框
        updateMatchDisplay();
    }
    
    // 18. 复制当前结果
    function copyCurrentMatch() {
        if (currentMatchIndex < 0 || currentMatchIndex >= allMatches.length) {
            showNotice('请先搜索文字');
            return;
        }
        
        const match = allMatches[currentMatchIndex];
        const textToCopy = match.text;
        copyText(textToCopy);
        showNotice(`已复制: "${textToCopy.substring(0, 50)}${textToCopy.length > 50 ? '...' : ''}"`);
    }
    
    function clearSearch() {
        document.getElementById('start-text').value = '';
        document.getElementById('end-text').value = '';
        clearSearchResults();
        showNotice('已清除搜索');
    }
    
    // 19. 工具函数
    function copyText(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function showNotice(message) {
        const existing = document.querySelector('.temp-notice');
        if (existing) existing.remove();
        
        const notice = document.createElement('div');
        notice.className = 'temp-notice';
        notice.textContent = message;
        document.body.appendChild(notice);
        
        setTimeout(() => {
            notice.style.opacity = '0';
            setTimeout(() => notice.remove(), 300);
        }, 1500);
    }
    
    function updateResultDisplay() {
        const matchCount = document.getElementById('match-count');
        const currentIndex = document.getElementById('current-index');
        
        if (matchCount) matchCount.textContent = allMatches.length;
        if (currentIndex) currentIndex.textContent = allMatches.length > 0 ? currentMatchIndex + 1 : 0;
    }
    
    // 20. 解锁复制
    function unlockCopy() {
        document.addEventListener('copy', e => e.stopPropagation(), true);
        document.oncontextmenu = null;
        document.body.style.userSelect = 'text';
    }
    
    // 21. 创建切换按钮
    function createToggleButton() {
        let toggle = document.getElementById('toggle-panel');
        if (toggle) toggle.remove();
        
        toggle = document.createElement('button');
        toggle.id = 'toggle-panel';
        toggle.innerHTML = '📋';
        toggle.title = '显示/隐藏面板';
        
        document.body.appendChild(toggle);
    }
    
    // 22. 切换按钮拖动功能
    function setupToggleButtonDrag() {
        const toggle = document.getElementById('toggle-panel');
        if (!toggle) return;
        
        let isDragging = false;
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;
        
        toggle.onmousedown = null;
        toggle.ontouchstart = null;
        
        toggle.onmousedown = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const rect = toggle.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;
            
            isDragging = true;
            toggle.style.opacity = '0.8';
            
            function onMouseMove(e) {
                if (!isDragging) return;
                
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                let newLeft = startLeft + deltaX;
                let newTop = startTop + deltaY;
                
                const maxLeft = window.innerWidth - toggle.offsetWidth;
                const maxTop = window.innerHeight - toggle.offsetHeight;
                
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));
                
                toggle.style.left = newLeft + 'px';
                toggle.style.top = newTop + 'px';
                toggle.style.right = 'auto';
                toggle.style.bottom = 'auto';
            }
            
            function onMouseUp(e) {
                if (!isDragging) return;
                
                isDragging = false;
                toggle.style.opacity = '1';
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                
                const deltaX = Math.abs(e.clientX - startX);
                const deltaY = Math.abs(e.clientY - startY);
                
                if (deltaX < 5 && deltaY < 5) {
                    togglePanel();
                }
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
        
        toggle.ontouchstart = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const touch = e.touches[0];
            const rect = toggle.getBoundingClientRect();
            startX = touch.clientX;
            startY = touch.clientY;
            startLeft = rect.left;
            startTop = rect.top;
            
            isDragging = true;
            toggle.style.opacity = '0.8';
            
            function onTouchMove(e) {
                if (!isDragging) return;
                
                const touch = e.touches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;
                
                let newLeft = startLeft + deltaX;
                let newTop = startTop + deltaY;
                
                const maxLeft = window.innerWidth - toggle.offsetWidth;
                const maxTop = window.innerHeight - toggle.offsetHeight;
                
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
                newTop = Math.max(0, Math.min(newTop, maxTop));
                
                toggle.style.left = newLeft + 'px';
                toggle.style.top = newTop + 'px';
                toggle.style.right = 'auto';
                toggle.style.bottom = 'auto';
            }
            
            function onTouchEnd(e) {
                if (!isDragging) return;
                
                isDragging = false;
                toggle.style.opacity = '1';
                
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                
                const touch = e.changedTouches[0];
                const deltaX = Math.abs(touch.clientX - startX);
                const deltaY = Math.abs(touch.clientY - startY);
                
                if (deltaX < 10 && deltaY < 10) {
                    togglePanel();
                }
            }
            
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
        };
    }
    
    // 23. 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(init, 100);
            setTimeout(setupGlobalEvents, 200);
        });
    } else {
        setTimeout(init, 100);
        setTimeout(setupGlobalEvents, 200);
    }
    
    console.log('🎯 智能整合复制面板 v1.0.1 加载完成');
    console.log('👤 作者: 琪琪 (雨落倾城梦之夏)');
    console.log('🌐 GreasyFork: https://greasyfork.org/zh-CN/users/1564293');
    console.log('🔧 功能: 文本搜索+匹配预览+自动选中');
    
})();