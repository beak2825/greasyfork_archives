// ==UserScript==
// @name         智能JavaScript拦截器
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  按域名和脚本类型选择性拦截JavaScript，包含空白区域清理
// @author       Your Name
// @match        *://*/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560028/%E6%99%BA%E8%83%BDJavaScript%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560028/%E6%99%BA%E8%83%BDJavaScript%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 获取当前域名
    var currentDomain = window.location.hostname;
    
    // 默认拦截规则
    var defaultRules = {
        // 广告相关脚本
        "ads": {
            name: "广告脚本",
            enabled: true,
            keywords: [
                "ads", "adserver", "doubleclick", "googlesyndication",
                "adsystem", "adnxs", "advertising", "advertisement",
                "adtech", "criteo", "taboola", "outbrain",
                "adsbygoogle", "adsense", "amazon-adsystem"
            ]
        },
        // 视频播放器脚本 - 默认不拦截
        "video": {
            name: "视频播放器",
            enabled: false,
            keywords: [
                "video", "player", "youtube", "vimeo",
                "dailymotion", "jwplayer", "videojs", "flowplayer",
                "brightcove", "kaltura", "wistia", "plyr"
            ]
        },
        // 社交媒体脚本
        "social": {
            name: "社交媒体",
            enabled: false,
            keywords: [
                "facebook", "twitter", "linkedin", "instagram",
                "pinterest", "whatsapp", "tiktok", "reddit"
            ]
        },
        // 分析和追踪脚本
        "analytics": {
            name: "分析和追踪",
            enabled: true,
            keywords: [
                "analytics", "tracking", "tracker", "statistics",
                "metrics", "monitoring", "measurement", "ga.js"
            ]
        },
        // 空白区域清理 - 默认启用
        "blank_areas": {
            name: "空白区域清理",
            enabled: true,
            settings: {
                mode: "moderate",
                mode_cn: "适中模式",
                minHeight: 30,
                minWidth: 100,
                removeEmptyElements: true,
                removeHiddenElements: true,
                removeWhitespaceOnlyElements: true,
                removeFixedHeightElements: true,
                preserveSelectors: [
                    ".main-content", ".content", ".article",
                    ".video-player", ".player", ".video-container",
                    ".header", ".footer", ".navigation", ".menu",
                    ".sidebar", ".comments", ".user-profile"
                ]
            }
        }
    };
    
    // 添加自定义CSS来隐藏空白区域
    GM_addStyle(`
        /* 隐藏空白区域 */
        .js-blank-area-hidden {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            z-index: -9999 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
        }
        
        /* 页面清理标记 */
        body.blank-areas-cleaned {
            position: relative;
        }
        
        /* 修复可能的布局问题 */
        .blank-cleaned-fix {
            min-height: auto !important;
            max-height: none !important;
        }
        
        /* 清理后的布局优化 */
        .main-content, .content-area {
            position: static !important;
        }
    `);
    
    // 获取用户设置
    var enabledDomains = GM_getValue('enabledDomains', '');
    var isEnabledForCurrentDomain = checkIfEnabledForDomain(currentDomain, enabledDomains);
    var rules = GM_getValue('interceptionRules', JSON.stringify(defaultRules));
    
    try {
        rules = JSON.parse(rules);
    } catch(e) {
        rules = defaultRules;
    }
    
    // 注册菜单命令
    if (typeof GM_registerMenuCommand !== 'undefined') {
        // 域名管理菜单
        GM_registerMenuCommand('🌐 为此域名开启拦截: ' + currentDomain, function() {
            enableForCurrentDomain();
        });
        
        GM_registerMenuCommand('🌐 为此域名关闭拦截: ' + currentDomain, function() {
            disableForCurrentDomain();
        });
        
        // 合并的状态和白名单管理菜单
        GM_registerMenuCommand('📋 状态与白名单管理', function() {
            showStatusAndManage();
        });
        
        // 规则管理菜单（现在包含空白区域设置）
        GM_registerMenuCommand('⚙️ 拦截规则设置', function() {
            manageRules();
        });
    }
    
    // 检查当前域名是否在白名单中
    function checkIfEnabledForDomain(domain, enabledDomainsStr) {
        if (!enabledDomainsStr) return false;
        
        var domains = enabledDomainsStr.split(';');
        for (var i = 0; i < domains.length; i++) {
            var pattern = domains[i].trim();
            if (!pattern) continue;
            
            // 正则表达式匹配
            if (pattern.startsWith('/') && pattern.endsWith('/')) {
                try {
                    var regex = new RegExp(pattern.slice(1, -1));
                    if (regex.test(domain)) {
                        return true;
                    }
                } catch (e) {
                    console.error('无效的正则表达式:', pattern, e);
                }
            } 
            // 通配符匹配
            else if (pattern.includes('*')) {
                var regexPattern = '^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
                try {
                    var regex = new RegExp(regexPattern);
                    if (regex.test(domain)) {
                        return true;
                    }
                } catch (e) {
                    console.error('无效的通配符模式:', pattern, e);
                }
            }
            // 精确匹配
            else if (domain === pattern) {
                return true;
            }
        }
        return false;
    }
    
    // 检查脚本是否匹配拦截规则
    function shouldBlockScript(scriptSrc, scriptContent) {
        if (!scriptSrc && !scriptContent) return {block: false, type: null};
        
        var textToCheck = (scriptSrc || '').toLowerCase() + ' ' + (scriptContent || '').toLowerCase();
        
        // 检查每个启用的规则
        for (var ruleId in rules) {
            var rule = rules[ruleId];
            if (rule.enabled && rule.keywords && rule.keywords.length > 0) {
                for (var i = 0; i < rule.keywords.length; i++) {
                    var keyword = rule.keywords[i].toLowerCase();
                    if (textToCheck.includes(keyword)) {
                        return {block: true, type: ruleId, keyword: keyword};
                    }
                }
            }
        }
        
        return {block: false, type: null};
    }
    
    // 清理空白区域
    function cleanupBlankAreas() {
        if (!rules.blank_areas || !rules.blank_areas.enabled) {
            return;
        }
        
        console.log('开始清理空白区域...');
        var cleanedCount = 0;
        var settings = rules.blank_areas.settings || {};
        var mode = settings.mode || "moderate";
        var minHeight = settings.minHeight || 30;
        var minWidth = settings.minWidth || 100;
        
        // 根据模式调整参数
        if (mode === "aggressive") {
            minHeight = 10;
            minWidth = 50;
        } else if (mode === "conservative") {
            minHeight = 50;
            minWidth = 200;
        }
        
        // 创建选择器数组
        var selectors = [
            // 通用空白区域选择器
            "div", "section", "aside", "article", "main", "header", "footer"
        ];
        
        // 创建清理函数
        function cleanBlankElements() {
            selectors.forEach(function(tagName) {
                try {
                    var elements = document.querySelectorAll(tagName);
                    elements.forEach(function(element) {
                        // 检查元素是否应该保留
                        var shouldPreserve = checkIfShouldPreserve(element, settings.preserveSelectors);
                        if (shouldPreserve) {
                            return;
                        }
                        
                        // 检查元素是否已经是隐藏状态
                        if (element.classList.contains('js-blank-area-hidden')) {
                            return;
                        }
                        
                        // 获取元素信息
                        var rect = element.getBoundingClientRect();
                        var style = window.getComputedStyle(element);
                        var innerText = element.innerText || element.textContent || '';
                        var innerHTML = element.innerHTML || '';
                        
                        // 判断是否应该清理
                        var shouldClean = false;
                        var reason = '';
                        
                        // 模式：激进
                        if (mode === "aggressive") {
                            if (rect.height >= minHeight && rect.width >= minWidth) {
                                // 检查是否为空或几乎为空
                                if (innerHTML.trim() === '' || 
                                    innerText.trim() === '' || 
                                    element.children.length === 0 ||
                                    style.display === 'none' ||
                                    style.visibility === 'hidden') {
                                    shouldClean = true;
                                    reason = '激进模式：空/隐藏的大元素';
                                }
                                // 检查是否有固定的高度样式（可能是广告占位）
                                else if (settings.removeFixedHeightElements && 
                                         (style.height.includes('px') || style.minHeight.includes('px'))) {
                                    shouldClean = true;
                                    reason = '激进模式：固定高度元素';
                                }
                            }
                        }
                        // 模式：适中（默认）
                        else if (mode === "moderate") {
                            // 检查完全空的元素
                            if (settings.removeEmptyElements && 
                                innerHTML.trim() === '' && 
                                rect.height >= minHeight && 
                                rect.width >= minWidth) {
                                shouldClean = true;
                                reason = '适中模式：完全空的大元素';
                            }
                            // 检查隐藏的元素
                            else if (settings.removeHiddenElements && 
                                     (style.display === 'none' || style.visibility === 'hidden') &&
                                     rect.height >= minHeight && 
                                     rect.width >= minWidth) {
                                shouldClean = true;
                                reason = '适中模式：隐藏的大元素';
                            }
                            // 检查只有空白字符的元素
                            else if (settings.removeWhitespaceOnlyElements && 
                                     innerText.trim() === '' && 
                                     innerHTML.trim() !== '' &&
                                     rect.height >= minHeight && 
                                     rect.width >= minWidth) {
                                shouldClean = true;
                                reason = '适中模式：只有空白字符的大元素';
                            }
                        }
                        // 模式：保守
                        else if (mode === "conservative") {
                            // 只清理非常明显的空白区域
                            if (innerHTML.trim() === '' && 
                                rect.height >= 100 && 
                                rect.width >= 300) {
                                shouldClean = true;
                                reason = '保守模式：非常大的空白元素';
                            }
                        }
                        
                        // 执行清理
                        if (shouldClean) {
                            element.classList.add('js-blank-area-hidden');
                            cleanedCount++;
                            console.log('已清理空白区域：' + reason, element);
                        }
                    });
                } catch (e) {
                    console.error('清理空白区域时出错:', tagName, e);
                }
            });
        }
        
        // 初始清理
        cleanBlankElements();
        
        // 使用MutationObserver监视DOM变化
        var cleanupObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    // 延迟执行，确保新元素已完全加载
                    setTimeout(function() {
                        cleanBlankElements();
                    }, 1000);
                }
            });
        });
        
        // 开始观察
        cleanupObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 页面加载完成后执行额外的清理
        window.addEventListener('load', function() {
            setTimeout(function() {
                cleanBlankElements();
                console.log('空白区域清理完成，共清理了 ' + cleanedCount + ' 个元素');
                
                // 标记页面已被清理
                document.body.classList.add('blank-areas-cleaned');
                
                // 修复可能的布局问题
                fixLayoutAfterCleaning();
            }, 2000);
        });
        
        // 监听滚动事件，清理可能动态加载的空白区域
        var scrollCleanup = debounce(function() {
            cleanBlankElements();
        }, 1500);
        
        window.addEventListener('scroll', scrollCleanup);
    }
    
    // 检查元素是否应该保留
    function checkIfShouldPreserve(element, preserveSelectors) {
        if (!preserveSelectors || preserveSelectors.length === 0) {
            return false;
        }
        
        // 检查元素本身是否匹配保留选择器
        for (var i = 0; i < preserveSelectors.length; i++) {
            try {
                if (element.matches(preserveSelectors[i])) {
                    return true;
                }
            } catch (e) {
                console.error('匹配保留选择器时出错:', preserveSelectors[i], e);
            }
        }
        
        // 检查父元素是否匹配保留选择器
        var parent = element.parentElement;
        while (parent && parent !== document.body) {
            for (var j = 0; j < preserveSelectors.length; j++) {
                try {
                    if (parent.matches(preserveSelectors[j])) {
                        return true;
                    }
                } catch (e) {
                    console.error('匹配保留选择器时出错:', preserveSelectors[j], e);
                }
            }
            parent = parent.parentElement;
        }
        
        return false;
    }
    
    // 修复清理后的布局问题
    function fixLayoutAfterCleaning() {
        console.log('修复清理后的布局问题...');
        
        // 查找可能受影响的相邻元素
        var allElements = document.querySelectorAll('div, section, article, aside');
        allElements.forEach(function(element) {
            var style = window.getComputedStyle(element);
            
            // 如果元素有固定高度但现在应该是自适应的
            if (style.height !== 'auto' && 
                !element.classList.contains('js-blank-area-hidden')) {
                element.classList.add('blank-cleaned-fix');
            }
        });
    }
    
    // 防抖函数
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // 为当前域名启用拦截
    function enableForCurrentDomain() {
        var currentDomains = GM_getValue('enabledDomains', '');
        var domains = currentDomains ? currentDomains.split(';') : [];
        
        if (!domains.includes(currentDomain)) {
            domains.push(currentDomain);
            GM_setValue('enabledDomains', domains.join(';'));
            alert('已为域名 "' + currentDomain + '" 启用JavaScript拦截功能\n页面将重新加载');
            location.reload();
        } else {
            alert('此域名已在白名单中');
        }
    }
    
    // 为当前域名禁用拦截
    function disableForCurrentDomain() {
        var currentDomains = GM_getValue('enabledDomains', '');
        if (!currentDomains) {
            alert('此域名不在白名单中');
            return;
        }
        
        var domains = currentDomains.split(';');
        var index = domains.indexOf(currentDomain);
        
        if (index !== -1) {
            domains.splice(index, 1);
            GM_setValue('enabledDomains', domains.join(';'));
            alert('已从域名白名单中移除 "' + currentDomain + '"\n页面将重新加载');
            location.reload();
        } else {
            alert('此域名不在白名单中');
        }
    }
    
    // 显示状态并管理白名单
    function showStatusAndManage() {
        var currentDomains = GM_getValue('enabledDomains', '');
        var domains = currentDomains ? currentDomains.split(';') : [];
        
        var message = '智能JavaScript拦截器\n\n';
        message += '当前域名：' + currentDomain + '\n';
        message += '拦截状态：' + (isEnabledForCurrentDomain ? '✅ 已启用' : '❌ 未启用') + '\n\n';
        
        if (domains.length > 0) {
            message += '白名单中的域名 (' + domains.length + ' 个)：\n';
            message += '（编号用于删除操作，✓标记当前域名）\n\n';
            domains.forEach(function(domain, index) {
                var prefix = (domain === currentDomain) ? '✓ ' : '  ';
                message += prefix + (index + 1) + '. ' + domain + '\n';
            });
            message += '\n';
        } else {
            message += '白名单中无域名\n\n';
        }
        
        message += '启用的拦截规则：\n';
        var enabledRulesCount = 0;
        for (var ruleId in rules) {
            if (rules[ruleId].enabled) {
                enabledRulesCount++;
                message += '✓ ' + rules[ruleId].name + '\n';
                
                // 显示空白区域的详细设置
                if (ruleId === 'blank_areas' && rules[ruleId].settings) {
                    var settings = rules[ruleId].settings;
                    message += '   - 模式：' + (settings.mode_cn || '适中模式') + '\n';
                }
            }
        }
        
        if (enabledRulesCount === 0) {
            message += '（无启用的规则）\n';
        }
        
        message += '\n请选择操作：\n';
        message += '1. 添加新域名到白名单\n';
        
        if (domains.length > 0) {
            message += '2. 从白名单中删除域名\n';
            message += '3. 返回\n\n';
            message += '📝 提示：\n';
            message += '• 使用编号可以快速删除域名\n';
            message += '• 支持通配符(*.example.com)和正则表达式(/.*\\.example\\.com/)\n';
            message += '• 当前域名有✓标记';
        } else {
            message += '2. 返回\n\n';
            message += '📝 提示：支持通配符(*.example.com)和正则表达式(/.*\\.example\\.com/)';
        }
        
        // 输入框设为空白
        var choice = prompt(message, '');
        
        if (choice === null) return;
        
        if (choice === '1') {
            addNewDomain();
        } else if (choice === '2' && domains.length > 0) {
            deleteDomain();
        } else if (choice === '3' && domains.length > 0) {
            // 返回，不做任何操作
        } else if (choice === '2' && domains.length === 0) {
            // 返回，当白名单为空时，选项2是返回
        } else {
            // 如果输入了其他内容，也视为返回
        }
    }
    
    // 添加新域名到白名单
    function addNewDomain() {
        var currentDomains = GM_getValue('enabledDomains', '');
        var domains = currentDomains ? currentDomains.split(';') : [];
        
        var newDomain = prompt('请输入要添加的域名（支持格式）：\n\n' +
                              '• 精确域名：example.com\n' +
                              '• 通配符：*.example.com（匹配所有子域名）\n' +
                              '• 正则表达式：/.*\\.example\\.com/（更灵活的匹配）\n\n' +
                              '当前域名：' + currentDomain, currentDomain);
        
        if (newDomain !== null && newDomain.trim() !== '') {
            newDomain = newDomain.trim();
            if (!domains.includes(newDomain)) {
                domains.push(newDomain);
                GM_setValue('enabledDomains', domains.join(';'));
                alert('已添加域名: ' + newDomain + '\n页面将重新加载');
                location.reload();
            } else {
                alert('此域名已在白名单中');
            }
        }
    }
    
    // 从白名单中删除域名
    function deleteDomain() {
        var currentDomains = GM_getValue('enabledDomains', '');
        var domains = currentDomains ? currentDomains.split(';') : [];
        
        if (domains.length === 0) {
            alert('白名单中无域名');
            return;
        }
        
        var message = '请选择要删除的域名：\n\n';
        message += '📝 编号说明：\n';
        message += '• 输入编号（如 1, 2, 3）\n';
        message += '• 或直接输入域名\n';
        message += '• 当前域名有→标记\n\n';
        
        domains.forEach(function(domain, index) {
            var prefix = (domain === currentDomain) ? '→ ' : '  ';
            message += prefix + (index + 1) + '. ' + domain + '\n';
        });
        
        message += '\n请输入编号（1-' + domains.length + '）或域名：';
        
        // 删除操作的输入框也设为空白
        var input = prompt(message, '');
        
        if (input === null || input.trim() === '') {
            return;
        }
        
        // 检查是否是数字（按编号删除）
        if (/^\d+$/.test(input.trim())) {
            var indexToRemove = parseInt(input.trim()) - 1;
            if (indexToRemove >= 0 && indexToRemove < domains.length) {
                var removedDomain = domains[indexToRemove];
                domains.splice(indexToRemove, 1);
                GM_setValue('enabledDomains', domains.join(';'));
                alert('已移除域名: ' + removedDomain + '\n页面将重新加载');
                location.reload();
            } else {
                alert('无效的编号，请输入1-' + domains.length + '之间的数字');
            }
        } 
        // 按域名删除
        else {
            var domainToRemove = input.trim();
            var index = domains.indexOf(domainToRemove);
            
            if (index !== -1) {
                domains.splice(index, 1);
                GM_setValue('enabledDomains', domains.join(';'));
                alert('已移除域名: ' + domainToRemove + '\n页面将重新加载');
                location.reload();
            } else {
                // 尝试模式匹配删除
                var found = false;
                for (var i = 0; i < domains.length; i++) {
                    var pattern = domains[i].trim();
                    
                    // 正则表达式匹配
                    if (pattern.startsWith('/') && pattern.endsWith('/')) {
                        try {
                            var regex = new RegExp(pattern.slice(1, -1));
                            if (regex.test(domainToRemove)) {
                                var removedDomain = domains[i];
                                domains.splice(i, 1);
                                GM_setValue('enabledDomains', domains.join(';'));
                                alert('已移除域名模式: ' + removedDomain + '\n页面将重新加载');
                                location.reload();
                                found = true;
                                break;
                            }
                        } catch(e) {
                            console.error('正则表达式匹配失败:', pattern, e);
                        }
                    }
                    // 通配符匹配
                    else if (pattern.includes('*')) {
                        var regexPattern = '^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
                        try {
                            var regex = new RegExp(regexPattern);
                            if (regex.test(domainToRemove)) {
                                var removedDomain = domains[i];
                                domains.splice(i, 1);
                                GM_setValue('enabledDomains', domains.join(';'));
                                alert('已移除域名模式: ' + removedDomain + '\n页面将重新加载');
                                location.reload();
                                found = true;
                                break;
                            }
                        } catch(e) {
                            console.error('通配符匹配失败:', pattern, e);
                        }
                    }
                    // 精确匹配
                    else if (domainToRemove === pattern) {
                        var removedDomain = domains[i];
                        domains.splice(i, 1);
                        GM_setValue('enabledDomains', domains.join(';'));
                        alert('已移除域名: ' + removedDomain + '\n页面将重新加载');
                        location.reload();
                        found = true;
                        break;
                    }
                }
                
                if (!found) {
                    alert('未找到匹配的域名: ' + domainToRemove + '\n请检查输入是否正确');
                }
            }
        }
    }
    
    // 获取模式的中文名称
    function getModeChineseName(mode) {
        var modeMap = {
            'aggressive': '激进模式',
            'moderate': '适中模式',
            'conservative': '保守模式'
        };
        return modeMap[mode] || '适中模式';
    }
    
    // 获取模式对应的英文名称
    function getModeFromChinese(chineseName) {
        var chineseMap = {
            '激进模式': 'aggressive',
            '适中模式': 'moderate',
            '保守模式': 'conservative'
        };
        return chineseMap[chineseName] || 'moderate';
    }
    
    // 管理拦截规则（现在包含空白区域设置）
    function manageRules() {
        // 获取所有规则ID
        var allRuleIds = Object.keys(rules);
        
        // 分离默认规则和自定义规则
        var defaultRuleIds = ['ads', 'video', 'social', 'analytics', 'blank_areas'];
        var customRuleIds = [];
        
        for (var ruleId in rules) {
            if (ruleId.startsWith('custom_') && !defaultRuleIds.includes(ruleId)) {
                customRuleIds.push(ruleId);
            }
        }
        
        // 计算总规则数
        var totalRules = defaultRuleIds.length + customRuleIds.length;
        var optionsCount = totalRules + 4; // 规则数 + 特殊操作数
        
        var message = '📋 拦截规则设置\n\n';
        message += '📝 操作说明：\n';
        message += '• 输入规则编号切换启用/禁用状态\n';
        message += '• 空白区域清理（编号5）可进入详细设置\n\n';
        
        // 显示所有规则
        var optionIndex = 1;
        
        // 显示默认规则（1-4）
        message += '═══ 默认拦截规则 ═══\n';
        for (var i = 0; i < defaultRuleIds.length; i++) {
            var ruleId = defaultRuleIds[i];
            if (ruleId === 'blank_areas') {
                // 空白区域规则稍后单独显示
                continue;
            }
            
            var rule = rules[ruleId];
            if (!rule) continue;
            
            var status = rule.enabled ? '✅ 已启用' : '❌ 已禁用';
            message += optionIndex + '. ' + rule.name + ' ' + status + '\n';
            optionIndex++;
        }
        
        // 显示自定义规则（如果有）
        if (customRuleIds.length > 0) {
            message += '\n═══ 自定义规则 ═══\n';
            customRuleIds.forEach(function(ruleId) {
                var rule = rules[ruleId];
                var status = rule.enabled ? '✅ 已启用' : '❌ 已禁用';
                message += optionIndex + '. ' + rule.name + ' ' + status + '\n';
                optionIndex++;
            });
        }
        
        // 显示空白区域清理（固定编号5）
        var blankRule = rules.blank_areas;
        if (blankRule) {
            var blankStatus = blankRule.enabled ? '✅ 已启用' : '❌ 已禁用';
            var blankMode = blankRule.settings && blankRule.settings.mode_cn ? 
                           blankRule.settings.mode_cn : getModeChineseName(blankRule.settings.mode || 'moderate');
            
            message += '\n═══ 页面清理功能 ═══\n';
            message += '5. 空白区域清理 ' + blankStatus + '（' + blankMode + '）\n';
        }
        
        // 特殊操作从totalRules+1开始
        message += '\n════ 特殊操作 ════\n';
        var addOptionIndex = totalRules + 1;
        var manageOptionIndex = totalRules + 2;
        var resetOptionIndex = totalRules + 3;
        var returnOptionIndex = totalRules + 4;
        
        message += addOptionIndex + '. 添加自定义规则\n';
        message += manageOptionIndex + '. 管理自定义规则\n';
        message += resetOptionIndex + '. 重置所有规则为默认设置\n';
        message += returnOptionIndex + '. 返回\n';
        
        message += '\n请输入选择（编号1-' + returnOptionIndex + '）：';
        
        // 规则设置的输入框也设为空白
        var input = prompt(message, '');
        
        if (input === null || input.trim() === '') {
            return;
        }
        
        var inputTrimmed = input.trim();
        
        // 检查是否是数字
        if (/^\d+$/.test(inputTrimmed)) {
            var selectedIndex = parseInt(inputTrimmed);
            
            // 处理空白区域清理（固定编号5）
            if (selectedIndex === 5) {
                manageBlankAreaSettings();
                return;
            }
            
            // 处理特殊操作
            if (selectedIndex === addOptionIndex) {
                addCustomRule();
                return;
            } else if (selectedIndex === manageOptionIndex) {
                manageCustomRules();
                return;
            } else if (selectedIndex === resetOptionIndex) {
                if (confirm('确定要重置所有规则为默认设置吗？\n这将删除所有自定义规则！')) {
                    rules = JSON.parse(JSON.stringify(defaultRules));
                    GM_setValue('interceptionRules', JSON.stringify(rules));
                    alert('已重置所有规则为默认设置\n页面将重新加载');
                    location.reload();
                }
                return;
            } else if (selectedIndex === returnOptionIndex) {
                return;
            }
            
            // 处理其他规则
            // 重新计算规则映射
            var ruleIndex = 1;
            var ruleMap = {};
            
            // 默认规则（跳过空白区域）
            for (var i = 0; i < defaultRuleIds.length; i++) {
                var ruleId = defaultRuleIds[i];
                if (ruleId === 'blank_areas') continue;
                
                if (rules[ruleId]) {
                    ruleMap[ruleIndex] = ruleId;
                    ruleIndex++;
                }
            }
            
            // 自定义规则
            customRuleIds.forEach(function(ruleId) {
                ruleMap[ruleIndex] = ruleId;
                ruleIndex++;
            });
            
            // 检查选择的规则
            if (ruleMap[selectedIndex]) {
                var selectedRuleId = ruleMap[selectedIndex];
                var rule = rules[selectedRuleId];
                
                // 切换规则状态
                rule.enabled = !rule.enabled;
                GM_setValue('interceptionRules', JSON.stringify(rules));
                alert('已' + (rule.enabled ? '启用' : '禁用') + '规则: ' + rule.name + '\n页面将重新加载');
                location.reload();
            } else {
                alert('无效的编号，请输入1-' + returnOptionIndex + '之间的数字');
            }
        } else {
            // 尝试匹配规则名称
            var found = false;
            for (var ruleId in rules) {
                if (rules[ruleId].name === inputTrimmed || 
                    rules[ruleId].name.toLowerCase() === inputTrimmed.toLowerCase()) {
                    // 切换规则状态
                    rules[ruleId].enabled = !rules[ruleId].enabled;
                    GM_setValue('interceptionRules', JSON.stringify(rules));
                    alert('已' + (rules[ruleId].enabled ? '启用' : '禁用') + '规则: ' + rules[ruleId].name + '\n页面将重新加载');
                    location.reload();
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                alert('未找到规则"' + inputTrimmed + '"，请输入有效的编号');
            }
        }
    }
    
    // 管理所有自定义规则
    function manageCustomRules() {
        var customRules = {};
        var customRuleIds = [];
        
        // 收集自定义规则
        for (var ruleId in rules) {
            if (ruleId.startsWith('custom_')) {
                customRules[ruleId] = rules[ruleId];
                customRuleIds.push(ruleId);
            }
        }
        
        if (customRuleIds.length === 0) {
            alert('暂无自定义规则');
            return;
        }
        
        var message = '📝 自定义规则管理\n\n';
        message += '当前有 ' + customRuleIds.length + ' 个自定义规则：\n\n';
        
        customRuleIds.forEach(function(ruleId, index) {
            var rule = customRules[ruleId];
            var status = rule.enabled ? '✅ 已启用' : '❌ 已禁用';
            message += (index + 1) + '. ' + rule.name + ' ' + status + '\n';
        });
        
        message += '\n请选择操作：\n';
        message += '• 输入编号编辑规则\n';
        message += (customRuleIds.length + 1) + '. 添加新规则\n';
        message += (customRuleIds.length + 2) + '. 返回规则设置';
        
        var input = prompt(message, '');
        if (input === null || input.trim() === '') {
            return;
        }
        
        var inputTrimmed = input.trim();
        
        if (/^\d+$/.test(inputTrimmed)) {
            var index = parseInt(inputTrimmed);
            
            if (index === customRuleIds.length + 1) {
                addCustomRule();
            } else if (index === customRuleIds.length + 2) {
                manageRules();
            } else if (index >= 1 && index <= customRuleIds.length) {
                manageCustomRule(customRuleIds[index - 1]);
            } else {
                alert('无效的编号');
            }
        }
    }
    
    // 管理单个自定义规则
    function manageCustomRule(ruleId) {
        var rule = rules[ruleId];
        if (!rule) return;
        
        var message = '✏️ 编辑自定义规则：' + rule.name + '\n\n';
        message += '当前状态：' + (rule.enabled ? '✅ 已启用' : '❌ 已禁用') + '\n';
        message += '关键词：' + rule.keywords.join(', ') + '\n\n';
        message += '请选择操作：\n';
        message += '1. ' + (rule.enabled ? '❌ 禁用此规则' : '✅ 启用此规则') + '\n';
        message += '2. 编辑关键词\n';
        message += '3. 重命名规则\n';
        message += '4. 删除此规则\n';
        message += '5. 返回';
        
        var choice = prompt(message, '');
        
        if (choice === null || choice.trim() === '') {
            return;
        }
        
        switch (choice.trim()) {
            case '1':
                // 切换启用状态
                rule.enabled = !rule.enabled;
                saveRulesAndAlert('已' + (rule.enabled ? '启用' : '禁用') + '规则: ' + rule.name);
                // 重新打开编辑界面
                setTimeout(function() {
                    manageCustomRule(ruleId);
                }, 100);
                break;
                
            case '2':
                // 编辑关键词
                var keywordsInput = prompt('请输入新的关键词（用逗号分隔）：\n当前关键词：' + rule.keywords.join(', '), rule.keywords.join(', '));
                if (keywordsInput !== null) {
                    var keywords = keywordsInput.split(',').map(function(k) {
                        return k.trim();
                    }).filter(function(k) {
                        return k.length > 0;
                    });
                    
                    if (keywords.length > 0) {
                        rule.keywords = keywords;
                        saveRulesAndAlert('已更新规则关键词');
                        // 重新打开编辑界面
                        setTimeout(function() {
                            manageCustomRule(ruleId);
                        }, 100);
                    } else {
                        alert('请输入至少一个关键词');
                        setTimeout(function() {
                            manageCustomRule(ruleId);
                        }, 100);
                    }
                } else {
                    setTimeout(function() {
                        manageCustomRule(ruleId);
                    }, 100);
                }
                break;
                
            case '3':
                // 重命名规则
                var newName = prompt('请输入新的规则名称：', rule.name);
                if (newName !== null && newName.trim() !== '') {
                    rule.name = newName.trim();
                    saveRulesAndAlert('已重命名规则');
                    // 重新打开编辑界面
                    setTimeout(function() {
                        manageCustomRule(ruleId);
                    }, 100);
                } else {
                    setTimeout(function() {
                        manageCustomRule(ruleId);
                    }, 100);
                }
                break;
                
            case '4':
                // 删除规则
                if (confirm('确定要删除规则"' + rule.name + '"吗？')) {
                    delete rules[ruleId];
                    saveRulesAndReload('已删除规则: ' + rule.name);
                } else {
                    setTimeout(function() {
                        manageCustomRule(ruleId);
                    }, 100);
                }
                break;
                
            case '5':
                // 返回自定义规则管理
                manageCustomRules();
                break;
        }
    }
    
    // 管理空白区域设置
    function manageBlankAreaSettings() {
        if (!rules.blank_areas) {
            rules.blank_areas = JSON.parse(JSON.stringify(defaultRules.blank_areas));
        }
        
        var rule = rules.blank_areas;
        var settings = rule.settings || {};
        
        // 确保有中文模式名称
        if (!settings.mode_cn && settings.mode) {
            settings.mode_cn = getModeChineseName(settings.mode);
        }
        
        var message = '🔄 空白区域清理设置\n\n';
        message += '当前状态：' + (rule.enabled ? '✅ 已启用' : '❌ 已禁用') + '\n';
        message += '当前模式：' + (settings.mode_cn || '适中模式') + '\n';
        message += '   • 激进模式：更积极地清理\n';
        message += '   • 适中模式：平衡清理效果（推荐）\n';
        message += '   • 保守模式：只清理明显的空白\n\n';
        
        message += '请选择操作：\n';
        message += '1. ' + (rule.enabled ? '❌ 禁用此规则' : '✅ 启用此规则') + '\n';
        message += '2. 切换清理模式\n';
        message += '3. 调整详细设置\n';
        message += '4. 重置为默认设置\n';
        message += '5. 返回规则设置';
        
        var choice = prompt(message, '');
        
        if (choice === null || choice.trim() === '') {
            return;
        }
        
        switch (choice.trim()) {
            case '1':
                // 切换启用状态
                rule.enabled = !rule.enabled;
                saveRulesAndAlert('已' + (rule.enabled ? '启用' : '禁用') + '空白区域清理规则');
                // 重新打开空白区域设置
                setTimeout(function() {
                    manageBlankAreaSettings();
                }, 100);
                break;
                
            case '2':
                // 切换清理模式（中文）
                var modes = [
                    {en: 'aggressive', cn: '激进模式'},
                    {en: 'moderate', cn: '适中模式'},
                    {en: 'conservative', cn: '保守模式'}
                ];
                
                // 查找当前模式
                var currentIndex = -1;
                for (var i = 0; i < modes.length; i++) {
                    if (settings.mode === modes[i].en || 
                        settings.mode_cn === modes[i].cn) {
                        currentIndex = i;
                        break;
                    }
                }
                
                if (currentIndex === -1) currentIndex = 1; // 默认为适中模式
                
                var nextIndex = (currentIndex + 1) % modes.length;
                settings.mode = modes[nextIndex].en;
                settings.mode_cn = modes[nextIndex].cn;
                saveRulesAndAlert('已切换为' + modes[nextIndex].cn);
                // 重新打开空白区域设置
                setTimeout(function() {
                    manageBlankAreaSettings();
                }, 100);
                break;
                
            case '3':
                // 进入详细设置
                manageBlankAreaDetailedSettings();
                break;
                
            case '4':
                // 重置为默认设置
                if (confirm('确定要重置空白区域设置为默认值吗？')) {
                    rules.blank_areas = JSON.parse(JSON.stringify(defaultRules.blank_areas));
                    saveRulesAndAlert('已重置为默认设置');
                    // 重新打开空白区域设置
                    setTimeout(function() {
                        manageBlankAreaSettings();
                    }, 100);
                } else {
                    setTimeout(function() {
                        manageBlankAreaSettings();
                    }, 100);
                }
                break;
                
            case '5':
                // 返回规则设置
                manageRules();
                break;
        }
    }
    
    // 管理空白区域详细设置
    function manageBlankAreaDetailedSettings() {
        if (!rules.blank_areas) {
            rules.blank_areas = JSON.parse(JSON.stringify(defaultRules.blank_areas));
        }
        
        var settings = rules.blank_areas.settings || {};
        
        var message = '⚙️ 空白区域详细设置\n\n';
        message += '当前设置：\n';
        message += '1. 最小高度：' + (settings.minHeight || 30) + 'px\n';
        message += '2. 最小宽度：' + (settings.minWidth || 100) + 'px\n';
        message += '3. 清理空元素：' + (settings.removeEmptyElements ? '✅ 开启' : '❌ 关闭') + '\n';
        message += '4. 清理隐藏元素：' + (settings.removeHiddenElements ? '✅ 开启' : '❌ 关闭') + '\n';
        message += '5. 清理空白文本元素：' + (settings.removeWhitespaceOnlyElements ? '✅ 开启' : '❌ 关闭') + '\n';
        message += '6. 清理固定高度元素：' + (settings.removeFixedHeightElements ? '✅ 开启' : '❌ 关闭') + '\n\n';
        
        message += '请选择要修改的设置（输入编号）：\n';
        message += '7. 返回';
        
        var choice = prompt(message, '');
        
        if (choice === null || choice.trim() === '') {
            return;
        }
        
        switch (choice.trim()) {
            case '1':
                var newHeight = prompt('请输入最小高度阈值（像素）：\n推荐值：30-100px', settings.minHeight || 30);
                if (newHeight !== null && /^\d+$/.test(newHeight.trim())) {
                    var height = parseInt(newHeight.trim());
                    if (height >= 10 && height <= 500) {
                        settings.minHeight = height;
                        saveRulesAndAlert('已设置最小高度为' + height + 'px');
                    } else {
                        alert('请输入10-500之间的数字');
                    }
                }
                // 返回详细设置
                setTimeout(function() {
                    manageBlankAreaDetailedSettings();
                }, 100);
                break;
                
            case '2':
                var newWidth = prompt('请输入最小宽度阈值（像素）：\n推荐值：100-300px', settings.minWidth || 100);
                if (newWidth !== null && /^\d+$/.test(newWidth.trim())) {
                    var width = parseInt(newWidth.trim());
                    if (width >= 50 && width <= 800) {
                        settings.minWidth = width;
                        saveRulesAndAlert('已设置最小宽度为' + width + 'px');
                    } else {
                        alert('请输入50-800之间的数字');
                    }
                }
                // 返回详细设置
                setTimeout(function() {
                    manageBlankAreaDetailedSettings();
                }, 100);
                break;
                
            case '3':
                settings.removeEmptyElements = !settings.removeEmptyElements;
                saveRulesAndAlert('已' + (settings.removeEmptyElements ? '开启' : '关闭') + '空元素清理');
                // 返回详细设置
                setTimeout(function() {
                    manageBlankAreaDetailedSettings();
                }, 100);
                break;
                
            case '4':
                settings.removeHiddenElements = !settings.removeHiddenElements;
                saveRulesAndAlert('已' + (settings.removeHiddenElements ? '开启' : '关闭') + '隐藏元素清理');
                // 返回详细设置
                setTimeout(function() {
                    manageBlankAreaDetailedSettings();
                }, 100);
                break;
                
            case '5':
                settings.removeWhitespaceOnlyElements = !settings.removeWhitespaceOnlyElements;
                saveRulesAndAlert('已' + (settings.removeWhitespaceOnlyElements ? '开启' : '关闭') + '空白文本元素清理');
                // 返回详细设置
                setTimeout(function() {
                    manageBlankAreaDetailedSettings();
                }, 100);
                break;
                
            case '6':
                settings.removeFixedHeightElements = !settings.removeFixedHeightElements;
                saveRulesAndAlert('已' + (settings.removeFixedHeightElements ? '开启' : '关闭') + '固定高度元素清理');
                // 返回详细设置
                setTimeout(function() {
                    manageBlankAreaDetailedSettings();
                }, 100);
                break;
                
            case '7':
                // 返回空白区域主设置
                manageBlankAreaSettings();
                break;
        }
    }
    
    // 保存规则并显示提示（不重新加载页面）
    function saveRulesAndAlert(message) {
        GM_setValue('interceptionRules', JSON.stringify(rules));
        if (message) {
            alert(message);
        }
    }
    
    // 保存规则并重新加载页面
    function saveRulesAndReload(message) {
        GM_setValue('interceptionRules', JSON.stringify(rules));
        if (message) {
            alert(message + '\n页面将重新加载');
        }
        location.reload();
    }
    
    // 添加自定义规则
    function addCustomRule(ruleName) {
        if (!ruleName) {
            ruleName = prompt('请输入新规则的名称：', '');
            if (!ruleName) return;
        }
        
        var keywordsInput = prompt('请输入关键词（用逗号分隔）：\n例如：ad,ads,advertising', '');
        if (keywordsInput === null) return;
        
        var keywords = keywordsInput.split(',').map(function(k) {
            return k.trim();
        }).filter(function(k) {
            return k.length > 0;
        });
        
        if (keywords.length === 0) {
            alert('请输入至少一个关键词');
            return;
        }
        
        // 生成规则ID
        var ruleId = 'custom_' + Date.now();
        
        rules[ruleId] = {
            name: ruleName,
            enabled: true,
            keywords: keywords
        };
        
        GM_setValue('interceptionRules', JSON.stringify(rules));
        alert('已添加自定义规则: ' + ruleName + '\n页面将重新加载');
        location.reload();
    }
    
    // 只在当前域名在白名单中时才执行拦截逻辑
    if (!isEnabledForCurrentDomain) {
        return;
    }
    
    // ============================
    // 以下是JavaScript拦截逻辑
    // ============================
    
    // 监听DOM变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeName === 'SCRIPT') {
                    var src = node.src || '';
                    var content = node.textContent || '';
                    var result = shouldBlockScript(src, content);
                    
                    if (result.block) {
                        console.log('已拦截脚本（' + result.type + '）：', src || content.substring(0, 100));
                        node.remove();
                    }
                }
            });
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    // 移除现有脚本
    document.addEventListener('DOMContentLoaded', function() {
        var scripts = document.querySelectorAll('script');
        scripts.forEach(function(script) {
            var src = script.src || '';
            var content = script.textContent || '';
            var result = shouldBlockScript(src, content);
            
            if (result.block) {
                console.log('已拦截脚本（' + result.type + '）：', src || content.substring(0, 100));
                script.remove();
            }
        });
        
        // 执行空白区域清理
        cleanupBlankAreas();
    });
    
    // 阻止通过document.write添加的脚本
    var oldWrite = document.write;
    document.write = function(content) {
        // 过滤掉匹配拦截规则的script标签
        var filteredContent = content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, function(match, scriptContent) {
            // 提取src属性
            var srcMatch = match.match(/src\s*=\s*["']([^"']+)["']/i);
            var src = srcMatch ? srcMatch[1] : '';
            var result = shouldBlockScript(src, scriptContent);
            
            if (result.block) {
                console.log('已拦截document.write脚本（' + result.type + '）');
                return '';
            }
            return match;
        });
        
        oldWrite.call(document, filteredContent);
    };
    
    // 拦截document.writeln
    var oldWriteln = document.writeln;
    document.writeln = function(content) {
        document.write(content + '\n');
    };
    
    // 拦截通过innerHTML添加的脚本
    var originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    if (originalInnerHTML && originalInnerHTML.set) {
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                var filteredValue = value.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, function(match, scriptContent) {
                    var srcMatch = match.match(/src\s*=\s*["']([^"']+)["']/i);
                    var src = srcMatch ? srcMatch[1] : '';
                    var result = shouldBlockScript(src, scriptContent);
                    
                    if (result.block) {
                        console.log('已拦截innerHTML脚本（' + result.type + '）');
                        return '';
                    }
                    return match;
                });
                
                originalInnerHTML.set.call(this, filteredValue);
            },
            get: function() {
                return originalInnerHTML.get.call(this);
            }
        });
    }
    
    // 拦截动态创建的script元素
    var originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        var element = originalCreateElement.call(document, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            // 拦截src属性设置
            var originalSrcDescriptor = Object.getOwnPropertyDescriptor(element, 'src');
            if (!originalSrcDescriptor) {
                originalSrcDescriptor = {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: ''
                };
            }
            
            Object.defineProperty(element, 'src', {
                set: function(value) {
                    var result = shouldBlockScript(value, '');
                    if (result.block) {
                        console.log('已拦截动态脚本（' + result.type + '）：', value);
                        return;
                    }
                    originalSrcDescriptor.value = value;
                },
                get: function() {
                    return originalSrcDescriptor.value;
                },
                configurable: true,
                enumerable: true
            });
        }
        
        return element;
    };
    
})();