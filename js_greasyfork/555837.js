// ==UserScript==
// @name        KYB的妙妙小工具
// @namespace   https://www.lspsp.me/
// @version     1.1
// @description 优化网站上的特定元素，支持可视化自定义优化和规则管理，内置部分优化规则，并且通过优化资源和统计脚本提高网站加载速度
// @author      KYB
// @match       https://www.lspsp.me/*
// @match       *://widget.weibo.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/555837/KYB%E7%9A%84%E5%A6%99%E5%A6%99%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/555837/KYB%E7%9A%84%E5%A6%99%E5%A6%99%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CSS 样式常量 ====================
    const PANEL_STYLES = `
        .lsp-blocker-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: linear-gradient(135deg, #d24f70, #ff7e9d);
            border: none;
            border-radius: 4px;
            width: 28px;
            height: 28px;
            cursor: pointer;
            color: white;
            font-size: 12px;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        }

        .lsp-blocker-btn:hover {
            transform: scale(1.1);
            background: linear-gradient(135deg, #bf3a5b, #e66784);
        }

        .lsp-panel-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
        }

        .lsp-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ffd9e4, #ffe6ee);
            border: 2px solid #d24f70;
            padding: 16px;
            z-index: 9999;
            box-shadow: 0 8px 32px rgba(210, 79, 112, 0.3);
            border-radius: 16px;
            width: 340px;
            max-height: 80vh;
            overflow-y: auto;
            color: #5a2a3a;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .lsp-panel::-webkit-scrollbar {
            display: none;
        }

        .lsp-panel-section {
            margin-bottom: 12px;
            background: rgba(255, 255, 255, 0.7);
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #ffb3c8;
        }

        .lsp-panel-title {
            margin: 0 0 12px 0;
            color: #d24f70;
            font-size: 16px;
            text-align: center;
            border-bottom: 1px solid #ffb3c8;
            padding-bottom: 8px;
        }

        .lsp-panel-subtitle {
            margin: 0 0 8px 0;
            color: #d24f70;
            font-size: 13px;
        }

        .lsp-panel-checkbox {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 2px 0;
            font-size: 12px;
        }

        .lsp-panel-checkbox input {
            margin-right: 6px;
            accent-color: #d24f70;
        }

        .lsp-panel-button {
            width: 100%;
            padding: 6px;
            background: linear-gradient(135deg, #d24f70, #ff7e9d);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            font-size: 12px;
            transition: all 0.2s ease;
            margin-bottom: 4px;
        }

        .lsp-panel-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 6px rgba(210, 79, 112, 0.3);
        }

        .lsp-panel-button-secondary {
            background: linear-gradient(135deg, #8c4a5e, #a85c74);
        }

        .lsp-panel-stats {
            font-size: 10px;
            color: #8c4a5e;
            text-align: center;
            margin-top: 2px;
        }

        .lsp-close-button {
            position: absolute;
            top: -10px;
            right: -10px;
            background: #d24f70;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            color: white;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            line-height: 1;
            padding: 0;
        }

        .lsp-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #d24f70, #ff7e9d);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 1px solid #bf3a5b;
        }

        .lsp-floating-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #d24f70, #ff7e9d);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            color: white;
            font-size: 20px;
            z-index: 9998;
            box-shadow: 0 4px 12px rgba(210, 79, 112, 0.3);
            transition: all 0.3s ease;
        }

        .lsp-floating-button:hover {
            transform: scale(1.1) rotate(30deg);
            background: linear-gradient(135deg, #bf3a5b, #e66784);
        }
    `;

    // ==================== 配置管理模块 ====================
    const ConfigManager = {
        KEYS: {
            BLOCK_RULES: 'blockRules',
            SETTINGS: 'settings'
        },

        DEFAULT_SETTINGS: {
            // 默认规则开关
            blockWeibo: true,
            blockExtra: true,
            blockFooter: true,
            blockSubscribe: true,

            // 功能开关
            blockOwnedGames: false,
            blockWinLottery: false,
            blockMissedLottery: false,
            blockInstantLottery: false,

            // 调试模式
            debugMode: false
        },

        cachedConfig: null,

        getConfig() {
            if (!this.cachedConfig) {
                this.cachedConfig = this.initConfig();
            }
            return this.cachedConfig;
        },

        initConfig() {
            const storedSettings = GM_getValue(this.KEYS.SETTINGS);
            const settings = { ...this.DEFAULT_SETTINGS, ...storedSettings };

            let blockRules = GM_getValue(this.KEYS.BLOCK_RULES);
            if (!blockRules) {
                blockRules = {
                    weibo: [],
                    extra: [],
                    footer: ['lspsp.me###footer'],
                    subscribe: [],
                    lspfree: [],
                    lottery: [],
                    ownedGames: [],
                    winLottery: [],
                    missedLottery: [],
                    instantLottery: [],
                    custom: []
                };
            }

            // 确保所有规则数组都存在
            const defaultRuleKeys = [
                'weibo', 'extra', 'footer', 'subscribe',
                'lspfree', 'lottery', 'custom',
                'ownedGames', 'winLottery', 'missedLottery', 'instantLottery'
            ];
            defaultRuleKeys.forEach(key => {
                if (!Array.isArray(blockRules[key])) {
                    blockRules[key] = [];
                }
            });

            // 保存合并后的配置
            if (!storedSettings || JSON.stringify(storedSettings) !== JSON.stringify(settings)) {
                GM_setValue(this.KEYS.SETTINGS, settings);
            }
            if (!GM_getValue(this.KEYS.BLOCK_RULES) || JSON.stringify(GM_getValue(this.KEYS.BLOCK_RULES)) !== JSON.stringify(blockRules)) {
                GM_setValue(this.KEYS.BLOCK_RULES, blockRules);
            }

            return { settings, blockRules };
        },

        clearCache() {
            this.cachedConfig = null;
        },

        saveSettings(settings) {
            GM_setValue(this.KEYS.SETTINGS, settings);
            this.clearCache();
        },

        saveBlockRules(blockRules) {
            GM_setValue(this.KEYS.BLOCK_RULES, blockRules);
            this.clearCache();
        }
    };

    // ==================== 资源优化模块 (多层防御机制) ====================
    const ResourceBlocker = {
        observer: null,

        init() {
            const { settings } = ConfigManager.getConfig();

            // 1. 启动属性劫持 (网络/执行层 - 最底层)
            this.setupInterceptors(settings);

            // 2. 启动 DOM 监听 (DOM 清理层 - 最上层)
            this.setupMutationObserver(settings);
        },

        // 通用属性劫持函数
        hijackProperty(prototype, propertyName, checkFunction) {
            const desc = Object.getOwnPropertyDescriptor(prototype, propertyName);
            if (desc && desc.set) {
                Object.defineProperty(prototype, propertyName, {
                    set: function(v) {
                        if (checkFunction(v)) {
                            debugLog(`属性劫持成功: ${propertyName}`, v);
                            return; // 劫持成功，直接返回，不执行原setter
                        }
                        desc.set.call(this, v);
                    },
                    get: function() { return desc.get.call(this); }
                });
            }
        },

        setupInterceptors(settings) {
            // A. 优化 Script 脚本 (Google Analytics, 微博组件JS)
            this.hijackProperty(HTMLScriptElement.prototype, 'src', (url) => {
                if (typeof url !== 'string') return false;

                // 必须优化的统计脚本 - 无条件执行
                if (url.includes('sinajs.cn/open/analytics') ||
                    url.includes('googletagmanager.com/gtag') ||
                    url.includes('google-analytics.com') ||
                    url.includes('analytics.js')) {
                    debugLog(`优化统计脚本: ${url}`);
                    return true;
                }

                // 微博组件 JS - 仅在开启时执行
                if (settings.blockWeibo && url.includes('widget.weibo.com')) {
                    debugLog(`优化微博脚本: ${url}`);
                    return true;
                }
                return false;
            });

            // B. 优化 Image 图片 (Sina JS, 店铺/群宣图片)
            this.hijackProperty(HTMLImageElement.prototype, 'src', (url) => {
                if (typeof url !== 'string') return false;

                // Sina JS 图片 - 无条件优化
                if (url.includes('rs.sinajs.cn')) {
                    debugLog(`优化Sina图片: ${url}`);
                    return true;
                }

                // 优化店铺和群宣：优化特定图片 - 仅在开启时执行
                if (settings.blockExtra) {
                    if (url.includes('/global/extra/ex-shop-pc.jpg') ||
                        url.includes('/global/extra/ex-review-pc.jpg') ||
                        url.includes('static.lspsp.cn/global/extra/ex-')) {
                        debugLog(`优化推广图片: ${url}`);
                        return true;
                    }
                }
                return false;
            });

            // C. 优化 Iframe (微博嵌入) - 仅在开启时执行
            if (settings.blockWeibo) {
                this.hijackProperty(HTMLIFrameElement.prototype, 'src', (url) => {
                    if (typeof url === 'string' && url.includes('weibo.com')) {
                        debugLog(`优化微博Iframe: ${url}`);
                        return true;
                    }
                    return false;
                });
            }
        },

        setupMutationObserver(settings) {
            this.observer = new MutationObserver(mutations => this.handleMutations(mutations, settings));
            this.observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        },

        handleMutations(mutations, settings) {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // ELEMENT_NODE
                        this.cleanNode(node, settings);
                    }
                }
            }
        },

        cleanNode(element, settings) {
            // 1. 优化 Google Analytics (Script) - 无条件执行
            if (element.tagName === 'SCRIPT') {
                if ((element.src && (
                    element.src.includes('googletagmanager.com/gtag') ||
                    element.src.includes('google-analytics.com') ||
                    element.src.includes('analytics.js')
                )) || (!element.src && element.textContent.includes('gtag('))) {
                    element.remove();
                    debugLog('已优化Google Analytics脚本');
                    return;
                }
            }

            // 2. 优化微博元素 (DIV / IFRAME) - 仅在开启时执行
            if (settings.blockWeibo) {
                if (element.matches && (
                    element.matches('#weibo') ||
                    element.matches('.weibo') ||
                    element.matches('.widget-weibo') ||
                    (element.tagName === 'IFRAME' && element.src && element.src.includes('weibo.com'))
                )) {
                    element.remove();
                    debugLog('已优化微博DOM元素');
                    return;
                }
            }

            // 3. 优化店铺和群宣容器 (DIV#extra) - 仅在开启时执行
            if (settings.blockExtra) {
                if (element.id === 'extra' || (element.matches && element.matches('#extra'))) {
                    element.remove();
                    debugLog('已优化推广容器 #extra');
                    return;
                }
            }
        }
    };

    // ==================== 规则管理模块 ====================
    const RuleManager = {
        generateFunctionalRules() {
            const { settings } = ConfigManager.getConfig();
            const blockRules = GM_getValue(ConfigManager.KEYS.BLOCK_RULES);

            // 仅在对应页面生成对应规则，其他页面保留旧规则
            if (window.location.pathname === '/bonus') {
                if (settings.blockOwnedGames) {
                    blockRules.ownedGames = this.generateOwnedGamesRules();
                }
            } else if (window.location.pathname === '/lottery') {
                // 仅重置乐透相关规则
                blockRules.winLottery = [];
                blockRules.missedLottery = [];
                blockRules.instantLottery = [];

                this.generateLotteryRules(blockRules, settings);
            }

            ConfigManager.saveBlockRules(blockRules);
            debugLog('功能规则已更新');
        },

        generateOwnedGamesRules() {
            const rules = [];
            const games = document.querySelectorAll('.widget.lspfree');

            games.forEach(game => {
                const ownedButton = game.querySelector('button.owned');
                if (ownedButton) {
                    const goid = ownedButton.getAttribute('data-goid');
                    if (goid) {
                        const rule = `lspsp.me##div.widget.lspfree:has(button[data-goid="${goid}"])`;
                        rules.push(rule);
                    }
                }
            });

            debugLog(`已生成 ${rules.length} 条已领取游戏规则`);
            return rules;
        },

        generateLotteryRules(blockRules, settings) {
            const lotteries = document.querySelectorAll('.widget.lottery');

            lotteries.forEach(lottery => {
                const lotteryId = lottery.getAttribute('data-lottery-id');
                if (!lotteryId) return;

                const lotteryState = lottery.getAttribute('data-lottery-state');
                const userState = lottery.getAttribute('data-user-state');
                const isInstant = lottery.getAttribute('data-is-instant');

                const rule = `lspsp.me##div.widget.lottery[data-lottery-id="${lotteryId}"]`;

                // 即刻领取项目：中奖且是即刻领取
                if (settings.blockInstantLottery && userState === 'win' && isInstant === '1') {
                    blockRules.instantLottery.push(rule);
                }

                // 中奖项目：乐透已结束、中奖、非即刻领取
                if (settings.blockWinLottery && lotteryState === 'ended' && userState === 'win' && isInstant === '0') {
                    blockRules.winLottery.push(rule);
                }

                // 未中奖项目：乐透已结束、未中奖
                if (settings.blockMissedLottery && lotteryState === 'ended' && userState === 'missed') {
                    blockRules.missedLottery.push(rule);
                }
            });

            debugLog(`乐透规则生成完成 - 中奖:${blockRules.winLottery.length}, 未中奖:${blockRules.missedLottery.length}, 即刻领取:${blockRules.instantLottery.length}`);
        },

        exportRules() {
            const { settings, blockRules } = ConfigManager.getConfig();
            const allAdBlockRules = [];

            // 添加网络优化规则
            if (settings.blockWeibo) {
                allAdBlockRules.push('||widget.weibo.com^$domain=lspsp.me');
            }
            if (settings.blockExtra) {
                allAdBlockRules.push('||static.lspsp.cn/global/extra/ex-$domain=lspsp.me');
            }

            // 添加元素优化规则 - 无论当前在哪个页面都导出所有规则
            if (settings.blockFooter) {
                allAdBlockRules.push(...blockRules.footer);
            }
            if (settings.blockSubscribe) {
                // 手动添加预约成功信息规则
                allAdBlockRules.push('lspsp.me##div.subscribe-state');
            }

            // 添加功能规则 - 无论当前在哪个页面都导出所有规则
            allAdBlockRules.push(...blockRules.lspfree);
            allAdBlockRules.push(...blockRules.lottery);
            allAdBlockRules.push(...blockRules.custom);

            // 添加动态功能规则 - 无论当前在哪个页面都导出所有规则
            allAdBlockRules.push(...blockRules.ownedGames);
            allAdBlockRules.push(...blockRules.winLottery);
            allAdBlockRules.push(...blockRules.missedLottery);
            allAdBlockRules.push(...blockRules.instantLottery);

            // 去重并排序，过滤空规则
            const uniqueRules = [...new Set(allAdBlockRules)]
                .filter(rule => rule && rule.trim())
                .sort();

            const exportText = uniqueRules.join('\n');

            debugLog(`导出 ${uniqueRules.length} 条规则`);

            // 复制到剪贴板
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(exportText);
                showMessage(`已复制 ${uniqueRules.length} 条规则到剪贴板`);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = exportText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showMessage(`已复制 ${uniqueRules.length} 条规则到剪贴板`);
            }
        },

        convertAdBlockToCSS(adblockRule) {
            if (!adblockRule || typeof adblockRule !== 'string') return '';

            const trimmedRule = adblockRule.trim();
            if (!trimmedRule) return '';

            // 处理AdBlock格式的规则
            if (trimmedRule.includes('##')) {
                const parts = trimmedRule.split('##');
                if (parts.length >= 2) {
                    const selector = parts[1].trim();
                    return `${selector} { display: none !important; }`;
                }
            }

            // 如果已经是CSS规则，直接返回
            return `${trimmedRule} { display: none !important; }`;
        }
    };

    // ==================== UI管理模块 ====================
    const UIManager = {
        addBlockButtons() {
            if (window.location.pathname === '/bonus') {
                this.addLSPFreeBlockButtons();
            } else if (window.location.pathname === '/lottery') {
                this.addLotteryBlockButtons();
            }
        },

        addLSPFreeBlockButtons() {
            const games = document.querySelectorAll('.widget.lspfree');

            if (!document.body.hasAttribute('data-lspfree-delegated')) {
                document.body.setAttribute('data-lspfree-delegated', 'true');
                document.body.addEventListener('click', (e) => {
                    if (e.target.classList.contains('lspfree-block-btn')) {
                        e.stopPropagation();
                        const game = e.target.closest('.widget.lspfree');
                        if (game) this.blockLSPFreeItem(game);
                    }
                });
            }

            games.forEach(game => {
                if (game.querySelector('.lspfree-block-btn')) return;

                const blockBtn = this.createBlockButton('lspfree-block-btn', '优化该+1项目');
                game.style.position = 'relative';
                game.appendChild(blockBtn);
            });

            debugLog(`为 ${games.length} 个游戏添加优化按钮`);
        },

        addLotteryBlockButtons() {
            const lotteries = document.querySelectorAll('.widget.lottery');

            if (!document.body.hasAttribute('data-lottery-delegated')) {
                document.body.setAttribute('data-lottery-delegated', 'true');
                document.body.addEventListener('click', (e) => {
                    if (e.target.classList.contains('lottery-block-btn')) {
                        e.stopPropagation();
                        const lottery = e.target.closest('.widget.lottery');
                        if (lottery) this.blockLotteryItem(lottery);
                    }
                });
            }

            lotteries.forEach(lottery => {
                if (lottery.querySelector('.lottery-block-btn')) return;

                const blockBtn = this.createBlockButton('lottery-block-btn', '优化该乐透项目');
                lottery.style.position = 'relative';
                lottery.appendChild(blockBtn);
            });

            debugLog(`为 ${lotteries.length} 个乐透添加优化按钮`);
        },

        createBlockButton(className, title) {
            const button = document.createElement('button');
            button.className = `${className} lsp-blocker-btn`;
            button.innerHTML = '⛔';
            button.title = title;
            return button;
        },

        blockLSPFreeItem(element) {
            const goidButton = element.querySelector('button[data-goid]');
            if (!goidButton) return;

            const goid = goidButton.getAttribute('data-goid');
            const rule = `lspsp.me##div.widget.lspfree:has(button[data-goid="${goid}"])`;

            this.saveAndApplyRule('lspfree', rule, element);
            showMessage('已优化该+1项目');
        },

        blockLotteryItem(element) {
            const lotteryId = element.getAttribute('data-lottery-id');
            if (!lotteryId) return;

            const rule = `lspsp.me##div.widget.lottery[data-lottery-id="${lotteryId}"]`;

            this.saveAndApplyRule('lottery', rule, element);
            showMessage('已优化该乐透项目');
        },

        saveAndApplyRule(type, rule, element) {
            const blockRules = GM_getValue(ConfigManager.KEYS.BLOCK_RULES);

            if (!blockRules[type].includes(rule)) {
                blockRules[type].push(rule);
                ConfigManager.saveBlockRules(blockRules);
                this.applyCSSRule(rule);
                debugLog(`规则已保存并应用: ${rule}`);
            }

            element.style.display = 'none';
        },

        applyCSSRule(rule) {
            if (!rule || typeof rule !== 'string' || !rule.trim()) return;

            try {
                // 将AdBlock规则转换为CSS规则
                const cssRule = RuleManager.convertAdBlockToCSS(rule);
                if (!cssRule) return;

                const style = document.createElement('style');
                style.className = 'lsp-dynamic-rule';
                style.textContent = cssRule;
                document.head.appendChild(style);
            } catch (e) {
                console.warn('应用CSS规则失败:', rule, e);
            }
        }
    };

    // ==================== 样式管理模块 (视觉层 - 中间层) ====================
    const StyleManager = {
        init() {
            this.injectGlobalStyles();
            this.injectEarlyBlockStyles();
        },

        injectGlobalStyles() {
            const style = document.createElement('style');
            style.id = 'lsp-blocker-global-styles';
            style.textContent = PANEL_STYLES;
            document.head.appendChild(style);
        },

        injectEarlyBlockStyles() {
            const { settings, blockRules } = ConfigManager.getConfig();
            const style = document.createElement('style');
            style.id = 'lsp-blocker-early-styles';

            const allRules = [];

            // 1. 保底 CSS 规则 (视觉层)
            if (settings.blockWeibo) {
                // 强制隐藏微博相关所有可能的容器
                allRules.push('lspsp.me###weibo', 'lspsp.me##.weibo', 'lspsp.me##.widget-weibo', 'lspsp.me##iframe[src*="weibo.com"]');
            }
            if (settings.blockExtra) {
                // 强制隐藏店铺群宣容器
                allRules.push('lspsp.me###extra');
            }
            if (settings.blockFooter) {
                allRules.push(...blockRules.footer);
            }
            if (settings.blockSubscribe) {
                allRules.push('lspsp.me##div.subscribe-state');
            }

            // 应用页面特定规则
            if (window.location.pathname === '/bonus') {
                allRules.push(...blockRules.lspfree);
                if (settings.blockOwnedGames) {
                    allRules.push(...blockRules.ownedGames);
                }
            } else if (window.location.pathname === '/lottery') {
                allRules.push(...blockRules.lottery);
                if (settings.blockWinLottery) {
                    allRules.push(...blockRules.winLottery);
                }
                if (settings.blockMissedLottery) {
                    allRules.push(...blockRules.missedLottery);
                }
                if (settings.blockInstantLottery) {
                    allRules.push(...blockRules.instantLottery);
                }
            }

            // 自定义规则
            allRules.push(...blockRules.custom);

            const cssRules = allRules
                .filter(rule => rule && rule.trim())
                .map(rule => RuleManager.convertAdBlockToCSS(rule))
                .filter(css => css && css.trim());

            style.textContent = cssRules.join('\n');

            // 确保样式被注入
            if (document.head) {
                document.head.appendChild(style);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    if (!document.getElementById('lsp-blocker-early-styles')) {
                        document.head.appendChild(style);
                    }
                });
            }

            debugLog(`注入 ${cssRules.length} 条CSS规则`);
        }
    };

    // ==================== 规则编辑器模块 ====================
    const RuleEditor = {
        create(type, name) {
            this.removeExisting();

            const overlay = this.createOverlay();
            const editor = this.createEditor(type, name);

            document.body.appendChild(overlay);
            document.body.appendChild(editor);

            this.bindEvents(editor, overlay, type);
        },

        removeExisting() {
            const existingEditor = document.getElementById('lsp-rule-editor');
            const existingOverlay = document.getElementById('lsp-rule-editor-overlay');
            if (existingEditor) existingEditor.remove();
            if (existingOverlay) existingOverlay.remove();
        },

        createOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'lsp-rule-editor-overlay';
            overlay.className = 'lsp-panel-overlay';
            return overlay;
        },

        createEditor(type, name) {
            const blockRules = GM_getValue(ConfigManager.KEYS.BLOCK_RULES);
            const currentRules = (blockRules[type] || []).join('\n');

            const editor = document.createElement('div');
            editor.id = 'lsp-rule-editor';
            editor.className = 'lsp-panel';
            editor.style.width = '500px';

            editor.innerHTML = `
                <div style="margin-bottom: 15px; position: relative;">
                    <button id="closeEditor" class="lsp-close-button">✖</button>

                    <h3 class="lsp-panel-title">📝 编辑 ${name} 优化规则</h3>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px; color: #d24f70; font-weight: 500;">规则列表 (每行一个规则):</label>
                        <textarea id="ruleTextarea" style="width: 100%; height: 300px; padding: 12px; border: 1px solid #ffb3c8; border-radius: 8px; background: rgba(255, 255, 255, 0.8); color: #5a2a3a; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box;">${currentRules}</textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button id="saveRules" class="lsp-panel-button">保存规则</button>
                        <button id="cancelEdit" class="lsp-panel-button lsp-panel-button-secondary">取消</button>
                    </div>

                    <div class="lsp-panel-section">
                        <h4 class="lsp-panel-subtitle">规则格式说明:</h4>
                        <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #8c4a5e;">
                            <li>每行一个规则</li>
                            <li>支持CSS选择器: <code>div.class-name</code></li>
                            <li>支持AdBlock格式: <code>domain.com##.class-name</code></li>
                            <li>支持网络规则: <code>||domain.com^</code></li>
                        </ul>
                    </div>
                </div>
            `;

            return editor;
        },

        bindEvents(editor, overlay, type) {
            const saveBtn = editor.querySelector('#saveRules');
            const cancelBtn = editor.querySelector('#cancelEdit');
            const closeBtn = editor.querySelector('#closeEditor');

            saveBtn.addEventListener('click', () => this.saveRules(type, editor));
            cancelBtn.addEventListener('click', () => this.close(editor, overlay));
            closeBtn.addEventListener('click', () => this.close(editor, overlay));
            overlay.addEventListener('click', () => this.close(editor, overlay));
        },

        saveRules(type, editor) {
            const textarea = editor.querySelector('#ruleTextarea');
            const newRules = textarea.value.split('\n')
                .filter(rule => rule && typeof rule === 'string' && rule.trim());

            const blockRules = GM_getValue(ConfigManager.KEYS.BLOCK_RULES);
            blockRules[type] = newRules;
            ConfigManager.saveBlockRules(blockRules);

            showMessage('规则已保存');
            this.close(editor, document.getElementById('lsp-rule-editor-overlay'));

            setTimeout(() => {
                location.reload();
            }, 1000);
        },

        close(editor, overlay) {
            editor.remove();
            overlay.remove();
        }
    };

    // ==================== 控制面板模块 ====================
    const ControlPanel = {
        create() {
            this.removeExisting();

            const overlay = this.createOverlay();
            const panel = this.createPanel();

            document.body.appendChild(overlay);
            document.body.appendChild(panel);

            this.bindEvents(panel, overlay);
        },

        removeExisting() {
            const existingPanel = document.getElementById('lsp-blocker-panel');
            const existingOverlay = document.getElementById('lsp-blocker-overlay');
            if (existingPanel) existingPanel.remove();
            if (existingOverlay) existingOverlay.remove();
        },

        createOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'lsp-blocker-overlay';
            overlay.className = 'lsp-panel-overlay';
            return overlay;
        },

        createPanel() {
            const { settings, blockRules } = ConfigManager.getConfig();
            const panel = document.createElement('div');
            panel.id = 'lsp-blocker-panel';
            panel.className = 'lsp-panel';

            panel.innerHTML = this.generatePanelHTML(settings, blockRules);
            return panel;
        },

        generatePanelHTML(settings, blockRules) {
            const isBonusPage = window.location.pathname === '/bonus';
            const isLotteryPage = window.location.pathname === '/lottery';

            return `
                <div style="margin-bottom: 12px; position: relative;">
                    <button id="closePanel" class="lsp-close-button">✖</button>

                    <h3 class="lsp-panel-title">🛡️ LSP优化控制面板</h3>

                    <div class="lsp-panel-section">
                        <h4 class="lsp-panel-subtitle">默认规则</h4>
                        <div style="display: grid; grid-template-columns: 1fr; gap: 6px;">
                            <label class="lsp-panel-checkbox">
                                <input type="checkbox" id="blockWeibo" ${settings.blockWeibo ? 'checked' : ''}>
                                <span>优化社媒资讯</span>
                            </label>
                            <label class="lsp-panel-checkbox">
                                <input type="checkbox" id="blockExtra" ${settings.blockExtra ? 'checked' : ''}>
                                <span>优化店铺和群宣</span>
                            </label>
                            <label class="lsp-panel-checkbox">
                                <input type="checkbox" id="blockFooter" ${settings.blockFooter ? 'checked' : ''}>
                                <span>优化页脚信息</span>
                            </label>
                            <label class="lsp-panel-checkbox">
                                <input type="checkbox" id="blockSubscribe" ${settings.blockSubscribe ? 'checked' : ''}>
                                <span>优化预约成功信息</span>
                            </label>
                        </div>
                    </div>

                    ${isBonusPage ? `
                    <div class="lsp-panel-section">
                        <h4 class="lsp-panel-subtitle">+1项目管理</h4>
                        <label class="lsp-panel-checkbox" style="margin-bottom: 6px;">
                            <input type="checkbox" id="blockOwnedGames" ${settings.blockOwnedGames ? 'checked' : ''}>
                            <span>一键优化已领取项目</span>
                        </label>
                        <button id="manageLspfreeRules" class="lsp-panel-button">管理自定义+1优化规则</button>
                        <div class="lsp-panel-stats">已优化 ${(blockRules.lspfree || []).length} 个项目</div>
                    </div>
                    ` : ''}

                    ${isLotteryPage ? `
                    <div class="lsp-panel-section">
                        <h4 class="lsp-panel-subtitle">乐透项目管理</h4>
                        <div style="display: grid; grid-template-columns: 1fr; gap: 4px;">
                            <label class="lsp-panel-checkbox">
                                <input type="checkbox" id="blockWinLottery" ${settings.blockWinLottery ? 'checked' : ''}>
                                <span>优化中奖项目</span>
                            </label>
                            <label class="lsp-panel-checkbox">
                                <input type="checkbox" id="blockMissedLottery" ${settings.blockMissedLottery ? 'checked' : ''}>
                                <span>优化未中奖项目</span>
                            </label>
                            <label class="lsp-panel-checkbox">
                                <input type="checkbox" id="blockInstantLottery" ${settings.blockInstantLottery ? 'checked' : ''}>
                                <span>优化即刻领取项目</span>
                            </label>
                        </div>
                        <button id="manageLotteryRules" class="lsp-panel-button" style="margin-top: 6px;">管理自定义乐透优化规则</button>
                        <div class="lsp-panel-stats">已优化 ${(blockRules.lottery || []).length} 个项目</div>
                    </div>
                    ` : ''}

                    <div class="lsp-panel-section">
                        <h4 class="lsp-panel-subtitle">自定义全局规则</h4>
                        <button id="manageCustomRules" class="lsp-panel-button">管理自定义全局规则</button>
                        <div class="lsp-panel-stats">已添加 ${(blockRules.custom || []).length} 条自定义全局规则</div>
                    </div>

                    <div class="lsp-panel-section">
                        <h4 class="lsp-panel-subtitle">工具</h4>
                        <button id="exportRules" class="lsp-panel-button">导出所有规则到剪贴板</button>
                        <button id="resetSettings" class="lsp-panel-button lsp-panel-button-secondary">重置所有设置</button>
                    </div>

                    <div class="lsp-panel-section">
                        <h4 class="lsp-panel-subtitle">其他设置</h4>
                        <label class="lsp-panel-checkbox">
                            <input type="checkbox" id="debugMode" ${settings.debugMode ? 'checked' : ''}>
                            <span>调试模式</span>
                        </label>
                    </div>

                    <div style="text-align: center;">
                        <button id="saveSettings" class="lsp-panel-button" style="padding: 8px; font-size: 13px; font-weight: 600;">保存设置并刷新</button>
                    </div>
                </div>
            `;
        },

        bindEvents(panel, overlay) {
            document.getElementById('saveSettings').addEventListener('click', this.saveSettings);
            document.getElementById('resetSettings').addEventListener('click', this.resetSettings);
            document.getElementById('exportRules').addEventListener('click', () => RuleManager.exportRules());
            document.getElementById('closePanel').addEventListener('click', () => this.close(panel, overlay));
            overlay.addEventListener('click', () => this.close(panel, overlay));

            // 绑定规则管理按钮
            if (window.location.pathname === '/bonus') {
                document.getElementById('manageLspfreeRules').addEventListener('click', () => RuleEditor.create('lspfree', '自定义+1'));
            }

            if (window.location.pathname === '/lottery') {
                document.getElementById('manageLotteryRules').addEventListener('click', () => RuleEditor.create('lottery', '自定义乐透'));
            }

            document.getElementById('manageCustomRules').addEventListener('click', () => RuleEditor.create('custom', '自定义全局'));
        },

        close(panel, overlay) {
            panel.remove();
            overlay.remove();
        },

        saveSettings() {
            const currentSettings = GM_getValue(ConfigManager.KEYS.SETTINGS) || {...ConfigManager.DEFAULT_SETTINGS};

            const settings = {
                ...currentSettings,
                blockWeibo: document.getElementById('blockWeibo').checked,
                blockExtra: document.getElementById('blockExtra').checked,
                blockFooter: document.getElementById('blockFooter').checked,
                blockSubscribe: document.getElementById('blockSubscribe').checked,
                debugMode: document.getElementById('debugMode').checked
            };

            if (window.location.pathname === '/bonus') {
                settings.blockOwnedGames = document.getElementById('blockOwnedGames') ? document.getElementById('blockOwnedGames').checked : currentSettings.blockOwnedGames;
            } else if (window.location.pathname === '/lottery') {
                settings.blockWinLottery = document.getElementById('blockWinLottery') ? document.getElementById('blockWinLottery').checked : currentSettings.blockWinLottery;
                settings.blockMissedLottery = document.getElementById('blockMissedLottery') ? document.getElementById('blockMissedLottery').checked : currentSettings.blockMissedLottery;
                settings.blockInstantLottery = document.getElementById('blockInstantLottery') ? document.getElementById('blockInstantLottery').checked : currentSettings.blockInstantLottery;
            }

            ConfigManager.saveSettings(settings);
            RuleManager.generateFunctionalRules();

            showMessage('设置已保存，页面即将刷新');
            setTimeout(() => {
                location.reload();
            }, 1000);
        },

        resetSettings() {
            if (confirm('确定要重置所有设置吗？这将清除所有自定义规则。')) {
                ConfigManager.saveSettings({...ConfigManager.DEFAULT_SETTINGS});
                ConfigManager.saveBlockRules({
                    weibo: [],
                    extra: [],
                    footer: ['lspsp.me###footer'],
                    subscribe: [],
                    lspfree: [],
                    lottery: [],
                    ownedGames: [],
                    winLottery: [],
                    missedLottery: [],
                    instantLottery: [],
                    custom: []
                });
                showMessage('设置已重置');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        }
    };

    // ==================== 工具函数 ====================
    function debugLog(...args) {
        const { settings } = ConfigManager.getConfig();
        if (settings.debugMode) {
            console.log('[LSP优化工具]', ...args);
        }
    }

    function showMessage(message) {
        const existingMsg = document.getElementById('lsp-blocker-message');
        if (existingMsg) {
            existingMsg.remove();
        }

        const msgDiv = document.createElement('div');
        msgDiv.id = 'lsp-blocker-message';
        msgDiv.className = 'lsp-message';
        msgDiv.textContent = message;
        document.body.appendChild(msgDiv);

        setTimeout(() => {
            if (document.body.contains(msgDiv)) {
                document.body.removeChild(msgDiv);
            }
        }, 3000);
    }

    function debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // ==================== 导航栏集成 ====================
    const NavigationManager = {
        addControlPanelButton() {
            const nav = document.querySelector('#nav ul');
            if (!nav) {
                this.createFloatingButton();
                return;
            }

            const panelButton = document.createElement('li');
            panelButton.innerHTML = `
                <a href="javascript:void(0)" id="lsp-control-panel-btn" style="display: flex; align-items: center; justify-content: center; line-height: 1.15; height: 100%; padding: 0 12px; color: #d24f70; font-weight: bold;">
                    ⚙️
                </a>
            `;

            nav.appendChild(panelButton);
            document.getElementById('lsp-control-panel-btn').addEventListener('click', () => {
                if (!document.getElementById('lsp-blocker-panel')) {
                    ControlPanel.create();
                }
            });

            debugLog('控制面板按钮已添加到导航栏');
        },

        createFloatingButton() {
            const btn = document.createElement('button');
            btn.innerHTML = '⚙️';
            btn.title = 'LSP优化控制面板';
            btn.id = 'lsp-floating-panel-btn';
            btn.className = 'lsp-floating-button';
            document.body.appendChild(btn);

            btn.addEventListener('click', () => {
                if (!document.getElementById('lsp-blocker-panel')) {
                    ControlPanel.create();
                }
            });

            debugLog('浮动控制面板按钮已创建');
        }
    };

    // ==================== 油猴菜单集成 ====================
    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('打开LSP优化控制面板', () => {
                if (!document.getElementById('lsp-blocker-panel')) {
                    ControlPanel.create();
                }
            }, 'o');

            GM_registerMenuCommand('导出优化规则', () => {
                RuleManager.exportRules();
            }, 'e');

            GM_registerMenuCommand('重置所有设置', () => {
                ControlPanel.resetSettings();
            }, 'r');

            debugLog('油猴菜单命令已注册');
        }
    }

    // ==================== 主函数 ====================
    function main() {
        debugLog('脚本主函数开始执行');

        // 注册油猴菜单命令
        registerMenuCommands();

        // 添加控制面板按钮
        NavigationManager.addControlPanelButton();

        // 添加优化按钮
        UIManager.addBlockButtons();

        // 生成功能规则
        RuleManager.generateFunctionalRules();

        debugLog('脚本主函数执行完成');
    }

    // ==================== 初始化 ====================
    // 初始化样式管理 (视觉层 - 中间层)
    StyleManager.init();

    // 初始化资源优化 (网络层 + DOM层)
    ResourceBlocker.init();

    // 页面加载完成后执行主函数
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

    // 监听动态内容变化（使用防抖优化性能）
    const debouncedProcess = debounce(() => {
        UIManager.addBlockButtons();
    }, 150);

    const observer = new MutationObserver((mutations) => {
        let hasNewContent = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                hasNewContent = true;
                break;
            }
        }
        if (hasNewContent) {
            debouncedProcess();
        }
    });

    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        debugLog('MutationObserver已启动');
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            debugLog('MutationObserver在DOMContentLoaded时启动');
        });
    }

})();