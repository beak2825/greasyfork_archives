// ==UserScript==
// @name         GitHub Release Note Generator from Commits
// @name:zh-CN   GitHub 基于 Commit 生成 Release Note
// @namespace    https://microblock.cc/
// @version      1.0.0
// @description  Adds a button on the GitHub new release page to generate release notes with custom formats, dark mode support, and more commit details.
// @description:zh-CN 在 GitHub 的 new release 页面添加一个按钮，用于基于 commits 生成发布说明。支持自定义格式、暗色模式及更多提交详情。
// @author       MicroBlock
// @match        https://github.com/*/*/releases/new
// @grant        GM_setValue
// @grant        GM_getValue
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/554484/GitHub%20Release%20Note%20Generator%20from%20Commits.user.js
// @updateURL https://update.greasyfork.org/scripts/554484/GitHub%20Release%20Note%20Generator%20from%20Commits.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONVENTIONAL_COMMIT_REGEX = /^(?<type>\w+)(?:\((?<scope>[^)]+)\))?!?:\s*(?<subject>.+)/;

    const CONFIG_KEYS = {
        githubToken: 'grn_github_token',
        groupBy: 'grn_group_by',
        templatePreset: 'grn_template_preset',
        customFormat: 'grn_custom_format',
        useGeneralScope: 'grn_use_general_scope'
    };

    function saveConfig(key, value) {
        GM_setValue(CONFIG_KEYS[key], value);
    }

    function loadConfig(key, defaultValue) {
        return GM_getValue(CONFIG_KEYS[key], defaultValue);
    }
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .grn-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 5vh;
            }
            .grn-modal-content {
                background: #fff; 
                border: 1px solid #d0d7de; 
                border-radius: 6px;
                padding: 20px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                gap: 15px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.12); 
            }
            .grn-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #e1e4e8; 
                padding-bottom: 10px;
            }
            .grn-modal-header h2 {
                font-size: 1.5em;
                margin: 0;
                color: #24292f; 
            }
            .grn-modal-close-btn {
                background: none;
                border: none;
                font-size: 1.5em;
                cursor: pointer;
                color: #57606a; 
            }
            .grn-modal-body {
                display: flex;
                flex-direction: column;
                gap: 20px;
                overflow-y: auto;
                color: #24292f; 
            }
            .grn-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 15px;
            }
            .grn-options fieldset {
                border: 1px solid #d0d7de; 
                padding: 10px 15px;
                border-radius: 6px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .grn-options legend {
                font-weight: 600;
                padding: 0 5px;
                color: #24292f; 
            }
            .grn-custom-format-container, .grn-custom-format-container label {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .grn-custom-format-input-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #grn-custom-format-input {
                 width: 100%;
                 background-color: #f6f8fa; 
                 border: 1px solid #d0d7de; 
                 border-radius: 6px;
                 padding: 5px 12px;
                 font-family: var(--font-family-monospace, monospace);
                 color: #24292f; 
                 resize: vertical;
                 min-height: 38px;
            }
            .grn-info-icon {
                color: #57606a; 
                cursor: help;
                font-weight: bold;
                font-size: 1.1em;
            }
            .grn-output {
                display: flex;
                flex-direction: column;
                gap: 10px;
                flex-grow: 1;
                min-height: 200px;
            }
            #grn-changelog-output {
                width: 100%;
                flex-grow: 1;
                resize: vertical;
                min-height: 200px;
                font-family: var(--font-family-monospace, monospace);
                background-color: #f6f8fa; 
                color: #24292f; 
                border: 1px solid #d0d7de; 
                border-radius: 6px;
                padding: 8px;
            }
            .Button.grn-copy-btn {
                align-self: flex-end;
                margin-top: 5px;
            }
            .grn-info {
                font-size: 0.9em;
                color: #57606a; 
                background-color: #f6f8fa; 
                padding: 8px 12px;
                border-radius: 6px;
            }
            
            html[data-color-mode="dark"] .grn-modal-content {
                background: #161b22; 
                border-color: #30363d; 
                box-shadow: 0 8px 24px rgba(0,0,0,0.6); 
            }
            html[data-color-mode="dark"] .grn-modal-header {
                border-bottom-color: #30363d;
            }
            html[data-color-mode="dark"] .grn-modal-header h2 {
                color: #c9d1d9; 
            }
            html[data-color-mode="dark"] .grn-modal-close-btn {
                color: #8b949e; 
            }
            html[data-color-mode="dark"] .grn-modal-body {
                color: #c9d1d9;
            }
            html[data-color-mode="dark"] .grn-options fieldset {
                border-color: #30363d;
            }
            html[data-color-mode="dark"] .grn-options legend {
                color: #c9d1d9;
            }
            html[data-color-mode="dark"] #grn-custom-format-input,
            html[data-color-mode="dark"] #grn-changelog-output {
                background-color: #0d1117; 
                border-color: #30363d;
                color: #c9d1d9;
            }
            html[data-color-mode="dark"] .grn-info-icon {
                color: #8b949e;
            }
            html[data-color-mode="dark"] .grn-info {
                color: #c9d1d9;
                background-color: #1f2a36; 
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 在GitHub原生的“Generate release notes”按钮旁边创建一个自定义按钮。
     */
    function createGeneratorButton() {

        const originalBtn = document.getElementById('generate-notes-btn');

        if (!originalBtn || document.getElementById('custom-generate-btn')) {
            return;
        }

        const newBtn = originalBtn.cloneNode(true);
        newBtn.id = 'custom-generate-btn';
        newBtn.ariaDisabled = false
        newBtn.querySelector('.Button-label').textContent = '基于 Commit 生成 Release Note';
        newBtn.removeAttribute('data-hotkey');

        newBtn.classList.add('Button--primary');
        newBtn.classList.remove('Button--secondary');
        originalBtn.classList.add('Button--secondary');
        originalBtn.classList.remove('Button--primary');

        newBtn.addEventListener('click', onGenerateClick);

        originalBtn.insertAdjacentElement('afterend', newBtn);
    }

    let currentRepoOwner = '';
    let currentRepoName = '';

    async function ghFetch(endpoint) {
        const url = `https://api.github.com${endpoint}`;
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
        };
        const token = loadConfig('githubToken', '');
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }
        const response = await fetch(url, { headers });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
        }
        return response.json();
    }

    async function getRepoInfo(owner, repo) {
        return ghFetch(`/repos/${owner}/${repo}`);
    }

    async function getLatestReleaseInfo(owner, repo) {
        try {
            const latestRelease = await ghFetch(`/repos/${owner}/${repo}/releases/latest`);
            const tagName = latestRelease.tag_name;

            const refData = await ghFetch(`/repos/${owner}/${repo}/git/ref/tags/${tagName}`);
            const commitSha = refData.object.type === 'tag'
                ? (await ghFetch(refData.object.url.replace('https://api.github.com', ''))).object.sha
                : refData.object.sha;
            return { tagName, commitSha };
        } catch (error) {

            if (error instanceof Error && String(error).includes('404')) {
                return null;
            }
            throw error;
        }
    }

    async function getCommitsSince(owner, repo, branch, baseCommitSha) {
        let commits = [];
        let page = 1;
        let foundBaseCommit = !baseCommitSha;

        while (true) {
            const pageCommits = await ghFetch(`/repos/${owner}/${repo}/commits?sha=${branch}&per_page=100&page=${page}`);
            if (pageCommits.length === 0) break;

            for (const commit of pageCommits) {
                if (commit.sha === baseCommitSha) {
                    foundBaseCommit = true;
                    break;
                }
                commits.push(commit);
            }
            if (foundBaseCommit) break;
            page++;
        }
        return commits;
    }
    function parseCommits(rawCommits) {
        const repoUrl = `https://github.com/${currentRepoOwner}/${currentRepoName}`;
        return rawCommits.map(c => {
            const message = c.commit.message.split('\n')[0];
            const match = message.match(CONVENTIONAL_COMMIT_REGEX);
            const coAuthors = c.commit.message.split('\n')
                .filter(line => line.startsWith('Co-authored-by:'))
                .map(line => line.replace('Co-authored-by:', '').trim());

            return {
                sha: c.sha.slice(0, 7),
                fullSha: c.sha,
                type: match ? match.groups.type.toLowerCase() : 'other',
                scope: (match && match.groups.scope) || null,
                subject: match ? match.groups.subject : message,
                committer: c.commit.committer.name,
                commitUrl: `${repoUrl}/commit/${c.sha}`,
                coAuthors: coAuthors,
            };
        });
    }

    function generateChangelog(parsedCommits, options) {
        const typeHeadings = {
            feat: '✨ Features',
            fix: '🐛 Bug Fixes',
            docs: '📝 Documentation',
            style: '🎨 Styles',
            refactor: '♻️ Code Refactoring',
            perf: '⚡ Performance Improvements',
            test: '✅ Tests',
            build: '📦 Build System',
            ci: '🚀 Continuous Integration',
            chore: '🧹 Chores',
            revert: '⏪ Reverts',
            other: '📚 Miscellaneous',
        };

        let sortedCommits = [...parsedCommits];
        if (options.groupBy === 'type') {
            const typeOrder = Object.keys(typeHeadings);
            sortedCommits.sort((a, b) => {
                const typeA = typeOrder.indexOf(a.type);
                const typeB = typeOrder.indexOf(b.type);
                if (typeA !== typeB) return typeA - typeB;
                return (a.scope || '').localeCompare(b.scope || '');
            });
        }
        const formatLine = (commit) => {
            let displayScope = commit.scope;
            if (!displayScope && options.useGeneralScope) {
                displayScope = 'general';
            }
            const scopeFormatted = displayScope ? `(${displayScope})` : '';
            const commitLink = `[${commit.sha}](${commit.commitUrl})`;
            const fullCommitLink = `[${commit.fullSha}](${commit.commitUrl})`;
            const coAuthorsFormatted = commit.coAuthors.length > 0 ? ` (Co-authored-by: ${commit.coAuthors.join(', ')})` : '';

            return options.customFormat
                .replace(/\$\{type\}/g, commit.type)
                .replace(/\$\{scope\}/g, displayScope || '')
                .replace(/\$\{scope_formatted\}/g, scopeFormatted)
                .replace(/\$\{subject\}/g, commit.subject)
                .replace(/\$\{sha\}/g, commit.sha)
                .replace(/\$\{fullSha\}/g, commit.fullSha)
                .replace(/\$\{committer\}/g, commit.committer)
                .replace(/\$\{commitUrl\}/g, commit.commitUrl)
                .replace(/\$\{commitLink\}/g, commitLink)
                .replace(/\$\{fullCommitLink\}/g, fullCommitLink)
                .replace(/\$\{coAuthors\}/g, coAuthorsFormatted);
        };

        if (options.groupBy === 'type') {
            const groups = sortedCommits.reduce((acc, commit) => {
                (acc[commit.type] = acc[commit.type] || []).push(commit);
                return acc;
            }, {});
            return Object.keys(typeHeadings)
                .filter(type => groups[type] && groups[type].length > 0)
                .map(type => {
                    const heading = `### ${typeHeadings[type]}`;
                    const list = groups[type].map(formatLine).join('\n');
                    return `${heading}\n${list}`;
                })
                .join('\n\n');
        } else {

            return sortedCommits.map(formatLine).join('\n');
        }
    }

    function showChangelogModal(commits, latestReleaseInfo, branch) {
        const modalId = 'grn-modal';
        if (document.getElementById(modalId)) return;

        const parsedCommits = parseCommits(commits);
        const fromInfo = latestReleaseInfo
            ? `从 \`${latestReleaseInfo.tagName}\` 到 \`${branch}\` 分支的 \`HEAD\``
            : `来自 \`${branch}\` 分支的所有可达 commits`;

        const variablesTooltip = `可用变量 (在自定义格式中使用，例如 \`- \${type}: \${subject} \${commitLink}\`):
- \`\${type}\`: 类型 (e.g., feat, fix)
- \`\${scope}\`: 范围 (e.g., api, core)
- \`\${scope_formatted}\`: 带括号的范围 (e.g., (api))，无则为空
- \`\${subject}\`: 提交信息主题
- \`\${sha}\`: 7位短 commit hash
- \`\${fullSha}\`: 完整 commit hash
- \`\${committer}\`: 提交者名称
- \`\${commitUrl}\`: commit 的 GitHub 链接 (URL)
- \`\${commitLink}\`: commit 的 GitHub 链接 (Markdown格式: [sha](url))
- \`\${fullCommitLink}\`: commit 的 GitHub 链接 (Markdown格式: [fullSha](url))
- \`\${coAuthors}\`: 共同作者 (如果存在, 例如 "(Co-authored-by: dev1, dev2)")`;

        const overlay = document.createElement('div');
        overlay.id = modalId;
        overlay.className = 'grn-modal-overlay';
        overlay.innerHTML = `
            <div class="grn-modal-content">
                <div class="grn-modal-header">
                    <h2>生成 Release Note</h2>
                    <button class="grn-modal-close-btn">&times;</button>
                </div>
                <div class="grn-modal-body">
                    <div class="grn-info">
                        在默认分支 <strong>${branch}</strong> 上找到了 ${commits.length} 个新 commits (${fromInfo}).
                    </div>
                    <div class="grn-options">
                        <fieldset>
                            <legend>Settings</legend>
                            <label>GitHub Token: <input type="password" id="grn-github-token" placeholder="Optional, for higher rate limits"></label>
                        </fieldset>

                        <fieldset>
                            <legend>分组和排序</legend>
                            <label><input type="radio" name="groupBy" value="type" checked> 按类型分组 (feat, fix...)</label>
                            <label><input type="radio" name="groupBy" value="time"> 按提交时间排序 (默认获取顺序)</label>
                        </fieldset>

                        <fieldset>
                            <legend>格式预设</legend>
                            <label><input type="radio" name="templatePreset" value="markdown-header" checked> 推荐样式 (按类型分组)</label>
                            <label><input type="radio" name="templatePreset" value="flat-list"> 扁平列表 (按时间排序)</label>
                        </fieldset>

                        <fieldset>
                            <legend>自定义格式选项</legend>
                             <div class="grn-custom-format-container">
                                <label for="grn-custom-format-input">自定义格式字符串:</label>
                                <div class="grn-custom-format-input-wrapper">
                                     <textarea id="grn-custom-format-input" rows="2"></textarea>
                                     <span class="grn-info-icon" title="${variablesTooltip}">ⓘ</span>
                                </div>
                            </div>
                            <label><input type="checkbox" id="grn-toggle-general-scope" checked> 为无 Scope 的 Commit 添加 (general) 标识</label>
                        </fieldset>
                    </div>

                    <div class="grn-output">
                        <textarea id="grn-changelog-output" readonly></textarea>
                        <button id="grn-copy-btn" class="Button Button--primary grn-copy-btn">复制到剪贴板</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const outputArea = document.getElementById('grn-changelog-output');
        const optionsForm = overlay.querySelector('.grn-options');
        const customFormatInput = document.getElementById('grn-custom-format-input');
        const tokenInput = document.getElementById('grn-github-token');
        tokenInput.value = loadConfig('githubToken', '');
        tokenInput.addEventListener('input', () => saveConfig('githubToken', tokenInput.value));

        const groupByValue = loadConfig('groupBy', 'type');
        optionsForm.querySelector(`input[name="groupBy"][value="${groupByValue}"]`).checked = true;

        const templatePresetValue = loadConfig('templatePreset', 'markdown-header');
        optionsForm.querySelector(`input[name="templatePreset"][value="${templatePresetValue}"]`).checked = true;

        const useGeneralScopeValue = loadConfig('useGeneralScope', true);
        document.getElementById('grn-toggle-general-scope').checked = useGeneralScopeValue;
        const presetFormats = {
            'markdown-header': '- **${scope_formatted}** ${subject} by ${committer} ${commitLink}${coAuthors}',
            'flat-list': '- ${type}${scope_formatted}: ${subject} by ${committer} ${commitLink}${coAuthors}',
        };
        customFormatInput.value = loadConfig('customFormat', presetFormats[templatePresetValue]);
        function applyPreset() {
            const selectedPreset = optionsForm.querySelector('input[name="templatePreset"]:checked').value;
            customFormatInput.value = presetFormats[selectedPreset];
            saveConfig('customFormat', customFormatInput.value);
        }

        function updateChangelog() {
            const options = {
                groupBy: optionsForm.querySelector('input[name="groupBy"]:checked').value,
                customFormat: customFormatInput.value,
                useGeneralScope: document.getElementById('grn-toggle-general-scope').checked,
            };
            outputArea.value = generateChangelog(parsedCommits, options);
        }
        optionsForm.addEventListener('change', (e) => {
            if (e.target.name === 'templatePreset') {
                applyPreset();
                saveConfig('templatePreset', e.target.value);

                if (e.target.value === 'markdown-header') {
                    optionsForm.querySelector('input[name="groupBy"][value="type"]').checked = true;
                    saveConfig('groupBy', 'type');
                } else if (e.target.value === 'flat-list') {
                    optionsForm.querySelector('input[name="groupBy"][value="time"]').checked = true;
                    saveConfig('groupBy', 'time');
                }
            } else if (e.target.name === 'groupBy') {
                saveConfig('groupBy', e.target.value);
            }
            updateChangelog();
        });
        customFormatInput.addEventListener('input', () => {
            saveConfig('customFormat', customFormatInput.value);
            updateChangelog();
        });

        document.getElementById('grn-toggle-general-scope').addEventListener('change', (e) => {
            saveConfig('useGeneralScope', e.target.checked);
            updateChangelog();
        });
        overlay.querySelector('.grn-modal-close-btn').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        document.getElementById('grn-copy-btn').addEventListener('click', (e) => {
            navigator.clipboard.writeText(outputArea.value).then(() => {
                const originalText = e.target.textContent;
                e.target.textContent = '已复制!';
                setTimeout(() => { e.target.textContent = originalText; }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制。');
            });
        });
        applyPreset();
        updateChangelog();
    }
    async function onGenerateClick(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const buttonLabel = button.querySelector('.Button-label');
        const originalText = buttonLabel.textContent;

        button.disabled = true;
        buttonLabel.textContent = '正在获取 Commits...';

        try {

            const pathMatch = window.location.pathname.match(/\/([^/]+)\/([^/]+)\/releases\/new/);
            if (!pathMatch || pathMatch.length < 3) {
                throw new Error("无法从URL解析仓库信息。");
            }
            const [, owner, repo] = pathMatch;
            currentRepoOwner = owner;
            currentRepoName = repo;

            const repoInfo = await getRepoInfo(owner, repo);
            const branch = repoInfo.default_branch;

            const latestReleaseInfo = await getLatestReleaseInfo(owner, repo);
            const baseCommitSha = latestReleaseInfo ? latestReleaseInfo.commitSha : null;

            const commits = await getCommitsSince(owner, repo, branch, baseCommitSha);

            if (commits.length > 0) {
                showChangelogModal(commits, latestReleaseInfo, branch);
            } else {
                alert(`在默认分支 "${branch}" 上，自上次发布版本${latestReleaseInfo ? ` (\`${latestReleaseInfo.tagName}\`)` : ''}以来没有找到新的 commits。`);
            }
        } catch (error) {
            console.error("生成 Release Note 失败:", error);
            if (error.message.includes('403') || error.message.toLowerCase().includes('rate limit')) {
                const token = prompt('检测到 GitHub API 速率限制。请提供您的 GitHub 个人访问令牌（Personal Access Token）以继续：');
                if (token) {
                    saveConfig('githubToken', token);

                    try {
                        return await onGenerateClick(event);
                    } catch (retryError) {
                        alert(`重试失败: ${retryError.message}`);
                    }
                } else {
                    alert('未提供令牌，操作取消。');
                }
            } else {
                alert(`生成 Release Note 失败: ${error.message}\n请检查您的网络连接或GitHub API访问权限。`);
            }
        } finally {
            button.disabled = false;
            buttonLabel.textContent = originalText;
        }
    }

    function initialize() {
        injectStyles();
        const observer = new MutationObserver((mutationsList, observer) => {
            let originalButtonExists = document.getElementById('generate-notes-btn');
            let customButtonExists = document.getElementById('custom-generate-btn');

            if (originalButtonExists && !customButtonExists) {
                createGeneratorButton();
            }

            if (originalButtonExists && document.getElementById('custom-generate-btn')) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        createGeneratorButton();
    }
    initialize();
})();