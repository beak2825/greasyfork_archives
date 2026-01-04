// ==UserScript==
// @name         即刻内容屏蔽器（稳定版）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  屏蔽即刻网页版中指定关键字和社区的内容（防止反复出现）
// @author       You
// @match        https://web.okjike.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554211/%E5%8D%B3%E5%88%BB%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD%E5%99%A8%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554211/%E5%8D%B3%E5%88%BB%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD%E5%99%A8%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_CONFIG = {
        keywords: ['吃播'],
        communities: ['喵星人的日常'],
        enabled: true
    };

    function getConfig() {
        const saved = GM_getValue('jike_blocker_config_v2');
        return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    }

    function saveConfig(config) {
        GM_setValue('jike_blocker_config_v2', JSON.stringify(config));
    }

    function shouldBlock(postElement) {
        const config = getConfig();
        if (!config.enabled) return false;

        const contentEl = postElement.querySelector('[class*="jk-"][class*="-mipk4t"]');
        if (contentEl) {
            const text = contentEl.textContent.toLowerCase();
            for (const keyword of config.keywords) {
                if (text.includes(keyword.toLowerCase())) return true;
            }
        }

        const communityEl = postElement.querySelector('[class*="jk-"][class*="-qcm5xu"]');
        if (communityEl) {
            const name = communityEl.textContent.trim();
            if (config.communities.includes(name)) return true;
        }

        return false;
    }

    function hidePost(el) {
        el.style.display = 'none';
        el.setAttribute('data-jike-blocked', '1');
    }

    function processAllPosts() {
        const posts = document.querySelectorAll('[data-clickable-feedback="true"]');
        posts.forEach(post => {
            if (!post.hasAttribute('data-jike-blocked') && shouldBlock(post)) {
                hidePost(post);
            }
        });
    }

    function startObserver() {
        const observer = new MutationObserver(() => {
            processAllPosts();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    function startPeriodicCheck() {
        setInterval(() => {
            processAllPosts();
        }, 1000); // 每秒检查一次，防止 React 把 display 改回来
    }

    function createSettingsPanel() {
        const config = getConfig();
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;"></div>
            <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;z-index:10000;width:90%;max-width:500px;">
                <h3>即刻内容屏蔽器设置</h3>
                <label><input type="checkbox" id="jike-enabled" ${config.enabled ? 'checked' : ''}> 启用屏蔽</label><br><br>
                <h4>关键字（每行一个）</h4>
                <textarea id="jike-keywords" rows="5" style="width:100%;">${config.keywords.join('\n')}</textarea><br>
                <h4>社区名（每行一个）</h4>
                <textarea id="jike-communities" rows="5" style="width:100%;">${config.communities.join('\n')}</textarea><br>
                <div style="text-align:right;">
                    <button id="jike-save" style="margin-right:10px;">保存</button>
                    <button id="jike-cancel">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        panel.querySelector('#jike-save').onclick = () => {
            const enabled = panel.querySelector('#jike-enabled').checked;
            const keywords = panel.querySelector('#jike-keywords').value.split('\n').map(s => s.trim()).filter(Boolean);
            const communities = panel.querySelector('#jike-communities').value.split('\n').map(s => s.trim()).filter(Boolean);
            saveConfig({ enabled, keywords, communities });
            panel.remove();
            processAllPosts();
        };

        panel.querySelector('#jike-cancel').onclick = () => panel.remove();
        panel.querySelector('div:first-child').onclick = () => panel.remove();
    }

    function addControlButton() {
        const btn = document.createElement('div');
        btn.innerHTML = '⚙️';
        btn.style.cssText = `
            position:fixed;bottom:20px;right:20px;width:50px;height:50px;background:#03A9F4;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:1000;font-size:20px;box-shadow:0 2px 10px rgba(0,0,0,0.3);
        `;
        btn.onclick = createSettingsPanel;
        document.body.appendChild(btn);
    }

    function init() {
        startObserver();
        startPeriodicCheck();
        addControlButton();
        processAllPosts();
    }

    GM_registerMenuCommand('设置屏蔽规则', createSettingsPanel);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();