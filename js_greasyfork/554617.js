// ==UserScript==
// @name         Gitee工时工具
// @namespace    https://tampermonkey.net/
// @version      10.12
// @description  支持自定义分割符号，提取所属项目、工作内容、业务负责人，并可选择是否保留原始工作内容
// @author       Your Name
// @include      https://e.gitee.com/*/working_hours*
// @grant        none
// @icon         https://gitee.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/554617/Gitee%E5%B7%A5%E6%97%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/554617/Gitee%E5%B7%A5%E6%97%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const UI_CONTAINER_ID = 'workload-export-container';
    let interceptedData = [];
    let exportContainer = null;
    let enterpriseId = null;
    let enterpriseName = ''; // 从basic_info提取的整体负责人
    let apiUrl = '';
    let startInput = null;
    let endInput = null;
    let delimiterInput = null; // 分割符号输入框
    let delimiter = '-'; // 默认分割符号
    let isLoading = false; // 查询状态标识
    let queryBtn = null; // 查询按钮引用
    let includeOriginalContent = true; // 是否包含原始工作内容列
    let projectList = []; // 项目名称列表
    let leaderList = []; // 负责人名称列表
    let sidePanel = null; // 右侧面板
    let sidePanelExpanded = true; // 右侧面板展开状态
    let templateList = []; // 工作内容模板列表
    let generationHistory = []; // 生成历史记录


    // ================ 1. 数据存储 ================
    function loadListsFromStorage() {
        try {
            const savedProjects = localStorage.getItem('gitee_project_list');
            const savedLeaders = localStorage.getItem('gitee_leader_list');
            const savedPanelState = localStorage.getItem('gitee_side_panel_expanded');
            const savedTemplates = localStorage.getItem('gitee_template_list');
            const savedHistory = localStorage.getItem('gitee_generation_history');

            projectList = savedProjects ? JSON.parse(savedProjects) : [];
            leaderList = savedLeaders ? JSON.parse(savedLeaders) : [];
            sidePanelExpanded = savedPanelState !== null ? JSON.parse(savedPanelState) : true;
            templateList = savedTemplates ? JSON.parse(savedTemplates) : getDefaultTemplates();
            generationHistory = savedHistory ? JSON.parse(savedHistory) : [];
        } catch (e) {
            console.error('加载列表数据失败:', e);
            projectList = [];
            leaderList = [];
            sidePanelExpanded = true;
            templateList = getDefaultTemplates();
            generationHistory = [];
        }
    }

    function saveListsToStorage() {
        try {
            localStorage.setItem('gitee_project_list', JSON.stringify(projectList));
            localStorage.setItem('gitee_leader_list', JSON.stringify(leaderList));
            localStorage.setItem('gitee_side_panel_expanded', JSON.stringify(sidePanelExpanded));
            localStorage.setItem('gitee_template_list', JSON.stringify(templateList));
            localStorage.setItem('gitee_generation_history', JSON.stringify(generationHistory));
        } catch (e) {
            console.error('保存列表数据失败:', e);
        }
    }

    function getDefaultTemplates() {
        return [
            // 开发类
            { category: '开发', template: '完成{模块}的{功能}功能开发' },
            { category: '开发', template: '实现{功能}接口及相关业务逻辑' },
            { category: '开发', template: '开发{模块}前端页面及交互功能' },
            { category: '开发', template: '完成{功能}模块的数据库设计和实现' },
            { category: '开发', template: '实现{模块}与{模块}的数据对接' },

            // Bug修复类
            { category: 'Bug修复', template: '修复{模块}{功能}异常问题' },
            { category: 'Bug修复', template: '解决{功能}在{场景}下的bug' },
            { category: 'Bug修复', template: '处理{模块}报错问题' },
            { category: 'Bug修复', template: '修复{功能}数据显示不正确的问题' },
            { category: 'Bug修复', template: '解决{模块}性能问题导致的卡顿' },

            // 测试类
            { category: '测试', template: '编写{模块}单元测试用例' },
            { category: '测试', template: '进行{功能}集成测试' },
            { category: '测试', template: '完成{模块}功能测试和bug修复' },
            { category: '测试', template: '执行{功能}回归测试' },

            // 文档类
            { category: '文档', template: '编写{模块}技术文档' },
            { category: '文档', template: '更新{功能}接口文档' },
            { category: '文档', template: '整理{模块}开发规范文档' },
            { category: '文档', template: '编写{功能}使用说明文档' },

            // 优化类
            { category: '优化', template: '优化{模块}性能，提升响应速度' },
            { category: '优化', template: '重构{模块}代码，提高可维护性' },
            { category: '优化', template: '优化{功能}的用户体验' },
            { category: '优化', template: '优化{模块}数据库查询效率' },

            // 会议类
            { category: '会议', template: '参加{功能}需求评审会议' },
            { category: '会议', template: '参与{模块}技术方案讨论' },
            { category: '会议', template: '参加项目周会和进度汇报' },
            { category: '会议', template: '参与{功能}问题分析会议' },

            // 代码审查类
            { category: '代码审查', template: '审查{模块}代码并提出优化建议' },
            { category: '代码审查', template: '进行{功能}代码review' },

            // 部署类
            { category: '部署', template: '完成{模块}测试环境部署' },
            { category: '部署', template: '协助{功能}生产环境上线' },

            // 学习类
            { category: '学习', template: '学习{技术}相关知识' },
            { category: '学习', template: '研究{功能}技术方案' }
        ];
    }


    // ================ 2. UI布局 ================
    function createUIContainer() {
        const existing = document.getElementById(UI_CONTAINER_ID);
        if (existing) existing.remove();

        exportContainer = document.createElement('div');
        exportContainer.id = UI_CONTAINER_ID;
        exportContainer.style.cssText = `
            position: fixed;
            top:45px;
            right: 7.5%;
            z-index: 9998;
            background: rgba(255,255,255,0.95);
            padding: 10px 15px;
            border-radius: 6px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-size: 12px;
            border: 1px solid #eee;
            width: 645px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;
        document.body.appendChild(exportContainer);

        // 第一行：标题、日期选择、查询、快捷按钮
        const firstRow = document.createElement('div');
        firstRow.style.cssText = 'display: flex; align-items: center; gap: 12px;';
        exportContainer.appendChild(firstRow);

        const title = document.createElement('div');
        title.id = 'ui-title';
        title.innerHTML = `工时工具 <span style="color:#f56c6c;">(加载中)</span>`;
        title.style.cssText = 'font-weight: 500; color: #409eff; white-space: nowrap;';
        firstRow.appendChild(title);

        const dateContainer = document.createElement('div');
        dateContainer.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        startInput = document.createElement('input');
        startInput.type = 'date';
        startInput.id = 'start-date';
        startInput.style.cssText = 'padding: 3px 6px; font-size: 12px; width: 130px;';

        endInput = document.createElement('input');
        endInput.type = 'date';
        endInput.id = 'end-date';
        endInput.style.cssText = 'padding: 3px 6px; font-size: 12px; width: 130px;';

        dateContainer.append(startInput, document.createTextNode('至'), endInput);
        firstRow.appendChild(dateContainer);

        const actionBtns = document.createElement('div');
        actionBtns.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        queryBtn = document.createElement('button');
        queryBtn.id = 'query-btn';
        queryBtn.textContent = '查询数据';
        queryBtn.style.cssText = 'background:#2196F3;color:white;border:none;padding:3px 10px;border-radius:3px;cursor:pointer;font-size:12px;opacity:0.5;cursor:not-allowed;';
        queryBtn.disabled = true;
        queryBtn.addEventListener('click', throttledFetchData);

        const weekBtn = document.createElement('button');
        weekBtn.textContent = '近一周';
        weekBtn.style.cssText = 'background:#FF9800;color:white;border:none;padding:3px 8px;border-radius:3px;cursor:pointer;font-size:12px;';
        weekBtn.addEventListener('click', () => setWeekRange());

        const lastMonthBtn = document.createElement('button');
        lastMonthBtn.textContent = '上月整月';
        lastMonthBtn.style.cssText = 'background:#FF9800;color:white;border:none;padding:3px 8px;border-radius:3px;cursor:pointer;font-size:12px;';
        lastMonthBtn.addEventListener('click', () => setLastMonthRange());

        actionBtns.append(queryBtn, weekBtn, lastMonthBtn);
        firstRow.appendChild(actionBtns);

        // 分割符号设置和原始内容选项放在同一行
        const settingsRow = document.createElement('div');
        settingsRow.style.cssText = 'display: flex; align-items: center; gap: 12px; padding-top: 5px; flex-wrap: wrap;';
        exportContainer.appendChild(settingsRow);

        // 分割符号设置
        const delimiterGroup = document.createElement('div');
        delimiterGroup.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        const delimiterLabel = document.createElement('div');
        delimiterLabel.textContent = '分割符号：';
        delimiterLabel.style.cssText = 'white-space: nowrap;';

        delimiterInput = document.createElement('input');
        delimiterInput.type = 'text';
        delimiterInput.id = 'delimiter-input';
        delimiterInput.value = delimiter;
        delimiterInput.maxLength = 1;
        delimiterInput.style.cssText = 'padding: 3px 6px; font-size: 12px; width: 30px; text-align: center;';
        delimiterInput.addEventListener('input', (e) => {
            if (e.target.value.length > 1) {
                e.target.value = e.target.value.charAt(0);
            }
            delimiter = e.target.value || '-';
        });

        const delimiterHelp = document.createElement('span');
        delimiterHelp.textContent = '（用于分割所属项目-工作内容-业务负责人）';
        delimiterHelp.style.cssText = 'color: #666; font-size: 11px;';

        delimiterGroup.appendChild(delimiterLabel);
        delimiterGroup.appendChild(delimiterInput);
        delimiterGroup.appendChild(delimiterHelp);
        settingsRow.appendChild(delimiterGroup);

        // 是否包含原始内容的选项
        const originalContentGroup = document.createElement('div');
        originalContentGroup.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        const originalContentCheckbox = document.createElement('input');
        originalContentCheckbox.type = 'checkbox';
        originalContentCheckbox.id = 'include-original-content';
        originalContentCheckbox.checked = includeOriginalContent;
        originalContentCheckbox.style.cssText = 'margin-right: 5px;';
        originalContentCheckbox.addEventListener('change', (e) => {
            includeOriginalContent = e.target.checked;
        });

        const originalContentLabel = document.createElement('label');
        originalContentLabel.htmlFor = 'include-original-content';
        originalContentLabel.textContent = '包含原始工作内容';
        originalContentLabel.style.cssText = 'display: flex; align-items: center;';

        originalContentGroup.appendChild(originalContentCheckbox);
        originalContentGroup.appendChild(originalContentLabel);
        settingsRow.appendChild(originalContentGroup);

        // 数据统计、导出、清空
        const secondRow = document.createElement('div');
        secondRow.style.cssText = 'display: flex; align-items: center; gap: 15px; padding-top: 5px; border-top: 1px dashed #eee;';
        exportContainer.appendChild(secondRow);

        const stats = document.createElement('div');
        stats.innerHTML = `数据: <span id="data-count" style="color: #52c41a; font-weight: 500">0</span> 条`;
        secondRow.appendChild(stats);

        const exportBtn = document.createElement('button');
        exportBtn.textContent = '导出Excel';
        exportBtn.style.cssText = 'background:#52c41a;color:white;border:none;padding:3px 10px;border-radius:3px;cursor:pointer;font-size:12px;';
        exportBtn.addEventListener('click', exportData);
        secondRow.appendChild(exportBtn);

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清空';
        clearBtn.style.cssText = 'background:#f56c6c;color:white;border:none;padding:3px 10px;border-radius:3px;cursor:pointer;font-size:12px;';
        clearBtn.addEventListener('click', clearData);
        secondRow.appendChild(clearBtn);

        setLastMonthRange();
    }


    // ================ 2. 负责人信息获取 ================
    function initIdInterceptor() {
        console.log('🔍 开始拦截请求以提取企业ID...');

        const originalFetch = window.fetch;
        window.fetch = async function (input, init) {
            const url = typeof input === 'string' ? input : input.url;
            if (url.includes('personal_workload_statistic')) {
                extractEnterpriseId(url);
            }
            return originalFetch.apply(this, arguments);
        };

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (url.includes('personal_workload_statistic')) {
                extractEnterpriseId(url);
            }
            return originalOpen.apply(this, arguments);
        };
    }

    function extractEnterpriseId(url) {
        if (enterpriseId) return;
        const match = url.match(/enterprises\/(\d+)\//);
        if (match && match[1]) {
            enterpriseId = match[1];
            apiUrl = `https://api.gitee.com/enterprises/${enterpriseId}/statistics/personal_workload_statistic`;
            console.log(`✅ 提取到企业ID: ${enterpriseId}`);
            fetchEnterpriseBasicInfo();
            updateUIAfterGetId();
        }
    }

    function fetchEnterpriseBasicInfo() {
        if (!enterpriseId) return;
        const basicInfoUrl = `https://api.gitee.com/enterprises/${enterpriseId}/basic_info`;
        console.log(`📡 正在请求负责人信息: ${basicInfoUrl}`);

        fetch(basicInfoUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': navigator.userAgent
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error(`获取负责人信息失败（HTTP状态: ${response.status}）`);
                return response.json();
            })
            .then(result => {
                enterpriseName = result?.member?.name || '未知负责人';
                console.log(`✅ 负责人信息提取成功: ${enterpriseName}`);
            })
            .catch(err => {
                console.error('❌ 负责人信息请求失败:', err);
                showNotification(`负责人信息获取失败: ${err.message}\n导出时将显示"未知负责人"`, 'error');
                enterpriseName = '未知负责人';
            });
    }

    function updateUIAfterGetId() {
        const title = document.getElementById('ui-title');
        if (title) title.innerHTML = `工时工具 <span style="color:#52c41a;">(已就绪)</span>`;

        if (queryBtn) {
            queryBtn.disabled = false;
            queryBtn.style.opacity = '1';
            queryBtn.style.cursor = 'pointer'; // 确保初始状态光标正常
        }
    }


    // ================ 3. 日期处理 ================
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function setWeekRange() {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);

        if (startInput && endInput) {
            startInput.value = formatDate(startDate);
            endInput.value = formatDate(today);
        }
    }

    function setLastMonthRange() {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        let lastMonth, lastMonthYear;
        if (currentMonth === 1) {
            lastMonth = 12;
            lastMonthYear = currentYear - 1;
        } else {
            lastMonth = currentMonth - 1;
            lastMonthYear = currentYear;
        }

        const startDate = new Date(lastMonthYear, lastMonth - 1, 1);
        const endDate = new Date(lastMonthYear, lastMonth, 0);

        if (startInput && endInput) {
            startInput.value = formatDate(startDate);
            endInput.value = formatDate(endDate);
        }
    }

    function validateDates(start, end) {
        if (!start || !end) {
            showNotification('请选择开始日期和结束日期', 'warning');
            return false;
        }
        if (new Date(start) > new Date(end)) {
            showNotification('开始日期不能晚于结束日期', 'warning');
            return false;
        }
        return true;
    }


    // ================ 4. 查询节流控制 ================
    function throttledFetchData() {
        if (isLoading) return;

        const start = startInput.value;
        const end = endInput.value;

        if (!validateDates(start, end)) return;
        if (!apiUrl) {
            showNotification('未获取到API地址，请刷新页面重试', 'error');
            return;
        }

        isLoading = true;
        updateQueryButtonState();

        const url = `${apiUrl}?start_date=${start}&end_date=${end}`;
        console.log(`📡 查询URL: ${url}`);

        interceptedData = [];
        updateCounter();

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Length': '0',
                'Accept': 'application/json',
                'User-Agent': navigator.userAgent
            },
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
                return response.json();
            })
            .then(result => {
                if (result?.data && Array.isArray(result.data)) {
                    const newLogs = [];
                    result.data.forEach(dayData => {
                        if (dayData.workload_logs && Array.isArray(dayData.workload_logs)) {
                            newLogs.push(...dayData.workload_logs);
                        }
                    });
                    const existingIds = new Set(interceptedData.map(item => item.log_id));
                    const uniqueLogs = newLogs.filter(item => !existingIds.has(item.log_id));
                    interceptedData.push(...uniqueLogs);
                    updateCounter();
                    showNotification(`成功获取 ${uniqueLogs.length} 条数据`, 'success');
                } else {
                    showNotification('未获取到有效数据', 'warning');
                }
            })
            .catch(err => {
                console.error('❌ 查询失败:', err);
                showNotification(`查询失败: ${err.message}`, 'error');
            })
            .finally(() => {
                isLoading = false;
                updateQueryButtonState();
            });
    }

    function updateQueryButtonState() {
        if (queryBtn) {
            if (isLoading) {
                queryBtn.disabled = true;
                queryBtn.textContent = '查询中...';
                queryBtn.style.backgroundColor = '#90caf9';
                queryBtn.style.cursor = 'not-allowed'; // 加载时显示禁止符号
            } else {
                queryBtn.disabled = false;
                queryBtn.textContent = '查询数据';
                queryBtn.style.backgroundColor = '#2196F3';
                queryBtn.style.cursor = 'pointer'; // 恢复正常光标
            }
        }
    }


    // ================ 5. 清空数据优化 ================
    function clearData() {
        if (interceptedData.length === 0) {
            showNotification('暂无数据可清空', 'info');
            return;
        }

        createConfirmationDialog('确认清空当前数据？', () => {
            interceptedData = [];
            updateCounter();
            showNotification('数据已清空', 'success');
        });
    }


    // ================ 6. 核心：使用自定义分割符号 ================
    function exportData() {
        if (interceptedData.length === 0) {
            showNotification('无数据可导出，请先查询数据', 'warning');
            return;
        }

        // 根据选项确定表头
        let headers = [
            '所属项目',
            '任务名称',
            '业务负责人',
            '负责人',
            '日期',
            '消耗工时',
            '工作内容'
        ];

        if (includeOriginalContent) {
            headers.push('原始工作内容');
        }

        const rows = [headers.join(',')];

        // 确保分隔符有效
        let effectiveDelimiter = delimiter.trim();
        if (!effectiveDelimiter) {
            showNotification('分隔符不能为空，将使用默认分隔符"-"', 'warning');
            effectiveDelimiter = '-';
        }

        interceptedData.forEach(item => {
            const rawDesc = String(item.description || '').trim();
            let project = '';
            let workContent = '';
            let businessLeader = '';

            console.log(`处理描述: "${rawDesc}"，使用分隔符: "${effectiveDelimiter}"`);

            // 高级分割逻辑
            if (rawDesc && effectiveDelimiter) {
                const delimiterIndices = [];
                let currentIndex = rawDesc.indexOf(effectiveDelimiter);

                // 找出所有分隔符的位置
                while (currentIndex !== -1) {
                    delimiterIndices.push(currentIndex);
                    currentIndex = rawDesc.indexOf(effectiveDelimiter, currentIndex + 1);
                }

                console.log(`找到 ${delimiterIndices.length} 个分隔符`);

                if (delimiterIndices.length >= 1) {
                    // 提取项目部分
                    project = rawDesc.substring(0, delimiterIndices[0]).trim();

                    if (delimiterIndices.length === 1) {
                        // 只有一个分隔符，剩余部分作为工作内容
                        workContent = rawDesc.substring(delimiterIndices[0] + effectiveDelimiter.length).trim();
                    } else {
                        // 有多个分隔符，最后一个分隔符之后的部分作为业务负责人
                        const lastDelimiterIndex = delimiterIndices[delimiterIndices.length - 1];
                        businessLeader = rawDesc.substring(lastDelimiterIndex + effectiveDelimiter.length).trim();

                        // 中间部分作为工作内容
                        workContent = rawDesc.substring(
                            delimiterIndices[0] + effectiveDelimiter.length,
                            lastDelimiterIndex
                        ).trim();
                    }
                } else {
                    // 没有分隔符，整个描述作为工作内容
                    workContent = rawDesc;
                }
            } else {
                // 没有描述或分隔符，整个描述作为工作内容
                workContent = rawDesc;
            }

            console.log(`分割结果: 项目="${project}", 工作内容="${workContent}", 业务负责人="${businessLeader}"`);

            let fields = [
                project.replace(/"/g, '""'),
                String(item.issue_title || '').replace(/"/g, '""'),
                businessLeader.replace(/"/g, '""'),
                enterpriseName.replace(/"/g, '""'),
                String(item.registered_at || '').replace(/"/g, '""'),
                String(item.duration_hours || '').replace(/"/g, '""'),
                workContent.replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, '')
            ];

            // 根据选项决定是否添加原始内容
            if (includeOriginalContent) {
                fields.push(rawDesc.replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ''));
            }

            const row = fields.map(field => {
                if (field.includes(',') || field.includes('""')) {
                    return `"${field}"`;
                }
                return field;
            }).join(',');

            rows.push(row);
        });

        const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `工时数据_${startInput.value}_to_${endInput.value}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }


    // ================ 7. 辅助UI组件 ================
    function showNotification(message, type = 'info') {
        // 移除已有的通知
        const existingNotification = document.getElementById('workload-notification');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.id = 'workload-notification';

        // 设置样式和图标
        let bgColor, icon;
        switch (type) {
            case 'success':
                bgColor = '#52c41a';
                icon = '✅';
                break;
            case 'error':
                bgColor = '#f56c6c';
                icon = '❌';
                break;
            case 'warning':
                bgColor = '#faad14';
                icon = '⚠️';
                break;
            case 'info':
            default:
                bgColor = '#1890ff';
                icon = 'ℹ️';
                break;
        }

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${bgColor};
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;

        notification.innerHTML = `
            <span>${icon}</span>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // 显示通知
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // 自动关闭
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.getElementById('workload-notification')) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    function createConfirmationDialog(message, onConfirm) {
        // 移除已有的对话框
        const existingDialog = document.getElementById('workload-confirmation');
        if (existingDialog) existingDialog.remove();

        const dialog = document.createElement('div');
        dialog.id = 'workload-confirmation';
        dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const dialogContent = document.createElement('div');
        dialogContent.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 6px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            max-width: 400px;
            width: 90%;
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;

        const dialogMessage = document.createElement('div');
        dialogMessage.textContent = message;
        dialogMessage.style.cssText = 'font-size: 14px;';

        const dialogActions = document.createElement('div');
        dialogActions.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px;';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = 'background: #f5f5f5; color: #555; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;';
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
        });

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '确认';
        confirmBtn.style.cssText = 'background: #f56c6c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;';
        confirmBtn.addEventListener('click', () => {
            onConfirm();
            document.body.removeChild(dialog);
        });

        dialogActions.appendChild(cancelBtn);
        dialogActions.appendChild(confirmBtn);
        dialogContent.appendChild(dialogMessage);
        dialogContent.appendChild(dialogActions);
        dialog.appendChild(dialogContent);
        document.body.appendChild(dialog);
    }


    // ================ 8. 其他辅助函数 ================
    function updateCounter() {
        const counter = document.getElementById('data-count');
        if (counter) counter.textContent = interceptedData.length;
    }


    // ================ 初始化 ================
    function init() {
        createUIContainer();
        initIdInterceptor();

        setTimeout(() => {
            const refreshBtn = document.querySelector('.refresh-btn') || document.querySelector('.icon-refresh');
            if (refreshBtn) {
                refreshBtn.click();
                console.log('🔄 模拟刷新获取API请求');
            }
        }, 1000);
    }

    let isInitialized = false;
    function safeInit() {
        if (!isInitialized) {
            isInitialized = true;
            init();
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', safeInit);
    } else {
        safeInit();
    }
})();