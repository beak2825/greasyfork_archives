// ==UserScript==
// @name         Linux.do Notion 同步（单贴）
// @namespace    https://linux.do/
// @version      0.3.1
// @description  将 Linux.do 单个帖子同步到 Notion 数据库（Tampermonkey/Greasy Fork）
// @license      MIT
// @match        https://linux.do/t/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.notion.com
// @downloadURL https://update.greasyfork.org/scripts/561359/Linuxdo%20Notion%20%E5%90%8C%E6%AD%A5%EF%BC%88%E5%8D%95%E8%B4%B4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561359/Linuxdo%20Notion%20%E5%90%8C%E6%AD%A5%EF%BC%88%E5%8D%95%E8%B4%B4%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const NOTION_API_BASE = 'https://api.notion.com/v1';
    const NOTION_VERSION = '2022-06-28';
    const SETTINGS_BUTTON_ID = 'linuxdo-notion-settings-btn';
    const SETTINGS_BUTTON_CLASS = 'linuxdo-notion-settings-btn';
    const PANEL_ID = 'linuxdo-notion-settings-panel';
    const SETTINGS_BUTTON_TITLE = '单击配置，双击同步';

    let panelElements = null;

    const STORAGE_KEYS = {
        notionToken: 'linuxdo_notion_token',
        databaseId: 'linuxdo_notion_database_id',
        parentPageId: 'linuxdo_notion_parent_page_id',
        syncContent: 'linuxdo_sync_content',
        settingsPosX: 'linuxdo_settings_pos_x',
        settingsPosY: 'linuxdo_settings_pos_y'
    };

    const DEFAULT_CONFIG = {
        notionToken: '',
        databaseId: '',
        parentPageId: '',
        syncContent: true
    };

    function getConfig() {
        return {
            notionToken: GM_getValue(STORAGE_KEYS.notionToken, DEFAULT_CONFIG.notionToken),
            databaseId: GM_getValue(STORAGE_KEYS.databaseId, DEFAULT_CONFIG.databaseId),
            parentPageId: GM_getValue(STORAGE_KEYS.parentPageId, DEFAULT_CONFIG.parentPageId),
            syncContent: GM_getValue(STORAGE_KEYS.syncContent, DEFAULT_CONFIG.syncContent)
        };
    }

    function saveConfig(partial) {
        const current = getConfig();
        const next = { ...current, ...partial };
        GM_setValue(STORAGE_KEYS.notionToken, next.notionToken || '');
        GM_setValue(STORAGE_KEYS.databaseId, next.databaseId || '');
        GM_setValue(STORAGE_KEYS.parentPageId, next.parentPageId || '');
        GM_setValue(STORAGE_KEYS.syncContent, !!next.syncContent);
    }

    function getSettingsButtonPosition() {
        const x = GM_getValue(STORAGE_KEYS.settingsPosX, null);
        const y = GM_getValue(STORAGE_KEYS.settingsPosY, null);

        if (typeof x === 'number' && typeof y === 'number') {
            return { x, y };
        }
        if (typeof x === 'string' && typeof y === 'string') {
            const parsedX = Number(x);
            const parsedY = Number(y);
            if (Number.isFinite(parsedX) && Number.isFinite(parsedY)) {
                return { x: parsedX, y: parsedY };
            }
        }
        return null;
    }

    function saveSettingsButtonPosition(x, y) {
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            return;
        }
        GM_setValue(STORAGE_KEYS.settingsPosX, Math.round(x));
        GM_setValue(STORAGE_KEYS.settingsPosY, Math.round(y));
    }

    function formatNotionId(input) {
        if (!input) return '';
        const clean = input.replace(/-/g, '').trim();
        if (!/^[a-f0-9]{32}$/i.test(clean)) {
            return input.trim();
        }
        return [
            clean.slice(0, 8),
            clean.slice(8, 12),
            clean.slice(12, 16),
            clean.slice(16, 20),
            clean.slice(20)
        ].join('-');
    }

    function extractPageId(input) {
        if (!input) return '';
        const cleanId = input.replace(/-/g, '');
        if (/^[a-f0-9]{32}$/i.test(cleanId)) {
            return cleanId;
        }

        const match = input.match(/([a-f0-9]{32})(?:\?|$)/i) ||
            input.match(/[/-]([a-f0-9]{32})$/i);

        if (match) {
            return match[1];
        }

        const urlMatch = input.match(/([a-f0-9-]{36})(?:\?|$)/i);
        if (urlMatch) {
            return urlMatch[1].replace(/-/g, '');
        }

        return input.trim();
    }

    function notify(message, type = 'info') {
        if (document.body) {
            showToast(message, type);
        } else {
            alert(message);
        }
    }

    function getSettingsPanelElements() {
        if (panelElements) {
            return panelElements;
        }

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.className = 'linuxdo-notion-panel';
        panel.innerHTML = `
            <div class="linuxdo-notion-panel-header">
                <span class="linuxdo-notion-panel-title">Notion 配置</span>
                <button type="button" class="linuxdo-notion-panel-close">×</button>
            </div>
            <div class="linuxdo-notion-panel-body">
                <label class="linuxdo-notion-label">Notion Token</label>
                <div class="linuxdo-notion-input-row">
                    <input type="password" class="linuxdo-notion-input" id="linuxdo-notion-token-input" placeholder="secret_xxx / ntn_xxx" />
                    <button type="button" class="linuxdo-notion-inline-btn" id="linuxdo-notion-toggle-token">显示</button>
                </div>
                <div class="linuxdo-notion-actions">
                    <button type="button" class="linuxdo-notion-btn" id="linuxdo-notion-validate">验证 Token</button>
                </div>

                <label class="linuxdo-notion-label">父页面链接/ID（用于自动建库）</label>
                <input type="text" class="linuxdo-notion-input" id="linuxdo-notion-parent-input" placeholder="粘贴 Notion 页面链接或 ID" />

                <label class="linuxdo-notion-label">数据库链接/ID（已有库）</label>
                <input type="text" class="linuxdo-notion-input" id="linuxdo-notion-db-input" placeholder="粘贴数据库链接或 ID" />

                <label class="linuxdo-notion-checkbox">
                    <input type="checkbox" id="linuxdo-notion-sync-content" />
                    <span>同步正文内容</span>
                </label>

                <div class="linuxdo-notion-actions">
                    <button type="button" class="linuxdo-notion-btn primary" id="linuxdo-notion-save">保存配置</button>
                    <button type="button" class="linuxdo-notion-btn" id="linuxdo-notion-create-db">创建数据库</button>
                    <button type="button" class="linuxdo-notion-btn danger" id="linuxdo-notion-clear">清空</button>
                </div>
                <div class="linuxdo-notion-hint">提示：支持直接粘贴链接，脚本会自动提取 ID。</div>
            </div>
        `;

        document.body.appendChild(panel);

        const tokenInput = panel.querySelector('#linuxdo-notion-token-input');
        const parentInput = panel.querySelector('#linuxdo-notion-parent-input');
        const dbInput = panel.querySelector('#linuxdo-notion-db-input');
        const syncContentInput = panel.querySelector('#linuxdo-notion-sync-content');
        const toggleTokenBtn = panel.querySelector('#linuxdo-notion-toggle-token');
        const validateBtn = panel.querySelector('#linuxdo-notion-validate');
        const saveBtn = panel.querySelector('#linuxdo-notion-save');
        const createDbBtn = panel.querySelector('#linuxdo-notion-create-db');
        const clearBtn = panel.querySelector('#linuxdo-notion-clear');
        const closeBtn = panel.querySelector('.linuxdo-notion-panel-close');

        const setButtonState = (button, text, disabled) => {
            button.textContent = text;
            button.disabled = !!disabled;
        };

        const loadPanelValues = () => {
            const config = getConfig();
            tokenInput.value = config.notionToken || '';
            parentInput.value = config.parentPageId || '';
            dbInput.value = config.databaseId || '';
            syncContentInput.checked = !!config.syncContent;
            toggleTokenBtn.textContent = tokenInput.type === 'password' ? '显示' : '隐藏';
        };

        toggleTokenBtn.addEventListener('click', () => {
            tokenInput.type = tokenInput.type === 'password' ? 'text' : 'password';
            toggleTokenBtn.textContent = tokenInput.type === 'password' ? '显示' : '隐藏';
        });

        validateBtn.addEventListener('click', async () => {
            const token = tokenInput.value.trim();
            if (!token) {
                notify('请先填写 Notion Token', 'error');
                return;
            }

            setButtonState(validateBtn, '验证中...', true);
            try {
                const ok = await validateToken(token);
                notify(ok ? 'Token 验证成功' : 'Token 无效，请检查', ok ? 'success' : 'error');
            } catch (error) {
                notify(`验证失败: ${error.message}`, 'error');
            } finally {
                setButtonState(validateBtn, '验证 Token', false);
            }
        });

        saveBtn.addEventListener('click', () => {
            const notionToken = tokenInput.value.trim();
            const parentPageId = extractPageId(parentInput.value.trim());
            const databaseId = extractPageId(dbInput.value.trim());
            const syncContent = !!syncContentInput.checked;

            saveConfig({
                notionToken,
                parentPageId,
                databaseId,
                syncContent
            });

            parentInput.value = parentPageId;
            dbInput.value = databaseId;
            notify('配置已保存', 'success');
        });

        createDbBtn.addEventListener('click', async () => {
            const token = tokenInput.value.trim();
            const parentPageId = extractPageId(parentInput.value.trim());

            if (!token) {
                notify('请先填写 Notion Token', 'error');
                return;
            }
            if (!parentPageId) {
                notify('请先填写父页面链接/ID', 'error');
                return;
            }

            setButtonState(createDbBtn, '创建中...', true);
            try {
                const databaseId = await createDatabase(token, parentPageId);
                saveConfig({ notionToken: token, parentPageId, databaseId });
                dbInput.value = databaseId;
                notify('数据库已创建并保存', 'success');
            } catch (error) {
                notify(`创建失败: ${error.message}`, 'error');
            } finally {
                setButtonState(createDbBtn, '创建数据库', false);
            }
        });

        clearBtn.addEventListener('click', () => {
            if (!confirm('确定清空所有配置？')) return;
            saveConfig({ notionToken: '', databaseId: '', parentPageId: '', syncContent: true });
            loadPanelValues();
            notify('配置已清空', 'info');
        });

        closeBtn.addEventListener('click', () => {
            setPanelVisible(false);
        });

        panelElements = {
            panel,
            tokenInput,
            parentInput,
            dbInput,
            syncContentInput,
            loadPanelValues
        };

        loadPanelValues();
        return panelElements;
    }

    function setPanelVisible(visible) {
        const { panel, loadPanelValues } = getSettingsPanelElements();
        if (visible) {
            loadPanelValues();
        }
        panel.classList.toggle('is-open', visible);

        const settingsButton = document.getElementById(SETTINGS_BUTTON_ID);
        if (settingsButton) {
            settingsButton.classList.toggle('active', visible);
        }

        if (visible) {
            requestAnimationFrame(positionPanelNearButton);
        }
    }

    function positionPanelNearButton() {
        const panel = panelElements?.panel;
        if (!panel || !panel.classList.contains('is-open')) {
            return;
        }

        const settingsButton = document.getElementById(SETTINGS_BUTTON_ID);
        if (!settingsButton) {
            return;
        }

        const buttonRect = settingsButton.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const padding = 8;

        let left = buttonRect.left;
        let top = buttonRect.top - panelRect.height - 8;

        if (top < padding) {
            top = buttonRect.bottom + 8;
        }

        if (left + panelRect.width > window.innerWidth - padding) {
            left = window.innerWidth - panelRect.width - padding;
        }
        if (left < padding) {
            left = padding;
        }

        if (top + panelRect.height > window.innerHeight - padding) {
            top = window.innerHeight - panelRect.height - padding;
        }
        if (top < padding) {
            top = padding;
        }

        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
    }

    function gmRequest({ method, url, headers, data }) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers,
                data,
                anonymous: true,
                onload: (response) => resolve(response),
                onerror: () => reject(new Error('网络请求失败'))
            });
        });
    }

    async function notionRequest(endpoint, token, options = {}) {
        const method = options.method || 'GET';
        const body = options.body || null;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Notion-Version': NOTION_VERSION,
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const response = await gmRequest({
            method,
            url: `${NOTION_API_BASE}${endpoint}`,
            headers,
            data: body ? JSON.stringify(body) : undefined
        });

        const statusOk = response.status >= 200 && response.status < 300;
        let payload = null;

        if (response.responseText) {
            try {
                payload = JSON.parse(response.responseText);
            } catch (error) {
                payload = null;
            }
        }

        if (!statusOk) {
            const errorMessage = payload?.message || response.statusText || 'Notion API 请求失败';
            throw new Error(`Notion API 错误: ${errorMessage}`);
        }

        return payload || {};
    }

    async function validateToken(token) {
        try {
            await notionRequest('/users/me', token);
            return true;
        } catch (error) {
            return false;
        }
    }

    async function createDatabase(token, parentPageId) {
        const result = await notionRequest('/databases', token, {
            method: 'POST',
            body: {
                parent: { type: 'page_id', page_id: formatNotionId(parentPageId) },
                title: [
                    { type: 'text', text: { content: 'Linux.do 收藏' } }
                ],
                properties: {
                    '标题': { title: {} },
                    '摘要': { rich_text: {} },
                    '链接': { url: {} },
                    '分类': { rich_text: {} },
                    '作者': { rich_text: {} },
                    '收藏时间': { date: {} },
                    '同步时间': { date: {} },
                    '帖子ID': { rich_text: {} }
                }
            }
        });

        return result.id;
    }

    async function queryPostExists(token, databaseId, postId) {
        const result = await notionRequest(`/databases/${formatNotionId(databaseId)}/query`, token, {
            method: 'POST',
            body: {
                filter: {
                    property: '帖子ID',
                    rich_text: { equals: String(postId) }
                },
                page_size: 1
            }
        });

        return Array.isArray(result?.results) && result.results.length > 0;
    }

    function formatDateForNotion(dateValue) {
        if (!dateValue) return null;

        try {
            let date;

            if (typeof dateValue === 'number') {
                date = new Date(dateValue);
            } else if (typeof dateValue === 'string') {
                if (/^\d+$/.test(dateValue)) {
                    date = new Date(parseInt(dateValue, 10));
                } else {
                    date = new Date(dateValue);
                }
            } else if (dateValue instanceof Date) {
                date = dateValue;
            } else {
                return null;
            }

            if (isNaN(date.getTime())) {
                return null;
            }

            return date.toISOString();
        } catch (error) {
            return null;
        }
    }

    async function createPage(token, databaseId, item) {
        const bookmarkTimeISO = formatDateForNotion(item.bookmarkTime);
        const properties = {
            '标题': { title: [{ text: { content: item.title || '无标题' } }] },
            '链接': { url: item.url || null },
            '分类': { rich_text: [{ text: { content: item.category || '' } }] },
            '作者': { rich_text: [{ text: { content: item.author || '' } }] },
            '摘要': { rich_text: [{ text: { content: (item.excerpt || '').substring(0, 2000) } }] },
            '同步时间': { date: { start: new Date().toISOString() } },
            '帖子ID': { rich_text: [{ text: { content: String(item.postId || '') } }] }
        };

        if (bookmarkTimeISO) {
            properties['收藏时间'] = { date: { start: bookmarkTimeISO } };
        }

        return notionRequest('/pages', token, {
            method: 'POST',
            body: {
                parent: { database_id: formatNotionId(databaseId) },
                properties
            }
        });
    }

    async function appendBlockChildren(token, pageId, blocks) {
        const batchSize = 100;
        for (let i = 0; i < blocks.length; i += batchSize) {
            const batch = blocks.slice(i, i + batchSize);
            await notionRequest(`/blocks/${formatNotionId(pageId)}/children`, token, {
                method: 'PATCH',
                body: { children: batch }
            });
            if (i + batchSize < blocks.length) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
    }

    async function syncCurrentPost() {
        const config = getConfig();

        if (!config.notionToken) {
            throw new Error('请先点击“设置”按钮配置 Notion Token');
        }

        const tokenValid = await validateToken(config.notionToken);
        if (!tokenValid) {
            throw new Error('Notion Token 无效，请重新配置');
        }

        let databaseId = config.databaseId;
        if (!databaseId) {
            if (!config.parentPageId) {
                throw new Error('请先在设置面板填写数据库或父页面链接/ID');
            }
            databaseId = await createDatabase(config.notionToken, config.parentPageId);
            saveConfig({ databaseId });
            notify('Notion 数据库已自动创建', 'success');
        }

        const postData = extractPostData();
        if (!postData.postId) {
            throw new Error('无法获取帖子 ID');
        }

        const exists = await queryPostExists(config.notionToken, databaseId, postData.postId);
        if (exists) {
            return { skipped: true };
        }

        const page = await createPage(config.notionToken, databaseId, postData);

        if (config.syncContent && postData.markdown) {
            const blocks = markdownToNotionBlocks(postData.markdown, {});
            if (blocks.length > 0) {
                try {
                    await appendBlockChildren(config.notionToken, page.id, blocks);
                } catch (error) {
                    console.warn('正文同步失败:', error);
                }
            }
        }

        return { skipped: false };
    }

    function showToast(message, type = 'info') {
        const existingToast = document.querySelector('.linuxdo-notion-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `linuxdo-notion-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    function extractPostData() {
        const titleEl = document.querySelector('.fancy-title') ||
            document.querySelector('.topic-title') ||
            document.querySelector('h1 a');
        const title = titleEl?.textContent?.trim() || document.title.replace(' - LINUX DO', '').trim();

        const url = window.location.href.split('?')[0].split('#')[0];
        const postIdMatch = url.match(/\/t\/[^\/]+\/(\d+)/);
        const postId = postIdMatch ? postIdMatch[1] : '';

        const categoryEl = document.querySelector('.badge-category span') ||
            document.querySelector('.category-name') ||
            document.querySelector('.badge-category');
        const category = categoryEl?.textContent?.trim() || '';

        let author = '';
        const firstPost = document.querySelector('.topic-post, #post_1, article[data-post-number="1"]');
        if (firstPost) {
            const namesContainer = firstPost.querySelector('.names');
            if (namesContainer) {
                const userCardEl = namesContainer.querySelector('[data-user-card]');
                if (userCardEl) {
                    author = userCardEl.getAttribute('data-user-card') || userCardEl.textContent?.trim() || '';
                }
            }
            if (!author) {
                const authorEl = firstPost.querySelector('.username a, .names .username a, a[href^="/u/"]');
                author = authorEl?.textContent?.trim() || '';
            }
        }
        if (!author) {
            const authorEl = document.querySelector('.topic-meta-data .username') ||
                document.querySelector('.names .username a') ||
                document.querySelector('.names [data-user-card]') ||
                document.querySelector('[data-user-card]');
            author = authorEl?.getAttribute?.('data-user-card') || authorEl?.textContent?.trim() || '';
        }

        const contentEl = document.querySelector('.post[data-post-number="1"] .cooked') || document.querySelector('.cooked');
        const excerpt = contentEl?.textContent?.trim().substring(0, 500) || '';

        let markdown = '';
        let imageUrls = [];
        if (contentEl) {
            const result = convertHtmlToMarkdown(contentEl);
            markdown = result.markdown;
            imageUrls = result.imageUrls;
        }

        return {
            title,
            url,
            postId,
            category,
            author,
            excerpt,
            markdown,
            imageUrls,
            bookmarkTime: new Date().toISOString()
        };
    }

    function convertHtmlToMarkdown(element) {
        const imageUrls = [];

        element.querySelectorAll('img').forEach(img => {
            let src = img.getAttribute('src');
            if (src && !src.startsWith('data:')) {
                if (!src.startsWith('http')) {
                    src = new URL(src, 'https://linux.do').href;
                }
                imageUrls.push(src);
            }
        });

        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent || '';
            }
            if (node.nodeType !== Node.ELEMENT_NODE) {
                return '';
            }

            const tag = node.tagName.toLowerCase();
            if (['script', 'style', 'noscript', 'iframe'].includes(tag)) {
                return '';
            }

            const children = Array.from(node.childNodes);
            const childContent = () => children.map(c => processNode(c)).join('');

            switch (tag) {
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6': {
                    const level = parseInt(tag[1]);
                    const prefix = '#'.repeat(Math.min(level, 3)) + ' ';
                    let text = '';
                    node.childNodes.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE) {
                            text += child.textContent;
                        } else if (child.nodeType === Node.ELEMENT_NODE) {
                            const childTag = child.tagName.toLowerCase();
                            if (childTag === 'a' && child.getAttribute('href')?.startsWith('#')) {
                                return;
                            }
                            text += processNode(child);
                        }
                    });
                    return '\n' + prefix + text.trim() + '\n\n';
                }
                case 'p':
                    return '\n' + childContent().trim() + '\n\n';
                case 'br':
                    return '\n';
                case 'hr':
                    return '\n---\n\n';
                case 'pre': {
                    const codeEl = node.querySelector('code');
                    let code = '';
                    let lang = '';
                    if (codeEl) {
                        code = codeEl.textContent || '';
                        const cls = codeEl.className || '';
                        const langMatch = cls.match(/(?:language-|lang-)(\w+)/);
                        if (langMatch) lang = langMatch[1];
                    } else {
                        code = node.textContent || '';
                    }
                    return '\n```' + lang + '\n' + code.trim() + '\n```\n\n';
                }
                case 'code':
                    if (node.parentElement?.tagName.toLowerCase() !== 'pre') {
                        return '`' + (node.textContent || '') + '`';
                    }
                    return node.textContent || '';
                case 'blockquote': {
                    const lines = childContent().trim().split('\n');
                    return '\n' + lines.map(l => '> ' + l).join('\n') + '\n\n';
                }
                case 'ul': {
                    const items = Array.from(node.querySelectorAll(':scope > li'));
                    return '\n' + items.map(li => '- ' + processNode(li).trim()).join('\n') + '\n\n';
                }
                case 'ol': {
                    const items = Array.from(node.querySelectorAll(':scope > li'));
                    return '\n' + items.map((li, i) => (i + 1) + '. ' + processNode(li).trim()).join('\n') + '\n\n';
                }
                case 'li':
                    return childContent();
                case 'img': {
                    let src = node.getAttribute('src') || '';
                    const alt = node.getAttribute('alt') || '';
                    if (!src || src.startsWith('data:')) return '';
                    if (!src.startsWith('http')) {
                        src = new URL(src, 'https://linux.do').href;
                    }
                    return '\n![' + alt + '](' + src + ')\n';
                }
                case 'a': {
                    let href = node.getAttribute('href') || '';
                    const innerImg = node.querySelector('img');
                    if (innerImg) {
                        return processNode(innerImg);
                    }
                    const text = childContent().trim() || href;
                    if (!href || href.startsWith('#')) return text;
                    if (!href.startsWith('http')) {
                        href = new URL(href, 'https://linux.do').href;
                    }
                    return '[' + text + '](' + href + ')';
                }
                case 'strong':
                case 'b':
                    return '**' + childContent() + '**';
                case 'em':
                case 'i':
                    return '*' + childContent() + '*';
                case 'del':
                case 's':
                case 'strike':
                    return '~~' + childContent() + '~~';
                case 'table': {
                    const rows = Array.from(node.querySelectorAll('tr'));
                    if (rows.length === 0) return '';
                    const result = [];
                    rows.forEach((row, i) => {
                        const cells = Array.from(row.querySelectorAll('th, td'));
                        const rowText = '| ' + cells.map(c => processNode(c).trim().replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ') + ' |';
                        result.push(rowText);
                        if (i === 0) result.push('| ' + cells.map(() => '---').join(' | ') + ' |');
                    });
                    return '\n' + result.join('\n') + '\n\n';
                }
                default:
                    return childContent();
            }
        }

        const markdown = processNode(element).trim();
        return { markdown, imageUrls: [...new Set(imageUrls)] };
    }

    function markdownToNotionBlocks(markdown, imageMap = {}) {
        if (!markdown || typeof markdown !== 'string') {
            return [];
        }

        const lines = markdown.split('\n');
        const blocks = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            if (line.trim() === '') {
                i++;
                continue;
            }

            if (line.startsWith('```')) {
                const { block, endIndex } = parseCodeBlock(lines, i);
                if (block) {
                    blocks.push(block);
                }
                i = endIndex + 1;
                continue;
            }

            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                const level = Math.min(headingMatch[1].length, 3);
                blocks.push(createHeadingBlock(level, headingMatch[2], imageMap));
                i++;
                continue;
            }

            if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
                blocks.push({ type: 'divider', divider: {} });
                i++;
                continue;
            }

            if (line.startsWith('>')) {
                const { block, endIndex } = parseQuoteBlock(lines, i, imageMap);
                blocks.push(block);
                i = endIndex + 1;
                continue;
            }

            if (/^(\s*)[-*+]\s+/.test(line)) {
                const { blockList, endIndex } = parseListBlock(lines, i, false, imageMap);
                blocks.push(...blockList);
                i = endIndex + 1;
                continue;
            }

            if (/^(\s*)\d+\.\s+/.test(line)) {
                const { blockList, endIndex } = parseListBlock(lines, i, true, imageMap);
                blocks.push(...blockList);
                i = endIndex + 1;
                continue;
            }

            const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
            if (imageMatch) {
                blocks.push(createImageBlock(imageMatch[2], imageMatch[1], imageMap));
                i++;
                continue;
            }

            if (line.includes('|')) {
                const { block, endIndex } = parseTableBlock(lines, i, imageMap);
                if (block) {
                    blocks.push(block);
                }
                i = endIndex + 1;
                continue;
            }

            blocks.push(createParagraphBlock(line, imageMap));
            i++;
        }

        return blocks;
    }

    function createHeadingBlock(level, text, imageMap) {
        const typeMap = {
            1: 'heading_1',
            2: 'heading_2',
            3: 'heading_3'
        };
        const type = typeMap[level] || 'heading_3';

        return {
            type: type,
            [type]: {
                rich_text: parseInlineToRichText(text, imageMap)
            }
        };
    }

    function createParagraphBlock(text, imageMap) {
        return {
            type: 'paragraph',
            paragraph: {
                rich_text: parseInlineToRichText(text, imageMap)
            }
        };
    }

    function createImageBlock(url, caption, imageMap) {
        const fileUploadId = imageMap[url];

        if (fileUploadId) {
            return {
                type: 'image',
                image: {
                    type: 'file_upload',
                    file_upload: { id: fileUploadId },
                    caption: caption ? [{ type: 'text', text: { content: caption } }] : []
                }
            };
        }

        return {
            type: 'image',
            image: {
                type: 'external',
                external: { url },
                caption: caption ? [{ type: 'text', text: { content: caption } }] : []
            }
        };
    }

    function parseCodeBlock(lines, startIndex) {
        const firstLine = lines[startIndex];
        const langMatch = firstLine.match(/^```(\w*)$/);
        const language = langMatch ? mapLanguage(langMatch[1]) : 'plain text';

        let endIndex = startIndex + 1;
        const codeLines = [];

        while (endIndex < lines.length) {
            if (lines[endIndex].startsWith('```')) {
                break;
            }
            codeLines.push(lines[endIndex]);
            endIndex++;
        }

        const code = codeLines.join('\n');

        return {
            block: {
                type: 'code',
                code: {
                    rich_text: [{ type: 'text', text: { content: code } }],
                    language
                }
            },
            endIndex
        };
    }

    const NOTION_LANGUAGE_MAP = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'rb': 'ruby',
        'sh': 'shell',
        'bash': 'shell',
        'zsh': 'shell',
        'yml': 'yaml',
        'md': 'markdown',
        'json': 'json',
        'html': 'html',
        'css': 'css',
        'sql': 'sql',
        'java': 'java',
        'c': 'c',
        'cpp': 'c++',
        'cs': 'c#',
        'go': 'go',
        'rust': 'rust',
        'swift': 'swift',
        'kotlin': 'kotlin',
        'php': 'php',
        'r': 'r',
        'scala': 'scala',
        'lua': 'lua',
        'perl': 'perl',
        'haskell': 'haskell',
        'clojure': 'clojure',
        'elixir': 'elixir',
        'erlang': 'erlang',
        'dockerfile': 'docker',
        'makefile': 'makefile',
        'graphql': 'graphql',
        'protobuf': 'protobuf',
        'toml': 'toml',
        'ini': 'plain text',
        'conf': 'plain text',
        'nginx': 'plain text',
        '': 'plain text'
    };

    const NOTION_SUPPORTED_LANGUAGES = new Set([
        'abap', 'abc', 'agda', 'arduino', 'ascii art', 'assembly', 'bash', 'basic',
        'bnf', 'c', 'c#', 'c++', 'clojure', 'coffeescript', 'coq', 'css', 'dart',
        'dhall', 'diff', 'docker', 'ebnf', 'elixir', 'elm', 'erlang', 'f#', 'flow',
        'fortran', 'gherkin', 'glsl', 'go', 'graphql', 'groovy', 'haskell', 'hcl',
        'html', 'idris', 'java', 'javascript', 'json', 'julia', 'kotlin', 'latex',
        'less', 'lisp', 'livescript', 'llvm ir', 'lua', 'makefile', 'markdown',
        'markup', 'matlab', 'mathematica', 'mermaid', 'nix', 'notion formula',
        'objective-c', 'ocaml', 'pascal', 'perl', 'php', 'plain text',
        'powershell', 'prolog', 'protobuf', 'purescript', 'python', 'r', 'racket',
        'reason', 'ruby', 'rust', 'sass', 'scala', 'scheme', 'scss', 'shell',
        'smalltalk', 'solidity', 'sql', 'swift', 'toml', 'typescript', 'vb.net',
        'verilog', 'vhdl', 'visual basic', 'webassembly', 'xml', 'yaml',
        'java/c/c++/c#'
    ]);

    function mapLanguage(lang) {
        const normalized = (lang || '').trim().toLowerCase();
        const mapped = NOTION_LANGUAGE_MAP[normalized] || normalized;
        return NOTION_SUPPORTED_LANGUAGES.has(mapped) ? mapped : 'plain text';
    }

    function parseQuoteBlock(lines, startIndex, imageMap) {
        const quoteLines = [];
        let endIndex = startIndex;

        while (endIndex < lines.length && lines[endIndex].startsWith('>')) {
            quoteLines.push(lines[endIndex].replace(/^>\s?/, ''));
            endIndex++;
        }

        const quoteText = quoteLines.join('\n');

        return {
            block: {
                type: 'quote',
                quote: {
                    rich_text: parseInlineToRichText(quoteText, imageMap)
                }
            },
            endIndex: endIndex - 1
        };
    }

    function parseListBlock(lines, startIndex, isOrdered, imageMap) {
        const blockList = [];
        let endIndex = startIndex;
        const pattern = isOrdered ? /^(\s*)\d+\.\s+(.+)$/ : /^(\s*)[-*+]\s+(.+)$/;

        while (endIndex < lines.length) {
            const line = lines[endIndex];
            const match = line.match(pattern);

            if (!match) {
                break;
            }

            const content = match[2];
            const blockType = isOrdered ? 'numbered_list_item' : 'bulleted_list_item';

            blockList.push({
                type: blockType,
                [blockType]: {
                    rich_text: parseInlineToRichText(content, imageMap)
                }
            });

            endIndex++;
        }

        return {
            blockList,
            endIndex: endIndex - 1
        };
    }

    function parseTableBlock(lines, startIndex, imageMap) {
        const tableLines = [];
        let endIndex = startIndex;

        while (endIndex < lines.length && lines[endIndex].includes('|')) {
            const line = lines[endIndex].trim();
            if (!/^\|[\s\-:|]+\|$/.test(line)) {
                tableLines.push(line);
            }
            endIndex++;
        }

        if (tableLines.length === 0) {
            return { block: null, endIndex: endIndex - 1 };
        }

        const rows = tableLines.map(line => {
            const cells = line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
            return cells;
        });

        const columnCount = Math.max(...rows.map(r => r.length));

        const tableBlock = {
            type: 'table',
            table: {
                table_width: columnCount,
                has_column_header: true,
                has_row_header: false,
                children: rows.map(row => {
                    while (row.length < columnCount) {
                        row.push('');
                    }
                    return {
                        type: 'table_row',
                        table_row: {
                            cells: row.map(cell => parseInlineToRichText(cell, imageMap))
                        }
                    };
                })
            }
        };

        return {
            block: tableBlock,
            endIndex: endIndex - 1
        };
    }

    function parseInlineToRichText(text, imageMap = {}) {
        if (!text || typeof text !== 'string') {
            return [];
        }

        const richText = [];
        const patterns = [
            { regex: /!\[([^\]]*)\]\(([^)]+)\)/g, type: 'image' },
            { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' },
            { regex: /\*\*\*(.+?)\*\*\*/g, type: 'bold_italic' },
            { regex: /\*\*(.+?)\*\*/g, type: 'bold' },
            { regex: /(?:^|[^*])\*([^*]+)\*(?:[^*]|$)/g, type: 'italic' },
            { regex: /~~(.+?)~~/g, type: 'strikethrough' },
            { regex: /`([^`]+)`/g, type: 'code' }
        ];

        const allMatches = [];
        for (const pattern of patterns) {
            pattern.regex.lastIndex = 0;
            let match;
            while ((match = pattern.regex.exec(text)) !== null) {
                allMatches.push({
                    type: pattern.type,
                    match,
                    start: match.index,
                    end: match.index + match[0].length
                });
            }
        }

        allMatches.sort((a, b) => a.start - b.start);

        const filteredMatches = [];
        let lastEnd = 0;
        for (const m of allMatches) {
            if (m.start >= lastEnd) {
                filteredMatches.push(m);
                lastEnd = m.end;
            }
        }

        let currentIndex = 0;
        for (const m of filteredMatches) {
            if (m.start > currentIndex) {
                const plainText = text.substring(currentIndex, m.start);
                if (plainText) {
                    richText.push(createTextObject(plainText));
                }
            }

            switch (m.type) {
                case 'link':
                    richText.push(createTextObject(m.match[1], { link: m.match[2] }));
                    break;
                case 'image':
                    richText.push(createTextObject(`[图片: ${m.match[1] || '图片'}]`, { link: m.match[2] }));
                    break;
                case 'bold': {
                    const boldContent = m.match[1];
                    const linkMatch = boldContent.match(/^\[([^\]]+)\]\(([^)]+)\)(.*)$/);
                    if (linkMatch) {
                        richText.push(createTextObject(linkMatch[1], { bold: true, link: linkMatch[2] }));
                        if (linkMatch[3]) {
                            richText.push(createTextObject(linkMatch[3], { bold: true }));
                        }
                    } else {
                        richText.push(createTextObject(boldContent, { bold: true }));
                    }
                    break;
                }
                case 'italic':
                    richText.push(createTextObject(m.match[1], { italic: true }));
                    break;
                case 'bold_italic':
                    richText.push(createTextObject(m.match[1], { bold: true, italic: true }));
                    break;
                case 'strikethrough':
                    richText.push(createTextObject(m.match[1], { strikethrough: true }));
                    break;
                case 'code':
                    richText.push(createTextObject(m.match[1], { code: true }));
                    break;
            }

            currentIndex = m.end;
        }

        if (currentIndex < text.length) {
            const plainText = text.substring(currentIndex);
            if (plainText) {
                richText.push(createTextObject(plainText));
            }
        }

        if (richText.length === 0 && text) {
            richText.push(createTextObject(text));
        }

        return richText;
    }

    function createTextObject(content, options = {}) {
        const textObj = {
            type: 'text',
            text: { content: content || '' },
            annotations: {
                bold: options.bold || false,
                italic: options.italic || false,
                strikethrough: options.strikethrough || false,
                underline: options.underline || false,
                code: options.code || false,
                color: 'default'
            }
        };

        if (options.link) {
            textObj.text.link = { url: options.link };
        }

        return textObj;
    }

    async function syncWithButton(button) {
        if (!button) {
            return { error: new Error('未找到同步按钮') };
        }
        if (button.dataset.syncing === '1') {
            return { error: new Error('正在同步中') };
        }

        button.dataset.syncing = '1';
        button.classList.remove('success', 'error');
        button.classList.add('syncing');
        const originalTitle = button.getAttribute('title') || SETTINGS_BUTTON_TITLE;
        button.setAttribute('title', '同步中...');

        try {
            const result = await syncCurrentPost();
            if (result.skipped) {
                button.classList.add('success');
                notify('帖子已存在，跳过同步', 'info');
            } else {
                button.classList.add('success');
                notify('同步成功', 'success');
            }
            return { skipped: !!result.skipped };
        } catch (error) {
            console.error('同步失败:', error);
            button.classList.add('error');
            notify(`同步失败: ${error.message}`, 'error');
            return { error };
        } finally {
            button.dataset.syncing = '';
            button.classList.remove('syncing');
            setTimeout(() => {
                button.classList.remove('success', 'error');
            }, 2000);
            button.setAttribute('title', originalTitle);
        }
    }

    function applySettingsButtonPosition(button) {
        const saved = getSettingsButtonPosition();
        if (saved) {
            button.style.left = `${saved.x}px`;
            button.style.top = `${saved.y}px`;
            button.style.right = 'auto';
            button.style.bottom = 'auto';
        } else {
            button.style.right = '20px';
            button.style.bottom = '60px';
            button.style.left = 'auto';
            button.style.top = 'auto';
        }
    }

    function attachSettingsButtonDrag(button) {
        let isDragging = false;
        let moved = false;
        let startX = 0;
        let startY = 0;
        let originLeft = 0;
        let originTop = 0;
        let buttonWidth = 0;
        let buttonHeight = 0;
        let lastClickTime = 0;
        let clickTimer = null;
        const dragThreshold = 4;
        const padding = 8;

        const onPointerDown = (event) => {
            if (event.button !== undefined && event.button !== 0) {
                return;
            }
            isDragging = true;
            moved = false;
            const rect = button.getBoundingClientRect();
            startX = event.clientX;
            startY = event.clientY;
            originLeft = rect.left;
            originTop = rect.top;
            buttonWidth = rect.width;
            buttonHeight = rect.height;
            button.setPointerCapture(event.pointerId);
        };

        const onPointerMove = (event) => {
            if (!isDragging) {
                return;
            }
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;

            if (Math.abs(dx) + Math.abs(dy) > dragThreshold) {
                moved = true;
            }

            const maxLeft = Math.max(padding, window.innerWidth - buttonWidth - padding);
            const maxTop = Math.max(padding, window.innerHeight - buttonHeight - padding);
            const nextLeft = Math.min(Math.max(originLeft + dx, padding), maxLeft);
            const nextTop = Math.min(Math.max(originTop + dy, padding), maxTop);

            button.style.left = `${nextLeft}px`;
            button.style.top = `${nextTop}px`;
            button.style.right = 'auto';
            button.style.bottom = 'auto';

            if (panelElements?.panel?.classList.contains('is-open')) {
                positionPanelNearButton();
            }
        };

        const onPointerUp = (event) => {
            if (!isDragging) {
                return;
            }
            isDragging = false;
            try {
                button.releasePointerCapture(event.pointerId);
            } catch (error) {
                // ignore
            }

            const rect = button.getBoundingClientRect();
            saveSettingsButtonPosition(rect.left, rect.top);

            if (moved) {
                if (panelElements?.panel?.classList.contains('is-open')) {
                    positionPanelNearButton();
                }
                return;
            }

            const now = Date.now();
            if (now - lastClickTime < 300) {
                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                }
                lastClickTime = 0;
                syncWithButton(button);
                return;
            }

            lastClickTime = now;
            if (clickTimer) {
                clearTimeout(clickTimer);
            }
            clickTimer = setTimeout(() => {
                clickTimer = null;
                lastClickTime = 0;
                const isOpen = panelElements?.panel?.classList.contains('is-open');
                setPanelVisible(!isOpen);
            }, 260);
        };

        button.addEventListener('pointerdown', onPointerDown);
        button.addEventListener('pointermove', onPointerMove);
        button.addEventListener('pointerup', onPointerUp);
        button.addEventListener('pointercancel', onPointerUp);
    }

    function createSettingsButton() {
        const button = document.createElement('button');
        button.id = SETTINGS_BUTTON_ID;
        button.className = SETTINGS_BUTTON_CLASS;
        button.setAttribute('title', SETTINGS_BUTTON_TITLE);
        button.setAttribute('aria-label', SETTINGS_BUTTON_TITLE);
        button.textContent = '📚';
        button.style.touchAction = 'none';

        applySettingsButtonPosition(button);
        attachSettingsButtonDrag(button);

        return button;
    }

    function injectSyncButton() {
        if (!window.location.pathname.startsWith('/t/')) {
            return;
        }

        let settingsButton = document.getElementById(SETTINGS_BUTTON_ID);
        if (!settingsButton) {
            settingsButton = createSettingsButton();
        }

        if (!document.body.contains(settingsButton)) {
            settingsButton.classList.add('linuxdo-notion-settings-float');
            document.body.appendChild(settingsButton);
            applySettingsButtonPosition(settingsButton);
        }
    }

    function startPolling() {
        setInterval(() => {
            try {
                injectSyncButton();
            } catch (error) {
                console.warn('按钮注入失败:', error);
            }
        }, 2000);
    }

    function addStyles() {
        GM_addStyle(`
            .${SETTINGS_BUTTON_CLASS} {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                margin-right: 0;
                background: #ffffff;
                color: #111827;
                border: 1px solid #d1d5db;
                border-radius: 999px;
                cursor: grab;
                font-size: 18px;
                font-weight: 600;
                transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
                user-select: none;
                box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
            }

            .${SETTINGS_BUTTON_CLASS}:hover {
                transform: translateY(-1px);
                box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
                border-color: #9ca3af;
            }

            .${SETTINGS_BUTTON_CLASS}:active {
                cursor: grabbing;
                transform: translateY(0);
            }

            .${SETTINGS_BUTTON_CLASS}.active {
                border-color: #2563eb;
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25), 0 8px 18px rgba(0, 0, 0, 0.18);
            }

            .${SETTINGS_BUTTON_CLASS}.syncing {
                animation: linuxdo-notion-pulse 1s ease-in-out infinite;
            }

            .${SETTINGS_BUTTON_CLASS}.success {
                background: #ecfdf3;
                border-color: #34d399;
                color: #047857;
            }

            .${SETTINGS_BUTTON_CLASS}.error {
                background: #fef2f2;
                border-color: #f87171;
                color: #b91c1c;
            }

            .linuxdo-notion-settings-float {
                position: fixed;
                z-index: 9999;
            }

            @keyframes linuxdo-notion-pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.08); opacity: 0.85; }
            }

            .linuxdo-notion-panel {
                position: fixed;
                width: 320px;
                max-width: calc(100vw - 24px);
                max-height: 70vh;
                overflow: auto;
                background: #ffffff;
                color: #111827;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
                z-index: 10001;
                display: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
                    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            }

            .linuxdo-notion-panel.is-open {
                display: block;
            }

            .linuxdo-notion-panel *,
            .linuxdo-notion-panel *::before,
            .linuxdo-notion-panel *::after {
                box-sizing: border-box;
            }

            .linuxdo-notion-panel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 12px;
                border-bottom: 1px solid #eef2f7;
                background: #f8fafc;
            }

            .linuxdo-notion-panel-title {
                font-size: 13px;
                font-weight: 600;
                color: #111827;
            }

            .linuxdo-notion-panel-close {
                border: none;
                background: transparent;
                font-size: 16px;
                line-height: 1;
                cursor: pointer;
                color: #9ca3af;
            }

            .linuxdo-notion-panel-body {
                padding: 12px;
                font-size: 12px;
            }

            .linuxdo-notion-label {
                display: block;
                margin: 10px 0 6px;
                font-size: 12px;
                font-weight: 600;
                color: #374151;
            }

            .linuxdo-notion-input-row {
                display: flex;
                gap: 6px;
                align-items: center;
            }

            .linuxdo-notion-input {
                width: 100%;
                padding: 6px 8px;
                font-size: 12px;
                color: #0f172a;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                outline: none;
                transition: border-color 0.2s, box-shadow 0.2s;
            }

            .linuxdo-notion-input:focus {
                border-color: #2563eb;
                box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
            }

            .linuxdo-notion-input::placeholder {
                color: #94a3b8;
            }

            .linuxdo-notion-inline-btn {
                padding: 6px 8px;
                border-radius: 6px;
                font-size: 11px;
                color: #2563eb;
                background: #eef2ff;
                border: 1px solid #c7d2fe;
                cursor: pointer;
                white-space: nowrap;
            }

            .linuxdo-notion-checkbox {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-top: 10px;
                font-size: 12px;
                color: #374151;
            }

            .linuxdo-notion-checkbox input[type="checkbox"] {
                width: 14px;
                height: 14px;
            }

            .linuxdo-notion-btn {
                flex: 1 1 90px;
                padding: 6px 10px;
                font-size: 12px;
                border-radius: 6px;
                border: 1px solid #e5e7eb;
                background: #f3f4f6;
                color: #111827;
                cursor: pointer;
                transition: background 0.2s, border-color 0.2s, color 0.2s;
            }

            .linuxdo-notion-btn.primary {
                background: #2563eb;
                border-color: #2563eb;
                color: #ffffff;
            }

            .linuxdo-notion-btn.danger {
                background: #fef2f2;
                border-color: #fecaca;
                color: #b91c1c;
            }

            .linuxdo-notion-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .linuxdo-notion-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 10px;
            }

            .linuxdo-notion-hint {
                margin-top: 10px;
                font-size: 11px;
                color: #6b7280;
            }

            .linuxdo-notion-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 16px;
                background: rgba(0, 0, 0, 0.85);
                color: #fff;
                border-radius: 6px;
                font-size: 12px;
                z-index: 10000;
                animation: linuxdo-notion-fadeIn 0.3s ease;
            }

            .linuxdo-notion-toast.success {
                background: rgba(72, 187, 120, 0.95);
            }

            .linuxdo-notion-toast.error {
                background: rgba(245, 101, 101, 0.95);
            }

            @keyframes linuxdo-notion-fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `);
    }

    function init() {
        addStyles();
        injectSyncButton();
        startPolling();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
