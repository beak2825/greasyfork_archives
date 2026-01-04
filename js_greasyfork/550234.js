// ==UserScript==
// @name         禁用开发者工具拦截器 - hhkan专用版
// @namespace    http://tampermonkey.net/
// @version      7.5
// @description  针对hhkan系列网站，拦截禁用开发者工具的脚本，保护控制台正常使用
// @author       MissChina
// @match        *://*.hhkan0.com/*
// @match        *://*.hhkan1.com/*
// @match        *://*.hhkan2.com/*
// @match        *://*.hhkan3.com/*
// @match        *://*.hhkan4.com/*
// @match        *://hhkan0.com/*
// @match        *://hhkan1.com/*
// @match        *://hhkan2.com/*
// @match        *://hhkan3.com/*
// @match        *://hhkan4.com/*
// @run-at       document-start
// @grant        none
// @icon         https://github.com/MissChina/anti-disable-devtool/raw/main/icon.png
// @downloadURL https://update.greasyfork.org/scripts/550234/%E7%A6%81%E7%94%A8%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%E6%8B%A6%E6%88%AA%E5%99%A8%20-%20hhkan%E4%B8%93%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/550234/%E7%A6%81%E7%94%A8%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7%E6%8B%A6%E6%88%AA%E5%99%A8%20-%20hhkan%E4%B8%93%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 检测规则 ====================
    // 精确匹配的 URL 路径（高优先级）
    const 精确路径关键词 = [
        'disable-devtool',
        'anti-debug',
        'devtool-disable',
        'disable_devtool',
        'anti_debug',
        'no-devtools',
        'block-devtools',
        'devtools-detect',
    ];

    // CDN 上的特定反调试库路径
    const CDN反调试路径 = [
        'jsdelivr.net/npm/disable-devtool',
        'unpkg.com/disable-devtool',
        'cdnjs.cloudflare.com/ajax/libs/disable-devtool',
        'vf.uujjyp.cn',
    ];

    // 🎯 目标网站域名（hhkan 系列）- 脚本只在这些网站运行
    const 目标网站 = ['hhkan0.com', 'hhkan1.com', 'hhkan2.com', 'hhkan3.com', 'hhkan4.com'];

    const 代码特征 = [
        'DisableDevtool',
        'ondevtoolopen',
        'ondevtoolclose',
        'detectors',
        'RegToString',
        'FuncToString',
        'clearIntervalWhenDevOpenTrigger',
        'isDevToolOpened',
        'devtoolIsOpening',
        'checkDevTools',
        'detectDevTool',
        // 🎯 hhkan 网站可能使用的特征
        'devtools',
        'debugger',
        'console.clear',
        'setInterval',
    ];

    let 拦截次数 = 0;
    let 待显示提示队列 = [];
    let 样式已注入 = false;

    // ==================== 最早期全局保护（立即执行）====================
    // 在任何其他代码之前锁定全局对象
    const 锁定全局属性 = () => {
        const 空函数 = function() { return { success: false, reason: 'blocked' }; };
        const 危险属性 = ['DisableDevtool', 'disableDevtool', 'DISABLE_DEVTOOL'];
        
        危险属性.forEach(属性名 => {
            try {
                Object.defineProperty(window, 属性名, {
                    get: () => 空函数,
                    set: () => true,
                    configurable: false
                });
            } catch(e) {}
        });

        // 阻止 debugger 语句（通过重写 Function 构造器的部分能力）
        const 原始eval = window.eval;
        window.eval = function(代码) {
            if (typeof 代码 === 'string' && 代码.includes('debugger')) {
                代码 = 代码.replace(/debugger/g, '');
            }
            return 原始eval.call(this, 代码);
        };

        // 拦截 Function 构造器中的 debugger
        const 原始Function = window.Function;
        window.Function = function(...args) {
            if (args.length > 0) {
                const 最后参数 = args[args.length - 1];
                if (typeof 最后参数 === 'string' && 最后参数.includes('debugger')) {
                    args[args.length - 1] = 最后参数.replace(/debugger/g, '');
                }
            }
            return 原始Function.apply(this, args);
        };
        window.Function.prototype = 原始Function.prototype;

        // 🔥 核心：拦截 alert/confirm/prompt 弹窗
        const 原始alert = window.alert;
        window.alert = function(消息) {
            const 消息字符串 = String(消息).toLowerCase();
            // 检测常见的反调试弹窗关键词
            const 反调试关键词 = ['devtool', 'debugger', '调试', '开发者工具', 'f12', '控制台', 'console'];
            if (反调试关键词.some(词 => 消息字符串.includes(词))) {
                console.log('🛡️ [alert] 拦截反调试弹窗:', 消息);
                return;
            }
            return 原始alert.call(this, 消息);
        };

        const 原始confirm = window.confirm;
        window.confirm = function(消息) {
            const 消息字符串 = String(消息).toLowerCase();
            const 反调试关键词 = ['devtool', 'debugger', '调试', '开发者工具', 'f12', '控制台', 'console'];
            if (反调试关键词.some(词 => 消息字符串.includes(词))) {
                console.log('🛡️ [confirm] 拦截反调试弹窗:', 消息);
                return false;
            }
            return 原始confirm.call(this, 消息);
        };

        // 🔥 核心：拦截页面跳转（防止跳转到百度等）
        const 跳转黑名单 = [
            'baidu.com', 'google.com', 'bing.com', 'so.com', 'sogou.com', 
            'about:blank', 'blank.html', '//www.', 'javascript:'
        ];
        
        // 🎯 针对 hhkan 网站：检测是否跳转离开当前域名
        const 当前域名 = location.hostname;
        
        // 检测是否为恶意跳转
        const 是否为恶意跳转 = (url) => {
            if (!url) return false;
            const 网址字符串 = String(url).toLowerCase();
            
            // 黑名单匹配
            if (跳转黑名单.some(域名 => 网址字符串.includes(域名))) {
                return true;
            }
            
            // 🎯 针对 hhkan：如果是目标网站，阻止跳转到其他域名
            if (当前域名.includes('hhkan')) {
                try {
                    const 目标URL = new URL(url, location.href);
                    // 如果跳转到非 hhkan 域名，视为恶意跳转
                    if (!目标URL.hostname.includes('hhkan')) {
                        return true;
                    }
                } catch(e) {}
            }
            
            return false;
        };

        // 拦截 location.assign
        const 原始assign = Location.prototype.assign;
        Location.prototype.assign = function(url) {
            if (是否为恶意跳转(url)) {
                console.log('🛡️ [location.assign] 拦截恶意跳转:', url);
                return;
            }
            return 原始assign.call(this, url);
        };

        // 拦截 location.replace
        const 原始replace = Location.prototype.replace;
        Location.prototype.replace = function(url) {
            if (是否为恶意跳转(url)) {
                console.log('🛡️ [location.replace] 拦截恶意跳转:', url);
                return;
            }
            return 原始replace.call(this, url);
        };

        // 拦截 window.open
        const 原始open = window.open;
        window.open = function(url, ...args) {
            if (是否为恶意跳转(url)) {
                console.log('🛡️ [window.open] 拦截恶意跳转:', url);
                return null;
            }
            return 原始open.call(this, url, ...args);
        };

        // 🔥 关键：拦截通过 setter 设置 location.href 的跳转
        // 使用 Proxy 代理 location 对象的属性访问
        const 创建location代理 = () => {
            const 原始href描述符 = Object.getOwnPropertyDescriptor(Location.prototype, 'href');
            if (原始href描述符 && 原始href描述符.set) {
                const 原始hrefSetter = 原始href描述符.set;
                Object.defineProperty(Location.prototype, 'href', {
                    get: 原始href描述符.get,
                    set: function(url) {
                        if (是否为恶意跳转(url)) {
                            console.log('🛡️ [location.href] 拦截恶意跳转:', url);
                            return;
                        }
                        return 原始hrefSetter.call(this, url);
                    },
                    configurable: true,
                    enumerable: true
                });
            }
        };
        
        try {
            创建location代理();
        } catch(e) {
            console.log('🛡️ location.href 拦截设置失败，尝试备用方案');
        }
    };
    锁定全局属性();

    // ==================== 启动信息 ====================
    console.log('%c🛡️ hhkan专用拦截器 v7.5 已启动', 'color: #10B981; font-weight: bold; font-size: 14px;');
    console.log('%c👨‍💻 作者：MissChina', 'color: #6B7280; font-size: 12px;');
    console.log('%c⚠️ 仅供个人非盈利使用，禁止商用', 'color: #F59E0B; font-size: 12px; font-weight: bold;');

    // ==================== 注入样式 ====================
    function 注入样式() {
        if (样式已注入) return;

        const 样式标签 = document.createElement('style');
        样式标签.textContent = `
            @keyframes antiDevtoolSlideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes antiDevtoolFadeOut {
                to {
                    opacity: 0;
                    transform: translateX(400px);
                }
            }
        `;
        document.head.appendChild(样式标签);
        样式已注入 = true;
    }

    // ==================== 提示系统 ====================
    function 显示提示(消息, 网址 = '') {
        // 如果 body 还不存在，加入队列等待
        if (!document.body) {
            待显示提示队列.push({ 消息, 网址 });
            return;
        }

        // 确保样式已注入
        注入样式();

        const 提示框 = document.createElement('div');
        提示框.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Microsoft YaHei', sans-serif;
            font-size: 14px;
            z-index: 2147483647;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(20px);
            animation: antiDevtoolSlideIn 0.3s ease-out;
            max-width: 400px;
            word-break: break-all;
        `;

        提示框.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">🛡️</span>
                <div>
                    <div style="font-weight: 600; margin-bottom: 4px;">${消息}</div>
                    ${网址 ? `<div style="font-size: 12px; opacity: 0.9; margin-top: 4px; max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${网址}</div>` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(提示框);

        // 3秒后淡出并移除
        setTimeout(() => {
            提示框.style.animation = 'antiDevtoolFadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (提示框.parentNode) {
                    提示框.parentNode.removeChild(提示框);
                }
            }, 300);
        }, 3000);
    }

    // ==================== 处理待显示的提示 ====================
    function 处理待显示提示() {
        if (待显示提示队列.length === 0) return;

        待显示提示队列.forEach(项 => {
            显示提示(项.消息, 项.网址);
        });

        待显示提示队列 = [];
    }

    // ==================== 检测函数 ====================
    function 是否为目标脚本(网址, 内容 = '') {
        if (!网址 && !内容) return false;

        if (网址) {
            const 小写网址 = 网址.toLowerCase();
            
            // 精确路径匹配（高优先级）
            if (精确路径关键词.some(关键词 => 小写网址.includes(关键词.toLowerCase()))) {
                return true;
            }
            
            // CDN 特定路径匹配
            if (CDN反调试路径.some(路径 => 小写网址.includes(路径.toLowerCase()))) {
                return true;
            }
        }

        if (内容) {
            const 匹配数量 = 代码特征.filter(特征 => 内容.includes(特征)).length;
            return 匹配数量 >= 2; // 降低阈值，提高检测灵敏度
        }

        return false;
    }

    // ==================== 拦截引擎 ====================
    function 拦截脚本(脚本元素, 方法) {
        const 网址 = 脚本元素.src || 脚本元素.getAttribute('src') || '';
        const 内容 = 脚本元素.textContent || 脚本元素.innerHTML || '';

        if (是否为目标脚本(网址, 内容)) {
            拦截次数++;
            const 显示网址 = 网址 || '内联脚本';

            console.log(`🛡️ 拦截成功 [${方法}]`, 显示网址);
            显示提示(`成功拦截第 ${拦截次数} 个恶意脚本`, 显示网址);

            const 替代脚本 = document.createElement('script');
            替代脚本.textContent = `
                console.log('%c🛡️ 反调试脚本已被安全拦截', 'color: #10b981; font-weight: bold;');
                window.DisableDevtool = function() { return { success: false, reason: 'intercepted' }; };
            `;
            return 替代脚本;
        }
        return null;
    }

    // ==================== 劫持脚本加载 ====================
    const 原始appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function(子元素) {
        if (子元素 && 子元素.tagName === 'SCRIPT') {
            const 替换元素 = 拦截脚本(子元素, 'appendChild');
            if (替换元素) return 原始appendChild.call(this, 替换元素);
        }
        return 原始appendChild.call(this, 子元素);
    };

    const 原始insertBefore = Element.prototype.insertBefore;
    Element.prototype.insertBefore = function(新节点, 参考节点) {
        if (新节点 && 新节点.tagName === 'SCRIPT') {
            const 替换元素 = 拦截脚本(新节点, 'insertBefore');
            if (替换元素) return 原始insertBefore.call(this, 替换元素, 参考节点);
        }
        return 原始insertBefore.call(this, 新节点, 参考节点);
    };

    const 原始createElement = Document.prototype.createElement;
    Document.prototype.createElement = function(标签名) {
        const 元素 = 原始createElement.call(this, 标签名);

        if (标签名 && 标签名.toLowerCase() === 'script') {
            let 真实网址 = '';

            Object.defineProperty(元素, 'src', {
                get: () => 真实网址,
                set: (值) => {
                    if (值 && 是否为目标脚本(值)) {
                        拦截次数++;
                        console.log(`🛡️ 拦截成功 [createElement]`, 值);
                        显示提示(`成功拦截第 ${拦截次数} 个恶意脚本`, 值);
                        return;
                    }
                    真实网址 = 值;
                    元素.setAttribute('src', 值);
                }
            });

            const 原始设置器 = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent').set;
            Object.defineProperty(元素, 'textContent', {
                get: function() { return this._内容 || ''; },
                set: function(值) {
                    if (值 && 是否为目标脚本('', 值)) {
                        拦截次数++;
                        console.log(`🛡️ 拦截成功 [内联脚本]`);
                        显示提示(`成功拦截第 ${拦截次数} 个恶意脚本`, '内联脚本');
                        this._内容 = '// 已拦截';
                        return;
                    }
                    this._内容 = 值;
                    原始设置器.call(this, 值);
                }
            });
        }

        return 元素;
    };

    // ==================== 等待 body 加载 ====================
    function 初始化提示系统() {
        if (document.body) {
            处理待显示提示();
        } else {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    处理待显示提示();
                });
            } else {
                setTimeout(初始化提示系统, 50);
            }
        }
    }

    初始化提示系统();

    // ==================== MutationObserver 实时监控（核心优化）====================
    const 启动实时监控 = () => {
        const 观察器 = new MutationObserver((变更列表) => {
            for (const 变更 of 变更列表) {
                for (const 新节点 of 变更.addedNodes) {
                    // 拦截脚本
                    if (新节点.tagName === 'SCRIPT') {
                        const 网址 = 新节点.src || '';
                        const 内容 = 新节点.textContent || '';
                        
                        if (是否为目标脚本(网址, 内容)) {
                            // 立即阻止执行
                            新节点.type = 'javascript/blocked';
                            新节点.removeAttribute('src');
                            新节点.textContent = '// 已被拦截';
                            
                            拦截次数++;
                            console.log('🛡️ [MutationObserver] 实时拦截', 网址 || '内联脚本');
                            显示提示(`实时拦截第 ${拦截次数} 个恶意脚本`, 网址 || '内联脚本');
                            
                            // 尝试移除
                            if (新节点.parentNode) {
                                新节点.parentNode.removeChild(新节点);
                            }
                        }
                    }
                    
                    // 拦截 meta 刷新跳转
                    if (新节点.tagName === 'META') {
                        const httpEquiv = 新节点.getAttribute('http-equiv');
                        const content = 新节点.getAttribute('content') || '';
                        if (httpEquiv && httpEquiv.toLowerCase() === 'refresh') {
                            const 跳转黑名单 = ['baidu.com', 'google.com', 'bing.com', 'so.com', 'sogou.com', 'about:blank'];
                            if (跳转黑名单.some(域名 => content.toLowerCase().includes(域名))) {
                                console.log('🛡️ [META] 拦截 meta 跳转:', content);
                                新节点.remove();
                            }
                        }
                    }
                }
            }
        });

        // 尽早开始观察
        观察器.observe(document.documentElement || document, {
            childList: true,
            subtree: true
        });
        
        // document.head 可用时也观察
        if (document.head) {
            观察器.observe(document.head, { childList: true, subtree: true });
        }
    };
    
    // 立即启动监控
    if (document.documentElement) {
        启动实时监控();
    } else {
        // 极早期，等待 documentElement
        const 等待文档 = setInterval(() => {
            if (document.documentElement) {
                clearInterval(等待文档);
                启动实时监控();
            }
        }, 0);
    }

    // ==================== 拦截 fetch 请求 ====================
    const 原始fetch = window.fetch;
    window.fetch = function(url, options) {
        const 网址字符串 = typeof url === 'string' ? url : (url.url || '');
        if (是否为目标脚本(网址字符串)) {
            拦截次数++;
            console.log('🛡️ [fetch] 拦截请求', 网址字符串);
            显示提示(`拦截 fetch 请求`, 网址字符串);
            return Promise.resolve(new Response('// blocked', { status: 200 }));
        }
        return 原始fetch.apply(this, arguments);
    };

    // ==================== 拦截 XMLHttpRequest ====================
    const 原始XHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._拦截器URL = url;
        return 原始XHROpen.apply(this, arguments);
    };

    const 原始XHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        if (this._拦截器URL && 是否为目标脚本(this._拦截器URL)) {
            拦截次数++;
            console.log('🛡️ [XHR] 拦截请求', this._拦截器URL);
            显示提示(`拦截 XHR 请求`, this._拦截器URL);
            return;
        }
        return 原始XHRSend.apply(this, arguments);
    };

    // ==================== 立即扫描（同步执行）====================
    const 立即扫描脚本 = () => {
        document.querySelectorAll('script').forEach(脚本 => {
            const 网址 = 脚本.src;
            const 内容 = 脚本.textContent || 脚本.innerHTML;

            if (是否为目标脚本(网址, 内容)) {
                脚本.type = 'javascript/blocked';
                脚本.removeAttribute('src');
                脚本.textContent = '// 已拦截';
                
                if (脚本.parentNode) {
                    脚本.parentNode.removeChild(脚本);
                }
                
                拦截次数++;
                console.log('🛡️ [立即扫描] 移除脚本', 网址 || '内联脚本');
                显示提示(`立即扫描移除恶意脚本`, 网址 || '内联脚本');
            }
        });
    };

    // 多时机扫描确保覆盖
    立即扫描脚本();
    document.addEventListener('DOMContentLoaded', 立即扫描脚本);
    window.addEventListener('load', 立即扫描脚本);

    // ==================== 扫描已存在的脚本（延迟兜底）====================
    setTimeout(() => {
        document.querySelectorAll('script').forEach(脚本 => {
            const 网址 = 脚本.src;
            const 内容 = 脚本.textContent || 脚本.innerHTML;

            if (是否为目标脚本(网址, 内容)) {
                console.log('🛡️ [延迟扫描] 移除脚本', 网址 || '内联脚本');
                if (脚本.parentNode) {
                    脚本.parentNode.removeChild(脚本);
                    拦截次数++;
                    显示提示(`延迟扫描移除恶意脚本`, 网址 || '内联脚本');
                }
            }
        });
    }, 100); // 缩短延迟时间

    // 额外的延迟扫描作为最终兜底
    setTimeout(() => {
        document.querySelectorAll('script').forEach(脚本 => {
            const 网址 = 脚本.src;
            const 内容 = 脚本.textContent || 脚本.innerHTML;

            if (是否为目标脚本(网址, 内容)) {
                console.log('🛡️ [兜底扫描] 移除脚本', 网址 || '内联脚本');
                if (脚本.parentNode) {
                    脚本.parentNode.removeChild(脚本);
                    拦截次数++;
                    显示提示(`兜底扫描移除恶意脚本`, 网址 || '内联脚本');
                }
            }
        });
    }, 1000);

    // ==================== 清理定时器炸弹 ====================
    // 拦截可能的 setInterval 检测
    const 原始setInterval = window.setInterval;
    window.setInterval = function(回调, 延迟, ...参数) {
        const 回调字符串 = 回调.toString();
        if (代码特征.some(特征 => 回调字符串.includes(特征))) {
            console.log('🛡️ [setInterval] 拦截可疑定时器');
            return -1;
        }
        return 原始setInterval.call(this, 回调, 延迟, ...参数);
    };

    const 原始setTimeout = window.setTimeout;
    window.setTimeout = function(回调, 延迟, ...参数) {
        if (typeof 回调 === 'function') {
            const 回调字符串 = 回调.toString();
            if (代码特征.some(特征 => 回调字符串.includes(特征))) {
                console.log('🛡️ [setTimeout] 拦截可疑定时器');
                return -1;
            }
        }
        return 原始setTimeout.call(this, 回调, 延迟, ...参数);
    };

    console.log('🛡️ 拦截器已启动，多层防护已就绪');

    // ==================== 跳转保护增强 ====================
    // 监听 beforeunload，检测可疑跳转
    const 跳转黑名单全局 = ['baidu.com', 'google.com', 'bing.com', 'so.com', 'sogou.com', 'about:blank'];
    let 用户主动导航 = false;

    // 标记用户主动点击
    document.addEventListener('click', (e) => {
        const 目标 = e.target.closest('a');
        if (目标 && 目标.href) {
            用户主动导航 = true;
            setTimeout(() => { 用户主动导航 = false; }, 100);
        }
    }, true);

    // 拦截非用户触发的跳转
    window.addEventListener('beforeunload', (e) => {
        if (!用户主动导航) {
            // 检查是否是恶意跳转
            // 注意：beforeunload 时已经无法阻止跳转，但可以记录
            console.log('🛡️ [beforeunload] 检测到非用户触发的页面离开');
        }
    });

    // ==================== SPA 导航监控 ====================
    // 监控 history API 变化（SPA 单页应用跳转）
    const 监控SPA导航 = () => {
        let 当前URL = location.href;

        // 劫持 pushState
        const 原始pushState = history.pushState;
        history.pushState = function(...args) {
            const 结果 = 原始pushState.apply(this, args);
            if (location.href !== 当前URL) {
                当前URL = location.href;
                console.log('🛡️ [SPA] 检测到页面导航，重新扫描');
                延迟扫描并清理();
            }
            return 结果;
        };

        // 劫持 replaceState
        const 原始replaceState = history.replaceState;
        history.replaceState = function(...args) {
            const 结果 = 原始replaceState.apply(this, args);
            if (location.href !== 当前URL) {
                当前URL = location.href;
                console.log('🛡️ [SPA] 检测到页面替换，重新扫描');
                延迟扫描并清理();
            }
            return 结果;
        };

        // 监听 popstate（浏览器前进后退）
        window.addEventListener('popstate', () => {
            if (location.href !== 当前URL) {
                当前URL = location.href;
                console.log('🛡️ [SPA] 检测到历史导航，重新扫描');
                延迟扫描并清理();
            }
        });

        // 监听 hashchange
        window.addEventListener('hashchange', () => {
            console.log('🛡️ [SPA] 检测到 hash 变化，重新扫描');
            延迟扫描并清理();
        });
    };

    // 延迟扫描并清理（给页面加载新内容一点时间）
    const 延迟扫描并清理 = () => {
        // 立即扫描一次
        立即扫描脚本();
        // 短延迟后再扫描
        setTimeout(立即扫描脚本, 50);
        setTimeout(立即扫描脚本, 200);
        setTimeout(立即扫描脚本, 500);
    };

    监控SPA导航();

    // ==================== 持续监控定时器 ====================
    // 定期检查是否有漏网之鱼
    setInterval(() => {
        document.querySelectorAll('script').forEach(脚本 => {
            const 网址 = 脚本.src;
            const 内容 = 脚本.textContent || 脚本.innerHTML;

            if (是否为目标脚本(网址, 内容)) {
                脚本.type = 'javascript/blocked';
                脚本.removeAttribute('src');
                脚本.textContent = '// 已拦截';
                
                if (脚本.parentNode) {
                    脚本.parentNode.removeChild(脚本);
                }
                
                拦截次数++;
                console.log('🛡️ [定期扫描] 移除脚本', 网址 || '内联脚本');
            }
        });
    }, 2000);

    // ==================== 🎯 hhkan 网站专用增强防护 ====================
    console.log('🎯 [hhkan] 启动专用防护模式');
    
    // 拦截所有 alert（hhkan 网站通常用 alert 提示检测到开发者工具）
    const hhkan原始alert = window.alert;
    window.alert = function(msg) {
        console.log('🛡️ [hhkan] 拦截 alert:', msg);
        // 在 hhkan 网站直接拦截所有 alert
        return;
    };

    // 阻止 console.clear
    const 原始consoleClear = console.clear;
    console.clear = function() {
        console.log('🛡️ [hhkan] 阻止 console.clear');
        return;
    };

    // 拦截可能的 debugger 检测循环
    const 原始setInterval2 = window.setInterval;
    window.setInterval = function(fn, delay, ...args) {
        // 对于非常短的间隔（可能是检测循环），进行审查
        if (delay < 500 && typeof fn === 'function') {
            const fnStr = fn.toString();
            if (fnStr.includes('debugger') || fnStr.includes('devtool') || fnStr.includes('console')) {
                console.log('🛡️ [hhkan] 拦截可疑短间隔定时器');
                return -1;
            }
        }
        return 原始setInterval2.call(this, fn, delay, ...args);
    };

    // 每秒清理可能的检测定时器
    setInterval(() => {
        // 清除页面上可能存在的检测代码产生的副作用
        if (document.body) {
            // 移除可能的遮罩层
            document.querySelectorAll('div').forEach(div => {
                const style = window.getComputedStyle(div);
                if (style.position === 'fixed' && style.zIndex > 9999 && 
                    (style.backgroundColor.includes('0, 0, 0') || div.innerHTML.includes('开发者'))) {
                    console.log('🛡️ [hhkan] 移除遮罩层');
                    div.remove();
                }
            });
        }
    }, 1000);

})();
