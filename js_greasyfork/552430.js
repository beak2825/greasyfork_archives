// ==UserScript==
// @name         B站Cookie手动提取器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  手动解析提取B站Cookie中的关键信息
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552430/B%E7%AB%99Cookie%E6%89%8B%E5%8A%A8%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552430/B%E7%AB%99Cookie%E6%89%8B%E5%8A%A8%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建显示面板
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'cookie-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            width: 500px;
            background: #fff;
            border: 2px solid #00a1d6;
            border-radius: 8px;
            padding: 15px;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #00a1d6;">Cookie 提取器</h3>
                <button id="close-panel" style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 16px;">×</button>
            </div>

            <div>
                <div style="font-weight: bold; margin-bottom: 8px; color: #333;">手动解析Cookie:</div>
                <textarea id="cookie-input" placeholder="粘贴完整的Cookie字符串到这里..." style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; font-family: monospace; resize: vertical; box-sizing: border-box;"></textarea>
                <button id="parse-cookie" style="width: 100%; margin-top: 8px; background: #00a1d6; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">解析并提取关键Cookie</button>
            </div>

            <div id="parsed-result" style="margin-top: 15px; display: none;">
                <div style="font-weight: bold; margin-bottom: 8px; color: #333;">解析结果:</div>
                <div id="parsed-cookie" style="background: #e8f5e9; padding: 10px; border-radius: 4px; font-size: 12px; word-break: break-all; font-family: monospace; line-height: 1.5; color: #333;"></div>
                <button id="copy-parsed" style="width: 100%; margin-top: 8px; background: #4caf50; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">复制解析结果</button>
            </div>

            <div id="status" style="margin-top: 10px; text-align: center; color: #4caf50; font-size: 12px; min-height: 20px;"></div>
        `;

        return panel;
    }

    // 显示状态消息
    function showStatus(message, isError = false) {
        const status = document.getElementById('status');
        if (status) {
            status.textContent = message;
            status.style.color = isError ? '#f44336' : '#4caf50';
            status.style.opacity = '1';
            setTimeout(() => {
                status.style.opacity = '0';
            }, 2000);
        }
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        if (!text) {
            showStatus('✗ 暂无可复制的内容', true);
            return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showStatus('✓ 已复制到剪贴板');
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    // 降级复制方案
    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showStatus('✓ 已复制到剪贴板');
        } catch (err) {
            showStatus('✗ 复制失败', true);
        }
        document.body.removeChild(textarea);
    }

    // 提取关键Cookie
    function extractKeyCookies(cookieString) {
        if (!cookieString) return '';

        const keyCookieNames = ['SESSDATA', 'DedeUserID', 'DedeUserID__ckMd5'];
        const keyCookies = [];

        keyCookieNames.forEach(name => {
            const regex = new RegExp(name + '=([^;\\s]+)');
            const match = cookieString.match(regex);
            if (match) {
                keyCookies.push(name + '=' + match[1]);
            }
        });

        return keyCookies.join('; ');
    }

    // 页面加载完成后添加面板
    window.addEventListener('load', function() {
        const panel = createPanel();
        document.body.appendChild(panel);

        // 关闭按钮
        document.getElementById('close-panel').addEventListener('click', function() {
            panel.style.display = 'none';
        });

        // 解析Cookie按钮
        document.getElementById('parse-cookie').addEventListener('click', function() {
            const input = document.getElementById('cookie-input').value.trim();
            if (!input) {
                showStatus('✗ 请先粘贴Cookie内容', true);
                return;
            }

            const parsed = extractKeyCookies(input);
            const resultDiv = document.getElementById('parsed-result');
            const parsedCookieDiv = document.getElementById('parsed-cookie');

            if (parsed) {
                parsedCookieDiv.textContent = parsed;
                resultDiv.style.display = 'block';
                showStatus('✓ 解析成功');
            } else {
                showStatus('✗ 未找到关键Cookie', true);
            }
        });

        // 复制解析结果按钮
        document.getElementById('copy-parsed').addEventListener('click', function() {
            const parsed = document.getElementById('parsed-cookie').textContent;
            copyToClipboard(parsed);
        });
    });

    console.log('[Cookie提取器] 脚本已加载');
})();