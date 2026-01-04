// ==UserScript==
// @name         OpenCD 清空收件箱
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  专用于OpenCD：自动批量删除收件箱中的所有消息（已读+未读），点击一次即可循环执行直到清空。
// @author       kk
// @license      MIT
// @match        *://open.cd/messages.php*
// @match        *://www.open.cd/messages.php*
// @match        *://hdsky.me/messages.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557542/OpenCD%20%E6%B8%85%E7%A9%BA%E6%94%B6%E4%BB%B6%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/557542/OpenCD%20%E6%B8%85%E7%A9%BA%E6%94%B6%E4%BB%B6%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 状态存储键名
    const STORAGE_KEY = 'ocd_autodel_running';

    // 初始化控制面板
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed; top:10px; left:10px; z-index:9999; padding:8px 12px; background:rgba(0,0,0,0.85); color:#fff; border-radius:4px; font-size:12px; box-shadow:0 2px 5px rgba(0,0,0,0.3);';
    document.body.appendChild(panel);

    // 状态文本
    const statusText = document.createElement('span');
    statusText.style.marginRight = '10px';
    panel.appendChild(statusText);

    // 操作按钮
    const btnAction = document.createElement('button');
    btnAction.style.cssText = 'border:none; padding:4px 8px; border-radius:3px; cursor:pointer; font-weight:bold; color:#fff;';
    panel.appendChild(btnAction);

    // 读取运行状态
    const isRunning = localStorage.getItem(STORAGE_KEY) === 'true';

    // 渲染界面逻辑
    if (isRunning) {
        statusText.innerText = '正在运行自动清理...';
        btnAction.innerText = '停止';
        btnAction.style.backgroundColor = '#5bc0de'; // 蓝色停止键
        
        // 延迟执行以确保页面加载完成
        setTimeout(executeDelete, 800);
    } else {
        statusText.innerText = '收件箱清理助手';
        btnAction.innerText = '全部删除';
        btnAction.style.backgroundColor = '#d9534f'; // 红色删除键
    }

    // 按钮事件绑定
    btnAction.onclick = function() {
        if (isRunning) {
            // 停止逻辑
            localStorage.setItem(STORAGE_KEY, 'false');
            location.reload();
        } else {
            // 开始逻辑
            if (confirm('警告：此操作将循环删除收件箱内“所有消息”（包含未读）。\n\n脚本将自动翻页处理，直到列表为空。\n\n是否确认执行？')) {
                localStorage.setItem(STORAGE_KEY, 'true');
                executeDelete();
            }
        }
    };

    // 核心删除逻辑
    function executeDelete() {
        // 获取所有消息复选框
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="messages[]"]');
        // 获取删除按钮
        const deleteBtn = document.querySelector('input[type="submit"][name="delete"]');

        if (checkboxes.length > 0 && deleteBtn) {
            statusText.innerText = `正在处理 ${checkboxes.length} 条消息...`;
            
            // 全选当前页
            checkboxes.forEach(box => box.checked = true);
            
            // 屏蔽系统原生确认弹窗
            window.confirm = () => true;
            
            // 提交删除，页面将自动刷新
            deleteBtn.click();
        } else {
            // 列表为空，任务结束
            localStorage.setItem(STORAGE_KEY, 'false');
            statusText.innerText = '清理完成';
            btnAction.style.display = 'none';
            alert('收件箱已清空。');
            // 稍微延迟后重置界面
            setTimeout(() => location.reload(), 1000);
        }
    }
})();