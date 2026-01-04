// ==UserScript==
// @name         新未名树洞剪贴板传图助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  实现在新未名树洞中直接从剪贴板粘贴上传图片的功能，但目前似乎还会直接自动发布图片（
// @author       Fia719
// @match        https://web.pkuhollow.com/*
// @icon         https://raw.githubusercontent.com/pkuhollow/pkuhollow/main/logo.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549944/%E6%96%B0%E6%9C%AA%E5%90%8D%E6%A0%91%E6%B4%9E%E5%89%AA%E8%B4%B4%E6%9D%BF%E4%BC%A0%E5%9B%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549944/%E6%96%B0%E6%9C%AA%E5%90%8D%E6%A0%91%E6%B4%9E%E5%89%AA%E8%B4%B4%E6%9D%BF%E4%BC%A0%E5%9B%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区 ---
    const AUTH_TOKEN_STORAGE_KEY = 'TOKEN';

    // --- “回复树洞”模式的配置 ---
    const REPLY_API_CONFIG = {
        url: 'https://api.pkuhollow.com/v3/send/comment',
        textField: 'text',
        imageField: 'data',
        typeValue: 'image',
        extraFields: { 'reply_to_cid': '-1' }
    };

    // --- “发新树洞”模式的配置 ---
    const NEW_POST_API_CONFIG = {
        url: 'https://api.pkuhollow.com/v3/send/post',
        textField: 'text',
        imageField: 'data',
        typeValue: 'image',
        extraFields: {}
    };
    // ----------------------------------------------------


    function showNotification(message, isError = false) {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '20px';
        div.style.left = '50%';
        div.style.transform = 'translateX(-50%)';
        div.style.padding = '10px 20px';
        div.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
        div.style.color = 'white';
        div.style.borderRadius = '5px';
        div.style.zIndex = '9999';
        div.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        div.innerText = message;
        document.body.appendChild(div);
        setTimeout(() => document.body.removeChild(div), 3000);
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    }

    async function handlePaste(imageFile, targetTextarea) {
        showNotification('检测到图片，正在发送~');

        const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
        if (!token) { showNotification('发送失败：未找到用户TOKEN', true); return; }

        let config, pid;
        const match = window.location.pathname.match(/\/h\/(\d+)/);

        if (match) {
            // --- 回复模式 ---
            config = REPLY_API_CONFIG;
            pid = match[1];
            console.log(`现在是回复模式，PID: ${pid}`);
        } else {
            // --- 发新洞模式 ---
            config = NEW_POST_API_CONFIG;
            console.log('现在是发新洞模式');
            
        }

        const text = targetTextarea ? targetTextarea.value : '';

        try {
            const base64Data = await fileToBase64(imageFile);
            const formData = new FormData();

            if (pid) formData.append('pid', pid);
            formData.append(config.textField, text);
            formData.append('type', config.typeValue);
            formData.append(config.imageField, base64Data);
            for (const key in config.extraFields) {
                formData.append(key, config.extraFields[key]);
            }

            const fullUrl = `${config.url}?device=0&v=v3.0.6-488384`;
            const response = await fetch(fullUrl, { method: 'POST', headers: { 'token': token }, body: formData });

            if (!response.ok) { throw new Error(`服务器错误: ${response.status}`); }
            const result = await response.json();

            if (result.code === 0) {
                showNotification('发送成功啦！即将刷新页面');
                if(targetTextarea) targetTextarea.value = '';
                setTimeout(() => { window.location.reload(); }, 1500);
            } else {
                throw new Error(result.msg || 'API返回了一个未知错误qwq');
            }
        } catch (error) {
            console.error('发送失败:', error);
            showNotification(`发送失败: ${error.message}`, true);
        }
    }

    document.addEventListener('paste', function (event) {
        const target = event.target;
        if (target.tagName !== 'TEXTAREA' && target.tagName !== 'INPUT') { return; }
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        let imageFile = null;
        for (const item of items) {
            if (item.type.indexOf('image') === 0) {
                imageFile = item.getAsFile();
                break;
            }
        }
        if (imageFile) {
            event.preventDefault();
            handlePaste(imageFile, target);
        }
    });

    console.log('树洞剪贴板传图助手已加载~');
})();
