// ==UserScript==
// @name         智能JavaScript拦截器
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  按域名和脚本类型选择性拦截JavaScript
// @author       Your Name
// @match        *://*/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
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
                "adsbygoogle", "adsense", "amazon-adsystem",
                "facebook.com/ads", "advertising.com", "adzerk"
            ]
        },
        // 视频播放器脚本 - 默认不拦截
        "video": {
            name: "视频播放器",
            enabled: false,
            keywords: [
                "video", "player", "youtube", "vimeo",
                "dailymotion", "jwplayer", "videojs", "flowplayer",
                "brightcove", "kaltura", "wistia", "plyr",
                "mediaelement", "clappr", "shaka", "dash"
            ]
        },
        // 社交媒体脚本
        "social": {
            name: "社交媒体",
            enabled: false,
            keywords: [
                "facebook", "twitter", "linkedin", "instagram",
                "pinterest", "whatsapp", "tiktok", "reddit",
                "tumblr", "snapchat", "wechat", "qq",
                "weibo", "vk", "telegram", "discord"
            ]
        },
        // 分析和追踪脚本
        "analytics": {
            name: "分析和追踪",
            enabled: true,
            keywords: [
                "analytics", "tracking", "tracker", "statistics",
                "metrics", "monitoring", "measurement", "ga.js",
                "gtag", "gtm", "google-analytics", "googleads"
            ]
        }
    };
    
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
        
        // 规则管理菜单
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
            if (rule.enabled && rule.keywords) {
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
    
    // 管理拦截规则
    function manageRules() {
        var message = '拦截规则设置\n\n';
        message += '📝 操作说明：\n';
        message += '• 输入编号切换规则状态\n';
        message += '• 输入新规则名称添加自定义规则\n\n';
        
        var ruleIndex = 1;
        var ruleMap = {};
        
        for (var ruleId in rules) {
            var rule = rules[ruleId];
            ruleMap[ruleIndex] = ruleId;
            message += ruleIndex + '. ' + rule.name + ' (' + (rule.enabled ? '✅ 已启用' : '❌ 已禁用') + ')\n';
            ruleIndex++;
        }
        
        message += '\n' + ruleIndex + '. 添加自定义规则\n';
        ruleMap[ruleIndex] = 'custom';
        
        message += '\n请输入选择：';
        
        // 规则设置的输入框也设为空白
        var input = prompt(message, '');
        
        if (input === null || input.trim() === '') {
            return;
        }
        
        // 检查是否是数字（切换现有规则）
        if (/^\d+$/.test(input.trim())) {
            var selectedIndex = parseInt(input.trim());
            var selectedRuleId = ruleMap[selectedIndex];
            
            if (selectedRuleId === 'custom') {
                addCustomRule();
            } else if (rules[selectedRuleId]) {
                var rule = rules[selectedRuleId];
                rule.enabled = !rule.enabled;
                GM_setValue('interceptionRules', JSON.stringify(rules));
                alert('已' + (rule.enabled ? '启用' : '禁用') + '规则: ' + rule.name + '\n页面将重新加载');
                location.reload();
            }
        } else {
            // 添加新规则
            var newRuleName = input.trim();
            addCustomRule(newRuleName);
        }
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