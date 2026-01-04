// ==UserScript==
// @name         Jenkins 联合构建 (v8.0 - 导入增强版)
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  [新增] Job配置导入功能 - 支持从页面提取项目,加号添加配置,运行时自动跳过不存在的项目
// @author       Tandy (增强 by AI Assistant)
// @match        http://10.9.31.83:9001/job/sz-newcis-dev/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553550/Jenkins%20%E8%81%94%E5%90%88%E6%9E%84%E5%BB%BA%20%28v80%20-%20%E5%AF%BC%E5%85%A5%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553550/Jenkins%20%E8%81%94%E5%90%88%E6%9E%84%E5%BB%BA%20%28v80%20-%20%E5%AF%BC%E5%85%A5%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================
    // ⚙️ [配置区] ⚙️
    // =================================================================

    // 默认配置
    const DEFAULT_CONFIG = {
        triggerMaxRetries: 3,
        triggerRetryDelay: 2000,
        displayOrder: ['common', 'api', 'web', 'bill', 'customer', 'system', 'report'],
        jobs: {
            'common': {
                name: 'Common',
                url: 'http://10.9.31.83:9001/job/sz-newcis-dev/job/sz-newcis-dev_cis-common/build?delay=0sec',
                enabled: true,
                wait: true // 是否等待构建完成
            },
            'api': {
                name: 'API',
                url: 'http://10.9.31.83:9001/job/sz-newcis-dev/job/sz-newcis-dev_cis-api/build?delay=0sec',
                enabled: true,
                wait: true
            },
            'web': {
                name: 'Web',
                url: 'http://10.9.31.83:9001/job/sz-newcis-dev/job/sz-newcis-dev_cis-web/build?delay=0sec',
                enabled: true,
                wait: false // web不等待
            },
            'bill': {
                name: 'Bill Service',
                url: 'http://10.9.31.83:9001/job/sz-newcis-dev/job/sz-newcis-dev_cis-bill-service/build?delay=0sec',
                enabled: true,
                wait: false
            },
            'customer': {
                name: 'Customer Service',
                url: 'http://10.9.31.83:9001/job/sz-newcis-dev/job/sz-newcis-dev_cis-customer-service/build?delay=0sec',
                enabled: true,
                wait: false
            },
            'system': {
                name: 'System Service',
                url: 'http://10.9.31.83:9001/job/sz-newcis-dev/job/sz-newcis-dev_cis-system-service/build?delay=0sec',
                enabled: true,
                wait: false
            },
            'report': {
                name: 'Report Service',
                url: 'http://10.9.31.83:9001/job/sz-newcis-dev/job/sz-newcis-dev_cis-report-service/build?delay=0sec',
                enabled: true,
                wait: false
            }
        }
    };

    // 运行时配置（会从存储加载）
    let CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

    // 重试配置
    let TRIGGER_MAX_RETRIES = CONFIG.triggerMaxRetries;
    let TRIGGER_RETRY_DELAY = CONFIG.triggerRetryDelay;

    // Job 定义
    let JOB_DEFINITIONS = CONFIG.jobs;
    let LAST_SCANNED_JOBS = [];
    let DISPLAY_ORDER = CONFIG.displayOrder || [];

    // 统一布尔与阶段等字段，防止旧版本字符串/数字造成显示与逻辑错误
    function sanitizeJob(job) {
        const normalizeBool = (val, defaultVal = true) => {
            if (val === undefined || val === null) return defaultVal;
            if (typeof val === 'string') {
                const lowered = val.toLowerCase();
                if (['false', '0', 'no', 'off'].includes(lowered)) return false;
                if (['true', '1', 'yes', 'on'].includes(lowered)) return true;
            }
            return Boolean(val);
        };

        const normalized = { ...job };
        normalized.enabled = normalizeBool(job.enabled, true);
        normalized.wait = normalizeBool(job.wait, true);
        return normalized;
    }

    function sanitizeAllJobs(jobsObj) {
        const newJobs = {};
        for (const [key, job] of Object.entries(jobsObj || {})) {
            newJobs[key] = sanitizeJob(job);
        }
        return newJobs;
    }

    function sanitizeDisplayOrder(orderArr, jobsObj) {
        const keys = new Set(Object.keys(jobsObj || {}));
        const result = [];
        (orderArr || []).forEach(k => { if (keys.has(k)) result.push(k); });
        // append missing keys at the end to keep stability
        for (const k of keys) {
            if (!result.includes(k)) result.push(k);
        }
        return result;
    }

    // 统一同步展示顺序到全局变量与配置
    function syncDisplayOrder() {
        CONFIG.displayOrder = sanitizeDisplayOrder(CONFIG.displayOrder, CONFIG.jobs);
        DISPLAY_ORDER = CONFIG.displayOrder;
        return DISPLAY_ORDER;
    }

    // 立即加载配置
    (function earlyLoadConfig() {
        try {
            if (typeof GM_getValue !== 'undefined') {
                const savedConfig = GM_getValue('jenkinsBuilderConfig');
                if (savedConfig) {
                    const parsedConfig = JSON.parse(savedConfig);
                    CONFIG = JSON.parse(JSON.stringify({ ...DEFAULT_CONFIG, ...parsedConfig }));
            CONFIG.jobs = sanitizeAllJobs(CONFIG.jobs);
            CONFIG.displayOrder = sanitizeDisplayOrder(CONFIG.displayOrder, CONFIG.jobs);
            TRIGGER_MAX_RETRIES = CONFIG.triggerMaxRetries;
            TRIGGER_RETRY_DELAY = CONFIG.triggerRetryDelay;
            JOB_DEFINITIONS = CONFIG.jobs;
            DISPLAY_ORDER = CONFIG.displayOrder;
                    console.log('配置预加载成功:', CONFIG);
                }
            }
        } catch (error) {
            console.error('配置预加载失败,使用默认配置:', error);
        }
    })();

    /**
     * 🆕 动态构建流水线步骤 (从Job配置中生成)
     * @returns {Array} 流水线步骤数组
     */
    function getOrderedJobEntries() {
        const jobs = sanitizeAllJobs(JOB_DEFINITIONS);
        const order = sanitizeDisplayOrder(DISPLAY_ORDER, jobs);
        return order.map(key => [key, jobs[key]]).filter(([, job]) => job);
    }

    function moveDisplayOrder(key, direction) {
        const idx = DISPLAY_ORDER.indexOf(key);
        if (idx === -1) return;
        const swapIdx = idx + direction;
        if (swapIdx < 0 || swapIdx >= DISPLAY_ORDER.length) return;
        const newOrder = [...DISPLAY_ORDER];
        [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];
        DISPLAY_ORDER = newOrder;
        CONFIG.displayOrder = newOrder;
        renderJobList();
        renderOrderList();
    }

    async function copyTextToClipboard(text) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (_) { /* ignore and fallback */ }

        // fallback
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        } catch (_) {
            return false;
        }
    }

    function exportConfigToClipboard() {
        syncDisplayOrder();
        const payload = {
            triggerMaxRetries: CONFIG.triggerMaxRetries,
            triggerRetryDelay: CONFIG.triggerRetryDelay,
            displayOrder: CONFIG.displayOrder,
            jobs: CONFIG.jobs
        };
        const json = JSON.stringify(payload, null, 2);
        copyTextToClipboard(json).then((ok) => {
            if (ok) {
                alert('✅ 配置已导出到剪贴板！');
            } else {
                const manual = prompt('剪贴板不可用，请手动复制 JSON：', json);
                if (manual !== null) alert('请手动复制提示框中的 JSON。');
            }
        }).catch(() => {
            const manual = prompt('剪贴板不可用，请手动复制 JSON：', json);
            if (manual !== null) alert('请手动复制提示框中的 JSON。');
        });
    }

    async function importConfigFromClipboard() {
        try {
            let text = '';
            if (navigator.clipboard && navigator.clipboard.readText) {
                text = await navigator.clipboard.readText();
            } else {
                text = prompt('请输入配置 JSON：', '');
                if (text === null) return;
            }
            if (!text || !text.trim()) {
                alert('未获取到内容');
                return;
            }
            const parsed = JSON.parse(text);
            if (!parsed.jobs || typeof parsed.jobs !== 'object') {
                alert('JSON 无效：缺少 jobs 字段');
                return;
            }
            CONFIG.jobs = sanitizeAllJobs(parsed.jobs);
            CONFIG.displayOrder = sanitizeDisplayOrder(parsed.displayOrder || [], CONFIG.jobs);
            DISPLAY_ORDER = CONFIG.displayOrder;
            CONFIG.triggerMaxRetries = parsed.triggerMaxRetries || CONFIG.triggerMaxRetries;
            CONFIG.triggerRetryDelay = parsed.triggerRetryDelay || CONFIG.triggerRetryDelay;
            TRIGGER_MAX_RETRIES = CONFIG.triggerMaxRetries;
            TRIGGER_RETRY_DELAY = CONFIG.triggerRetryDelay;
            JOB_DEFINITIONS = CONFIG.jobs;
            syncDisplayOrder();
            renderJobList();
            rerenderImportList();
            renderOrderList();
            saveConfig();
            alert('✅ 配置已导入并保存！');
        } catch (err) {
            alert('导入失败：' + err.message);
            console.error('导入配置失败', err);
        }
    }

    function buildPipelineSteps() {
        // 使用“优先”(wait=true) 分两批执行，按展示顺序排列
        const priorityJobs = [];
        const normalJobs = [];

        for (const [key, job] of getOrderedJobEntries()) {
            if (!job.enabled) continue; // 跳过禁用的Job
            const jobEntry = {
                key,
                wait: job.wait !== undefined ? job.wait : true // wait 仍表示是否阻塞等待
            };
            if (job.wait !== false) {
                priorityJobs.push(jobEntry);
            } else {
                normalJobs.push(jobEntry);
            }
        }

        const pipelineSteps = [];
        if (priorityJobs.length) {
            pipelineSteps.push({ type: 'parallel-wait', jobs: priorityJobs });
        }
        if (normalJobs.length) {
            pipelineSteps.push({ type: 'parallel-wait', jobs: normalJobs });
        }

        console.log('动态生成的流水线步骤:', pipelineSteps);
        return pipelineSteps;
    }

    // =================================================================
    // 🆕 [新增] Job发现与导入功能
    // =================================================================

    /**
     * 从当前Jenkins页面提取所有可用的Job项目
     * @returns {Array} Job列表 [{key, name, url, buildUrl}]
     */
    function extractJobsFromPage() {
        const jobs = [];
        const baseUrl = window.location.origin;
        const folderPath = '/job/sz-newcis-dev';

        // 提取表格中所有的Job行
        const jobRows = document.querySelectorAll('#projectstatus tbody tr[id^="job_"]');

        jobRows.forEach(row => {
            const jobId = row.getAttribute('id');
            if (!jobId) return;

            // 提取job名称(从id中获取: job_sz-newcis-dev_xxx)
            const jobName = jobId.replace('job_', '');

            // 提取显示名称
            const nameLink = row.querySelector('td a.jenkins-table__link.model-link');
            const displayName = nameLink ? nameLink.textContent.trim().replace(/\n/g, '').replace(/\s+/g, ' ') : jobName;

            // 生成key (简化的job标识)
            let key = jobName.replace('sz-newcis-dev_cis-', '');
            // 去掉 -service 后缀（如果有）
            key = key.replace('-service', '');

            // 生成构建URL
            const buildUrl = `${baseUrl}${folderPath}/job/${jobName}/build?delay=0sec`;

            // 检查Job状态图标(判断是否可用)
            const statusIcon = row.querySelector('.build-status-icon__wrapper');
            const isAvailable = statusIcon !== null;

            jobs.push({
                key: key,
                name: displayName,
                jobName: jobName,
                url: buildUrl,
                available: isAvailable
            });
        });

        console.log(`从页面提取到 ${jobs.length} 个Job项目:`, jobs);
        return jobs;
    }

    // =================================================================
    // 🔚 [新增功能结束]
    // =================================================================

    // --- 全局 UI 元素和状态标志 ---
    let panelTitle, progressBar, progressContainer, stepContainer;
    let combinedButton, cancelButton;
    let isBuildCancelled = false;
    const PANEL_TITLE_DEFAULT = '🚀 联合构建 (v8.0)';

    class BuildChainError extends Error {
        constructor(message) {
            super(message);
            this.name = 'BuildChainError';
        }
    }

    // --- 配置管理函数 ---

    function saveConfig() {
        try {
            if (typeof GM_setValue !== 'undefined') {
                const configString = JSON.stringify(CONFIG);
                GM_setValue('jenkinsBuilderConfig', configString);

                const verification = GM_getValue('jenkinsBuilderConfig');
                if (verification !== configString) {
                    throw new Error('配置验证失败：保存的数据与预期不符');
                }

                TRIGGER_MAX_RETRIES = CONFIG.triggerMaxRetries;
                TRIGGER_RETRY_DELAY = CONFIG.triggerRetryDelay;
                CONFIG.jobs = sanitizeAllJobs(CONFIG.jobs);
                CONFIG.displayOrder = sanitizeDisplayOrder(CONFIG.displayOrder, CONFIG.jobs);
                JOB_DEFINITIONS = CONFIG.jobs;
                DISPLAY_ORDER = CONFIG.displayOrder;
                console.log('配置保存并验证成功:', CONFIG);
                return true;
            } else {
                throw new Error('GM_setValue 不可用');
            }
        } catch (error) {
            console.error('保存配置失败:', error);
            return false;
        }
    }

    function resetConfig() {
        CONFIG = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        return saveConfig();
    }

    // --- 配置 UI 函数 ---

    function createConfigUI() {
        const overlay = document.createElement('div');
        overlay.id = 'gm-config-overlay';
        overlay.innerHTML = `
            <div id="gm-config-modal">
                <div id="gm-config-header">
                    <h2>⚙️ Jenkins 构建配置</h2>
                    <button id="gm-config-close">&times;</button>
                </div>
                <div id="gm-config-body">
                    <!-- 标签导航 -->
                    <div class="gm-settings-nav">
                        <div class="gm-settings-nav-item active" data-tab="basic">基础配置</div>
                        <div class="gm-settings-nav-item" data-tab="jobs">Job配置</div>
                        <div class="gm-settings-nav-item" data-tab="order">展示顺序</div>
                        <div class="gm-settings-nav-item" data-tab="import">导入管理</div>
                    </div>

                    <!-- 标签内容 -->
                    <div class="gm-settings-content">
                        <!-- 基础配置标签 -->
                        <div class="gm-settings-content-tab active" data-tab-content="basic">
                            <div class="gm-config-section">
                                <div class="gm-config-field">
                                    <label>最大重试次数</label>
                                    <input type="number" id="gm-cfg-maxRetries" min="1" max="10" />
                                </div>
                                <div class="gm-config-field">
                                    <label>重试延迟 (毫秒)</label>
                                    <input type="number" id="gm-cfg-retryDelay" min="1000" max="10000" step="1000" />
                                </div>
                            </div>
                        </div>

                        <!-- Job配置标签 -->
                        <div class="gm-settings-content-tab" data-tab-content="jobs">
                            <div class="gm-config-section">
                                <div id="gm-job-list"></div>
                            </div>
                        </div>

                        <!-- 展示顺序标签 -->
                        <div class="gm-settings-content-tab" data-tab-content="order">
                            <div class="gm-config-section">
                                <div style="margin-bottom: 8px;">
                                    <strong>排序启用的服务 (用于展示):</strong>
                                    <span id="gm-order-count" style="color:#17a2b8;"></span>
                                </div>
                                <div id="gm-order-list" class="gm-order-list" style="max-height: 400px; overflow-y: auto;"></div>
                                <div class="gm-order-hint">仅显示已启用的 Job，可上下调整展示顺序。</div>
                            </div>
                        </div>

                        <!-- 导入管理标签 -->
                        <div class="gm-settings-content-tab" data-tab-content="import">
                            <div class="gm-config-section">
                                <div style="margin-bottom: 15px;">
                                    <button id="gm-import-scan" class="gm-action-btn gm-btn-scan">
                                        🔍 扫描页面Job
                                    </button>
                                    <label class="gm-import-toggle">
                                        <input type="checkbox" id="gm-import-show-existing" />
                                        显示已在配置的 Job
                                    </label>
                                </div>
                                <div style="margin-bottom: 12px;">
                                    <button id="gm-import-export" class="gm-action-btn gm-btn-export">
                                        ⬆️ 导出配置(JSON)
                                    </button>
                                    <button id="gm-import-import" class="gm-action-btn gm-btn-import">
                                        ⬇️ 导入配置(JSON)
                                    </button>
                                </div>
                                <div id="gm-import-list" style="display: none;">
                                    <div style="margin-bottom: 10px;">
                                        <strong>可用的Job项目:</strong>
                                        <span id="gm-import-count" style="color: #007bff;"></span>
                                    </div>
                                    <div id="gm-import-items" style="max-height: 550px; overflow-y: auto;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="gm-config-footer">
                    <button id="gm-config-reset">恢复默认</button>
                    <button id="gm-config-cancel">取消</button>
                    <button id="gm-config-save">保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // 绑定事件
        document.getElementById('gm-config-close').onclick = closeConfig;
        document.getElementById('gm-config-cancel').onclick = closeConfig;
        document.getElementById('gm-config-save').onclick = saveConfigFromUI;
        document.getElementById('gm-config-reset').onclick = resetConfigUI;

        // 🆕 导入功能事件
        document.getElementById('gm-import-scan').onclick = scanAndShowJobs;
        document.getElementById('gm-import-show-existing').onchange = rerenderImportList;
        document.getElementById('gm-import-export').onclick = exportConfigToClipboard;
        document.getElementById('gm-import-import').onclick = importConfigFromClipboard;

        // 🆕 标签切换事件
        const navItems = document.querySelectorAll('.gm-settings-nav-item');
        const contentTabs = document.querySelectorAll('.gm-settings-content-tab');

        navItems.forEach(navItem => {
            navItem.onclick = () => {
                const targetTab = navItem.getAttribute('data-tab');

                // 切换导航激活状态
                navItems.forEach(item => item.classList.remove('active'));
                navItem.classList.add('active');

                // 切换内容显示
                contentTabs.forEach(tab => {
                    if (tab.getAttribute('data-tab-content') === targetTab) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });

                // 进入导入管理时自动扫描一次
                if (targetTab === 'import') {
                    if (LAST_SCANNED_JOBS.length === 0) {
                        scanAndShowJobs();
                    } else {
                        rerenderImportList();
                    }
                }
            };
        });

        overlay.onclick = (e) => {
            if (e.target === overlay) closeConfig();
        };

        // 绑定排序按钮事件（事件委托）
        document.addEventListener('click', (e) => {
            const upBtn = e.target.closest('.gm-order-up');
            const downBtn = e.target.closest('.gm-order-down');
            if (upBtn) {
                moveDisplayOrder(upBtn.getAttribute('data-key'), -1);
            } else if (downBtn) {
                moveDisplayOrder(downBtn.getAttribute('data-key'), 1);
            }
        });
    }

    /**
     * 🆕 扫描页面并显示可导入的Job
     */
    function scanAndShowJobs() {
        const jobs = extractJobsFromPage();
        const importList = document.getElementById('gm-import-list');
        if (jobs.length === 0) {
            alert('未在页面中找到可用的Job项目！');
            return;
        }
        LAST_SCANNED_JOBS = jobs;
        importList.style.display = 'block';
        rerenderImportList();
    }

    /**
     * 🆕 根据选择框过滤并渲染导入列表
     */
    function rerenderImportList() {
        const importItems = document.getElementById('gm-import-items');
        const importCount = document.getElementById('gm-import-count');
        const showExisting = document.getElementById('gm-import-show-existing').checked;

        if (!importItems || !importCount || LAST_SCANNED_JOBS.length === 0) return;

        const filtered = LAST_SCANNED_JOBS.filter(job => {
            const isExisting = CONFIG.jobs[job.key] !== undefined;
            return showExisting ? true : !isExisting;
        });

        importCount.textContent = `(共 ${filtered.length} 个${showExisting ? '' : '，已过滤已配置'} )`;
        importItems.innerHTML = '';

        if (filtered.length === 0) {
            importItems.innerHTML = '<div class="gm-empty-tip">没有符合条件的 Job。</div>';
            return;
        }

        filtered.forEach(job => {
            const isExisting = CONFIG.jobs[job.key] !== undefined;
            const item = document.createElement('div');
            item.className = 'gm-import-item';
            item.innerHTML = `
                <div class="gm-import-item-row">
                    <div class="gm-import-item-left">
                        <span class="gm-import-item-name">${job.name}</span>
                        ${job.available ?
                            '<span class="gm-badge gm-badge-success">✓ 可用</span>' :
                            '<span class="gm-badge gm-badge-warning">⚠ 状态未知</span>'
                        }
                        ${isExisting ? '<span class="gm-badge gm-badge-muted">已在配置</span>' : ''}
                    </div>
                    <div class="gm-import-item-right">
                        ${isExisting ? `
                            <button class="gm-btn-added" disabled>已在配置</button>
                        ` : `
                            <button class="gm-btn-add" data-job-key="${job.key}">
                                ➕ 添加到配置
                            </button>
                        `}
                    </div>
                </div>
                <div class="gm-import-item-info">
                    <small>Key: ${job.key} | Job: ${job.jobName}</small>
                </div>
            `;
            importItems.appendChild(item);

            const addBtn = item.querySelector('.gm-btn-add');
            if (addBtn) {
                addBtn.onclick = () => addJobToConfig(job, addBtn);
            }
        });
    }

    /**
     * 🆕 添加Job到配置
     */
    function addJobToConfig(job, button) {
        if (CONFIG.jobs[job.key]) {
            alert('该Job已存在于配置中！');
            return;
        }

        CONFIG.jobs[job.key] = {
            name: job.name,
            url: job.url,
            enabled: false, // 导入时默认不启用，避免误触发
            wait: true
        };
        syncDisplayOrder();

        // 更新按钮状态
        button.textContent = '✓ 已添加';
        button.className = 'gm-btn-added';
        button.disabled = true;

        // 刷新Job配置列表
        renderJobList();
        rerenderImportList();
        renderOrderList();

        console.log(`添加Job: ${job.name} (${job.key})`);
    }

    // 已添加列表标签被移除，若未来需要，可基于 getOrderedJobEntries 构建

    /**
     * 渲染Job配置列表
     */
    function renderJobList() {
        const jobList = document.getElementById('gm-job-list');
        if (!jobList) return;

        jobList.innerHTML = '';
        for (const [key, job] of getOrderedJobEntries()) {
            const jobItem = document.createElement('div');
            jobItem.className = 'gm-job-item';
            jobItem.innerHTML = `
                <div class="gm-job-header">
                    <strong class="gm-job-name-display" data-job-key="${key}" title="双击编辑名称">${job.name}</strong>
                    <div class="gm-job-switches">
                        <label class="checkbox-label">
                            <input type="checkbox" data-job-key="${key}" class="gm-job-wait" ${job.wait !== false ? 'checked' : ''} />
                            优先
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" data-job-key="${key}" class="gm-job-enabled" ${job.enabled ? 'checked' : ''} />
                            启用
                        </label>
                        <button class="gm-btn-remove gm-btn-remove-inline" data-job-key="${key}">🗑️</button>
                    </div>
                </div>
                <div class="gm-config-field">
                    <label>构建 URL</label>
                    <input type="text" data-job-key="${key}" class="gm-job-url" value="${job.url}" />
                </div>
            `;
            jobList.appendChild(jobItem);

            // 绑定删除按钮（放在启用右侧）
            const removeBtn = jobItem.querySelector('.gm-btn-remove-inline');
            let confirmTimer = null;
            removeBtn.onclick = () => {
                const isConfirm = removeBtn.getAttribute('data-confirm') === 'true';
                if (!isConfirm) {
                    removeBtn.setAttribute('data-confirm', 'true');
                    removeBtn.classList.add('gm-btn-remove-confirm');
                    removeBtn.textContent = '确认删除';
                    if (confirmTimer) clearTimeout(confirmTimer);
                    confirmTimer = setTimeout(() => {
                        removeBtn.setAttribute('data-confirm', 'false');
                        removeBtn.classList.remove('gm-btn-remove-confirm');
                        removeBtn.textContent = '🗑️';
                    }, 2000);
                    return;
                }
                if (confirmTimer) clearTimeout(confirmTimer);
                removeBtn.setAttribute('data-confirm', 'false');
                removeBtn.classList.remove('gm-btn-remove-confirm');
                removeBtn.textContent = '🗑️';
                removeJobFromConfig(key);
            };

            // 名称双击编辑
            const nameEl = jobItem.querySelector('.gm-job-name-display');
            nameEl.ondblclick = () => {
                const current = CONFIG.jobs[key]?.name || '';
                const newName = prompt('编辑名称', current);
                if (newName === null) return;
                const trimmed = newName.trim();
                if (!trimmed) {
                    alert('名称不能为空');
                    return;
                }
                CONFIG.jobs[key].name = trimmed;
                nameEl.textContent = trimmed;
                renderOrderList();
            };
        }

        renderOrderList();
    }

    /**
     * 🆕 展示顺序列表（仅显示已启用的Job，可上下调整）
     */
    function renderOrderList() {
        const listEl = document.getElementById('gm-order-list');
        const countEl = document.getElementById('gm-order-count');
        if (!listEl || !countEl) return;

        const entries = getOrderedJobEntries().filter(([, job]) => job.enabled);
        countEl.textContent = `(共 ${entries.length} 个启用项)`;

        if (entries.length === 0) {
            listEl.innerHTML = '<div class="gm-empty-tip">当前没有启用的 Job。</div>';
            return;
        }

        listEl.innerHTML = '';
        entries.forEach(([key, job], idx) => {
            const item = document.createElement('div');
            item.className = 'gm-order-item';
            item.innerHTML = `
                <div class="gm-order-name">${job.name}</div>
                <div class="gm-order-btns">
                    <button class="gm-order-up" data-key="${key}" ${idx === 0 ? 'disabled' : ''}>↑ 上移</button>
                    <button class="gm-order-down" data-key="${key}" ${idx === entries.length - 1 ? 'disabled' : ''}>↓ 下移</button>
                </div>
            `;
            listEl.appendChild(item);
        });
    }

    /**
     * 🆕 从配置中删除Job
     */
    function removeJobFromConfig(key) {
        if (!CONFIG.jobs[key]) return;

        const jobName = CONFIG.jobs[key].name;
        if (confirm(`确定要删除 "${jobName}" 吗？`)) {
            delete CONFIG.jobs[key];
            CONFIG.displayOrder = CONFIG.displayOrder.filter(k => k !== key);
            DISPLAY_ORDER = CONFIG.displayOrder;
            renderJobList();
            rerenderImportList();
            renderOrderList();
            console.log(`删除Job: ${jobName} (${key})`);
        }
    }

    function openConfig() {
        const overlay = document.getElementById('gm-config-overlay');
        const modal = document.getElementById('gm-config-modal');
        if (!overlay) return;

        // 保证顺序与配置最新
        syncDisplayOrder();

        // 加载当前配置到 UI
        document.getElementById('gm-cfg-maxRetries').value = CONFIG.triggerMaxRetries;
        document.getElementById('gm-cfg-retryDelay').value = CONFIG.triggerRetryDelay;

        // 渲染Job列表和排序
        renderJobList();
        renderOrderList();

        // 显示侧边栏（带动画效果）
        overlay.style.display = 'block';
        setTimeout(() => {
            overlay.classList.add('show');
            modal.classList.add('show');
        }, 10);
    }

    function closeConfig() {
        const overlay = document.getElementById('gm-config-overlay');
        const modal = document.getElementById('gm-config-modal');
        if (overlay) {
            // 移除show类触发滑出动画
            overlay.classList.remove('show');
            modal.classList.remove('show');
            // 等待动画完成后隐藏元素
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300); // 匹配CSS transition时长
        }
    }

    function saveConfigFromUI() {
        const maxRetries = parseInt(document.getElementById('gm-cfg-maxRetries').value);
        const retryDelay = parseInt(document.getElementById('gm-cfg-retryDelay').value);

        if (isNaN(maxRetries) || maxRetries < 1 || maxRetries > 10) {
            alert('❌ 验证失败：最大重试次数必须在 1-10 之间');
            return;
        }
        if (isNaN(retryDelay) || retryDelay < 1000 || retryDelay > 10000) {
            alert('❌ 验证失败：重试延迟必须在 1000-10000 毫秒之间');
            return;
        }

        CONFIG.triggerMaxRetries = maxRetries;
        CONFIG.triggerRetryDelay = retryDelay;

        const enabledInputs = document.querySelectorAll('.gm-job-enabled');
        const urlInputs = document.querySelectorAll('.gm-job-url');
        const waitInputs = document.querySelectorAll('.gm-job-wait');

        let hasError = false;

        enabledInputs.forEach(input => {
            const key = input.getAttribute('data-job-key');
            CONFIG.jobs[key].enabled = input.checked;
        });

        urlInputs.forEach(input => {
            const key = input.getAttribute('data-job-key');
            const url = input.value.trim();
            if (!url) {
                alert(`❌ 验证失败：Job "${key}" 的 URL 不能为空`);
                hasError = true;
                return;
            }
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                alert(`❌ 验证失败：Job "${key}" 的 URL 必须以 http:// 或 https:// 开头`);
                hasError = true;
                return;
            }
            CONFIG.jobs[key].url = url;
        });

        if (hasError) return;

        waitInputs.forEach(input => {
            const key = input.getAttribute('data-job-key');
            CONFIG.jobs[key].wait = input.checked;
        });

        // 名称校验（双击编辑后写入 CONFIG）
        for (const [key, job] of Object.entries(CONFIG.jobs)) {
            const name = (job.name || '').trim();
            if (!name) {
                alert(`❌ 验证失败：Job "${key}" 的名称不能为空`);
                hasError = true;
                break;
            }
            job.name = name;
        }

        if (hasError) return;

        // 保存前统一规范化，避免布尔字段串型导致显示错误
        CONFIG.jobs = sanitizeAllJobs(CONFIG.jobs);
        syncDisplayOrder();
        renderOrderList();

        if (saveConfig()) {
            alert('✅ 配置保存成功！');
            closeConfig();
        } else {
            alert('❌ 配置保存失败，请检查控制台日志。');
        }
    }

    function resetConfigUI() {
        if (confirm('确定要恢复默认配置吗？')) {
            if (resetConfig()) {
                alert('已恢复默认配置！');
                openConfig();
            } else {
                alert('恢复默认配置失败，请检查控制台日志。');
            }
        }
    }

    function registerConfigMenu() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('⚙️ Jenkins 构建配置', openConfig);
        }
    }

    // --- 辅助函数 ---

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gm-progress-bar-stripes {
                from { background-position: 40px 0; }
                to { background-position: 0 0; }
            }
            #gm-build-panel { margin-top: 1em; }
            #gm-build-panel-title {
                display: block; font-size: 1.17em; font-weight: bold;
                color: #000; margin-bottom: 0.5em; padding-left: 5px;
            }
            #gm-build-panel .gm-button {
                width: 100%; box-sizing: border-box; padding: 8px 12px;
                font-size: 13px; border: none; border-radius: 4px;
                cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            #gm-build-panel .gm-button:disabled { background-color: #aaa; cursor: not-allowed; }
            #gm-build-panel #gm-start-btn { background-color: #f0ad4e; color: white; }
            #gm-build-panel #gm-start-btn:hover:not(:disabled) { background-color: #ec971f; }
            #gm-build-panel #gm-cancel-btn { background-color: #d9534f; color: white; }
            #gm-build-panel #gm-cancel-btn:hover:not(:disabled) { background-color: #c9302c; }
            #gm-step-container {
                width: 100%; background: #fff; border: 1px solid #ccc;
                border-radius: 4px; margin-top: 8px; max-height: 250px;
                overflow-y: auto; font-size: 12px; box-sizing: border-box;
                display: none;
            }
            .gm-step-strong {
                min-width: 90px; display: inline-block; margin-right: 5px;
            }
            .gm-step-status { color: #555; }

            /* 配置面板样式 - 右侧滑出侧边栏 */
            #gm-config-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); z-index: 10000; display: none;
                opacity: 0; transition: opacity .3s linear;
            }
            #gm-config-overlay.show {
                opacity: 1;
            }
            #gm-config-modal {
                position: fixed; top: 0; right: 0;
                width: 100%; max-width: 480px; height: 100vh;
                background: white; box-shadow: -2px 0 8px rgba(0,0,0,0.15);
                transform: translateX(100%);
                transition: transform .3s linear;
                display: flex; flex-direction: column;
                overflow: hidden;
            }
            #gm-config-modal.show {
                transform: translateX(0);
            }
            #gm-config-header {
                background: #f8f9fa; padding: 15px 20px; border-bottom: 1px solid #dee2e6;
                display: flex; justify-content: space-between; align-items: center;
                flex-shrink: 0;
            }
            #gm-config-header h2 { margin: 0; font-size: 18px; }
            #gm-config-close {
                background: none; border: none; font-size: 24px;
                cursor: pointer; color: #6c757d; padding: 0; width: 30px; height: 30px;
            }
            #gm-config-close:hover { color: #000; }
            #gm-config-body {
                padding: 20px;
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
            }
            .gm-config-section { margin-bottom: 25px; }
            .gm-config-section h3 {
                font-size: 16px; margin: 0 0 15px 0; color: #495057;
                border-bottom: 2px solid #007bff; padding-bottom: 5px;
            }
            .gm-config-field { margin-bottom: 15px; }
            .gm-config-field label {
                display: block; margin-bottom: 5px; font-weight: 500;
                font-size: 13px; color: #495057;
            }
            .gm-config-field input[type="text"],
            .gm-config-field input[type="number"] {
                width: 100%; padding: 8px 12px; border: 1px solid #ced4da;
                border-radius: 4px; font-size: 13px; box-sizing: border-box;
            }
            .gm-config-field input[type="checkbox"] {
                width: 18px; height: 18px; cursor: pointer; margin-right: 8px;
                vertical-align: middle;
            }
            .gm-config-field .checkbox-label {
                display: inline; font-weight: normal; cursor: pointer;
                vertical-align: middle;
            }
            .gm-job-item {
                background: #f8f9fa; padding: 15px; border-radius: 4px;
                margin-bottom: 10px; border: 1px solid #dee2e6;
            }
            .gm-job-header {
                display: flex; justify-content: space-between; align-items: center; gap: 10px;
                margin-bottom: 10px;
            }
            .gm-job-header strong { font-size: 14px; }
            .gm-job-switches {
                display: flex; align-items: center; gap: 10px;
            }
            .gm-job-name-display { cursor: pointer; user-select: none; }
            .gm-btn-remove {
                padding: 5px 12px; background: #6c757d; color: white;
                border: none; border-radius: 4px; cursor: pointer; font-size: 12px;
                transition: background .2s ease;
            }
            .gm-btn-remove:hover { background: #5a6268; }
            .gm-btn-remove-inline {
                padding: 4px 10px;
                margin-left: 4px;
            }
            .gm-btn-remove-confirm {
                background: #dc3545 !important;
            }

            /* 🆕 导入功能样式 */
            .gm-action-btn {
                padding: 8px 16px; border: none; border-radius: 4px;
                cursor: pointer; font-size: 13px; margin-right: 10px;
                font-weight: 500;
            }
            .gm-import-toggle {
                margin-left: 6px; font-size: 12px; color: #555;
                user-select: none; cursor: pointer;
            }
            .gm-import-toggle input {
                vertical-align: middle; margin-right: 4px;
            }
            .gm-btn-scan {
                background: #17a2b8; color: white;
            }
            .gm-btn-scan:hover { background: #138496; }
            .gm-btn-validate {
                background: #28a745; color: white;
            }
            .gm-btn-validate:hover { background: #218838; }
            .gm-btn-export {
                background: #6f42c1; color: white;
            }
            .gm-btn-export:hover { background: #5a379e; }
            .gm-btn-import {
                background: #20c997; color: white;
            }
            .gm-btn-import:hover { background: #17a589; }
            .gm-import-item {
                background: white; padding: 12px; border-radius: 4px;
                margin-bottom: 8px; border: 1px solid #dee2e6;
            }
            .gm-import-item-row {
                display: flex; align-items: center; gap: 10px;
            }
            .gm-import-item-left {
                display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
            }
            .gm-import-item-right { margin-left: auto; }
            .gm-import-item-header {
                display: flex; align-items: center; gap: 8px;
                margin-bottom: 5px;
            }
            .gm-import-item-name {
                font-weight: 500; font-size: 13px;
            }
            .gm-badge {
                padding: 2px 8px; border-radius: 3px; font-size: 11px;
                font-weight: 500;
            }
            .gm-badge-success {
                background: #d4edda; color: #155724;
            }
            .gm-badge-warning {
                background: #fff3cd; color: #856404;
            }
            .gm-badge-info {
                background: #d1ecf1; color: #0c5460;
            }
            .gm-import-item-info {
                margin-bottom: 8px;
            }
            .gm-import-item-info small {
                color: #6c757d; font-size: 11px;
            }
            .gm-import-item-actions {
                text-align: right;
            }
            .gm-btn-add {
                padding: 5px 12px; background: #007bff; color: white;
                border: none; border-radius: 4px; cursor: pointer; font-size: 12px;
            }
            .gm-btn-add:hover { background: #0056b3; }
            .gm-btn-added {
                padding: 5px 12px; background: #6c757d; color: white;
                border: none; border-radius: 4px; cursor: not-allowed; font-size: 12px;
            }
            .gm-order-list .gm-order-item {
                display: flex; align-items: center; gap: 10px;
                padding: 10px 12px; border: 1px solid #dee2e6;
                border-radius: 4px; background: #fff; margin-bottom: 8px;
            }
            .gm-order-name { flex: 1; font-weight: 500; }
            .gm-order-btns button {
                padding: 4px 10px; border: 1px solid #ced4da;
                background: #f8f9fa; cursor: pointer; border-radius: 4px;
                margin-left: 4px; font-size: 12px;
            }
            .gm-order-btns button:hover { background: #e2e6ea; }
            .gm-order-hint { color: #6c757d; font-size: 12px; margin-top: 6px; }

            /* 🆕 标签导航样式 */
            .gm-settings-nav {
                display: flex;
                border-bottom: 1px solid #eee;
                margin-bottom: 20px;
                padding-bottom: 2px;
            }
            .gm-settings-nav-item {
                padding: 10px 15px;
                cursor: pointer;
                font-size: 14px;
                color: #666;
                position: relative;
                transition: all .3s;
            }
            .gm-settings-nav-item:hover {
                color: #1a73e8;
            }
            .gm-settings-nav-item.active {
                color: #1a73e8;
                font-weight: 500;
            }
            .gm-settings-nav-item.active:after {
                content: "";
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 2px;
                background-color: #1a73e8;
                border-radius: 2px;
            }
            .gm-settings-content-tab {
                display: none;
            }
            .gm-settings-content-tab.active {
                display: block;
            }

            #gm-config-footer {
                background: #f8f9fa; padding: 15px 20px; border-top: 1px solid #dee2e6;
                display: flex; justify-content: flex-end; gap: 10px;
                flex-shrink: 0;
            }
            #gm-config-footer button {
                padding: 8px 20px; border: none; border-radius: 4px;
                cursor: pointer; font-size: 13px; font-weight: 500;
            }
            #gm-config-save {
                background: #28a745; color: white;
            }
            #gm-config-save:hover { background: #218838; }
            #gm-config-reset {
                background: #ffc107; color: #212529;
            }
            #gm-config-reset:hover { background: #e0a800; }
            #gm-config-cancel {
                background: #6c757d; color: white;
            }
            #gm-config-cancel:hover { background: #5a6268; }
        `;
        document.head.appendChild(style);
    }

    function getMyJenkinsCrumb() {
        const crumbInput = document.querySelector('input[name="Jenkins-Crumb"]');
        if (crumbInput) {
            return crumbInput.value;
        }
        console.error("未能找到 Jenkins Crumb input 元素。");
        return null;
    }

    // --- UI 更新函数 ---

    function updateStatus(message, isError = false) {
        if (!panelTitle) return;
        console.log(message);
        panelTitle.innerText = message;
        panelTitle.style.color = isError ? 'red' : 'black';
    }

    function updateStepStatus(jobKey, message, icon, color = 'info') {
        const el = document.getElementById(`gm-step-${jobKey}`);
        if (!el) return;
        const iconEl = el.querySelector('.gm-step-icon');
        const statusEl = el.querySelector('.gm-step-status');
        if (icon) iconEl.innerText = icon;
        if (message) statusEl.innerText = message;
        switch (color) {
            case 'success': el.style.backgroundColor = '#dff0d8'; break;
            case 'warning': el.style.backgroundColor = '#fcf8e3'; break;
            case 'error': el.style.backgroundColor = '#f2dede'; break;
            case 'skipped': el.style.backgroundColor = '#f5f5f5'; break;
            case 'info': default: el.style.backgroundColor = '#fff'; break;
        }
    }

    function populateStepUI() {
        if (!stepContainer) return;
        stepContainer.innerHTML = '';
        stepContainer.style.display = 'block';
        for (const [key, jobData] of getOrderedJobEntries()) {
            const el = document.createElement('div');
            el.id = `gm-step-${key}`;
            el.style = 'padding: 5px 8px; border-bottom: 1px solid #eee;';
            el.innerHTML = `
                <span class="gm-step-icon">⚪</span>
                <strong class="gm-step-strong">${jobData.name}</strong>
                <span class="gm-step-status">未开始</span>
            `;
            stepContainer.appendChild(el);
        }
    }

    function skipPendingSteps() {
        for (const key of Object.keys(JOB_DEFINITIONS)) {
            const el = document.getElementById(`gm-step-${key}`);
            if (el && el.querySelector('.gm-step-status').innerText === '未开始') {
                updateStepStatus(key, '已跳过', '⏩', 'skipped');
            }
        }
    }

    function setProgressActive(show, text) {
        if (progressContainer) {
            progressContainer.style.display = show ? 'block' : 'none';
        }
        if (show && text) {
            updateStatus(text);
        }
    }

    function setBuildInProgressUI(inProgress) {
        if (!combinedButton || !cancelButton || !stepContainer) return;
        if (inProgress) {
            combinedButton.disabled = true;
            combinedButton.innerText = '▶ 正在构建...';
            combinedButton.style.display = 'none';
            cancelButton.style.display = 'block';
            populateStepUI();
        } else {
            combinedButton.disabled = false;
            combinedButton.innerText = '▶ 启动联合构建';
            combinedButton.style.display = 'block';
            cancelButton.style.display = 'none';
            setProgressActive(false);
        }
    }

    // --- Jenkins API 核心函数 ---

    /**
     * 🆕 触发单个构建
     */
    async function triggerSingleBuild(jobKey, crumb) {
        const jobData = JOB_DEFINITIONS[jobKey];
        if (!jobData) throw new BuildChainError(`Job key "${jobKey}" 未在 JOB_DEFINITIONS 中定义。`);

        updateStepStatus(jobKey, '正在请求...', '⏳', 'warning');

        for (let attempt = 0; attempt < TRIGGER_MAX_RETRIES; attempt++) {
            if (isBuildCancelled) throw new BuildChainError('构建已取消');
            try {
                const response = await fetch(jobData.url, {
                    method: 'POST',
                    headers: { 'Jenkins-Crumb': crumb },
                    body: null
                });

                if (response.status === 201) {
                    const queueUrl = response.headers.get('Location');
                    if (!queueUrl) {
                        updateStepStatus(jobKey, '触发成功，但未找到 Queue URL！', '❌', 'error');
                        throw new BuildChainError(`[${jobData.name}] 未找到 Queue URL`);
                    }
                    let successMsg = '已进入队列';
                    if (attempt > 0) successMsg = `重试成功 (第 ${attempt + 1} 次)，已入队`;
                    updateStepStatus(jobKey, successMsg, '⏳', 'warning');
                    return queueUrl;
                }

                if (response.status >= 400 && response.status < 500) {
                    updateStepStatus(jobKey, `请求失败 (状态: ${response.status})`, '❌', 'error');
                    throw new BuildChainError(`[${jobData.name}] 构建请求失败 (状态: ${response.status})`);
                }

                throw new Error(`服务器状态: ${response.status}`);

            } catch (error) {
                console.warn(`[${jobData.name}] 触发失败 (第 ${attempt + 1} 次): ${error.message}`);
                if (attempt < TRIGGER_MAX_RETRIES - 1) {
                    const retryMsg = `触发失败 (第 ${attempt + 1} 次)，${TRIGGER_RETRY_DELAY / 1000}s 后重试...`;
                    updateStepStatus(jobKey, retryMsg, '⏳', 'warning');
                    await sleep(TRIGGER_RETRY_DELAY);
                } else {
                    updateStepStatus(jobKey, `请求失败: ${error.message}`, '❌', 'error');
                    throw new BuildChainError(`[${jobData.name}] 触发失败`);
                }
            }
        }
        throw new BuildChainError(`[${jobData.name}] 未知的触发错误`);
    }

    async function getBuildNumberFromQueue(jobKey, queueUrl, crumb) {
        const jobData = JOB_DEFINITIONS[jobKey];
        if (!queueUrl) throw new BuildChainError(`[${jobData.name}] 队列 URL 为空`);
        updateStepStatus(jobKey, '等待构建编号...', '⏳', 'warning');
        const pollInterval = 2000;
        let attempts = 0;
        const maxAttempts = 30;
        while (attempts < maxAttempts) {
            if (isBuildCancelled) throw new BuildChainError('构建已取消');
            try {
                const response = await fetch(`${queueUrl}api/json`, { headers: { 'Jenkins-Crumb': crumb } });
                if (!response.ok) throw new Error(`Queue API 状态: ${response.status}`);
                const data = await response.json();
                if (data.cancelled) {
                    updateStepStatus(jobKey, '任务被取消', '❌', 'error');
                    throw new BuildChainError(`[${jobData.name}] 队列任务被取消`);
                }
                if (data.executable) {
                    const buildNumber = data.executable.number;
                    const buildUrl = data.executable.url;
                    updateStepStatus(jobKey, `已获取: #${buildNumber}`, '⏳', 'warning');
                    return { number: buildNumber, url: buildUrl };
                }
                await sleep(pollInterval);
                attempts++;
            } catch (error) {
                updateStepStatus(jobKey, `轮询队列失败`, '❌', 'error');
                throw error;
            }
        }
        updateStepStatus(jobKey, `等待构建编号超时`, '❌', 'error');
        throw new BuildChainError(`[${jobData.name}] 等待构建编号超时`);
    }

    async function pollBuildStatus(jobKey, buildInfo, crumb) {
        const jobData = JOB_DEFINITIONS[jobKey];
        if (!buildInfo || !buildInfo.url) {
            updateStepStatus(jobKey, '缺少 Build 信息', '❌', 'error');
            throw new BuildChainError(`[${jobData.name}] 无法轮询`);
        }
        const buildUrl = buildInfo.url.endsWith('/') ? buildInfo.url : buildInfo.url + '/';
        const buildNumber = buildInfo.number;
        const pollInterval = 5000;
        let isBuilding = true;
        updateStepStatus(jobKey, `正在构建 #${buildNumber}`, '⏳', 'warning');
        setProgressActive(true, `正在构建 ${jobData.name} #${buildNumber}...`);
        while (isBuilding) {
            if (isBuildCancelled) throw new BuildChainError('构建已取消');
            await sleep(pollInterval);
            try {
                const response = await fetch(`${buildUrl}api/json`, { headers: { 'Jenkins-Crumb': crumb } });
                if (!response.ok) {
                    if (response.status === 404) continue;
                    throw new Error(`Build API 状态: ${response.status}`);
                }
                const data = await response.json();
                if (data.building === false) {
                    isBuilding = false;
                    const result = data.result;
                    if (result === 'SUCCESS') {
                        updateStepStatus(jobKey, `构建成功 (#${buildNumber})`, '✅', 'success');
                    } else {
                        updateStepStatus(jobKey, `构建 ${result} (#${buildNumber})`, '❌', 'error');
                        throw new BuildChainError(`[${jobData.name}] 构建失败`);
                    }
                    return result;
                }
            } catch (error) {
                updateStepStatus(jobKey, `轮询状态失败`, '❌', 'error');
                throw error;
            }
        }
    }

    /**
     * 启动联合构建链 (🆕 增强版 - 支持自动跳过不存在的Job)
     */
    async function startCombinedChain() {
        // 运行前统一清洗配置，确保 wait/enable 状态与 UI 一致
        CONFIG.jobs = sanitizeAllJobs(CONFIG.jobs);
        syncDisplayOrder();
        JOB_DEFINITIONS = CONFIG.jobs;

        isBuildCancelled = false;
        const crumb = getMyJenkinsCrumb();
        if (!crumb) {
            updateStatus("错误：无法获取 Crumb。", true);
            return;
        }

        setBuildInProgressUI(true);
        updateStatus('联合构建已启动...');

        const jobBuilds = {};
        let stepIndex = 0;

        try {
            for (const step of buildPipelineSteps()) {
                if (isBuildCancelled) throw new BuildChainError('构建已取消');
                stepIndex++;

                if (step.type === 'parallel-wait') {
                    updateStatus(`步骤 ${stepIndex}: 正在并行触发...`);

                    // 过滤掉被禁用的 jobs
                    const activeJobs = step.jobs.filter(job => {
                        const jobConfig = JOB_DEFINITIONS[job.key];
                        if (!jobConfig || !jobConfig.enabled) {
                            updateStepStatus(job.key, '已禁用 (跳过)', '⏭️', 'skipped');
                            console.log(`[${job.key}] 已被禁用，跳过构建`);
                            return false;
                        }
                        return true;
                    });

                    if (activeJobs.length === 0) {
                        updateStatus(`步骤 ${stepIndex}: 所有 Job 已禁用，跳过`);
                        continue;
                    }

                    // 🆕 并行触发，但捕获单个Job失败
                    const triggerResults = await Promise.allSettled(
                        activeJobs.map(job => triggerSingleBuild(job.key, crumb))
                    );

                    // 🆕 收集成功触发的Job
                    const successfulJobs = [];
                    const queueUrls = [];

                    for (let i = 0; i < activeJobs.length; i++) {
                        const job = activeJobs[i];
                        const result = triggerResults[i];

                        if (result.status === 'fulfilled') {
                            successfulJobs.push(job);
                            queueUrls.push(result.value);
                        } else {
                            // Job触发失败(可能不存在),已在triggerSingleBuild中标记
                            console.warn(`跳过失败的Job: ${job.key}`);
                        }
                    }

                    // 🆕 如果所有Job都失败,跳过此步骤
                    if (successfulJobs.length === 0) {
                        updateStatus(`步骤 ${stepIndex}: 所有 Job 触发失败或不存在，跳过`);
                        continue;
                    }

                    // 区分需要等待的 Job 和不需要等待的 Job
                    const buildInfoPromises = [];
                    for (let i = 0; i < successfulJobs.length; i++) {
                        const job = successfulJobs[i];
                        if (job.wait) {
                            buildInfoPromises.push(
                                getBuildNumberFromQueue(job.key, queueUrls[i], crumb)
                                    .then(buildInfo => {
                                        jobBuilds[job.key] = buildInfo;
                                        return buildInfo;
                                    })
                            );
                        } else {
                            updateStepStatus(job.key, '已触发 (不等待)', '▶️', 'success');
                        }
                    }

                    await Promise.all(buildInfoPromises);

                    // 并行轮询状态
                    const pollPromises = [];
                    for (const job of successfulJobs) {
                        if (job.wait) {
                            pollPromises.push(
                                pollBuildStatus(job.key, jobBuilds[job.key], crumb)
                            );
                        }
                    }
                    await Promise.all(pollPromises);

                    updateStatus(`步骤 ${stepIndex}: 本阶段构建完成！`);
                }

                else if (step.type === 'sequential-trigger') {
                    updateStatus(`步骤 ${stepIndex}: 正在串行触发...`);
                    for (const job of step.jobs) {
                        if (isBuildCancelled) throw new BuildChainError('构建已取消');

                        const jobConfig = JOB_DEFINITIONS[job.key];
                        if (!jobConfig || !jobConfig.enabled) {
                            updateStepStatus(job.key, '已禁用 (跳过)', '⏭️', 'skipped');
                            console.log(`[${job.key}] 已被禁用，跳过构建`);
                            continue;
                        }

                        // 🆕 尝试触发,如果失败则跳过
                        try {
                            await triggerSingleBuild(job.key, crumb);
                            updateStepStatus(job.key, '已触发', '▶️', 'success');
                        } catch (error) {
                            console.warn(`Job ${job.key} 触发失败，继续下一个`);
                            // 已在triggerSingleBuild中标记为skipped
                        }
                    }
                }
            }

            updateStatus('✅ 联合构建链全部完成！', false);
            setProgressActive(false);

        } catch (error) {
            setProgressActive(false);
            if (error instanceof BuildChainError) {
                updateStatus(`❌ 构建链中止: ${error.message}`, true);
            } else {
                updateStatus(`❌ 发生意外错误: ${error.message}`, true);
                console.error(error);
            }
            skipPendingSteps();

        } finally {
            setBuildInProgressUI(false);
            if (panelTitle.style.color !== 'red') {
                setTimeout(() => {
                    if (!isBuildCancelled && combinedButton.disabled === false) {
                        updateStatus(PANEL_TITLE_DEFAULT, false);
                    }
                }, 5000);
            }
        }
    }

    // --- UI 创建与初始化 ---

    function createUI() {
        const sidePanel = document.getElementById('side-panel');
        if (!sidePanel) return;

        addStyles();

        createConfigUI();
        registerConfigMenu();

        const mainPanel = document.createElement('div');
        mainPanel.id = 'gm-build-panel';
        mainPanel.className = 'task';

        panelTitle = document.createElement('div');
        panelTitle.id = 'gm-build-panel-title';
        panelTitle.innerText = PANEL_TITLE_DEFAULT;

        const controlsContainer = document.createElement('div');
        controlsContainer.style = 'padding: 0 5px;';

        combinedButton = document.createElement('button');
        combinedButton.id = 'gm-start-btn';
        combinedButton.className = 'gm-button';
        combinedButton.innerText = '▶ 启动联合构建';
        combinedButton.onclick = startCombinedChain;

        cancelButton = document.createElement('button');
        cancelButton.id = 'gm-cancel-btn';
        cancelButton.className = 'gm-button';
        cancelButton.innerText = '■ 取消';
        cancelButton.style.display = 'none';
        cancelButton.onclick = function() {
            isBuildCancelled = true;
            updateStatus('正在取消，请稍候...', true);
        };

        progressContainer = document.createElement('div');
        progressContainer.id = 'gm-progress-container';
        progressContainer.style = `
            width: 100%; height: 10px; background-color: #e9ecef;
            border: 1px solid #ced4da; border-radius: 4px;
            box-sizing: border-box; display: none; overflow: hidden;
            margin: 8px 0;
        `;
        progressBar = document.createElement('div');
        progressBar.id = 'gm-progress-bar';
        progressBar.style = `
            height: 100%; width: 100%; background-color: #007bff;
            border-radius: 2px;
            background-size: 40px 40px;
            background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
            animation: gm-progress-bar-stripes 1s linear infinite;
        `;
        progressContainer.appendChild(progressBar);

        stepContainer = document.createElement('div');
        stepContainer.id = 'gm-step-container';

        controlsContainer.appendChild(combinedButton);
        controlsContainer.appendChild(cancelButton);
        mainPanel.appendChild(panelTitle);
        mainPanel.appendChild(controlsContainer);
        mainPanel.appendChild(progressContainer);
        mainPanel.appendChild(stepContainer);
        sidePanel.appendChild(mainPanel);

        console.log('🎉 Jenkins 联合构建 (v8.0 - 导入增强版) 已加载。');
        console.log('📝 新功能: Job配置导入、存在性检测、自动跳过不存在项目');
    }

    if (document.body) createUI();
    else window.addEventListener('load', createUI);

})();
