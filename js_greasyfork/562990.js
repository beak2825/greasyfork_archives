// ==UserScript==
// @name         M-Team 免费种子提取
// @name:en      M-Team FREE Torrents Extractor
// @namespace    https://github.com/cyrahs
// @version      2.6
// @description  获取页面上所有标记为FREE的torrent id并通过API获取下载链接
// @description:en  Finds all FREE-marked torrents on the page and fetches download links via the API.
// @author       cyrah
// @license      MIT
// @homepageURL  https://github.com/cyrahs/mteam-js
// @supportURL   https://github.com/cyrahs/mteam-js
// @match        https://*.m-team.cc/*
// @match        https://m-team.cc/*
// @icon         https://kp.m-team.cc/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/562990/M-Team%20%E5%85%8D%E8%B4%B9%E7%A7%8D%E5%AD%90%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/562990/M-Team%20%E5%85%8D%E8%B4%B9%E7%A7%8D%E5%AD%90%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置管理（使用 GM 存储）
    const CONFIG_KEYS = {
        apiEndpoint: 'mteam_api_endpoint',
        apiKey: 'mteam_api_key',
        openUrl: 'mteam_open_url'
    };

    function getConfig() {
        const defaultConfig = {
            apiEndpoint: 'https://api.m-team.cc/api/torrent/genDlToken',
            apiKey: '',
            openUrl: ''
        };
        try {
            const storedEndpoint = GM_getValue(CONFIG_KEYS.apiEndpoint, undefined);
            const storedApiKey = GM_getValue(CONFIG_KEYS.apiKey, undefined);
            const storedOpenUrl = GM_getValue(CONFIG_KEYS.openUrl, undefined);

            const hasGMValues =
                storedEndpoint !== undefined ||
                storedApiKey !== undefined ||
                storedOpenUrl !== undefined;

            if (hasGMValues) {
                return {
                    ...defaultConfig,
                    apiEndpoint: storedEndpoint !== undefined ? storedEndpoint : defaultConfig.apiEndpoint,
                    apiKey: storedApiKey !== undefined ? storedApiKey : defaultConfig.apiKey,
                    openUrl: storedOpenUrl !== undefined ? storedOpenUrl : defaultConfig.openUrl
                };
            }

        } catch (e) {
            console.error('读取配置失败:', e);
        }
        return defaultConfig;
    }

    function saveConfig(config) {
        try {
            GM_setValue(CONFIG_KEYS.apiEndpoint, config.apiEndpoint);
            GM_setValue(CONFIG_KEYS.apiKey, config.apiKey);
            GM_setValue(CONFIG_KEYS.openUrl, config.openUrl);
        } catch (e) {
            console.error('保存配置失败:', e);
        }
    }

    // 等待页面加载完成
    function waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    // 查找包含"FREE"文本的元素
    function findFreeElements() {
        const allElements = document.querySelectorAll('*');
        const freeElements = [];
        const seenElements = new Set();

        allElements.forEach(element => {
            const text = element.textContent || '';
            // 查找包含"FREE"文本的元素（精确匹配单词，不区分大小写）
            const freeRegex = /\bFREE\b/i;
            if (freeRegex.test(text) && element.children.length === 0 && !seenElements.has(element)) {
                // 只选择叶子节点，避免重复
                freeElements.push(element);
                seenElements.add(element);
            }
        });

        return freeElements;
    }

    // 从元素中提取torrent id
    function extractTorrentId(element) {
        // 方法1: 查找data属性（当前元素和父元素）
        let current = element;
        for (let i = 0; i < 10; i++) {
            let torrentId = current.getAttribute('data-id') ||
                current.getAttribute('data-torrent-id') ||
                current.getAttribute('data-torrentid') ||
                current.getAttribute('data-tid');

            if (torrentId && /^\d+$/.test(torrentId)) {
                return torrentId;
            }

            if (!current.parentElement) break;
            current = current.parentElement;
        }

        // 方法2: 查找包含数字的id属性
        current = element;
        for (let i = 0; i < 10; i++) {
            const id = current.getAttribute('id');
            if (id) {
                // 查找纯数字id或包含torrent/detail的id
                const match = id.match(/^(\d+)$/) ||
                    id.match(/(?:torrent|detail)[_-]?(\d+)/i) ||
                    id.match(/(\d+)$/);
                if (match && match[1]) {
                    return match[1];
                }
            }
            if (!current.parentElement) break;
            current = current.parentElement;
        }

        // 方法3: 查找附近的链接（向上和向下查找）
        current = element;
        for (let i = 0; i < 10; i++) {
            // 在当前元素及其子元素中查找链接
            const links = current.querySelectorAll('a[href]');
            for (const link of links) {
                const href = link.getAttribute('href') || '';
                // 匹配各种常见的torrent id格式
                const match = href.match(/(?:torrent|detail)[\/=](\d+)/i) ||
                    href.match(/id[=:](\d+)/i) ||
                    href.match(/\/t\/(\d+)/i) ||
                    href.match(/\/details\.php\?id=(\d+)/i) ||
                    href.match(/\/torrents\.php\?id=(\d+)/i) ||
                    href.match(/\/\d+\/(\d+)/) ||
                    href.match(/\/(\d{4,})(?:\/|$|\?|#)/); // 4位以上的数字
                if (match && match[1]) {
                    return match[1];
                }
            }

            // 查找父元素中的链接
            const parentLink = current.closest('a[href]');
            if (parentLink) {
                const href = parentLink.getAttribute('href') || '';
                const match = href.match(/(?:torrent|detail)[\/=](\d+)/i) ||
                    href.match(/id[=:](\d+)/i) ||
                    href.match(/\/t\/(\d+)/i) ||
                    href.match(/\/(\d{4,})(?:\/|$|\?|#)/);
                if (match && match[1]) {
                    return match[1];
                }
            }

            if (!current.parentElement) break;
            current = current.parentElement;
        }

        // 方法4: 查找包含torrent相关class或id的容器
        const container = element.closest('[id*="torrent"], [class*="torrent"], [id*="detail"], [class*="item"], [class*="row"]');
        if (container) {
            // 在容器中查找所有链接
            const containerLinks = container.querySelectorAll('a[href]');
            for (const link of containerLinks) {
                const href = link.getAttribute('href') || '';
                const match = href.match(/\/(\d{4,})(?:\/|$|\?|#)/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        }

        return null;
    }

    // 主函数：获取所有FREE torrent id
    function getAllFreeTorrentIds() {
        const freeElements = findFreeElements();
        const torrentIds = [];
        const seenIds = new Set();
        const seenElements = new Set();

        freeElements.forEach(element => {
            // 避免处理同一个父容器中的多个FREE元素
            const container = element.closest('[class*="item"], [class*="row"], [class*="card"], tr, li');
            if (container && seenElements.has(container)) {
                return; // 跳过已处理的容器
            }
            if (container) {
                seenElements.add(container);
            }

            const torrentId = extractTorrentId(element);
            if (torrentId && !seenIds.has(torrentId)) {
                seenIds.add(torrentId);

                // 获取更多上下文信息
                const containerElement = container || element.parentElement;
                const titleElement = containerElement?.querySelector('a, [class*="title"], [class*="name"]');
                const title = titleElement?.textContent?.trim() || element.textContent.trim().substring(0, 100);

                torrentIds.push({
                    id: torrentId,
                    element: element,
                    container: containerElement,
                    title: title,
                    text: element.textContent.trim().substring(0, 100)
                });
            }
        });

        return torrentIds;
    }

    // 调用API获取下载链接
    async function getDownloadLink(torrentId) {
        const config = getConfig();
        const apiUrl = config.apiEndpoint;
        const apiKey = config.apiKey;

        // 将 id 参数添加到 URL 查询字符串中
        const url = new URL(apiUrl);
        url.searchParams.set('id', torrentId);

        const headers = {};

        if (apiKey) {
            headers['x-api-key'] = apiKey;
        }

        try {
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: headers,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.code === '0' && data.data) {
                return data.data;
            } else {
                throw new Error(data.message || 'API返回错误');
            }
        } catch (error) {
            throw new Error('API请求失败: ' + error.message);
        }
    }

    // 复制到剪贴板
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            } catch (err) {
                document.body.removeChild(textarea);
                return false;
            }
        }
    }

    // 主函数：获取所有FREE torrent的下载链接
    async function main() {
        const button = document.getElementById('mteam-free-btn');
        if (button) {
            button.disabled = true;
            button.textContent = '处理中...';
        }

        try {
            // 等待一小段时间确保动态内容加载完成
            await new Promise(resolve => setTimeout(resolve, 500));

            const freeTorrents = getAllFreeTorrentIds();

            if (freeTorrents.length === 0) {
                if (button) {
                    button.disabled = false;
                    button.textContent = '未找到';
                    setTimeout(() => {
                        if (button) {
                            button.textContent = '获取FREE种子';
                        }
                    }, 2000);
                }
                return;
            }

            console.log('=== FREE Torrent IDs ===');
            console.log(`找到 ${freeTorrents.length} 个FREE标记的torrent`);

            const config = getConfig();
            if (!config.apiEndpoint) {
                if (button) {
                    button.disabled = false;
                    button.textContent = '请配置API';
                    setTimeout(() => {
                        if (button) {
                            button.textContent = '获取FREE种子';
                        }
                    }, 2000);
                }
                showSettingsPanel();
                return;
            }

            // 更新按钮显示开始处理
            if (button) {
                button.textContent = '处理中... 0/' + freeTorrents.length;
            }

            console.log('开始获取下载链接...');

            // 并发处理函数
            const CONCURRENT_LIMIT = 5; // 同时处理的请求数量
            const results = [];
            let completedCount = 0;
            const total = freeTorrents.length;

            // 处理单个种子的函数
            const processTorrent = async (torrent, index) => {
                console.log(`[${index}/${total}] 处理种子 ID: ${torrent.id}...`);

                try {
                    const downloadLink = await getDownloadLink(torrent.id);
                    const result = {
                        id: torrent.id,
                        title: torrent.title,
                        downloadLink: downloadLink
                    };
                    console.log(`  ✓ 下载链接: ${downloadLink}`);
                    return result;
                } catch (error) {
                    console.error(`  ✗ 获取失败: ${error.message}`);
                    return {
                        id: torrent.id,
                        title: torrent.title,
                        downloadLink: null,
                        error: error.message
                    };
                } finally {
                    completedCount++;
                    // 更新按钮显示进度
                    if (button) {
                        button.textContent = `处理中... ${completedCount}/${total}`;
                    }
                }
            };

            // 并发处理所有种子
            const processBatch = async (batch) => {
                return Promise.all(batch.map((item, idx) => processTorrent(item.torrent, item.index)));
            };

            // 将种子分批处理
            for (let i = 0; i < freeTorrents.length; i += CONCURRENT_LIMIT) {
                const batch = freeTorrents.slice(i, i + CONCURRENT_LIMIT).map((torrent, idx) => ({
                    torrent: torrent,
                    index: i + idx + 1
                }));

                const batchResults = await processBatch(batch);
                results.push(...batchResults);

                // 批次之间添加小延迟，避免请求过快
                if (i + CONCURRENT_LIMIT < freeTorrents.length) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            // 生成结果文本
            const successResults = results.filter(r => r.downloadLink);
            const resultText = successResults.map(r => r.downloadLink).join('\n');
            const resultTextWithInfo = results.map(r =>
                r.downloadLink
                    ? `${r.id}: ${r.downloadLink}`
                    : `${r.id}: 获取失败${r.error ? ' - ' + r.error : ''}`
            ).join('\n');

            // 复制到剪贴板
            const copied = await copyToClipboard(resultText);

            console.log('\n=== 下载链接结果 ===');
            console.log(`成功获取 ${successResults.length}/${results.length} 个种子的下载链接`);
            console.log('\n完整结果:');
            console.log(resultTextWithInfo);

            // 复制完成后按需打开指定网址
            if (copied) {
                const openUrl = (config.openUrl || '').trim();
                if (openUrl) {
                    try {
                        window.open(openUrl, '_blank', 'noopener');
                    } catch (e) {
                        console.warn('自动打开网址失败:', e);
                    }
                }
            }

            // 保存到全局变量
            window.freeTorrentIds = freeTorrents.map(t => t.id);
            window.freeTorrents = freeTorrents;
            window.freeTorrentDownloadLinks = results;
            window.freeTorrentDownloadLinksArray = successResults.map(r => r.downloadLink);

            // 在按钮上显示成功信息
            if (button) {
                button.disabled = false;
                button.textContent = `${successResults.length}/${results.length} 成功 已复制到剪贴板`;
                // 3秒后恢复按钮文本
                setTimeout(() => {
                    if (button) {
                        button.textContent = '获取FREE种子';
                    }
                }, 3000);
            }

        } catch (error) {
            console.error('处理失败:', error);
            if (button) {
                button.disabled = false;
                button.textContent = '处理失败';
                // 3秒后恢复按钮文本
                setTimeout(() => {
                    if (button) {
                        button.textContent = '获取FREE种子';
                    }
                }, 3000);
            }
        }
    }

    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'mteam-settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            min-width: 400px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        const config = getConfig();

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #1890ff;">M-Team FREE 种子设置</h3>
                <button id="mteam-settings-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">API Endpoint:</label>
                <input type="text" id="mteam-api-endpoint" value="${config.apiEndpoint}" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                <small style="color: #666;">例如: https://api.m-team.cc/api/torrent/genDlToken</small>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">API Key (x-api-key):</label>
                <input type="text" id="mteam-api-key" value="${config.apiKey}" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
                    placeholder="请输入API Key">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">复制后自动打开网址 (可选):</label>
                <input type="text" id="mteam-open-url" value="${config.openUrl || ''}" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;"
                    placeholder="例如: http://localhost:8080 或 qbittorrent://">
                <small style="color: #666;">留空则不自动打开新标签页</small>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="mteam-settings-cancel" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; background: #f5f5f5;">取消</button>
                <button id="mteam-settings-save" style="padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; background: #1890ff; color: white;">保存</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 关闭按钮
        document.getElementById('mteam-settings-close').onclick = () => panel.remove();
        document.getElementById('mteam-settings-cancel').onclick = () => panel.remove();

        // 保存按钮
        document.getElementById('mteam-settings-save').onclick = () => {
            const apiEndpoint = document.getElementById('mteam-api-endpoint').value.trim();
            const apiKey = document.getElementById('mteam-api-key').value.trim();
            const openUrl = document.getElementById('mteam-open-url').value.trim();

            if (!apiEndpoint) {
                alert('API Endpoint不能为空');
                return;
            }

            saveConfig({ apiEndpoint, apiKey, openUrl });
            alert('设置已保存');
            panel.remove();
        };

        // 点击背景关闭
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                panel.remove();
            }
        });
    }

    // 显示设置面板
    function showSettingsPanel() {
        const existing = document.getElementById('mteam-settings-panel');
        if (existing) {
            existing.remove();
        }
        createSettingsPanel();
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        const wrapper = document.createElement('div');
        wrapper.id = 'mteam-free-btn-wrap';
        wrapper.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: inline-flex;
            align-items: center;
            background: #1890ff;
            border-radius: 25px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
            z-index: 9999;
            transition: transform 0.3s;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        const mainButton = document.createElement('button');
        mainButton.id = 'mteam-free-btn';
        mainButton.textContent = '获取FREE种子';
        mainButton.style.cssText = `
            height: 44px;
            padding: 0 14px 0 20px;
            background: transparent;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            transition: color 0.3s;
        `;

        const divider = document.createElement('span');
        divider.style.cssText = `
            width: 1px;
            background: rgba(255, 255, 255, 0.85);
            border-radius: 1px;
            align-self: stretch;
            margin: 6px 0;
            pointer-events: none;
        `;

        const settingsButton = document.createElement('button');
        settingsButton.id = 'mteam-settings-btn';
        settingsButton.innerHTML = `
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"
                style="width: 22px; height: 22px; display: block; fill: currentColor;">
                <path d="M19.14,12.94c0.04-0.31,0.06-0.63,0.06-0.94s-0.02-0.63-0.06-0.94l2.03-1.58
                    c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.11-0.2-0.35-0.28-0.57-0.22l-2.39,0.96
                    c-0.5-0.38-1.04-0.7-1.64-0.94L14.5,2.5c-0.02-0.22-0.2-0.39-0.42-0.39h-3.84
                    c-0.22,0-0.4,0.17-0.42,0.39L9.44,5.35C8.84,5.59,8.3,5.91,7.8,6.29L5.41,5.33
                    c-0.21-0.08-0.46,0.02-0.57,0.22L2.92,8.87C2.81,9.07,2.86,9.34,3.04,9.48l2.03,1.58
                    C5.03,11.37,5.01,11.69,5.01,12s0.02,0.63,0.06,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61
                    l1.92,3.32c0.11,0.2,0.35,0.28,0.57,0.22l2.39-0.96c0.5,0.38,1.04,0.7,1.64,0.94
                    l0.38,2.85c0.02,0.22,0.2,0.39,0.42,0.39h3.84c0.22,0,0.4-0.17,0.42-0.39l0.38-2.85
                    c0.6-0.24,1.14-0.56,1.64-0.94l2.39,0.96c0.21,0.08,0.46-0.02,0.57-0.22l1.92-3.32
                    c0.11-0.2,0.06-0.46-0.12-0.61L19.14,12.94z M12,15.6c-1.99,0-3.6-1.61-3.6-3.6
                    s1.61-3.6,3.6-3.6s3.6,1.61,3.6,3.6S13.99,15.6,12,15.6z"/>
            </svg>
        `;
        settingsButton.title = '打开设置';
        settingsButton.setAttribute('aria-label', '设置');
        settingsButton.style.cssText = `
            height: 44px;
            padding: 0 10px;
            min-width: 40px;
            background: transparent;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 22px;
            font-weight: bold;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: color 0.3s;
        `;

        wrapper.onmouseenter = () => {
            wrapper.style.background = '#40a9ff';
            wrapper.style.transform = 'scale(1.05)';
        };
        wrapper.onmouseleave = () => {
            wrapper.style.background = '#1890ff';
            wrapper.style.transform = 'scale(1)';
        };

        mainButton.onclick = () => {
            main();
        };

        settingsButton.onclick = () => {
            showSettingsPanel();
        };

        wrapper.appendChild(mainButton);
        wrapper.appendChild(divider);
        wrapper.appendChild(settingsButton);
        document.body.appendChild(wrapper);
    }

    // 初始化
    async function init() {
        await waitForPageLoad();
        createFloatingButton();
    }

    // 运行初始化
    init();

    // 导出函数供控制台使用
    window.getAllFreeTorrentIds = getAllFreeTorrentIds;
    window.getMTeamConfig = getConfig;
    window.setMTeamConfig = saveConfig;
    window.showMTeamSettings = showSettingsPanel;
})();
