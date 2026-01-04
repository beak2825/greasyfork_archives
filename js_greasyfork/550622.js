// ==UserScript==
// @name         网站保活助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在指定网站上自动保活，定时滚动和刷新页面，用户操作会重置计时
// @author       damu
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550622/%E7%BD%91%E7%AB%99%E4%BF%9D%E6%B4%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/550622/%E7%BD%91%E7%AB%99%E4%BF%9D%E6%B4%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEFAULT_SCROLL = 5, DEFAULT_REFRESH = 20, DEFAULT_ACTIVITY = 1;
    let scrollTimer, refreshTimer, lastActivityTime = Date.now();
    let globalEnabled = GM_getValue('globalEnabled', true);
    let sites = GM_getValue('keepAliveSites', []);

    // 修复旧数据格式：如果sites是字符串数组，转换为对象数组
    if (sites.length > 0 && typeof sites[0] === 'string') {
        sites = sites.map(url => ({
            url: url,
            enabled: true,
            scroll: DEFAULT_SCROLL,
            refresh: DEFAULT_REFRESH,
            activity: DEFAULT_ACTIVITY
        }));
        GM_setValue('keepAliveSites', sites);
    }

    GM_registerMenuCommand("网站保活管理", openManagerUI);
    GM_registerMenuCommand("添加当前网站", addCurrentSite);

    function addCurrentSite() {
        const currentUrl = window.location.origin + window.location.pathname;
        const sitePattern = currentUrl + (window.location.pathname.endsWith('/') ? '*' : '/*');
        if (!sites.some(s => s.url === sitePattern)) {
            sites.push({url: sitePattern, enabled: true, scroll: DEFAULT_SCROLL, refresh: DEFAULT_REFRESH, activity: DEFAULT_ACTIVITY});
            GM_setValue('keepAliveSites', sites);
            GM_notification({ text: `已添加 ${sitePattern}`, timeout: 2000 });
            if (globalEnabled) initKeepAlive();
        } else {
            GM_notification({ text: '网站已存在', timeout: 2000 });
        }
    }

    function openManagerUI() {
        if (!document.getElementById('keepAliveManager')) createManagerUI();
        document.getElementById('keepAliveOverlay').style.display = 'block';
        document.getElementById('keepAliveManager').style.display = 'block';
    }

    function closeManagerUI() {
        document.getElementById('keepAliveOverlay').style.display = 'none';
        document.getElementById('keepAliveManager').style.display = 'none';
    }

    function addSiteFromUI() {
        const url = document.getElementById('siteUrl').value.trim();
        if (url && !sites.some(s => s.url === url)) {
            sites.push({url: url, enabled: true, scroll: DEFAULT_SCROLL, refresh: DEFAULT_REFRESH, activity: DEFAULT_ACTIVITY});
            renderSiteList();
            document.getElementById('siteUrl').value = '';
        }
    }

    function saveConfig() {
        globalEnabled = document.getElementById('globalToggle').checked;
        GM_setValue('keepAliveSites', sites);
        GM_setValue('globalEnabled', globalEnabled);
        GM_notification({ text: '已保存', timeout: 1500 });
        closeManagerUI();
        clearTimers();
        if (globalEnabled && checkSite()) initKeepAlive();
    }

    function createManagerUI() {
        const overlay = document.createElement('div');
        overlay.id = 'keepAliveOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:none';
        overlay.onclick = closeManagerUI;

        const manager = document.createElement('div');
        manager.id = 'keepAliveManager';
        manager.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;background:white;border-radius:8px;z-index:10000;display:none';

        manager.innerHTML = `
            <div style="background:#3498db;color:white;padding:15px;border-radius:8px 8px 0 0;display:flex;justify-content:space-between;align-items:center">
                <h3 style="margin:0">网站保活管理</h3>
                <button id="closeBtn" style="background:none;border:none;color:white;font-size:20px;cursor:pointer">&times;</button>
            </div>
            <div style="padding:15px">
                <div style="margin-bottom:15px">
                    <label><input type="checkbox" id="globalToggle" ${globalEnabled ? 'checked' : ''}> 全局启用</label>
                </div>
                <div style="margin-bottom:15px">
                    <input type="text" id="siteUrl" placeholder="输入网站URL" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;margin-bottom:10px">
                    <button id="addBtn" style="background:#3498db;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;width:100%">添加网站</button>
                </div>
                <div id="siteList" style="max-height:300px;overflow-y:auto"></div>
            </div>
            <div style="padding:15px;background:#f5f5f5;border-radius:0 0 8px 8px;text-align:right">
                <button id="saveBtn" style="background:#2ecc71;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;margin-right:10px">保存</button>
                <button id="cancelBtn" style="background:#e74c3c;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer">取消</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(manager);

        document.getElementById('closeBtn').onclick = closeManagerUI;
        document.getElementById('addBtn').onclick = addSiteFromUI;
        document.getElementById('saveBtn').onclick = saveConfig;
        document.getElementById('cancelBtn').onclick = closeManagerUI;

        renderSiteList();
    }

    function renderSiteList() {
        const siteListDiv = document.getElementById('siteList');
        if (!siteListDiv) return;

        siteListDiv.innerHTML = sites.length ? '' : '<div style="text-align:center;color:#666;padding:20px">暂无网站</div>';

        sites.forEach((site, index) => {
            const siteItem = document.createElement('div');
            siteItem.style.cssText = 'padding:10px;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between';

            siteItem.innerHTML = `
                <div style="flex:1">
                    <label style="display:flex;align-items:center;cursor:pointer">
                        <input type="checkbox" ${site.enabled ? 'checked' : ''} style="margin-right:8px">
                        <span style="font-size:12px">${site.url}</span>
                    </label>
                </div>
                <button style="background:#e74c3c;color:white;border:none;padding:4px 8px;border-radius:3px;cursor:pointer;font-size:12px">删除</button>
            `;

            const checkbox = siteItem.querySelector('input[type="checkbox"]');
            checkbox.onchange = function() {
                sites[index].enabled = this.checked;
            };

            const deleteBtn = siteItem.querySelector('button');
            deleteBtn.onclick = function() {
                sites.splice(index, 1);
                renderSiteList();
            };

            siteListDiv.appendChild(siteItem);
        });
    }

    function clearTimers() {
        clearTimeout(scrollTimer);
        clearTimeout(refreshTimer);
    }

    function checkSite() {
        const currentUrl = window.location.href;
        return sites.some(site => site.enabled && new RegExp('^' + site.url.replace(/\*/g, '.*') + '$').test(currentUrl));
    }

    function getCurrentSiteSettings() {
        const currentUrl = window.location.href;
        return sites.find(site => site.enabled && new RegExp('^' + site.url.replace(/\*/g, '.*') + '$').test(currentUrl));
    }

    function simulateScroll() {
        window.scrollBy(0, 200);
        setTimeout(() => window.scrollBy(0, -100), 1000);
    }

    function refreshPage() {
        const settings = getCurrentSiteSettings();
        if (settings && Date.now() - lastActivityTime > settings.activity * 60000) {
            window.location.reload();
        } else {
            resetTimers();
        }
    }

    function resetTimers() {
        const settings = getCurrentSiteSettings();
        if (!settings) return;

        lastActivityTime = Date.now();
        clearTimers();
        scrollTimer = setTimeout(simulateScroll, settings.scroll * 60000);
        refreshTimer = setTimeout(refreshPage, settings.refresh * 60000);
    }

    function initKeepAlive() {
        ['mousemove', 'keypress', 'click', 'scroll'].forEach(event => {
            document.addEventListener(event, () => { lastActivityTime = Date.now(); }, {passive: true});
        });
        resetTimers();
    }

    // 初始化
    if (globalEnabled && checkSite()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initKeepAlive);
        } else {
            initKeepAlive();
        }
    }
})();