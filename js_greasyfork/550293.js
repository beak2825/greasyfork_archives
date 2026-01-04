// ==UserScript==
// @name         MT PR Review Helper (With Dev Log)
// @namespace    http://tampermonkey.net/meituan-pr-helper
// @version      1.4
// @description  带开发日志的PR审查助手
// @author       Your name
// @match        https://dev.sankuai.com/code/repo-detail/*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/550293/MT%20PR%20Review%20Helper%20%28With%20Dev%20Log%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550293/MT%20PR%20Review%20Helper%20%28With%20Dev%20Log%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置常量
    const NAMESPACE = 'meituan_pr_helper_';
    const VERSION = '1.4';
    const LOG_PREFIX = '[PR Helper]';
    let prMerged = false;

    // 开发日志
    const CHANGELOG = [
        '1.4 (2023-11-20): 添加开发日志功能，优化错误处理',
        '1.3 (2023-11-15): 精确元素定位，添加步骤提示',
        '1.2 (2023-11-10): 兼容HPX按钮，改进样式隔离',
        '1.1 (2023-11-05): 添加节日效果和完成通知',
        '1.0 (2023-11-01): 初始版本，基础功能实现'
    ];

    // 状态变量
    let currentStep = 0;


    // 初始化日志系统
    function initLogger() {
        // 检查上次运行版本
        const lastVersion = GM_getValue('last_version', '');
        if (lastVersion !== VERSION) {
            log(`版本更新: ${lastVersion || '首次运行'} → ${VERSION}`);
            GM_setValue('last_version', VERSION);
            showChangelog();
        }

        log(`脚本初始化，当前版本: ${VERSION}`);
        log(`匹配URL: ${window.location.href}`);
        log(`页面类型: ${isOnDiffPage() ? 'Diff页面' : 'Overview页面'}`);
        log(`项目信息: ${getCurrentProjectPath()}`);
        log(`PR号: ${getCurrentPRNumber()}`);
    }

    // 显示更新日志
    function showChangelog() {
        const logHtml = CHANGELOG.map(v => `<li>${v}</li>`).join('');
        $('body').append(`
            <div id="${NAMESPACE}changelog" style="
                position: fixed; bottom: 60px; right: 20px; width: 300px;
                background: white; padding: 15px; border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 10000;
                font-size: 12px; max-height: 200px; overflow-y: auto;">
                <h4 style="margin-top:0;color:#1890ff">PR Helper 更新日志</h4>
                <ul style="padding-left: 20px;margin-bottom:0">${logHtml}</ul>
            </div>
        `);
        setTimeout(() => $(`#${NAMESPACE}changelog`).fadeOut(1000), 5000);
    }

    // 日志记录函数
    function log(message, data) {
        const timestamp = new Date().toISOString().substr(11, 12);

        GM_log(`${LOG_PREFIX} ${message}`);

        // 记录到页面日志面板
        if ($(`#${NAMESPACE}logs`).length) {
            $(`#${NAMESPACE}logs`).prepend(
                `<div style="margin:5px 0;border-bottom:1px solid #eee">[${timestamp}] ${message}</div>`
            );
        }
    }

    // 添加样式
    function initStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #${NAMESPACE}button { margin-right: 8px; position: relative; }
            .${NAMESPACE}button-content { display: flex; align-items: center; }
            .${NAMESPACE}icon { margin-right: 4px; }
            .${NAMESPACE}marked-tab {
                background-color: #f0f7ff !important;
                border-left: 3px solid #1890ff !important;
            }
            .${NAMESPACE}active-step {
                box-shadow: 0 0 0 2px #1890ff !important;
                transition: all 0.3s ease;
            }
            #${NAMESPACE}progress {
                position: fixed; bottom: 20px; right: 20px;
                background: white; padding: 10px; width: 250px;
                border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                z-index: 9999; font-size: 13px;
            }
            #${NAMESPACE}logs {
                position: fixed; bottom: 80px; right: 20px;
                background: white; padding: 10px; width: 300px;
                max-height: 200px; overflow-y: auto;
                border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                z-index: 9998; font-size: 12px; display: none;
            }
            #${NAMESPACE}log-toggle {
                position: fixed; bottom: 20px; right: 280px;
                padding: 5px 10px; background: #f0f0f0;
                border-radius: 4px; cursor: pointer;
                font-size: 12px; z-index: 10000;
            }
             .${NAMESPACE}notify {
        animation: ${NAMESPACE}fadeIn 0.3s;
    }
    @keyframes ${NAMESPACE}fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
        `;
        document.head.appendChild(style);
        log("样式初始化完成");
    }

    // 初始化UI元素
    function initUI() {
        // 主按钮
        if ($(`#${NAMESPACE}button`).length === 0) {
            $(".btn-box").prepend(`
                <button id="${NAMESPACE}button" type="button" class="mtd-btn mtd-btn-primary">
                    <span>
                        <div class="${NAMESPACE}button-content">
                            <span class="mtdicon mtdicon-fast-forward ${NAMESPACE}icon"></span>
                            <span>PR助手</span>
                        </div>
                    </span>
                </button>
            `);
            $(`#${NAMESPACE}button`).click(executeSteps);
            log("主按钮添加完成");
            // checkPRStatus(()=>)
        }

        // 日志面板
        if ($(`#${NAMESPACE}logs`).length === 0) {
            $('body').append(`
                <div id="${NAMESPACE}logs" style="display:none"></div>
                <div id="${NAMESPACE}log-toggle">显示日志</div>
            `);
            $(`#${NAMESPACE}log-toggle`).click(() => {
                $(`#${NAMESPACE}logs`).toggle();
                $(this).text($(`#${NAMESPACE}logs`).is(':visible') ? '隐藏日志' : '显示日志');
            });
            log("日志面板初始化完成");
        }
    }

    // 更新executeSteps函数添加初始检查
    function executeSteps() {
        // 执行前先检查按钮状态
        if ($(`#${NAMESPACE}button`).prop('disabled')) {
            log("按钮已禁用，跳过执行");
            showNotification("PR已合并，无法执行审查流程", "error");
            return;
        }

        log("开始执行PR审查流程");
        log(`当前页面: ${isOnDiffPage() ? 'diff页面' : 'overview页面'}`);
        log(`项目路径: ${getCurrentProjectPath()}`);
        log(`PR号: ${getCurrentPRNumber()}`);

        currentStep = 0;
        prMerged = false; // 重置状态
        showProgressPanel();
        executeNextStep(getSteps());
    }


    // 更新executeNextStep函数以处理合并状态
    function executeNextStep(steps) {
        if (currentStep >= steps.length) {
            log("所有步骤已完成");
            updateProgressPanel("✅ 所有步骤已完成!");
            setTimeout(() => $(`#${NAMESPACE}progress`).fadeOut(), 3000);
            return;
        }

        const step = steps[currentStep];
        log(`正在执行步骤 ${currentStep + 1}/${steps.length}: ${step.name}`);
        updateProgressPanel(`🔄 ${step.name} (${currentStep + 1}/${steps.length})`);

        // 高亮当前步骤元素
        $(step.selector).addClass(`${NAMESPACE}active-step`);

        try {
            step.action(() => {
                // 如果PR已合并，在第一步后就停止
                if (prMerged && currentStep === 0) {
                    $(step.selector).removeClass(`${NAMESPACE}active-step`);
                    return; // 中断执行
                }

                $(step.selector).removeClass(`${NAMESPACE}active-step`);
                currentStep++;
                setTimeout(() => executeNextStep(steps), 800);
            });
        } catch (e) {
            log(`步骤执行出错: ${e.message}`, e);
            updateProgressPanel(`❌ 步骤出错: ${step.name}`);
        }
    }


    // 更新switchToDiffTab函数
    // 更新后的switchToDiffTab函数
    function switchToDiffTab(callback) {
        const projectPath = getCurrentProjectPath();
        const prNumber = getCurrentPRNumber();

        if (!projectPath || !prNumber) {
            log("无法获取项目路径或PR号", {
                projectPath,
                prNumber,
                currentPath: window.location.pathname
            });
            updateProgressPanel("❌ 无法解析项目信息");
            callback();
            return;
        }

        // 动态构建diff链接
        const diffHref = `/code/repo-detail/${projectPath}/pr/${prNumber}/diff`;
        const diffTabLink = $(`.mtd-tabs-item a[href="${diffHref}"]`);

        log(`尝试切换到diff页面: ${diffHref}`);

        if (diffTabLink.length) {
            log(`找到Diff Tab链接: ${diffTabLink.attr('href')}`);

            // 直接点击<a>标签
            diffTabLink[0].click();
            log("已直接点击Diff Tab链接");
            // 添加视觉反馈
            diffTabLink.css({
                'background-color': '#e6f7ff',
                'box-shadow': '0 0 0 2px #1890ff'
            });
            setTimeout(() => diffTabLink.css({ 'background-color': '', 'box-shadow': '' }), 1000);
        } else {
            log("未找到精确的Diff Tab链接，尝试备用选择器");

            // 备用选择器：匹配包含/diff的任何<a>标签
            const fallbackDiffTab = $(`.mtd-tabs-item a[href*="/diff"]`);
            if (fallbackDiffTab.length) {
                fallbackDiffTab[0].click();
                log("通过备用选择器点击Diff Tab");
            } else {
                log("所有选择器都无法定位Diff Tab链接", {
                    '当前URL': window.location.href,
                    '项目路径': projectPath,
                    'PR号': prNumber,
                    '期望链接': diffHref
                });
                updateProgressPanel("❌ 无法定位Diff Tab链接");
            }
        }

        setTimeout(callback, 1500); // 延长等待时间确保页面切换完成
    }
    // 更新标记函数以匹配实际结构
    function markTabs(callback) {
        const tabs = $(".mtd-tabs-item");
        tabs.addClass(`${NAMESPACE}marked-tab`)
            .css('transition', 'all 0.3s ease');
        log(`已标记 ${tabs.length} 个Tab`, {
            tabNames: tabs.map((i, el) => $(el).find('.mtd-tabs-item-label').text().trim()).get()
        });
        callback();
    }


    // 优化的进度检查和处理函数
    function checkAndHandleProgress(callback) {
        const progressElement = $(".reviewed-dropdown-content > span:last");
        const progressText = progressElement.text().trim();

        log("检查当前进度:", progressText);

        const match = progressText.match(/\((\d+)\s*\/\s*(\d+)\)/);

        if (match && match.length === 3) {
            const reviewed = parseInt(match[1]);
            const total = parseInt(match[2]);
            const percent = Math.round((reviewed / total) * 100);

            log(`当前进度: ${reviewed}/${total} (${percent}%)`);
            updateProgressPanel(`📊 进度: ${reviewed}/${total} (${percent}%)`);

            if (reviewed === total) {
                // 进度已完成，直接approve
                log("进度已完成，执行approve操作");
                updateProgressPanel("🎯 进度已完成，正在approve...");

                setTimeout(() => {
                    const approveSuccess = clickApproveButton();
                    if (approveSuccess) {
                        // approve成功，流程结束
                        log("Approve操作完成，流程结束");
                        setTimeout(() => $(`#${NAMESPACE}progress`).fadeOut(), 3000);
                    }
                    // 不调用callback，流程在此结束
                }, 1000);

            } else {
                // 进度未完成，开始循环标记
                log(`进度未完成 (${reviewed}/${total})，开始循环标记流程`);
                updateProgressPanel(`🔄 开始标记流程 (${reviewed}/${total})`);
                startMarkingLoop();
            }
        } else {
            log("无法解析进度信息", progressText);
            updateProgressPanel("⚠️ 无法解析进度信息");
            callback();
        }
    }
    // 新增：循环标记流程
    function startMarkingLoop() {
        let loopCount = 0;
        let progressObserver = null;
        let isProcessing = false; // 防止重复处理
        let isWaitingForProgress = false; // 新增：标记是否正在等待进度更新

        function markingLoop() {
            if (isProcessing) {
                log("正在处理中，跳过本次循环");
                return;
            }

            loopCount++;
            log(`开始第 ${loopCount} 轮标记`);

            if (loopCount > 200) {
                log("达到最大循环次数，停止标记");
                cleanupAndStop("标记超时，请手动检查");
                return;
            }

            isProcessing = true;

            // 标记一批文件
            markBatchFiles(() => {
                isProcessing = false;
                // 开始等待进度更新
                waitForProgressUpdate();
            });
        }

        function waitForProgressUpdate() {
            if (isWaitingForProgress) {
                log("已在等待进度更新，跳过");
                return;
            }

            isWaitingForProgress = true;
            log("开始等待进度更新...");

            // 清理之前的监听器
            if (progressObserver) {
                progressObserver.disconnect();
            }

            // 创建新的监听器
            progressObserver = createProgressObserver((newProgressText) => {
                log(`监听到进度更新: ${newProgressText}`);
                isWaitingForProgress = false;

                // 解析新的进度
                const match = newProgressText.match(/\((\d+)\s*\/\s*(\d+)\)/);
                if (match && match.length === 3) {
                    const reviewed = parseInt(match[1]);
                    const total = parseInt(match[2]);

                    updateProgressPanel(`📊 进度更新: ${reviewed}/${total}`);

                    if (reviewed === total) {
                        // 进度完成
                        log("监听到进度完成，执行approve");
                        cleanupObserver();

                        updateProgressPanel("🎯 标记完成，正在approve...");
                        setTimeout(() => {
                            clickApproveButton();
                            setTimeout(() => $(`#${NAMESPACE}progress`).fadeOut(), 3000);
                        }, 1000);
                    } else {
                        // 进度未完成，继续下一轮
                        log(`进度未完成 (${reviewed}/${total})，准备下一轮标记`);

                        // 延迟一下再继续，避免过于频繁
                        setTimeout(() => {
                            markingLoop();
                        }, 1500);
                    }
                } else {
                    log("无法解析新的进度信息");
                    cleanupAndStop("无法解析进度信息");
                }
            });

            // 设置超时保护 - 如果8秒内没有进度变化，继续下一轮
            setTimeout(() => {
                if (isWaitingForProgress) {
                    log("进度监听超时，继续下一轮标记");
                    isWaitingForProgress = false;
                    markingLoop();
                }
            }, 8000);
        }

        function cleanupObserver() {
            if (progressObserver) {
                progressObserver.disconnect();
                progressObserver = null;
            }
            isWaitingForProgress = false;
        }

        function cleanupAndStop(message) {
            cleanupObserver();
            updateProgressPanel(`❌ ${message}`);
            showNotification(message, "error");
        }

        // 开始第一轮标记
        markingLoop();
    }

    // 优化：批量标记文件
    function markBatchFiles(callback) {
        const unmarkedCheckboxes = $(".file-reviewed-checkbox:not(.mtd-checkbox-checked)");
        const batchSize = Math.min(3, unmarkedCheckboxes.length); // 每批最多标记3个

        if (unmarkedCheckboxes.length === 0) {
            log("没有找到未标记的文件");
            callback();
            return;
        }

        log(`开始标记 ${batchSize} 个文件，剩余 ${unmarkedCheckboxes.length} 个`);
        updateProgressPanel(`📌 正在标记 ${batchSize} 个文件...`);

        let markedCount = 0;

        // 标记前几个未标记的文件
        unmarkedCheckboxes.slice(0, batchSize).each(function (index) {
            setTimeout(() => {
                const $checkbox = $(this);

                // 添加视觉反馈
                $checkbox.css('outline', '2px solid #1890ff');

                // 点击标记
                $checkbox[0].click();
                markedCount++;

                log(`已标记第 ${markedCount} 个文件`);

                // 清除视觉反馈
                setTimeout(() => $checkbox.css('outline', ''), 500);

                // 如果是最后一个，执行回调
                if (markedCount === batchSize) {
                    log(`本批次标记完成，共标记 ${markedCount} 个文件`);
                    callback();
                }
            }, index * 800); // 每个文件间隔800ms
        });
    }
    // 优化：approve按钮点击函数
    function clickApproveButton() {
        const approveBtn = $(".approve-btn button");

        if (approveBtn.length === 0) {
            log("未找到approve按钮");
            updateProgressPanel("⚠️ 未找到approve按钮");
            showNotification("未找到approve按钮，请手动操作", "error");
            return false;
        }

        // 检查按钮状态
        const buttonText = approveBtn.find('span:last').text().trim();
        if (buttonText === "Approved") {
            log("PR已经是Approved状态");
            updateProgressPanel("✅ PR已经是Approved状态");
            showNotification("PR已经是Approved状态", "success");
            showCompleteNotification();
            return true;
        }

        if (approveBtn.hasClass('disabled') || approveBtn.prop('disabled')) {
            log("Approve按钮被禁用");
            updateProgressPanel("⚠️ Approve按钮被禁用");
            showNotification("Approve按钮被禁用，请检查权限", "error");
            return false;
        }

        // 点击approve按钮
        log("点击approve按钮");
        updateProgressPanel("🎯 正在approve...");

        // 添加视觉反馈
        approveBtn.css({
            'box-shadow': '0 0 0 2px #52c41a',
            'background-color': '#f6ffed'
        });

        approveBtn[0].click();

        // 检查结果
        setTimeout(() => {
            const newButtonText = approveBtn.find('span:last').text().trim();
            if (newButtonText === "Approved") {
                log("Approve成功");
                updateProgressPanel("🎉 Approve成功！");
                showNotification("PR已成功approve", "success");
                showCompleteNotification();
            } else {
                log("Approve状态未确认，请手动检查");
                updateProgressPanel("⚠️ 请手动检查approve状态");
                showNotification("请手动检查approve状态", "warning");
            }

            // 清除视觉反馈
            approveBtn.css({
                'box-shadow': '',
                'background-color': ''
            });
        }, 2000);

        return true;
    }

    // 新增：进度监听器 - 优化版本
    function createProgressObserver(callback) {
        const progressElement = $(".reviewed-dropdown-content > span:last")[0];

        if (!progressElement) {
            log("未找到进度元素，无法创建监听器");
            return null;
        }

        let lastProgressText = progressElement.textContent.trim();
        log(`初始进度文本: ${lastProgressText}`);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const newProgressText = progressElement.textContent.trim();

                    // 只有当进度真正发生变化时才触发回调
                    if (newProgressText !== lastProgressText) {
                        log(`进度变化检测到: ${lastProgressText} → ${newProgressText}`);
                        lastProgressText = newProgressText;
                        callback(newProgressText);
                    }
                }
            });
        });

        // 监听文本内容变化
        observer.observe(progressElement, {
            childList: true,
            subtree: true,
            characterData: true
        });

        return observer;
    }

    function showNotification(message, type = 'info') {
        const colors = {
            info: '#1890ff',
            error: '#ff4d4f',
            success: '#52c41a'
        };

        $('body').append(`
        <div class="${NAMESPACE}notify" style="
            position: fixed; top: 20px; right: 20px;
            padding: 10px 15px; background: white;
            border-left: 4px solid ${colors[type]};
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 10001;">
            ${message}
        </div>
    `);

        setTimeout(() => $(`.${NAMESPACE}notify`).fadeOut(500, function () {
            $(this).remove();
        }), 3000);
    }
    // UI相关函数
    function showProgressPanel() {
        $(`#${NAMESPACE}progress`).remove();
        $('body').append(`<div id="${NAMESPACE}progress">准备开始...</div>`);
    }

    function updateProgressPanel(text) {
        $(`#${NAMESPACE}progress`).html(text).show();
    }



    function showCompleteNotification() {
        log("PR审查已完成");
        updateProgressPanel("🎉 已完成全部代码审查!");
        setTimeout(() => $(`#${NAMESPACE}progress`).fadeOut(), 3000);
    }


    // 新增：检查当前是否在diff页面
    function isOnDiffPage() {
        return window.location.pathname.includes('/diff');
    }

    // 新增：获取当前项目路径
    function getCurrentProjectPath() {
        const pathParts = window.location.pathname.split('/');
        // 路径格式: /code/repo-detail/{group}/{project}/pr/{prNumber}/...
        if (pathParts.length >= 6) {
            return `${pathParts[3]}/${pathParts[4]}`;
        }
        return null;
    }

    // 新增：获取当前PR号
    function getCurrentPRNumber() {
        const pathParts = window.location.pathname.split('/');
        const prIndex = pathParts.indexOf('pr');
        if (prIndex !== -1 && prIndex + 1 < pathParts.length) {
            return pathParts[prIndex + 1];
        }
        return null;
    }


    // 修正检查PR状态函数
    function checkPRStatus(callback) {
        // 使用更精确的选择器定位PR状态标签
        const statusElement = $(".pr-status-tag .mtd-tag-content");

        if (statusElement.length === 0) {
            log("未找到PR状态元素，尝试备用选择器");
            // 备用选择器
            const fallbackElement = $(".mtd-tag-content");
            if (fallbackElement.length === 0) {
                log("所有选择器都无法找到PR状态元素");
                updateProgressPanel("⚠️ 无法检测PR状态");
                callback();
                return;
            }
            statusElement = fallbackElement;
        }

        const statusText = statusElement.text().trim();
        log(`检查PR状态: ${statusText}`);

        if (statusText === "已合并") {
            prMerged = true;
            log("PR已合并，禁用按钮");

            // 禁用主按钮
            $(`#${NAMESPACE}button`)
                .prop('disabled', true)
                .addClass('mtd-btn-disabled')
                .find('span:last')
                .text('PR已合并');

            updateProgressPanel("ℹ️ PR已合并，无需审查");
            showNotification("此PR已合并，无需进行审查操作", "info");

            // 停止后续步骤执行
            setTimeout(() => $(`#${NAMESPACE}progress`).fadeOut(), 3000);
            return; // 不调用callback，中断流程
        } else {
            prMerged = false;
            log(`PR状态正常: ${statusText}，继续执行后续步骤`);
            updateProgressPanel(`✅ PR状态检查通过: ${statusText}`);
        }

        callback();
    }
    // 优化：动态生成步骤配置
    function getSteps() {
        const baseSteps = [
            { name: "检查PR状态", selector: ".pr-status-tag .mtd-tag-content", action: checkPRStatus },
            { name: "标记Tab", selector: ".mtd-tabs-item", action: markTabs }
        ];

        if (!isOnDiffPage()) {
            baseSteps.push({
                name: "切换到Diff Tab",
                selector: `.mtd-tabs-item a[href*="/diff"]`,
                action: switchToDiffTab
            });
        } else {
            log("当前已在diff页面，跳过切换步骤");
        }

        baseSteps.push({
            name: "检查并处理进度",
            selector: ".reviewed-dropdown-content > span:last",
            action: checkAndHandleProgress
        });

        return baseSteps;
    }

    // 优化：switchToDiffTab函数支持动态项目路径
    function switchToDiffTab(callback) {
        const projectPath = getCurrentProjectPath();
        const prNumber = getCurrentPRNumber();

        if (!projectPath || !prNumber) {
            log("无法获取项目路径或PR号", {
                projectPath,
                prNumber,
                currentPath: window.location.pathname
            });
            updateProgressPanel("❌ 无法解析项目信息");
            callback();
            return;
        }

        // 动态构建diff链接
        const diffHref = `/code/repo-detail/${projectPath}/pr/${prNumber}/diff`;
        const diffTabLink = $(`.mtd-tabs-item a[href="${diffHref}"]`);

        log(`尝试切换到diff页面: ${diffHref}`);

        if (diffTabLink.length) {
            log(`找到Diff Tab链接: ${diffTabLink.attr('href')}`);

            // 直接点击<a>标签
            diffTabLink[0].click();
            log("已直接点击Diff Tab链接");

            // 添加视觉反馈
            diffTabLink.css({
                'background-color': '#e6f7ff',
                'box-shadow': '0 0 0 2px #1890ff'
            });
            setTimeout(() => diffTabLink.css({ 'background-color': '', 'box-shadow': '' }), 1000);
        } else {
            log("未找到精确的Diff Tab链接，尝试备用选择器");

            // 备用选择器：匹配包含/diff的任何<a>标签
            const fallbackDiffTab = $(`.mtd-tabs-item a[href*="/diff"]`);
            if (fallbackDiffTab.length) {
                fallbackDiffTab[0].click();
                log("通过备用选择器点击Diff Tab");
            } else {
                log("所有选择器都无法定位Diff Tab链接", {
                    '当前URL': window.location.href,
                    '项目路径': projectPath,
                    'PR号': prNumber,
                    '期望链接': diffHref
                });
                updateProgressPanel("❌ 无法定位Diff Tab链接");
            }
        }

        setTimeout(callback, 1500);
    }

    // 优化：executeSteps函数使用动态步骤
    function executeSteps() {
        // 执行前先检查按钮状态
        if ($(`#${NAMESPACE}button`).prop('disabled')) {
            log("按钮已禁用，跳过执行");
            showNotification("PR已合并，无法执行审查流程", "error");
            return;
        }

        log("开始执行PR审查流程");
        log(`当前页面: ${isOnDiffPage() ? 'diff页面' : 'overview页面'}`);
        log(`项目路径: ${getCurrentProjectPath()}`);
        log(`PR号: ${getCurrentPRNumber()}`);

        currentStep = 0;
        prMerged = false;

        // 获取动态步骤配置
        const dynamicSteps = getSteps();
        log(`生成步骤配置，共${dynamicSteps.length}个步骤:`, dynamicSteps.map(s => s.name));

        showProgressPanel();
        executeNextStep(dynamicSteps);
    }

    // 优化：executeNextStep函数接受步骤参数
    function executeNextStep(steps) {
        if (currentStep >= steps.length) {
            log("所有步骤已完成");
            updateProgressPanel("✅ 所有步骤已完成!");
            setTimeout(() => $(`#${NAMESPACE}progress`).fadeOut(), 3000);
            return;
        }

        const step = steps[currentStep];
        log(`正在执行步骤 ${currentStep + 1}/${steps.length}: ${step.name}`);
        updateProgressPanel(`🔄 ${step.name} (${currentStep + 1}/${steps.length})`);

        // 高亮当前步骤元素
        $(step.selector).addClass(`${NAMESPACE}active-step`);

        try {
            step.action(() => {
                // 如果PR已合并，在第一步后就停止
                if (prMerged && currentStep === 0) {
                    $(step.selector).removeClass(`${NAMESPACE}active-step`);
                    return;
                }

                $(step.selector).removeClass(`${NAMESPACE}active-step`);
                currentStep++;
                setTimeout(() => executeNextStep(steps), 800);
            });
        } catch (e) {
            log(`步骤执行出错: ${e.message}`, e);
            updateProgressPanel(`❌ 步骤出错: ${step.name}`);
        }
    }

    // 优化：initLogger函数添加页面信息
    function initLogger() {
        // 检查上次运行版本
        const lastVersion = GM_getValue('last_version', '');
        if (lastVersion !== VERSION) {
            log(`版本更新: ${lastVersion || '首次运行'} → ${VERSION}`);
            GM_setValue('last_version', VERSION);
            showChangelog();
        }

        log(`脚本初始化，当前版本: ${VERSION}`);
        log(`匹配URL: ${window.location.href}`);
        log(`页面类型: ${isOnDiffPage() ? 'Diff页面' : 'Overview页面'}`);
        log(`项目信息: ${getCurrentProjectPath()}`);
        log(`PR号: ${getCurrentPRNumber()}`);
    }

    // 新增：页面变化监听器
    function initPageChangeListener() {
        let currentUrl = window.location.href;
        // 监听URL变化
        const urlObserver = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                const oldUrl = currentUrl;
                currentUrl = window.location.href;

                log(`页面URL变化: ${oldUrl} → ${currentUrl}`);

                // 检查新URL是否匹配脚本规则
                if (isMatchingUrl(currentUrl)) {
                    log("新页面匹配脚本规则，重新初始化");
                    // 延迟重新初始化，等待页面内容加载
                    setTimeout(() => {
                        reinitializeScript();
                    }, 1000);
                } else {
                    log("新页面不匹配脚本规则，清理UI");
                    cleanupUI();
                }
            }
        });

        // 监听整个document的变化
        urlObserver.observe(document, {
            childList: true,
            subtree: true
        });

        // 监听popstate事件（浏览器前进后退）
        window.addEventListener('popstate', () => {
            log("检测到popstate事件，延迟重新初始化");
            setTimeout(() => {
                if (isMatchingUrl(window.location.href)) {
                    reinitializeScript();
                }
            }, 500);
        });

        log("页面变化监听器已初始化");
    }

    // 新增：检查URL是否匹配脚本规则
    function isMatchingUrl(url) {
        const patterns = [
            /\/code\/repo-detail\/.*\/pr\/.*\/overview/,
            /\/code\/repo-detail\/.*\/pr\/.*\/diff/
        ];

        return patterns.some(pattern => pattern.test(url));
    }
    // 新增：重新初始化脚本
    function reinitializeScript() {
        log("开始重新初始化脚本");

        // 清理现有UI
        cleanupUI();

        // 重置状态变量
        currentStep = 0;
        prMerged = false;

        // 重新初始化
        initLogger();

        // 等待页面元素加载完成后初始化UI
        waitForElementAndInit();
    }

    // 新增：等待元素加载并初始化
    function waitForElementAndInit() {
        let attempts = 0;
        const maxAttempts = 20; // 最多尝试20次

        function checkAndInit() {
            attempts++;

            if ($(".btn-box").length > 0) {
                log(`第${attempts}次尝试成功找到.btn-box元素，初始化UI`);
                initUI();
                return;
            }

            if (attempts < maxAttempts) {
                log(`第${attempts}次尝试未找到.btn-box元素，500ms后重试`);
                setTimeout(checkAndInit, 500);
            } else {
                log("达到最大尝试次数，停止等待");
                // 尝试使用MutationObserver作为备用方案
                const observer = new MutationObserver(() => {
                    if ($(".btn-box").length > 0) {
                        log("通过MutationObserver找到.btn-box元素，初始化UI");
                        initUI();
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // 10秒后断开observer
                setTimeout(() => {
                    observer.disconnect();
                    log("MutationObserver已断开");
                }, 10000);
            }
        }

        checkAndInit();
    }

    // 新增：清理UI元素
    function cleanupUI() {
        log("清理现有UI元素");

        // 移除所有脚本创建的元素
        $(`#${NAMESPACE}button`).remove();
        $(`#${NAMESPACE}progress`).remove();
        $(`#${NAMESPACE}logs`).remove();
        $(`#${NAMESPACE}log-toggle`).remove();
        $(`#${NAMESPACE}changelog`).remove();
        $(`.${NAMESPACE}notify`).remove();

        // 清理样式类
        // $(`.${NAMESPACE}marked-tab[).removeClass(](file://chrome/pr.js#202#35)${NAMESPACE}marked-tab`);
        // $(`.${NAMESPACE}active-step[).removeClass(](file://chrome/pr.js#202#35)${NAMESPACE}active-step`);

        log("UI清理完成");
    }

    // 修改：检查是否应该显示按钮
    function shouldShowButton() {
        const currentUrl = window.location.href;

        // 检查是否在PR页面（overview或diff）
        const isPRPage = /\/code\/repo-detail\/.*\/pr\/\d+\/(overview|diff)/.test(currentUrl);

        if (!isPRPage) {
            log("当前不在PR页面，不显示按钮");
            return false;
        }

        // 检查是否存在必要的页面元素
        const hasButtonContainer = $(".btn-box").length > 0;
        if (!hasButtonContainer) {
            log("未找到按钮容器(.btn-box)，不显示按钮");
            return false;
        }

        const statusElement = $(".pr-status-tag .mtd-tag-content");

        if(statusElement.length === 0){
            log("未找到PR状态标签，可能还在加载中");
            return null; // 返回null表示需要等待
        }

        const statusText = statusElement.text().trim();
        log(`检查PR状态: ${statusText}`);

        if (statusText === "已合并") {
            log("PR已合并，不显示按钮");
            return false;
        }

        log("页面检查通过，可以显示按钮");
        return true;
    }

    // 新增：等待PR状态元素加载
    function waitForPRStatusAndInject(callback, maxAttempts = 10, currentAttempt = 1) {
        const shouldShow = shouldShowButton();
        if (shouldShow === true) {
            // 可以显示按钮
            inject(callback);
            return;
        } else if (shouldShow === false) {
            // 明确不应该显示按钮
            log("页面条件不满足，跳过按钮注入");
            callback();
            return;
        } else if (shouldShow === null) {
            // 需要等待
            if (currentAttempt <= maxAttempts) {
                log(`第${currentAttempt}次尝试等待PR状态元素加载`);
                        setTimeout(() => {
                    waitForPRStatusAndInject(callback, maxAttempts, currentAttempt + 1);
                }, 500);
            } else {
                log("等待PR状态元素超时，尝试强制注入按钮");
                inject(callback);
        }
    }
    }

    // 修改：注入按钮的函数
    function inject(callback) {
        // 检查按钮是否已存在，避免重复创建
        if ($(`#${NAMESPACE}button`).length > 0) {
            log("PR Helper按钮已存在，跳过创建");
            callback();
            return;
        }

        // 创建按钮
        initUI();
        log("PR Helper按钮注入完成");
        callback();
    }

    // 简化：主初始化函数
    function main() {
        initLogger();
        initStyles();

        if (window.location.toString().indexOf('dev.sankuai.com/code/repo-detail') >= 0) {
            // 使用 MutationObserver 监听DOM变化
            const observer = new MutationObserver((mutations, observer) => {
                if ($(".btn-box").length > 0 && $(`#${NAMESPACE}button`).length === 0) {
                    log('检测到按钮容器');
                    observer.disconnect(); // 停止观察
                    waitForPRStatusAndInject(() => {}); // 使用新的等待函数
                }
            });

            // 立即检查是否已存在按钮容器
            if ($(".btn-box").length > 0) {
                log('按钮容器已存在');
                waitForPRStatusAndInject(() => {}); // 使用新的等待函数
            } else {
                log('等待按钮容器');
                // 开始观察
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }

            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    log('URL 发生变化: ' + url);

                    // 清理现有UI
                    cleanupUI();

                    // 检查新URL是否需要注入按钮
                    if (url.indexOf('dev.sankuai.com/code/repo-detail') >= 0) {
                        // 延迟一下等待页面内容加载
                        setTimeout(() => {
                            waitForPRStatusAndInject(() => {}); // 使用新的等待函数
                        }, 300);
                    }
                }
            }).observe(document, {subtree: true, childList: true});
        }
    }

    // 启动脚本
    main();
})();

