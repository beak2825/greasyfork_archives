// ==UserScript==
// @name         MR目标分支设置
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自定义GitLab推送后创建合并请求的目标分支，支持手动设置
// @author       章小慢
// @match        https://git.xxxxx.co/* 
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/550368/MR%E7%9B%AE%E6%A0%87%E5%88%86%E6%94%AF%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/550368/MR%E7%9B%AE%E6%A0%87%E5%88%86%E6%94%AF%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 从存储中获取目标分支，默认为develop
    let TARGET_BRANCH = GM_getValue('gitlabMrTargetBranch', 'develop');
    
    // 更新切换按钮文本，显示当前分支
    const updateToggleButtonText = (toggleBtn) => {
        toggleBtn.textContent = `MR → ${TARGET_BRANCH}`;
    };
    
    // 创建设置面板
    const createSettingsPanel = () => {
        // 检查面板是否已存在
        if (document.getElementById('mr-branch-settings-panel')) {
            return;
        }
        
        // 创建面板元素 - 更紧凑的样式
        const panel = document.createElement('div');
        panel.id = 'mr-branch-settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: white;
            padding: 12px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 8888;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            width: 260px;
            margin: 0;
            overflow: hidden; /* 避免内部元素产生滚动条 */
        `;
        
        // 面板标题 - 减少边距和字体大小
        const title = document.createElement('h4');
        title.textContent = 'MR目标分支设置';
        title.style.marginTop = '0';
        title.style.marginBottom = '8px';
        title.style.fontSize = '14px';
        title.style.fontWeight = '500';
        title.style.color = '#333';
        
        // 输入框 - 更紧凑的样式
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'target-branch-input';
        input.value = TARGET_BRANCH;
        input.style.width = '100%';
        input.style.padding = '6px 8px';
        input.style.marginBottom = '8px';
        input.style.boxSizing = 'border-box';
        input.style.border = '1px solid #ddd';
        input.style.borderRadius = '4px';
        input.style.fontSize = '13px';
        input.style.outline = 'none';
        input.placeholder = '输入目标分支名称';
        input.style.transition = 'border-color 0.2s ease';
        
        // 添加输入框焦点效果
        input.addEventListener('focus', () => {
            input.style.borderColor = '#007bff';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = '#ddd';
        });
        
        // 保存按钮 - 更紧凑的样式
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存设置';
        saveBtn.style.backgroundColor = '#28a745';
        saveBtn.style.color = 'white';
        saveBtn.style.border = 'none';
        saveBtn.style.padding = '6px 12px';
        saveBtn.style.borderRadius = '4px';
        saveBtn.style.cursor = 'pointer';
        saveBtn.style.width = '100%';
        saveBtn.style.fontSize = '13px';
        saveBtn.style.transition = 'background-color 0.2s ease';
        
        // 添加按钮悬停效果
        saveBtn.addEventListener('mouseover', () => {
            saveBtn.style.backgroundColor = '#218838';
        });
        
        saveBtn.addEventListener('mouseout', () => {
            saveBtn.style.backgroundColor = '#28a745';
        });
        
        // 切换面板显示的按钮 - 更紧凑的样式
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggle-settings-btn';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: #007bff;
            color: white;
            border: none;
            padding: 7px 12px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            white-space: nowrap;
        `;
        
        // 初始化按钮文本
        updateToggleButtonText(toggleBtn);
        
        // 添加按钮悬停效果
        toggleBtn.addEventListener('mouseover', () => {
            toggleBtn.style.backgroundColor = '#0056b3';
            toggleBtn.style.transform = 'translateY(-1px)';
            toggleBtn.style.boxShadow = '0 3px 6px rgba(0,0,0,0.2)';
        });
        
        toggleBtn.addEventListener('mouseout', () => {
            toggleBtn.style.backgroundColor = '#007bff';
            toggleBtn.style.transform = 'translateY(0)';
            toggleBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        });
        
        // 保存设置
        saveBtn.addEventListener('click', () => {
            const newBranch = input.value.trim();
            if (newBranch) {
                TARGET_BRANCH = newBranch;
                GM_setValue('gitlabMrTargetBranch', TARGET_BRANCH);
                console.log(`已设置目标分支为: ${TARGET_BRANCH}`);
                
                // 更新按钮文本
                updateToggleButtonText(toggleBtn);
                
                // 更新所有MR按钮
                document.querySelectorAll('.qa-create-merge-request').forEach(button => {
                    modifyMergeRequestLink(button);
                });
                
                // 隐藏面板
                panel.style.display = 'none';
                toggleBtn.style.display = 'block';
            } else {
                alert('请输入有效的分支名称');
            }
        });
        
        // 切换面板显示
        toggleBtn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            toggleBtn.style.display = panel.style.display === 'none' ? 'block' : 'none';
            if (panel.style.display === 'block') {
                input.focus();
                // 选中输入框内容
                input.select();
            }
        });
        
        // 组装面板
        panel.appendChild(title);
        panel.appendChild(input);
        panel.appendChild(saveBtn);
        panel.style.display = 'none'; // 默认隐藏
        
        // 添加到页面
        document.body.appendChild(panel);
        document.body.appendChild(toggleBtn);
    };
    
    // 监视页面变化的函数，用于处理动态加载的内容
    const observePageChanges = () => {
        // 选择要观察的节点
        const targetNode = document.body;
        
        // 观察器的配置
        const config = { childList: true, subtree: true };
        
        // 当观察到变动时执行的回调函数
        const callback = function(mutationsList, observer) {
            // 检查是否存在创建合并请求的按钮
            const mrButtons = document.querySelectorAll('.qa-create-merge-request');
            mrButtons.forEach(button => {
                modifyMergeRequestLink(button);
            });
        };
        
        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(callback);
        
        // 开始观察目标节点
        observer.observe(targetNode, config);
    };
    
    // 修改合并请求链接的函数
    const modifyMergeRequestLink = (button) => {
        const originalHref = button.getAttribute('href');
        
        if (originalHref && originalHref.includes('merge_request%5Btarget_branch%5D=')) {
            // 替换目标分支参数
            const newHref = originalHref.replace(
                /merge_request%5Btarget_branch%5D=[^&]+/,
                `merge_request%5Btarget_branch%5D=${encodeURIComponent(TARGET_BRANCH)}`
            );
            
            // 只有当链接实际改变时才更新，避免重复操作
            if (newHref !== originalHref) {
                button.setAttribute('href', newHref);
                
                // 更新按钮文本，显示当前目标分支
                button.textContent = `Create MR to ${TARGET_BRANCH}`;
                
                // 添加视觉提示
                button.classList.remove('btn-info', 'btn-success');
                button.classList.add('btn-primary');
            }
        }
    };
    
    // 页面加载完成后开始执行
    window.addEventListener('load', function() {
        // 创建设置面板
        createSettingsPanel();
        
        // 立即检查并修改已存在的按钮
        document.querySelectorAll('.qa-create-merge-request').forEach(button => {
            modifyMergeRequestLink(button);
        });
        
        // 启动页面变化监视器
        observePageChanges();
    });
})();
