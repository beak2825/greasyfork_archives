// ==UserScript==
// @name         GitHub链接自动镜像跳转
// @namespace    https://github.com/feihuafu/gitscript
// @version      2.0
// @description  在必应、百度搜索结果中点击GitHub链接时自动跳转至可选镜像站（bgithub或kkgithub）
// @author       feihuafu
// @match        https://cn.bing.com/*
// @match        https://www.baidu.com/*
// @license      GNU General Public License v3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553058/GitHub%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E9%95%9C%E5%83%8F%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553058/GitHub%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E9%95%9C%E5%83%8F%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'github_mirror_settings';
    const defaultSettings = {
        enabled: true,
        mirror: 'bgithub.xyz'
    };

    // 从localStorage加载设置
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultSettings;

    // 监听点击事件
    document.addEventListener('click', function(e) {
        if (!settings.enabled) return; // 未启用则不拦截

        let link = e.target.closest('a');
        if (!link) return;

        let href = link.href;
        if (href.startsWith('https://github.com/')) {
            e.preventDefault(); // 阻止默认跳转
            let newUrl = href.replace('https://github.com/', `https://${settings.mirror}/`);
            window.open(newUrl, '_blank');
        }
    }, true);

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'github-mirror-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            background: rgba(30,30,30,0.9);
            color: #fff;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 13px;
            font-family: sans-serif;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: move;
            user-select: none;
        `;
        panel.innerHTML = `
            <div style="margin-bottom:6px;font-weight:bold;">🔗 GitHub镜像跳转</div>
            <label style="display:block;margin-bottom:4px;">
                <input type="checkbox" id="gm-enable" ${settings.enabled ? 'checked' : ''}>
                启用自动跳转
            </label>
            <label>
                镜像源：
                <select id="gm-mirror">
                    <option value="bgithub.xyz" ${settings.mirror === 'bgithub.xyz' ? 'selected' : ''}>bgithub.xyz</option>
                    <option value="kkgithub.com" ${settings.mirror === 'kkgithub.com' ? 'selected' : ''}>kkgithub.com</option>
                </select>
            </label>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        const enableCheckbox = panel.querySelector('#gm-enable');
        const mirrorSelect = panel.querySelector('#gm-mirror');

        enableCheckbox.addEventListener('change', () => {
            settings.enabled = enableCheckbox.checked;
            saveSettings();
        });
        mirrorSelect.addEventListener('change', () => {
            settings.mirror = mirrorSelect.value;
            saveSettings();
        });

        // 可拖动
        makeDraggable(panel);
    }

    function saveSettings() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    // 实现面板拖动
    function makeDraggable(el) {
        let offsetX = 0, offsetY = 0, dragging = false;
        el.addEventListener('mousedown', e => {
            dragging = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
            el.style.transition = 'none';
        });
        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            el.style.left = (e.clientX - offsetX) + 'px';
            el.style.top = (e.clientY - offsetY) + 'px';
            el.style.right = 'auto';
            el.style.bottom = 'auto';
        });
        document.addEventListener('mouseup', () => dragging = false);
    }

    // 等页面加载后创建面板
    window.addEventListener('load', createControlPanel);
})();