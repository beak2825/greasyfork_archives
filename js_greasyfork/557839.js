// ==UserScript==
// @name         GGn Steam Language
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Get Steam language support info for GazelleGames (based on stable HTML parsing)
// @author       WhiteLycoris and Deepseek, thanks lucianjp
// @match        https://gazellegames.net/torrents.php?id=*
// @match        https://gazellegames.net/upload.php?groupid=*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557839/GGn%20Steam%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/557839/GGn%20Steam%20Language.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Steam 页面解析器 (基于 lucianjp 的稳定逻辑)
    class SteamPageParser {
        constructor() {}

        async getLanguageData(appId) {
            try {
                const html = await this.fetchSteamPage(appId);
                const languages = this.extractLanguagesFromHTML(html);
                return languages;
            } catch (error) {
                console.error('[GGn Steam Language] Failed to get language data:', error);
                return {
                    interfaceSubs: [],
                    fullAudio: [],
                    error: true
                };
            }
        }

        async fetchSteamPage(appId) {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Page request timeout'));
                }, 10000);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://store.steampowered.com/app/${appId}/`,
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                    },
                    anonymous: true,
                    onload: (response) => {
                        clearTimeout(timeout);
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else if (response.status === 404) {
                            reject(new Error(`Steam app (ID: ${appId}) not found`));
                        } else {
                            reject(new Error(`Page returned ${response.status}`));
                        }
                    },
                    onerror: (error) => {
                        clearTimeout(timeout);
                        reject(error);
                    },
                    ontimeout: () => {
                        clearTimeout(timeout);
                        reject(new Error('Request timeout'));
                    }
                });
            });
        }

        extractLanguagesFromHTML(html) {
            const result = {
                interfaceSubs: [],
                fullAudio: [],
                error: false
            };

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const languageTable = doc.querySelector('table.game_language_options');

            if (!languageTable) {
                console.warn('[GGn Steam Language] Language table not found on Steam page.');
                result.error = true;
                return result;
            }

            const languages = this.parseLanguageTable(languageTable);

            for (const [category, langList] of Object.entries(languages)) {
                const catLower = category.toLowerCase();

                langList.forEach(lang => {
                    if (!result.interfaceSubs.includes(lang)) {
                        result.interfaceSubs.push(lang);
                    }
                });

                if (catLower.includes('full audio') || catLower.includes('audio')) {
                    langList.forEach(lang => {
                        if (!result.fullAudio.includes(lang)) {
                            result.fullAudio.push(lang);
                        }
                    });
                }
            }

            result.interfaceSubs.sort();
            result.fullAudio.sort();

            return result;
        }

        parseLanguageTable(table) {
            const languages = {};

            for (let r = 0; r < table.rows.length; r++) {
                for (let c = 0; c < table.rows[r].cells.length; c++) {
                    const cell = table.rows[r].cells[c];

                    if (cell.textContent.trim() === '✔' || cell.innerHTML.includes('✓')) {
                        if (r === 0) continue;

                        const header = table.rows[0].cells[c].textContent.trim();
                        const languageName = table.rows[r].cells[0].textContent.trim();

                        if (header && languageName) {
                            if (!languages[header]) {
                                languages[header] = [];
                            }
                            if (!languages[header].includes(languageName)) {
                                languages[header].push(languageName);
                            }
                        }
                    }
                }
            }

            return languages;
        }
    }

    // UI管理器 (保持你原有的便捷交互逻辑)
    class UIManager {
        constructor() {
            this.button = null;
            this.isProcessing = false;
            this.appId = null;
            this.hasInitialized = false;
        }

        async init() {
            if (this.hasInitialized) return;
            this.hasInitialized = true;
            this.monitorPage();
        }

        monitorPage() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.findAndInsertButton());
            } else {
                setTimeout(() => this.findAndInsertButton(), 500);
            }
        }

        async findAndInsertButton() {
            // 防止重复插入
            if (document.querySelector('#ggn-steam-language-btn')) return;

            let steamLink = null;
            let pageType = '';

            // 根据当前页面特征，判断是详情页还是上传页，并获取链接
            if (window.location.pathname.includes('torrents.php')) {
                pageType = 'details';
                steamLink = this.findSteamLinkOnDetailsPage();
            } else if (window.location.pathname.includes('upload.php')) {
                pageType = 'upload';
                steamLink = this.findSteamLinkOnUploadPage();
            }

            if (steamLink) {
                this.appId = this.extractAppId(steamLink);
                if (this.appId) {
                    // 根据页面类型，在不同的位置插入按钮
                    if (pageType === 'details') {
                        this.insertButtonOnDetailsPage();
                    } else if (pageType === 'upload') {
                        this.insertButtonOnUploadPage();
                    }
                }
            }
        }

        // 详情页：从Web Links区域获取链接
        findSteamLinkOnDetailsPage() {
            const weblinksDiv = document.querySelector('#weblinksdiv');
            if (weblinksDiv) {
                const steamLink = weblinksDiv.querySelector('a[href*="store.steampowered.com/app/"]');
                if (steamLink) return steamLink.href;
            }
            return null;
        }

        // 上传页：从ID为steamuri的输入框获取链接
        findSteamLinkOnUploadPage() {
            const steamInput = document.querySelector('#steamuri');
            if (steamInput && steamInput.value) {
                return steamInput.value;
            }
            return null;
        }

        extractAppId(url) {
            const match = url.match(/store\.steampowered\.com\/app\/(\d+)/);
            return match ? match[1] : null;
        }

        // 详情页：在标题后插入按钮
        insertButtonOnDetailsPage() {
            const titleElement = document.querySelector('#display_name');
            if (!titleElement) return;

            this.createButton();

            const separator = document.createTextNode(' | ');
            titleElement.appendChild(separator);
            titleElement.appendChild(this.button);
        }

        // 上传页：在Language选择框所在的<td>内插入按钮
        insertButtonOnUploadPage() {
            // 找到包含Language下拉框的td单元格
            const languageLabelTd = Array.from(document.querySelectorAll('td.label')).find(td => td.textContent.trim() === 'Language');
            if (!languageLabelTd) return;

            const targetTd = languageLabelTd.nextElementSibling; // 相邻的右侧td
            if (!targetTd) return;

            this.createButton();

            // 在td内现有内容后添加一个空格和按钮
            targetTd.appendChild(document.createTextNode(' '));
            targetTd.appendChild(this.button);
        }

        // 创建按钮的通用方法
        createButton() {
            this.button = document.createElement('span');
            this.button.id = 'ggn-steam-language-btn';
            this.button.className = 'ggn-steam-language-btn';
            this.button.textContent = 'Steam Language';
            this.button.title = 'Click to copy Steam language info to clipboard';

            this.addButtonStyles();

            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleButtonClick();
            });
        }

        // 【已修改】按钮样式：默认颜色改为 #ffffff (白色)
        addButtonStyles() {
            if (document.querySelector('#ggn-steam-language-styles')) return;
            const style = document.createElement('style');
            style.id = 'ggn-steam-language-styles';
            style.textContent = `
                .ggn-steam-language-btn {
                    color: #ffffff; /* 修改为白色 */
                    text-decoration: none;
                    margin-left: 8px;
                    margin-right: 8px;
                    font-weight: normal;
                    cursor: pointer;
                    font-size: 13px;
                    font-family: inherit;
                    background: none;
                    border: none;
                    padding: 0;
                    display: inline;
                }
                .ggn-steam-language-btn:hover {
                    text-decoration: underline;
                    color: #cccccc; /* 悬停时改为浅灰色，确保在深色背景下可见 */
                }
                .ggn-steam-language-btn.loading {
                    color: #999;
                    cursor: wait;
                    text-decoration: none;
                }
                .ggn-steam-language-btn.success {
                    color: #2ecc71;
                    font-weight: bold;
                }
                .ggn-steam-language-btn.error {
                    color: #e74c3c;
                }
            `;
            document.head.appendChild(style);
        }

        async handleButtonClick() {
            if (this.isProcessing || !this.button) return;
            this.isProcessing = true;
            const originalText = this.button.textContent;
            const originalTitle = this.button.title;

            this.button.classList.add('loading');
            this.button.textContent = 'Loading...';
            this.button.title = 'Loading Steam language info (this may take a moment)...';

            try {
                const parser = new SteamPageParser();
                const languageData = await parser.getLanguageData(this.appId);

                const textToCopy = this.formatLanguageText(languageData);
                GM_setClipboard(textToCopy, 'text');

                this.button.classList.remove('loading');
                this.button.classList.add('success');
                this.button.textContent = 'Copied!';
                this.button.title = 'Language info copied to clipboard';

                setTimeout(() => {
                    this.button.classList.remove('success');
                    this.button.textContent = originalText;
                    this.button.title = originalTitle;
                    this.isProcessing = false;
                }, 2000);

            } catch (error) {
                console.error('[GGn Steam Language] Failed to copy language info:', error);
                this.button.classList.remove('loading');
                this.button.classList.add('error');
                this.button.textContent = 'Error';
                this.button.title = 'Failed to get language info. Click to retry';

                setTimeout(() => {
                    this.button.classList.remove('error');
                    this.button.textContent = originalText;
                    this.button.title = originalTitle;
                    this.isProcessing = false;
                }, 2000);
            }
        }

        formatLanguageText(languageData) {
            if (languageData.error || languageData.interfaceSubs.length === 0) {
                return 'Steam language info unavailable';
            }

            const { interfaceSubs, fullAudio } = languageData;

            // 构建带BBCode的 Interface and Subtitles 行
            let text = `[b]Interface and Subtitles[/b]: ${interfaceSubs.join(', ')}`;

            // 只有当有完整音频语言时，才添加空行和Full Audio行
            if (fullAudio.length > 0) {
                text += '\n\n'; // 在两部分之间插入一个空行
                text += `[b]Full Audio[/b]: ${fullAudio.join(', ')}`;
            }

            return text;
        }
    }

    // 主初始化
    function init() {
        if (window.ggnSteamLanguageInitialized) return;
        window.ggnSteamLanguageInitialized = true;
        new UIManager().init();
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();