// ==UserScript==
// @name         小r究极无敌强化监测
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  究极秘密插件，新增防呆保护功能，新增队列快速确认
// @author       XiaoR
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      不公开
// @downloadURL https://update.greasyfork.org/scripts/549261/%E5%B0%8Fr%E7%A9%B6%E6%9E%81%E6%97%A0%E6%95%8C%E5%BC%BA%E5%8C%96%E7%9B%91%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/549261/%E5%B0%8Fr%E7%A9%B6%E6%9E%81%E6%97%A0%E6%95%8C%E5%BC%BA%E5%8C%96%E7%9B%91%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 超强化监测相关变量
    let isTitleMonitoring = false;
    let titleObserver;

    // 强化监测相关变量
    let isAutoClickEnabled = true;
    let autoClickObserver;
    // 添加上次执行时间变量，用于性能优化
    let lastAutoClickTime = 0;
    // 设置最小执行间隔（毫秒）
    const MIN_INTERVAL = 300;
    // 存储上次点击的按钮，避免重复点击同一个按钮
    let lastClickedButton = null;

    // 自动确认对话框相关变量
    // 始终开启，无需控制开关
    const isDialogConfirmEnabled = true;
    let dialogConfirmObserver;
    let lastDialogConfirmTime = 0;
    const DIALOG_CONFIRM_MIN_INTERVAL = 200; // 对话框确认的最小间隔时间

    // 防呆保护相关变量
    let antiFoolIntervalId = null;
    const ANTI_FOOL_CHECK_INTERVAL = 2000; // 检测间隔2秒

    // 通用的停止按钮点击函数
    function clickStopButton() {
        try {
            // 使用与超级监测相同的选择器
            const stopButtonElement = document.querySelector('#root > div > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > button');
            if (stopButtonElement && stopButtonElement.textContent) {
                stopButtonElement.click();
                console.log('已点击停止按钮');
            }
        } catch (error) {
            console.error('点击停止按钮出错:', error);
        }
    }

    // 创建按钮容器 - 修改为左下角位置
    function createButtonContainer() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';
        document.body.appendChild(container);
        return container;
    }

    // 创建统一样式的按钮
    function createButton(text, backgroundColor, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.padding = '8px 12px';
        btn.style.backgroundColor = backgroundColor;
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        btn.style.width = '120px';

        btn.addEventListener('click', onClick);

        return btn;
    }

    // 超强化监测功能
    function startTitleMonitoring() {
        titleObserver = new MutationObserver(() => {
            // 创建目标标题数组，通过循环为每个标题添加前缀和格式化
            const baseTitles = [
                "棉靴 +7", "奶酪靴 +7", "奶酪护手 +7", "棉手套 +7", "粗糙靴 +7", 
                "粗糙护腕 +7", "瞄准护腕", "奶酪护手 +15", "棉靴 +15", "奶酪靴",
                "棉手套 +15", "粗糙靴 +15", "粗糙护腕 +15", "治疗之书", "鳄鱼马甲", 
                "鳄鱼马甲 +6", "鳄鱼马甲 +16", "哥布林关刀", "哥布林弹弓", "哥布林火棍",
                "神圣强化器", "神圣蒸馏器", "神圣剪刀", "神圣斧头", "神圣锤子", 
                "神圣锅铲", "神圣刷子", "神圣凿子", "神圣针", "神圣壶",
                "元素之书", "棕熊鞋", "巫师靴", "烈焰袍服", "烈焰袍裙", 
                "半人马靴", "月神袍服", "月神袍裙", "皇家自然系袍服", "皇家自然系袍裙", 
                "时空手套", "恢复戒指", "恢复耳环", "巫师项链", "经验项链", 
                "收藏家靴", "黑熊鞋", "北极熊鞋", "鲸头鹳鞋", "掌上监工", 
                "附魔手套", "速度项链", "磁力手套", "光辉帽"
            ];
            
            // 循环处理每个标题，添加格式和前缀
            const TARGET_TITLES = baseTitles.map(title => `强化 - ${title} -`);

            // 使用更高效的字符串检查方法
            const titleText = document.title;
            const isTargetTitle = TARGET_TITLES.some(title => titleText.includes(title));

            if (isTargetTitle) {
                // 使用提取出来的通用停止按钮点击函数
                clickStopButton();
            }
        });

        titleObserver.observe(document.querySelector('title'), {
            childList: true,
            subtree: true,
            characterData: true
        });

        titleObserver.takeRecords();
    }

    function stopTitleMonitoring() {
        if (titleObserver) {
            titleObserver.disconnect();
        }
    }

    // 自动点击功能 - 全面性能优化
    function startAutoClick() {
        // 使用更精确的观察配置
        autoClickObserver = new MutationObserver((mutations) => {
            if (!isAutoClickEnabled) return;

            // 获取当前时间
            const currentTime = Date.now();
            // 检查是否已经过了最小间隔时间
            if (currentTime - lastAutoClickTime < MIN_INTERVAL) {
                return; // 未到间隔时间，不执行后续逻辑
            }

            // 添加防抖逻辑，合并短时间内的多次变化
            let shouldProcess = false;
            mutations.forEach(mutation => {
                // 只处理有新节点添加的变化
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                }
            });
            const labels = document.querySelectorAll('div.SkillActionDetail_label__1mGQJ');
            const isCraft = Array.from(labels).some(label =>
                label.textContent?.trim() === '生产'
            );

            if (isCraft) {
                return;
            }

            if (!shouldProcess) return;

            try {
                // 使用更高效的选择器替代XPath
                const addToQueueButtons = document.querySelectorAll('button');
                let foundTargetButton = false;
                // 仅在lastHasProtection从false变为true时才打印日志
                const currentLastHasProtection = GM_getValue('lastHasProtection', false);
                const newHasProtection = checkProtection();
                if (!currentLastHasProtection && newHasProtection){
                    console.log('[DEBUG] lastHasProtection changed to: true');
                }
                if (currentLastHasProtection){
                    if (!newHasProtection) return;
                }
                // 遍历按钮集合寻找目标按钮
                for (let i = 0; i < addToQueueButtons.length; i++) {
                    const button = addToQueueButtons[i];
                    // 避免重复点击同一个按钮
                    if (button === lastClickedButton) continue;

                    // 检查按钮文本
                    if (button.textContent && button.textContent.trim().startsWith('添加到队列')) {
                        button.click();
                        console.log('检测到目标按钮并已点击', button.textContent.trim());
                        // 更新上次执行时间和上次点击的按钮
                        lastAutoClickTime = currentTime;
                        lastClickedButton = button;
                        foundTargetButton = true;
                        break; // 只点击第一个找到的按钮
                    }

                }
                GM_setValue('lastHasProtection', checkProtection());

                // 如果找不到目标按钮，重置上次点击的按钮引用
                if (!foundTargetButton) {
                    lastClickedButton = null;
                }
            } catch (error) {
                console.error('自动点击功能执行出错:', error);
            }
        });

        // 限制观察范围，提高性能
        const targetNode = document.body;
        autoClickObserver.observe(targetNode, {
            childList: true, // 只观察子节点变化
            subtree: true,   // 观察整个子树
            attributes: false,
            characterData: false
        });
    }

    function stopAutoClick() {
        if (autoClickObserver) {
            autoClickObserver.disconnect();
        }
    }

    // 使用XPath查找元素的辅助函数
    function findElementByXPath(xpath) {
        try {
            return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } catch (error) {
            console.error('XPath查询出错:', error);
            return null;
        }
    }

    // 自动确认对话框功能
    function startDialogConfirm() {
        // 使用更高效的观察方式，专注于对话框出现的位置
        dialogConfirmObserver = new MutationObserver(() => {
            // 始终执行，无需检查开关状态

            // 获取当前时间，检查是否已经过了最小间隔时间
            const currentTime = Date.now();
            if (currentTime - lastDialogConfirmTime < DIALOG_CONFIRM_MIN_INTERVAL) {
                return;
            }

            try {
                // 方法1: 使用用户提供的XPath查找对话框主体
                const dialogContainer = findElementByXPath('/html/body/div[11]/div[3]/div');

                if (dialogContainer) {
                    // 在对话框容器内查找消息文本和确定按钮
                    const dialogMessage = dialogContainer.querySelector('.DialogModal_message__2utk_');

                    if (dialogMessage && dialogMessage.textContent && dialogMessage.textContent.includes('现在运行此行动吗')) {
                        // 查找确定按钮
                        const confirmButton = dialogContainer.querySelector('.Button_button__1Fe9z.Button_success__6d6kU') ||
                                            dialogContainer.querySelector('.Button_success__6d6kU');

                        if (confirmButton && confirmButton.textContent && confirmButton.textContent.trim() === '确定') {
                            confirmButton.click();
                            console.log('已通过XPath自动确认对话框');
                            lastDialogConfirmTime = currentTime;
                            return; // 找到并点击后直接返回
                        }
                    }
                }

                // 方法2: 备用方案 - 使用类名查找，兼容不同情况
                const dialogMessage = document.querySelector('.DialogModal_message__2utk_');
                if (dialogMessage && dialogMessage.textContent && dialogMessage.textContent.includes('现在运行此行动吗')) {
                    const confirmButton = dialogMessage.closest('.MuiDialog-paper')?.querySelector('.Button_success__6d6kU');
                    if (confirmButton && confirmButton.textContent && confirmButton.textContent.trim() === '确定') {
                        confirmButton.click();
                        console.log('已通过类名自动确认对话框');
                        lastDialogConfirmTime = currentTime;
                    }
                }
            } catch (error) {
                console.error('自动确认对话框出错:', error);
            }
        });

        // 直接观察body，但减少回调频率
        dialogConfirmObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('自动确认对话框功能已启动，使用XPath优先策略');
    }

    // 自动确认对话框功能始终开启，不需要停止函数
    // 保留函数定义以保持兼容性

    // 一键收货功能（保持不变）
function collectAllOrders() {
    const validOrders = Array.from(document.querySelectorAll('tr'))
        .filter(tr => {
            const statusTd = tr.querySelector('td:first-child');
            // 兼容新旧版本状态标识
            return statusTd?.textContent?.trim().match(/有效/);
        });

    validOrders.forEach((order, index) => {
        setTimeout(() => {
            // 更新按钮选择器，使用更稳定的类名组合
            const collectBtn = order.querySelector('button.Button_button__1Fe9z:not([disabled])');
            if (collectBtn?.textContent?.trim() === '收集') {
                collectBtn.click();
                console.log(`已处理第 ${index + 1} 个有效订单`);
            }
        }, index * 500);
    });
}

    // 初始化
    function init() {
        // 创建按钮容器
        const container = createButtonContainer();

        // 创建超级监测按钮
        const titleMonitorBtn = createButton('超级监测：OFF', '#f44336', function() {
            isTitleMonitoring = !isTitleMonitoring;
            if (isTitleMonitoring) {
                this.textContent = '超级监测：ON';
                this.style.backgroundColor = '#4CAF50';
                startTitleMonitoring();
            } else {
                this.textContent = '超级监测：OFF';
                this.style.backgroundColor = '#f44336';
                stopTitleMonitoring();
            }
            GM_setValue('titleMonitoringEnabled', isTitleMonitoring);
        });
        container.appendChild(titleMonitorBtn);

        // 创建摸鱼按钮
        const autoClickBtn = createButton('摸鱼：ON', '#4CAF50', function() {
            isAutoClickEnabled = !isAutoClickEnabled;
            this.textContent = `摸鱼：${isAutoClickEnabled ? 'ON' : 'OFF'}`;
            this.style.backgroundColor = isAutoClickEnabled ? '#4CAF50' : '#f44336';
            GM_setValue('autoClickEnabled', isAutoClickEnabled);
            GM_setValue('lastHasProtection', false);
            // 根据状态控制自动点击功能
            if (isAutoClickEnabled) {
                startAutoClick();
            } else {
                stopAutoClick();
            }
        });
        container.appendChild(autoClickBtn);

        // 创建一键收货按钮
        const collectBtn = createButton('一键收货', '#2196F3', collectAllOrders);
        container.appendChild(collectBtn);

        // 自动确认对话框功能已集成，无需控制按钮

        // 从存储读取状态
        const savedState = GM_getValue('autoClickEnabled', true);
        isAutoClickEnabled = savedState;
        autoClickBtn.textContent = `摸鱼：${isAutoClickEnabled ? 'ON' : 'OFF'}`;
        autoClickBtn.style.backgroundColor = isAutoClickEnabled ? '#4CAF50' : '#f44336';

        // 自动确认对话框功能默认始终开启，无需读取状态

        // 读取超级监测的保存状态
        const savedTitleMonitorState = GM_getValue('titleMonitoringEnabled', false);
        isTitleMonitoring = savedTitleMonitorState;
        titleMonitorBtn.textContent = `超级监测：${isTitleMonitoring ? 'ON' : 'OFF'}`;
        titleMonitorBtn.style.backgroundColor = isTitleMonitoring ? '#4CAF50' : '#f44336';

        // 启动自动点击功能
        if (isAutoClickEnabled) {
            startAutoClick();
        }

        if (isTitleMonitoring) {
            startTitleMonitoring();
        }

        // 自动确认对话框功能始终开启，直接启动
        startDialogConfirm();

        // 默认启动防呆保护功能
        startAntiFoolProtection();
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 页面卸载时清理定时器
    window.addEventListener('beforeunload', function() {
        stopAntiFoolProtection();
    });

    // 在自执行函数内部添加检测函数
    function checkProtection() {
        const protectionElement = document.querySelector('.ItemSelector_emptySlot__1ns6h .ItemSelector_label__22ds9');
        var currentHasProtection = !protectionElement?.textContent?.includes('消耗物品');
        return currentHasProtection;
    }

    // 防呆保护功能 - 判断条件函数
    function checkAntiFoolConditions(A, B, C) {
        // 条件1: 如果B包含 目标: +x且x大于8, 又不包含保护字样 则触发停止
        const targetMatch = B?.match(/目标: \+(\d+)/);
        const hasTargetCondition = targetMatch && parseInt(targetMatch[1]) > 8 && !B?.includes('保护');

        // 条件2: 贤者无保护强化
        const hasSageCondition = A?.includes('贤者') && B?.includes('目标') && !B?.includes('保护');

        // 条件3: B包含目标字样且C包含贤者 鞋 弩 弓 三叉 速度 触发停止
        const criticalItems = ['贤者', '鹳鞋','熊鞋', '弩', '弓', '三叉', '速度', '靴'];
        const hasCriticalItemCondition = B?.includes('目标') && criticalItems.some(item => C?.includes(item));

        // 条件4: A包含 护符， B的目标x>3 ,且B没有保护 触发停止
        const hasCharmTargetCondition = A?.includes('护符') && targetMatch && parseInt(targetMatch[1]) > 3 && !B?.includes('保护');

        // 条件5: A包含'强化'但不包含'贤者和护符'，且B包含'保护'二字且保护等级低于3时触发停止
        const protectionLevelMatch = B?.match(/保护: \+(\d+)/);
        const protectionLevel = protectionLevelMatch ? parseInt(protectionLevelMatch[1]) : 0;
        const hasLowProtectionCondition = B?.includes('目标') && !A?.includes('贤者') && !A?.includes('护符') && B?.includes('保护') && protectionLevel <= 3;

        // 条件6: A出现 点金: 贤者之石碎片 或 ( 转化: 贤者之石碎片&& B不包含 催化剂 三个字)
        const hasPhilosopherStoneCondition =
            A?.includes('点金: 贤者之石碎片') ||
            (A?.includes('转化: 贤者之石碎片') && !B?.includes('催化剂'));

        // 任意条件满足则触发防呆保护
        return hasTargetCondition ||
               hasSageCondition ||
               hasCriticalItemCondition ||
               hasCharmTargetCondition ||
               hasLowProtectionCondition ||
               hasPhilosopherStoneCondition;
    }

    // 防呆保护检测函数
    function performAntiFoolCheck() {
        try {
            // 获取A、B、C三个元素的文本
            const A = document.querySelector('.Header_displayName__1hN09')?.textContent || '';
            const B = document.querySelector('.Header_secondaryInfo__1O1js')?.textContent || '';
            // C元素必须位于SkillActionDetail_protectionItemInputContainer__35ChM类的div内
            const CElement = document.querySelector('.SkillActionDetail_protectionItemInputContainer__35ChM .Item_iconContainer__5z7j4 svg.Icon_icon__2LtL_');
            const C = CElement?.getAttribute('aria-label') || '';

            // 检查是否满足防呆条件
            if (checkAntiFoolConditions(A, B, C)) {
                // 停止所有运行的功能
                stopAutoClick();
                stopTitleMonitoring();
                stopDialogConfirm();
                isAutoClickEnabled = false;
                isTitleMonitoring = false;
                isDialogConfirmEnabled = false;

                // 点击停止按钮（与超级监测使用同一个函数）
                clickStopButton();

                // 更新按钮状态
                const buttons = document.querySelectorAll('button');
                buttons.forEach(btn => {
                    if (btn.textContent.includes('摸鱼：ON')) {
                        btn.textContent = '摸鱼：OFF';
                        btn.style.backgroundColor = '#f44336';
                    }
                    if (btn.textContent.includes('超级监测：ON')) {
                        btn.textContent = '超级监测：OFF';
                        btn.style.backgroundColor = '#f44336';
                    }
                    if (btn.textContent.includes('自动确认：ON')) {
                        btn.textContent = '自动确认：OFF';
                        btn.style.backgroundColor = '#f44336';
                    }
                });

                // 保存状态
                GM_setValue('autoClickEnabled', false);
                GM_setValue('titleMonitoringEnabled', false);
                GM_setValue('dialogConfirmEnabled', false);

                // 显示提示信息
                alert('已检测到铸币操作，已自动停止');
                console.log('防呆保护已触发，已停止所有功能并点击停止按钮');
            }
        } catch (error) {
            console.error('防呆保护检测出错:', error);
        }
    }

    // 启动防呆保护
    function startAntiFoolProtection() {
        if (antiFoolIntervalId) {
            clearInterval(antiFoolIntervalId);
        }

        // 立即执行一次检测，然后每2秒执行一次
        performAntiFoolCheck();
        antiFoolIntervalId = setInterval(performAntiFoolCheck, ANTI_FOOL_CHECK_INTERVAL);
        console.log('防呆保护已启动');
    }

    // 停止防呆保护
    function stopAntiFoolProtection() {
        if (antiFoolIntervalId) {
            clearInterval(antiFoolIntervalId);
            antiFoolIntervalId = null;
            console.log('防呆保护已停止');
        }
    }
})();