// ==UserScript==
// @name         百度网盘 Cookie 完整提取器
// @namespace    http://tampermonkey.net/
// @version      4.0
// @license      MIT
// @description  专门针对百度网盘优化，完整提取所有Cookie（含HttpOnly）
// @author       Marx Engels
// @match        *://*.baidu.com/*
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @connect      baidu.com
// @connect      pan.baidu.com
// @run-at       document-start
// @icon         https://pan.baidu.com/res/static/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/551239/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20Cookie%20%E5%AE%8C%E6%95%B4%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551239/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20Cookie%20%E5%AE%8C%E6%95%B4%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = true;

    // 百度关键Cookie列表
    const BAIDU_CRITICAL_COOKIES = [
        'BDUSS', 'BDUSS_BFESS',  // 百度通行证
        'STOKEN',                 // 会话令牌
        'PANPSC', 'PANWEB',      // 网盘专用
        'csrfToken',             // CSRF防护
        'BAIDUID', 'BIDUPSID',   // 用户标识
        'ndut_fmt'               // 网盘格式化
    ];

    GM_addStyle(`
        .baidu-cookie-notifier {
            all: initial;
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            padding: 16px 24px !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
            z-index: 2147483647 !important;
            font-family: 'Segoe UI', 'Microsoft Yahei', sans-serif !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            min-width: 200px !important;
            max-width: 400px !important;
            opacity: 0 !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            transform: translateX(100px) !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
        }

        .baidu-cookie-notifier.show {
            opacity: 1 !important;
            transform: translateX(0) !important;
        }

        .baidu-cookie-notifier.success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
        }

        .baidu-cookie-notifier.error {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
        }

        .baidu-cookie-notifier.warning {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
        }

        .baidu-cookie-title {
            font-weight: 700 !important;
            font-size: 15px !important;
            margin-bottom: 6px !important;
        }

        .baidu-cookie-content {
            font-size: 13px !important;
            opacity: 0.95 !important;
            line-height: 1.5 !important;
        }

        .baidu-cookie-stats {
            margin-top: 8px !important;
            padding-top: 8px !important;
            border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
            font-size: 12px !important;
            opacity: 0.9 !important;
        }
    `);

    function showNotification(title, content, stats = '', type = 'default', duration = 2500) {
        try {
            const existing = document.querySelector('.baidu-cookie-notifier');
            if (existing) existing.remove();

            const notification = document.createElement('div');
            notification.className = `baidu-cookie-notifier ${type}`;
            
            notification.innerHTML = `
                <div class="baidu-cookie-title">${title}</div>
                <div class="baidu-cookie-content">${content}</div>
                ${stats ? `<div class="baidu-cookie-stats">${stats}</div>` : ''}
            `;

            (document.body || document.documentElement).appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300);
                }, duration);
            }, 10);
        } catch (e) {
            console.error('通知显示失败:', e);
        }
    }

    // 方法1: 使用GM_cookie API (Tampermonkey特有)
    function getCookiesViaGM(callback) {
        if (typeof GM_cookie === 'undefined') {
            if (DEBUG) console.log('GM_cookie API不可用');
            callback(null);
            return;
        }

        const domain = window.location.hostname;
        const allDomains = [
            domain,
            '.baidu.com',
            'pan.baidu.com',
            '.pan.baidu.com'
        ];

        let allCookies = [];
        let processed = 0;

        allDomains.forEach(d => {
            GM_cookie.list({ domain: d }, (cookies, error) => {
                if (!error && cookies) {
                    allCookies = allCookies.concat(cookies);
                }
                processed++;
                if (processed === allDomains.length) {
                    // 去重
                    const uniqueCookies = Array.from(
                        new Map(allCookies.map(c => [c.name, c])).values()
                    );
                    callback(uniqueCookies);
                }
            });
        });
    }

    // 方法2: document.cookie
    function getDocumentCookies() {
        const cookieString = document.cookie;
        if (!cookieString) return [];
        
        return cookieString.split(';').map(cookie => {
            const [name, ...valueParts] = cookie.split('=');
            return {
                name: name.trim(),
                value: valueParts.join('=').trim(),
                source: 'document.cookie'
            };
        }).filter(c => c.name);
    }

    // 方法3: 通过请求拦截
    function interceptRequestCookies() {
        const cookies = [];
        const originalOpen = XMLHttpRequest.prototype.open;
        
        XMLHttpRequest.prototype.open = function(...args) {
            this.addEventListener('load', function() {
                const setCookie = this.getAllResponseHeaders().match(/^set-cookie:(.*)$/gim);
                if (setCookie) {
                    setCookie.forEach(header => {
                        const cookieString = header.substring(12).trim();
                        const [nameValue] = cookieString.split(';');
                        const [name, ...valueParts] = nameValue.split('=');
                        if (name) {
                            cookies.push({
                                name: name.trim(),
                                value: valueParts.join('=').trim(),
                                source: 'xhr-intercept'
                            });
                        }
                    });
                }
            });
            return originalOpen.apply(this, args);
        };
        
        return cookies;
    }

    // 主提取函数
    function extractAllCookies(callback) {
        showNotification(
            '🔄 正在提取...',
            '正在从多个来源收集Cookie',
            '',
            'default',
            1000
        );

        const results = {
            document: getDocumentCookies(),
            gm: null,
            merged: []
        };

        // 尝试使用GM_cookie
        getCookiesViaGM((gmCookies) => {
            if (gmCookies) {
                results.gm = gmCookies.map(c => ({
                    name: c.name,
                    value: c.value,
                    httpOnly: c.httpOnly || false,
                    secure: c.secure || false,
                    source: 'GM_cookie'
                }));
            }

            // 合并所有Cookie
            const cookieMap = new Map();
            
            // 优先使用GM_cookie结果（更完整）
            if (results.gm) {
                results.gm.forEach(c => cookieMap.set(c.name, c));
            }
            
            // 补充document.cookie中的
            results.document.forEach(c => {
                if (!cookieMap.has(c.name)) {
                    cookieMap.set(c.name, c);
                }
            });

            results.merged = Array.from(cookieMap.values());
            callback(results);
        });
    }

    // 格式化为标准Cookie字符串
    function formatCookieString(cookies) {
        return cookies.map(c => `${c.name}=${c.value}`).join('; ');
    }

    // 分析Cookie完整性
    function analyzeCookies(results) {
        const merged = results.merged;
        const criticalFound = BAIDU_CRITICAL_COOKIES.filter(name =>
            merged.some(c => c.name === name)
        );
        const criticalMissing = BAIDU_CRITICAL_COOKIES.filter(name =>
            !merged.some(c => c.name === name)
        );

        const httpOnlyCount = merged.filter(c => c.httpOnly).length;
        const secureCount = merged.filter(c => c.secure).length;

        return {
            total: merged.length,
            criticalFound: criticalFound.length,
            criticalMissing: criticalMissing.length,
            httpOnlyCount,
            secureCount,
            missingCookies: criticalMissing,
            completeness: (criticalFound.length / BAIDU_CRITICAL_COOKIES.length * 100).toFixed(0)
        };
    }

    // 完整提取功能
    function fullExtract() {
        extractAllCookies((results) => {
            const cookieString = formatCookieString(results.merged);
            const analysis = analyzeCookies(results);

            if (cookieString) {
                GM_setClipboard(cookieString, 'text');
                
                const type = analysis.completeness >= 80 ? 'success' : 'warning';
                showNotification(
                    `✅ 已复制 ${analysis.total} 个Cookie`,
                    `关键Cookie: ${analysis.criticalFound}/${BAIDU_CRITICAL_COOKIES.length}`,
                    `完整度: ${analysis.completeness}% | HttpOnly: ${analysis.httpOnlyCount} | Secure: ${analysis.secureCount}`,
                    type,
                    3000
                );

                if (DEBUG) {
                    console.group('%c 🍪 百度Cookie完整提取报告', 'color: #667eea; font-weight: bold; font-size: 16px');
                    console.log('%c 📊 统计信息', 'color: #10b981; font-weight: bold');
                    console.log('总数量:', analysis.total);
                    console.log('关键Cookie:', `${analysis.criticalFound}/${BAIDU_CRITICAL_COOKIES.length}`);
                    console.log('HttpOnly:', analysis.httpOnlyCount);
                    console.log('Secure:', analysis.secureCount);
                    console.log('完整度:', analysis.completeness + '%');
                    
                    if (analysis.missingCookies.length > 0) {
                        console.log('%c ⚠️  缺失的关键Cookie:', 'color: #f59e0b; font-weight: bold');
                        analysis.missingCookies.forEach(name => console.log('  - ' + name));
                    }

                    console.log('\n%c 📋 Cookie字符串 (已复制到剪贴板):', 'color: #3b82f6; font-weight: bold');
                    console.log(cookieString);

                    if (results.gm) {
                        console.log('\n%c ✅ 通过GM_cookie获取到完整Cookie (含HttpOnly)', 'color: #10b981; font-weight: bold');
                        console.table(results.gm.map(c => ({
                            名称: c.name,
                            值长度: c.value.length + '字符',
                            HttpOnly: c.httpOnly ? '✓' : '-',
                            Secure: c.secure ? '✓' : '-',
                            来源: c.source
                        })));
                    } else {
                        console.log('\n%c ⚠️  GM_cookie不可用，可能缺少HttpOnly Cookie', 'color: #f59e0b; font-weight: bold');
                        console.log('请确保使用最新版本的Tampermonkey');
                    }

                    console.groupEnd();
                }
            } else {
                showNotification(
                    '❌ 提取失败',
                    '当前页面没有找到Cookie',
                    '',
                    'error'
                );
            }
        });
    }

    // 仅提取关键Cookie
    function extractCritical() {
        extractAllCookies((results) => {
            const critical = results.merged.filter(c =>
                BAIDU_CRITICAL_COOKIES.includes(c.name)
            );

            if (critical.length > 0) {
                const cookieString = formatCookieString(critical);
                GM_setClipboard(cookieString, 'text');
                showNotification(
                    `🎯 已复制 ${critical.length} 个关键Cookie`,
                    BAIDU_CRITICAL_COOKIES.slice(0, 3).join(', ') + '...',
                    `完整度: ${(critical.length/BAIDU_CRITICAL_COOKIES.length*100).toFixed(0)}%`,
                    'success',
                    2500
                );

                if (DEBUG) {
                    console.log('%c 🎯 关键Cookie提取:', 'color: #667eea; font-weight: bold');
                    console.table(critical.map(c => ({
                        名称: c.name,
                        值: c.value.substring(0, 30) + '...',
                        来源: c.source
                    })));
                }
            } else {
                showNotification(
                    '⚠️ 未找到关键Cookie',
                    '请确保已登录百度账号',
                    '',
                    'warning'
                );
            }
        });
    }

    // 诊断功能
    function runDiagnostics() {
        console.clear();
        console.log('%c 🔬 百度Cookie诊断工具', 'font-size: 18px; font-weight: bold; color: #667eea');
        
        console.log('\n%c 【环境检查】', 'color: #10b981; font-weight: bold; font-size: 14px');
        console.log('当前URL:', window.location.href);
        console.log('域名:', window.location.hostname);
        console.log('协议:', window.location.protocol);
        console.log('GM_cookie可用:', typeof GM_cookie !== 'undefined' ? '✅ 是' : '❌ 否');
        
        extractAllCookies((results) => {
            const analysis = analyzeCookies(results);
            
            console.log('\n%c 【Cookie统计】', 'color: #10b981; font-weight: bold; font-size: 14px');
            console.log('document.cookie:', results.document.length, '个');
            console.log('GM_cookie:', results.gm ? results.gm.length + '个' : '不可用');
            console.log('合并后总数:', results.merged.length, '个');
            console.log('HttpOnly Cookie:', analysis.httpOnlyCount, '个');
            
            console.log('\n%c 【关键Cookie检查】', 'color: #f59e0b; font-weight: bold; font-size: 14px');
            BAIDU_CRITICAL_COOKIES.forEach(name => {
                const found = results.merged.find(c => c.name === name);
                if (found) {
                    console.log(`✅ ${name}: 已找到 (${found.source}${found.httpOnly ? ', HttpOnly' : ''})`);
                } else {
                    console.log(`❌ ${name}: 缺失`);
                }
            });
            
            console.log('\n%c 【建议】', 'color: #3b82f6; font-weight: bold; font-size: 14px');
            if (analysis.completeness < 100) {
                console.log('• 完整度仅 ' + analysis.completeness + '%，部分关键Cookie缺失');
                if (!results.gm) {
                    console.log('• GM_cookie不可用，无法获取HttpOnly Cookie');
                    console.log('• 建议更新Tampermonkey到最新版本');
                }
                if (analysis.missingCookies.length > 0) {
                    console.log('• 缺失Cookie:', analysis.missingCookies.join(', '));
                    console.log('• 请确保已登录百度账号并刷新页面');
                }
            } else {
                console.log('✅ Cookie完整度100%，所有关键Cookie已获取');
            }
            
            console.log('\n%c 如需导出，请使用"完整提取"功能', 'color: #8b5cf6');
        });

        showNotification(
            '📊 诊断完成',
            '详细信息请查看控制台',
            '',
            'success',
            2000
        );
    }

    // 对比开发者工具
    function compareWithDevTools() {
        console.clear();
        console.log('%c 🔍 与开发者工具对比', 'font-size: 16px; font-weight: bold; color: #667eea');
        
        extractAllCookies((results) => {
            console.log('\n%c 【提取结果】', 'color: #10b981; font-weight: bold');
            console.log('脚本获取数量:', results.merged.length);
            console.log('Cookie字符串长度:', formatCookieString(results.merged).length);
            
            console.log('\n%c 【手动验证步骤】', 'color: #f59e0b; font-weight: bold');
            console.log('1. 按F12打开开发者工具');
            console.log('2. 点击 Application 标签');
            console.log('3. 左侧点击 Cookies → ' + window.location.hostname);
            console.log('4. 数一下有多少个Cookie（包括HttpOnly的）');
            console.log('5. 对比上面的"脚本获取数量"');
            console.log('\n%c 如果数量一致 = 脚本获取完整 ✅', 'color: #10b981; font-weight: bold');
            console.log('%c 如果开发者工具更多 = 存在HttpOnly Cookie ⚠️', 'color: #ef4444; font-weight: bold');
            
            console.log('\n%c 【参考数据】', 'color: #3b82f6; font-weight: bold');
            console.log('您提供的Cookie示例有29个，长度1847字符');
            console.log('当前获取与参考对比:');
            console.log('  数量差:', 29 - results.merged.length);
            console.log('  长度差:', 1847 - formatCookieString(results.merged).length);
        });

        showNotification(
            '📋 对比指南已输出',
            '请按控制台提示操作',
            '',
            'default',
            2500
        );
    }

    // 注册菜单
    function initializeScript() {
        GM_registerMenuCommand('🚀 完整提取所有Cookie', fullExtract);
        GM_registerMenuCommand('🎯 仅提取关键Cookie', extractCritical);
        GM_registerMenuCommand('🔬 运行诊断测试', runDiagnostics);
        GM_registerMenuCommand('🔍 与开发者工具对比', compareWithDevTools);
        
        if (DEBUG) {
            console.log('%c 百度Cookie提取器已加载', 'color: #667eea; font-weight: bold; font-size: 14px');
            console.log('%c 支持完整提取HttpOnly Cookie', 'color: #10b981');
            console.log('%c 使用Tampermonkey菜单选择功能', 'color: #8b5cf6');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

})();