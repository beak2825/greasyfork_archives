// ==UserScript==
// @name         复旦研究生评教助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动填充课程评教表单，一键完成所有课程评教（全选"完全同意"）
// @author       zsy1207
// @match        https://yzsfwapp.fudan.edu.cn/gsapp/sys/wspjappfudan/*
// @icon         https://www.fudan.edu.cn/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561134/%E5%A4%8D%E6%97%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561134/%E5%A4%8D%E6%97%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%84%E6%95%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===========================================
    // Configuration - 配置项
    // ===========================================
    const CONFIG = {
        // 操作延迟时间 (毫秒)
        CLICK_DELAY: 100,        // 每次点击选项的间隔
        FILL_COMPLETE_DELAY: 2000, // 填充完成后等待时间（确保所有选项都已选中）
        SUBMIT_DELAY: 800,       // 提交后等待时间
        CONFIRM_DELAY: 1000,     // 确认对话框出现等待时间
        NEXT_COURSE_DELAY: 1500, // 下一门课前等待时间
        PAGE_LOAD_DELAY: 2000,   // 页面加载等待时间

        // 自动模式
        AUTO_MODE: true,

        // 调试模式
        DEBUG: true
    };

    // ===========================================
    // Utility Functions
    // ===========================================
    function log(...args) {
        if (CONFIG.DEBUG) {
            console.log('[FudanEval]', ...args);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const el = document.querySelector(selector);
                if (el) {
                    obs.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // ===========================================
    // Core Functions
    // ===========================================

    // Get all unevaluated course cards - 获取所有未评教课程卡片
    function getUnevaluatedCourses() {
        const unevaluated = [];

        // 方法1：使用精确的选择器 (基于实际页面结构)
        // 课程卡片: div.bh-card[data-action="评教"]
        const cards = document.querySelectorAll('.bh-card[data-action="评教"]');
        cards.forEach(card => {
            // 检查是否包含"未评教"标签 (sc-panel-warning 类)
            const warningBadge = card.querySelector('.sc-panel-warning, .sc-panel-diagonalStrips-bar');
            if (warningBadge && warningBadge.textContent.includes('未评教')) {
                unevaluated.push(card);
            }
        });

        log(`方法1: 找到 ${unevaluated.length} 张卡片`);

        // 方法2：备选 - 查找所有bh-card并检查内容
        if (unevaluated.length === 0) {
            const allCards = document.querySelectorAll('.bh-card');
            allCards.forEach(card => {
                if (card.textContent.includes('未评教') && !card.textContent.includes('已评教')) {
                    unevaluated.push(card);
                }
            });
            log(`方法2: 找到 ${unevaluated.length} 张卡片`);
        }

        // 方法3：再备选 - 通过data-wjwid属性查找
        if (unevaluated.length === 0) {
            const wjCards = document.querySelectorAll('[data-wjwid]');
            wjCards.forEach(card => {
                if (card.textContent.includes('未评教')) {
                    unevaluated.push(card);
                }
            });
            log(`方法3: 找到 ${unevaluated.length} 张卡片`);
        }

        log(`总共找到 ${unevaluated.length} 门未评教课程`);
        return unevaluated;
    }

    // Select all "完全同意" (Totally Agree) options - 选择所有"完全同意"选项
    function selectAllTotallyAgree() {
        // 方法1: 查找所有包含"完全同意"文本的label并点击
        const allLabels = document.querySelectorAll('label');
        const targetLabels = [];

        allLabels.forEach(label => {
            const text = label.textContent.trim();
            if (text === '完全同意') {
                targetLabels.push(label);
            }
        });

        log(`找到 ${targetLabels.length} 个"完全同意"选项`);

        // 逐个点击，每个选项之间有延迟
        targetLabels.forEach((label, index) => {
            setTimeout(() => {
                // 查找关联的radio input
                const radio = label.querySelector('input[type="radio"]') ||
                             document.getElementById(label.getAttribute('for'));

                if (radio && !radio.checked) {
                    // 点击label（对自定义样式的radio更可靠）
                    label.click();
                    if (CONFIG.DEBUG) {
                        console.log(`[FudanEval] 点击选项 ${index + 1}/${targetLabels.length}`);
                    }
                } else if (!radio) {
                    // 如果没有找到radio，直接点击label
                    label.click();
                }
            }, index * CONFIG.CLICK_DELAY); // 每个选项之间的延迟
        });

        // 方法2: 如果方法1没有找到，尝试其他选择器
        if (targetLabels.length === 0) {
            log('尝试备选方法查找选项...');

            // 查找带有特定value的radio
            const radioInputs = document.querySelectorAll('input[type="radio"][value="100"]');
            radioInputs.forEach((radio, index) => {
                setTimeout(() => {
                    if (!radio.checked) {
                        radio.click();
                    }
                }, index * CONFIG.CLICK_DELAY);
            });

            if (radioInputs.length > 0) {
                log(`备选方法找到 ${radioInputs.length} 个选项`);
                return radioInputs.length;
            }
        }

        // 方法3: ZeroStar 评分组件（如果存在）
        const zeroStarItems = document.querySelectorAll('.zeroStarItem, .star-item');
        if (zeroStarItems.length > 0 && targetLabels.length === 0) {
            zeroStarItems.forEach((item, index) => {
                setTimeout(() => {
                    const stars = item.querySelectorAll('.star, [class*="star"]');
                    if (stars.length > 0) {
                        stars[stars.length - 1].click();
                    }
                }, index * CONFIG.CLICK_DELAY);
            });
            log(`ZeroStar方法找到 ${zeroStarItems.length} 个评分项`);
            return zeroStarItems.length;
        }

        return targetLabels.length;
    }

    // Click submit button - 点击提交按钮
    async function submitForm() {
        let submitBtn = null;

        // 方法1: 精确查找 - 底部栏中文本为"提交"的按钮
        const allBtns = document.querySelectorAll('a.bh-btn, button.bh-btn');
        for (const btn of allBtns) {
            if (btn.textContent.trim() === '提交' && btn.offsetParent !== null) {
                submitBtn = btn;
                break;
            }
        }

        // 方法2: 通过类名和位置查找
        if (!submitBtn) {
            const primaryBtns = document.querySelectorAll('.bh-btn.bh-btn-primary');
            for (const btn of primaryBtns) {
                if (btn.textContent.trim() === '提交') {
                    submitBtn = btn;
                    break;
                }
            }
        }

        // 方法3: 备选 - 查找任何文本为"提交"的可见链接或按钮
        if (!submitBtn) {
            const allLinks = document.querySelectorAll('a, button');
            submitBtn = Array.from(allLinks).find(el => {
                const text = el.textContent.trim();
                return text === '提交' && el.offsetParent !== null;
            });
        }

        if (submitBtn) {
            log('点击提交按钮');
            submitBtn.click();
            await sleep(CONFIG.SUBMIT_DELAY);

            // 处理确认对话框
            const confirmed = await handleConfirmDialog();
            log(confirmed ? '确认对话框已处理' : '等待确认对话框');

            return true;
        }

        log('未找到提交按钮');
        return false;
    }

    // Handle confirmation dialog - 处理确认对话框
    async function handleConfirmDialog() {
        // 等待对话框出现
        await sleep(800);

        let confirmBtn = null;

        // 方法1: BH对话框的确定按钮 (精确选择器)
        confirmBtn = document.querySelector('a.bh-dialog-btn.bh-bg-primary');
        if (confirmBtn) {
            log('找到BH对话框确定按钮');
            confirmBtn.click();
            await sleep(500);
            return true;
        }

        // 方法2: 通过类名查找
        confirmBtn = document.querySelector('.bh-dialog-btn.bh-bg-primary, .bh-dialog-btn-confirm');
        if (confirmBtn && confirmBtn.offsetParent !== null) {
            log('找到确认按钮 (类名匹配)');
            confirmBtn.click();
            await sleep(500);
            return true;
        }

        // 方法3: layui对话框按钮
        confirmBtn = document.querySelector('.layui-layer-btn0');
        if (confirmBtn) {
            log('找到layui确认按钮');
            confirmBtn.click();
            await sleep(500);
            return true;
        }

        // 方法4: 通过文本内容查找"确定"按钮
        const allButtons = document.querySelectorAll('a.bh-dialog-btn, button, .layui-layer-btn a');
        for (const btn of allButtons) {
            const text = btn.textContent.trim();
            if (text === '确定' && btn.offsetParent !== null) {
                log('找到确定按钮 (文本匹配)');
                btn.click();
                await sleep(500);
                return true;
            }
        }

        // 方法5: 备选 - 查找任何包含确定文字的可见按钮
        const allLinks = document.querySelectorAll('a, button');
        for (const btn of allLinks) {
            if (btn.textContent.trim() === '确定' && btn.offsetParent !== null) {
                log('找到确定按钮 (备选方法)');
                btn.click();
                await sleep(500);
                return true;
            }
        }

        log('未找到确认按钮');
        return false;
    }

    // Close current form
    async function closeForm() {
        // Try various close button selectors
        const closeSelectors = [
            '.pj-form-footer a:nth-child(3)',
            '.bh-paper-pile-footer a:last-child',
            '.bh-dialog-close',
            '.layui-layer-close',
            'a.bh-btn-default'
        ];

        for (const selector of closeSelectors) {
            const closeBtn = document.querySelector(selector);
            if (closeBtn && (closeBtn.textContent.includes('关闭') || closeBtn.textContent.includes('Close'))) {
                log('Clicking close button');
                closeBtn.click();
                await sleep(CONFIG.CLICK_DELAY);
                return true;
            }
        }

        // Fallback: find by text
        const closeBtn = Array.from(document.querySelectorAll('a, button')).find(el => {
            return el.textContent.trim() === '关闭' && el.offsetParent !== null;
        });

        if (closeBtn) {
            log('Clicking close button (text match)');
            closeBtn.click();
            await sleep(CONFIG.CLICK_DELAY);
            return true;
        }

        // Try clicking X button in modal header
        const xBtn = document.querySelector('.bh-dialog-close, .close, [class*="close"]');
        if (xBtn) {
            xBtn.click();
            await sleep(CONFIG.CLICK_DELAY);
            return true;
        }

        return false;
    }

    // Process single course evaluation - 处理单个课程评教
    async function processSingleCourse() {
        log('正在处理当前评教表单');

        // 等待表单加载
        await sleep(CONFIG.PAGE_LOAD_DELAY);

        // 检查表单是否已加载
        const formVisible = document.body.innerHTML.includes('完全同意');
        if (!formVisible) {
            log('表单未加载，继续等待...');
            await sleep(1500);
        }

        // 选择所有"完全同意"
        const selectedCount = selectAllTotallyAgree();
        log(`开始选中选项，预计 ${selectedCount} 项`);

        // 重要：等待所有选项点击完成
        // 每个选项点击间隔约50ms，加上额外的缓冲时间
        const waitTime = Math.max(CONFIG.FILL_COMPLETE_DELAY, selectedCount * 100 + 500);
        log(`等待 ${waitTime}ms 确保所有选项都已选中...`);
        await sleep(waitTime);

        // 验证选项是否都已选中
        const checkedCount = document.querySelectorAll('input[type="radio"]:checked, .bh-radio-checked, [class*="checked"]').length;
        log(`验证：已选中 ${checkedCount} 个选项`);

        // 提交表单
        log('准备提交表单...');
        const submitted = await submitForm();

        if (submitted) {
            log('表单已提交，等待确认对话框...');

            // 等待确认对话框出现
            await sleep(CONFIG.CONFIRM_DELAY);

            // 处理确认对话框
            const confirmed = await handleConfirmDialog();
            log(confirmed ? '确认对话框已处理' : '确认对话框处理可能失败');

            // 等待操作完成
            await sleep(CONFIG.NEXT_COURSE_DELAY);

            // 检查并关闭可能还开着的表单
            const closeBtn = Array.from(document.querySelectorAll('a.bh-btn, button')).find(
                el => el.textContent.trim() === '关闭' && el.offsetParent !== null
            );
            if (closeBtn) {
                log('关闭表单');
                closeBtn.click();
                await sleep(500);
            }

            return true;
        }

        log('表单提交失败');
        return false;
    }

    // Process all courses automatically - 自动处理所有课程
    async function processAllCourses() {
        log('开始自动评教流程');
        updateStatus('正在处理...');

        // 确保在课程列表页面
        const isOnListPage = window.location.hash === '#/wspj' || window.location.hash.includes('wspj');

        if (!isOnListPage) {
            log('不在课程列表页面，尝试导航');
            const listLink = document.querySelector('a[href*="wspj"]') ||
                           Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('网上评教'));
            if (listLink) {
                listLink.click();
                await sleep(CONFIG.PAGE_LOAD_DELAY);
            }
        }

        await sleep(CONFIG.PAGE_LOAD_DELAY);

        let processedCount = 0;
        let maxIterations = 50;
        let consecutiveFailures = 0;

        while (maxIterations > 0 && consecutiveFailures < 3) {
            maxIterations--;

            // 获取未评教课程
            const courses = getUnevaluatedCourses();
            log(`发现 ${courses.length} 门未评教课程`);

            if (courses.length === 0) {
                log('所有课程已评教完成！');
                break;
            }

            // 获取课程名称用于显示
            const courseContent = courses[0].querySelector('.pjwj_card_content, .sc-panel-diagonalStrips-text');
            const courseName = courseContent ? courseContent.textContent.trim() : courses[0].textContent.substring(0, 30).replace(/\s+/g, ' ').trim();

            log(`正在处理: ${courseName}...`);
            updateStatus(`正在处理: ${courseName.substring(0, 10)}...`);

            // 触发点击事件 - 使用 dispatchEvent 确保事件被正确处理
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            courses[0].dispatchEvent(clickEvent);

            // 等待表单加载
            await sleep(CONFIG.PAGE_LOAD_DELAY + 1000);

            // 检查表单是否已打开
            const formOpened = document.body.innerHTML.includes('完全同意') ||
                              document.querySelector('.bh-paper-pile-dialog');

            if (!formOpened) {
                log('表单未打开，尝试再次点击');
                courses[0].click();
                await sleep(CONFIG.PAGE_LOAD_DELAY);
            }

            // 处理表单
            const success = await processSingleCourse();

            if (success) {
                processedCount++;
                consecutiveFailures = 0;
                log(`已完成 ${processedCount} 门课程`);
                updateStatus(`已完成 ${processedCount} 门`);
            } else {
                consecutiveFailures++;
                log(`处理失败 (${consecutiveFailures}/3)`);
                // 尝试关闭可能打开的对话框
                await closeForm();
            }

            // 等待页面稳定
            await sleep(CONFIG.NEXT_COURSE_DELAY);
        }

        const message = `评教完成！共完成 ${processedCount} 门课程的评教。`;
        log(message);
        updateStatus(`完成 ${processedCount} 门`);
        alert(message);
    }

    // ===========================================
    // UI Controls - 界面控制
    // ===========================================
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'fudan-eval-panel';
        panel.innerHTML = `
            <style>
                #fudan-eval-panel {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 99999;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 15px;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    min-width: 180px;
                }
                #fudan-eval-panel h3 {
                    color: white;
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    font-weight: 600;
                    text-align: center;
                }
                #fudan-eval-panel button {
                    display: block;
                    width: 100%;
                    margin: 8px 0;
                    padding: 10px 16px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                #fudan-eval-panel button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                #fudan-eval-panel .btn-primary {
                    background: #ffffff;
                    color: #667eea;
                }
                #fudan-eval-panel .btn-primary:hover {
                    background: #f0f0ff;
                }
                #fudan-eval-panel .btn-secondary {
                    background: rgba(255,255,255,0.2);
                    color: white;
                }
                #fudan-eval-panel .btn-secondary:hover {
                    background: rgba(255,255,255,0.3);
                }
                #fudan-eval-panel .btn-danger {
                    background: #ff6b6b;
                    color: white;
                }
                #fudan-eval-panel .btn-danger:hover {
                    background: #ff5252;
                }
                #fudan-eval-panel .status {
                    color: rgba(255,255,255,0.9);
                    font-size: 11px;
                    text-align: center;
                    margin-top: 8px;
                }
                #fudan-eval-panel .minimize-btn {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.3);
                    color: white;
                    font-size: 12px;
                    line-height: 20px;
                    text-align: center;
                    cursor: pointer;
                }
            </style>
            <div class="minimize-btn" id="minimize-panel">-</div>
            <h3>复旦评教助手</h3>
            <button class="btn-primary" id="btn-auto-all">自动完成全部（推荐）</button>
            <button class="btn-secondary" id="btn-fill-all">填充当前</button>
            <button class="btn-danger" id="btn-close">关闭面板</button>
            <div class="status" id="eval-status">就绪</div>
        `;

        document.body.appendChild(panel);

        // Event listeners - 事件监听
        document.getElementById('btn-auto-all').addEventListener('click', async () => {
            updateStatus('自动处理中...');
            await processAllCourses();
        });

        document.getElementById('btn-fill-all').addEventListener('click', async () => {
            updateStatus('正在填充...');
            const count = selectAllTotallyAgree();
            updateStatus(`已填充 ${count} 项`);
        });

        document.getElementById('btn-close').addEventListener('click', () => {
            panel.remove();
        });

        document.getElementById('minimize-panel').addEventListener('click', () => {
            const content = panel.querySelectorAll('button, .status, h3');
            const isMinimized = panel.dataset.minimized === 'true';

            content.forEach(el => {
                el.style.display = isMinimized ? '' : 'none';
            });

            panel.dataset.minimized = isMinimized ? 'false' : 'true';
            document.getElementById('minimize-panel').textContent = isMinimized ? '-' : '+';
            panel.style.minWidth = isMinimized ? '180px' : '50px';
        });
    }

    function updateStatus(text) {
        const status = document.getElementById('eval-status');
        if (status) {
            status.textContent = text;
        }
        log(text);
    }

    // ===========================================
    // Initialize - 初始化
    // ===========================================
    function init() {
        log('复旦评教助手已加载');

        // Wait for page to be ready - 等待页面就绪
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(createControlPanel, 1000);
            });
        } else {
            setTimeout(createControlPanel, 1000);
        }
    }

    init();
})();

