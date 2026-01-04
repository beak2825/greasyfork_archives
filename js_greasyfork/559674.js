// ==UserScript==
// @name         GitHub Xget 下载加速器 - 增强优化版
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  自动加速 GitHub、GitLab、Gitea 等平台的文件下载,支持多平台和自定义加速域名，增强版功能 | UP：毕加索自画像
// @author       Xget | Enhanced & Optimized by 毕加索自画像
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @match        https://gitlab.com/*
// @match        https://gitea.com/*
// @match        https://codeberg.org/*
// @match        https://sourceforge.net/*
// @match        https://android.googlesource.com/*
// @match        https://huggingface.co/*
// @match        https://civitai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_setValue
// @grant        GM_setValues
// @grant        GM_getValue
// @grant        GM_getValues
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559674/GitHub%20Xget%20%E4%B8%8B%E8%BD%BD%E5%8A%A0%E9%80%9F%E5%99%A8%20-%20%E5%A2%9E%E5%BC%BA%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/559674/GitHub%20Xget%20%E4%B8%8B%E8%BD%BD%E5%8A%A0%E9%80%9F%E5%99%A8%20-%20%E5%A2%9E%E5%BC%BA%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 预设加速源列表（type: xget 使用 /prefix/path 格式，ghproxy 使用 /fullurl 格式）
    // platforms: 支持的平台列表，'all' 表示支持所有平台
    // 注意：公共加速源稳定性无法保证，强烈建议自建！
    const PRESET_ACCELERATORS = [
        { 
            domain: 'xget.xi-xu.me', 
            name: '⭐ Xget 官方', 
            type: 'xget', 
            testPath: '/gh/robots.txt',
            platforms: 'all',
            description: '全平台 | 官方实例'
        },
        { 
            domain: 'gh.llkk.cc', 
            name: 'LLKK', 
            type: 'ghproxy', 
            testPath: '/https://github.com/robots.txt',
            platforms: ['github.com', 'raw.githubusercontent.com', 'gist.github.com', 'codeload.github.com', 'objects.githubusercontent.com'],
            description: '仅 GitHub | 相对稳定'
        },
        { 
            domain: 'github.moeyy.xyz', 
            name: 'Moeyy', 
            type: 'ghproxy', 
            testPath: '/https://github.com/robots.txt',
            platforms: ['github.com', 'raw.githubusercontent.com', 'gist.github.com', 'codeload.github.com', 'objects.githubusercontent.com'],
            description: '仅 GitHub | 知名度高'
        }
    ];

    // 自建部署链接
    const SELF_HOST_LINKS = {
        xget: 'https://github.com/xixu-me/xget',
        ghproxy: 'https://github.com/hunshcn/gh-proxy'
    };

    // 配置项
    const CONFIG = {
        // 默认加速域名
        defaultDomain: 'xget.xi-xu.me',
        // 默认加速类型
        defaultType: 'xget',
        // 是否启用加速
        enabled: GM_getValue('xget_enabled', true),
        // 自定义加速域名
        customDomain: GM_getValue('xget_custom_domain', ''),
        // 自定义加速类型（xget 或 ghproxy）
        customType: GM_getValue('xget_custom_type', 'xget'),
        // 用户自定义加速源列表
        userAccelerators: GM_getValue('xget_user_accelerators', []),
        // 是否显示通知
        showNotification: GM_getValue('xget_show_notification', true),
        // 统计数据
        stats: GM_getValue('xget_stats', { total: 0, success: 0, failed: 0 }),
        // 白名单模式（false 为黑名单模式）
        whitelistMode: GM_getValue('xget_whitelist_mode', false),
        // 排除列表（域名或路径模式）
        excludeList: GM_getValue('xget_exclude_list', []),
        // 是否自动检测加速服务可用性
        autoCheck: GM_getValue('xget_auto_check', true),
        // 服务器状态缓存（避免频繁检测）
        serverStatus: GM_getValue('xget_server_status', { available: true, lastCheck: 0 }),
        // 调试模式
        debug: GM_getValue('xget_debug', false),
        // 最大重试次数
        maxRetries: GM_getValue('xget_max_retries', 2),
        // 强力拦截模式（会调用 stopImmediatePropagation，和旧版本保持一致）
        strongIntercept: GM_getValue('xget_strong_intercept', true)
    };

    // 可下载文件扩展名白名单
    const DOWNLOAD_EXTENSIONS = [
        // 压缩包
        'zip', 'tar', 'gz', 'bz2', '7z', 'rar', 'xz', 'tgz',
        // 安装包
        'exe', 'dmg', 'deb', 'rpm', 'msi', 'pkg', 'apk', 'appimage',
        // 模型文件
        'bin', 'safetensors', 'pt', 'pth', 'ckpt', 'h5', 'onnx', 'pb', 'model',
        // 其他
        'iso', 'img', 'jar', 'war'
    ];

    // 平台配置（添加前缀和下载 URL 模式）
    const PLATFORM_CONFIG = {
        'github.com': {
            prefix: 'gh',
            name: 'GitHub',
            patterns: [
                /\/releases\/download\//,
                /\/archive\/.*\.(zip|tar\.gz|tar)$/,
                /\/raw\//,
                /\/.*\/.*\/.*\.(exe|dmg|deb|rpm|msi|pkg|apk|zip|tar\.gz|tar\.bz2|7z|rar)$/
            ]
        },
        // GitHub 源码包下载（Download ZIP / tarball）
        'codeload.github.com': {
            prefix: 'gh',
            name: 'GitHub',
            patterns: [
                /\/zip\//,
                /\/tar\.gz\//,
                /\/tar\//
            ]
        },
        // GitHub Raw 文件下载（raw host 基本都是文件内容）
        'raw.githubusercontent.com': {
            prefix: 'gh',
            name: 'GitHub',
            patterns: [
                /.*/
            ]
        },
        // GitHub Release 资产下载（常见会跳到 objects host）
        'objects.githubusercontent.com': {
            prefix: 'gh',
            name: 'GitHub',
            patterns: [
                /.*/
            ]
        },
        'gist.github.com': {
            prefix: 'gist',
            name: 'GitHub Gist',
            patterns: [
                /\/raw\//,
                /\/download/
            ]
        },
        'gitlab.com': {
            prefix: 'gl',
            name: 'GitLab',
            patterns: [
                /\/-\/archive\//,
                /\/-\/project\/.*\/uploads\//,
                /\/uploads\//
            ]
        },
        'gitea.com': {
            prefix: 'gitea',
            name: 'Gitea',
            patterns: [
                /\/archive\//,
                /\/raw\//,
                /\/releases\/download\//
            ]
        },
        'codeberg.org': {
            prefix: 'codeberg',
            name: 'Codeberg',
            patterns: [
                /\/archive\//,
                /\/raw\//,
                /\/releases\/download\//
            ]
        },
        'sourceforge.net': {
            prefix: 'sf',
            name: 'SourceForge',
            patterns: [
                /\/files\//,
                /\/downloads\//
            ]
        },
        'android.googlesource.com': {
            prefix: 'aosp',
            name: 'AOSP',
            patterns: [
                /\/\+archive\//
            ]
        },
        'huggingface.co': {
            prefix: 'hf',
            name: 'Hugging Face',
            patterns: [
                /\/resolve\//,
                /\/.*\/.*\/(blob|resolve)\/.*\.(bin|safetensors|pt|pth|ckpt|h5|onnx|pb|model)$/
            ]
        },
        'civitai.com': {
            prefix: 'civitai',
            name: 'Civitai',
            patterns: [
                /\/api\/download\//
            ]
        }
    };

    // 调试日志
    function debugLog(...args) {
        if (CONFIG.debug) {
            console.log('[Xget Debug]', new Date().toLocaleTimeString(), ...args);
        }
    }

    // 节流函数
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 防抖函数
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // 统计落盘（防止频繁写入存储）
    const saveStatsDebounced = debounce(() => {
        try {
            if (typeof GM_setValues === 'function') {
                GM_setValues({ xget_stats: CONFIG.stats });
            } else {
                GM_setValue('xget_stats', CONFIG.stats);
            }
        } catch (e) {
            // 回退到单值写入
            GM_setValue('xget_stats', CONFIG.stats);
        }
    }, 600);

    // 指示器内容更新
    function renderIndicator() {
        const el = CONFIG._indicatorEl;
        if (!el) return;
        el.innerHTML = `
            <div style="font-weight: 700; font-size: 13px;">⚡ Xget 加速已启用</div>
        `;
    }

    // 获取当前使用的加速域名
    function getAcceleratorDomain() {
        return CONFIG.customDomain || CONFIG.defaultDomain;
    }

    // 获取当前使用的加速类型
    function getAcceleratorType() {
        return CONFIG.customType || CONFIG.defaultType;
    }

    // 获取所有可用的加速源（预设 + 用户自定义）
    function getAllAccelerators() {
        return [...PRESET_ACCELERATORS, ...CONFIG.userAccelerators];
    }

    // 根据域名获取加速源配置
    function getAcceleratorByDomain(domain) {
        return getAllAccelerators().find(a => a.domain === domain);
    }

    // 获取当前平台配置
    function getCurrentPlatform() {
        const hostname = window.location.hostname;
        return PLATFORM_CONFIG[hostname];
    }

    // 编译排除规则
    function compileExcludeMatchers(list) {
        const matchers = [];
        for (const raw of (list || [])) {
            const pattern = String(raw || '').trim();
            if (!pattern) continue;

            // 支持 /.../flags 形式
            if (pattern.startsWith('/') && pattern.lastIndexOf('/') > 0) {
                const lastSlash = pattern.lastIndexOf('/');
                const body = pattern.slice(1, lastSlash);
                const flags = pattern.slice(lastSlash + 1);
                try {
                    matchers.push({ type: 'regex', raw: pattern, re: new RegExp(body, flags) });
                    continue;
                } catch (e) {
                    debugLog('排除规则正则解析失败，降级为包含匹配:', pattern, e);
                }
            }

            // 支持直接 RegExp 字符串（不带 / /）
            try {
                matchers.push({ type: 'regex', raw: pattern, re: new RegExp(pattern) });
            } catch {
                matchers.push({ type: 'substr', raw: pattern, s: pattern });
            }
        }
        return matchers;
    }

    function refreshExcludeMatchers() {
        CONFIG._excludeMatchers = compileExcludeMatchers(CONFIG.excludeList);
    }

    // 判断是否在排除列表中
    function isExcluded(url) {
        const matchers = CONFIG._excludeMatchers || [];
        return matchers.some(m => {
            if (m.type === 'regex') return m.re.test(url);
            return url.includes(m.s);
        });
    }

    // 检查是否为可下载文件扩展名
    function hasDownloadableExtension(pathname) {
        const lowerPath = pathname.toLowerCase();
        return DOWNLOAD_EXTENSIONS.some(ext => lowerPath.endsWith('.' + ext));
    }

    // 下载链接检测 - 优化版
    function isDownloadLink(url, element) {
        try {
            const urlObj = new URL(url);
            const platform = PLATFORM_CONFIG[urlObj.hostname];

            if (!platform) {
                debugLog('平台不支持:', urlObj.hostname);
                return false;
            }

            // 检查是否在排除列表中
            if (isExcluded(url)) {
                debugLog('URL 在排除列表中:', url);
                return false;
            }

            // 检查元素是否有 download 属性
            if (element && (element.download || element.hasAttribute('download'))) {
                debugLog('检测到 download 属性');
                return true;
            }

            // 检查文件扩展名
            const hasValidExt = hasDownloadableExtension(urlObj.pathname);

            // 使用平台特定的正则模式匹配
            const matchesPattern = platform.patterns.some(pattern => pattern.test(urlObj.pathname));

            // 改为 OR：pattern 命中或扩展名命中即认为是下载（减少漏判）
            const isDownload = matchesPattern || hasValidExt;
            debugLog('链接检测结果:', { url, hasValidExt, matchesPattern, isDownload });

            return isDownload;
        } catch (e) {
            debugLog('链接检测错误:', e);
            return false;
        }
    }

    // 检查加速源是否支持指定平台
    function isAcceleratorSupportPlatform(accelerator, hostname) {
        if (!accelerator) return true;
        if (accelerator.platforms === 'all') return true;
        if (Array.isArray(accelerator.platforms)) {
            return accelerator.platforms.includes(hostname);
        }
        return true;
    }

    // 转换 URL 为加速 URL
    function convertToAcceleratorURL(originalUrl) {
        try {
            const url = new URL(originalUrl);
            const platform = PLATFORM_CONFIG[url.hostname];

            if (!platform) {
                debugLog('无法转换: 平台不支持');
                return originalUrl;
            }

            const acceleratorDomain = getAcceleratorDomain();
            const acceleratorType = getAcceleratorType();
            const accelerator = getAcceleratorByDomain(acceleratorDomain);

            // 检查当前加速源是否支持该平台
            if (!isAcceleratorSupportPlatform(accelerator, url.hostname)) {
                debugLog('当前加速源不支持该平台:', url.hostname);
                // 如果不支持，尝试回退到 xget 官方
                const xgetOfficial = PRESET_ACCELERATORS.find(a => a.domain === 'xget.xi-xu.me');
                if (xgetOfficial) {
                    const pathAndQuery = url.pathname + url.search + url.hash;
                    const fallbackUrl = `https://${xgetOfficial.domain}/${platform.prefix}${pathAndQuery}`;
                    debugLog('回退到 Xget 官方:', fallbackUrl);
                    return fallbackUrl;
                }
                return originalUrl;
            }

            let acceleratedUrl;

            if (acceleratorType === 'ghproxy') {
                // ghproxy 格式: https://domain/https://github.com/path
                acceleratedUrl = `https://${acceleratorDomain}/${originalUrl}`;
            } else {
                // xget 格式: https://domain/prefix/path
                const pathAndQuery = url.pathname + url.search + url.hash;
                acceleratedUrl = `https://${acceleratorDomain}/${platform.prefix}${pathAndQuery}`;
            }

            debugLog('URL 转换:', { 
                original: originalUrl, 
                accelerated: acceleratedUrl,
                type: acceleratorType
            });

            return acceleratedUrl;
        } catch (e) {
            console.error('URL 转换失败:', e);
            return originalUrl;
        }
    }

    // 带重试的 URL 转换
    async function convertWithRetry(originalUrl) {
        const maxRetries = CONFIG.maxRetries;
        let lastError = null;

        for (let i = 0; i <= maxRetries; i++) {
            try {
                const convertedUrl = convertToAcceleratorURL(originalUrl);

                // 验证转换后的URL是否有效
                if (convertedUrl && convertedUrl !== originalUrl) {
                    debugLog(`URL 转换成功 (尝试 ${i + 1}/${maxRetries + 1})`);
                    return convertedUrl;
                }

                throw new Error('转换结果无效');
            } catch (e) {
                lastError = e;
                debugLog(`URL 转换重试 ${i + 1}/${maxRetries + 1}:`, e);

                // 等待一小段时间再重试
                if (i < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        }

        console.error('URL 转换最终失败:', lastError);
        return originalUrl;
    }

    // 检测加速服务器可用性 - 优化版
    async function checkServerAvailability() {
        // 如果最近 5 分钟内检查过，使用缓存结果
        const now = Date.now();
        if (now - CONFIG.serverStatus.lastCheck < 5 * 60 * 1000) {
            debugLog('使用缓存的服务器状态:', CONFIG.serverStatus.available);
            return CONFIG.serverStatus.available;
        }

        try {
            const domain = getAcceleratorDomain();
            const accelerator = getAcceleratorByDomain(domain);
            // 根据加速源类型使用不同的测试路径
            const testPath = accelerator?.testPath || (getAcceleratorType() === 'ghproxy' ? '/https://github.com/robots.txt' : '/gh/robots.txt');
            const testUrl = `https://${domain}${testPath}`;

            debugLog('开始检测服务器可用性:', testUrl);

            return new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    debugLog('服务器检测超时');
                    updateServerStatus(false);
                    resolve(false);
                }, 3000);

                GM_xmlhttpRequest({
                    method: 'GET',
                    headers: {
                        'Range': 'bytes=0-0',
                        'Cache-Control': 'no-cache'
                    },
                    url: testUrl,
                    timeout: 3000,
                    onload: function(response) {
                        clearTimeout(timeout);
                        // 更严格的状态码判断（Range 可能返回 206）
                        const available = (response.status >= 200 && response.status < 400) || response.status === 206;
                        debugLog('服务器响应:', { status: response.status, available });
                        updateServerStatus(available);
                        resolve(available);
                    },
                    onerror: function(error) {
                        clearTimeout(timeout);
                        debugLog('服务器检测错误:', error);
                        updateServerStatus(false);
                        resolve(false);
                    },
                    ontimeout: function() {
                        clearTimeout(timeout);
                        debugLog('服务器检测超时');
                        updateServerStatus(false);
                        resolve(false);
                    }
                });
            });
        } catch (e) {
            console.error('服务器可用性检查失败:', e);
            updateServerStatus(false);
            return false;
        }
    }

    // 更新服务器状态缓存
    function updateServerStatus(available) {
        CONFIG.serverStatus = { available, lastCheck: Date.now() };
        GM_setValue('xget_server_status', CONFIG.serverStatus);
        debugLog('服务器状态已更新:', CONFIG.serverStatus);

        // 同步更新指示器
        renderIndicator();
    }

    // 更新统计数据
    function updateStats(success) {
        CONFIG.stats.total++;
        if (success) {
            CONFIG.stats.success++;
        } else {
            CONFIG.stats.failed++;
        }

        // 防抖写入，减少存储 IO
        saveStatsDebounced();
        debugLog('统计数据已更新:', CONFIG.stats);

        // 同步更新指示器
        renderIndicator();
    }

    // 显示通知
    function showNotification(message, type = 'info', duration = 3000) {
        if (!CONFIG.showNotification) return;

        const colors = {
            success: '#10b981',
            info: '#3b82f6',
            warning: '#f59e0b',
            error: '#ef4444'
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;
        notification.textContent = message;

        // 点击关闭
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        });

        // 添加动画样式
        if (!document.getElementById('xget-notification-style')) {
            const style = document.createElement('style');
            style.id = 'xget-notification-style';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // 拦截下载链接 - 核心功能
    function interceptDownloadLinks() {
        const platform = getCurrentPlatform();
        if (!platform || !CONFIG.enabled) return;

        debugLog('开始拦截下载链接:', platform.name);

        // 使用节流优化性能
        const handleClick = throttle(async function(e) {
            // 仅拦截普通左键点击；避免影响 Ctrl/⌘/Shift 打开新标签等行为
            if (e.button !== 0) return;
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

            // 使用 closest 更高效地查找链接元素
            const target = e.target.closest('a[href]');

            if (!target?.href) return;

            const href = target.href;

            // 精确检测是否为下载链接
            if (!isDownloadLink(href, target)) return;

            debugLog('检测到下载链接:', href);

            // 如果启用了自动检测，先检查服务器可用性
            if (CONFIG.autoCheck) {
                const available = await checkServerAvailability();
                if (!available) {
                    showNotification('⚠️ 加速服务暂不可用，使用原始链接下载', 'warning');
                    updateStats(false);
                    return; // 不拦截，使用原始链接
                }
            }

            // 阻止默认行为和事件传播
            e.preventDefault();
            e.stopPropagation();
            if (CONFIG.strongIntercept) {
                e.stopImmediatePropagation();
            }

            const acceleratedUrl = await convertWithRetry(href);

            if (acceleratedUrl !== href) {
                showNotification(`🚀 已启用 ${platform.name} 加速下载`, 'success', 2000);
                updateStats(true);

                // 创建隐藏链接并触发
                const link = document.createElement('a');
                link.href = acceleratedUrl;
                link.download = target.download || '';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                showNotification('⚠️ URL 转换失败，使用原始链接', 'warning');
                updateStats(false);
                window.open(href, '_blank', 'noopener,noreferrer');
            }
        }, 300);

        // 使用捕获阶段确保最先处理
        document.addEventListener('click', handleClick, true);
        debugLog('事件监听器已注册');
    }

    // 添加页面指示器 - 增强版
    function addPageIndicator() {
        const platform = getCurrentPlatform();
        if (!platform || !CONFIG.enabled) return;

        const indicator = document.createElement('div');
        indicator.id = 'xget-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: rgba(16, 185, 129, 0.95);
            color: white;
            border-radius: 8px;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            transition: all 0.3s;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        // 保存指示器引用
        CONFIG._indicatorEl = indicator;

        // 初始渲染指示器内容
        renderIndicator();

        indicator.addEventListener('mouseenter', () => {
            indicator.style.transform = 'scale(1.05)';
            indicator.style.background = 'rgba(16, 185, 129, 1)';
        });

        indicator.addEventListener('mouseleave', () => {
            indicator.style.transform = 'scale(1)';
            indicator.style.background = 'rgba(16, 185, 129, 0.95)';
        });

        indicator.addEventListener('click', () => {
            const stats = CONFIG.stats;
            const successRate = stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : 0;
            showNotification(
                `域名: ${getAcceleratorDomain()}\n总计: ${stats.total} | 成功: ${stats.success} | 失败: ${stats.failed}\n成功率: ${successRate}%`,
                'info',
                5000
            );
        });

        document.body.appendChild(indicator);

        // 服务器状态指示
        if (!CONFIG.serverStatus.available) {
            const statusDot = document.createElement('div');
            statusDot.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                width: 8px;
                height: 8px;
                background: #ef4444;
                border-radius: 50%;
                animation: pulse 2s infinite;
            `;
            indicator.appendChild(statusDot);

            if (!document.getElementById('xget-pulse-style')) {
                const pulseStyle = document.createElement('style');
                pulseStyle.id = 'xget-pulse-style';
                pulseStyle.textContent = `
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `;
                document.head.appendChild(pulseStyle);
            }
        }
        
        debugLog('页面指示器已添加');

    }

    // 设置菜单命令 - 增强版
    function setupMenuCommands() {
        // 切换启用/禁用
        GM_registerMenuCommand(CONFIG.enabled ? '❌ 禁用加速' : '✅ 启用加速', function() {
            CONFIG.enabled = !CONFIG.enabled;
            GM_setValue('xget_enabled', CONFIG.enabled);
            showNotification(CONFIG.enabled ? '加速已启用' : '加速已禁用', 'success');
            location.reload();
        });

        // 设置加速域名 - 增强版选择界面
        GM_registerMenuCommand('⚙️ 设置加速域名', function() {
            showAcceleratorSelector();
        });

        // 查看统计信息
        GM_registerMenuCommand('📊 查看统计', function() {
            showStatsPanel();
        });

        // 管理排除列表
        GM_registerMenuCommand('🚫 管理排除列表', function() {
            showExcludeListPanel();
        });

        // 切换自动检测 - 移到高级设置
        // 手动检测服务器
        GM_registerMenuCommand('🔍 检测服务器状态', async function() {
            showNotification('正在检测服务器状态...', 'info', 2000);
            CONFIG.serverStatus.lastCheck = 0;
            const available = await checkServerAvailability();
            showNotification(
                available ? '✅ 加速服务器可用' : '❌ 加速服务器不可用',
                available ? 'success' : 'error',
                3000
            );
        });

        // 测试加速链接
        GM_registerMenuCommand('🧪 测试转换', function() {
            showTestPanel();
        });

        // 设置重试次数
        GM_registerMenuCommand('🔁 高级设置', function() {
            showAdvancedSettingsPanel();
        });
    }

    // 通用模态框创建函数
    function createModal(id, title, content, options = {}) {
        // 移除已存在的模态框
        const existing = document.getElementById(id);
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = id;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            animation: xgetFadeIn 0.2s ease-out;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 24px;
            max-width: ${options.maxWidth || '450px'};
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
            animation: xgetSlideUp 0.3s ease-out;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 18px; color: #1f2937; display: flex; align-items: center; gap: 8px;">${title}</h2>
                <button class="xget-modal-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #9ca3af; transition: color 0.2s;">&times;</button>
            </div>
            <div class="xget-modal-content">${content}</div>
        `;

        // 添加动画样式
        if (!document.getElementById('xget-modal-animations')) {
            const style = document.createElement('style');
            style.id = 'xget-modal-animations';
            style.textContent = `
                @keyframes xgetFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes xgetSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes xgetSlideOut {
                    from { opacity: 1; transform: translateY(0) scale(1); }
                    to { opacity: 0; transform: translateY(20px) scale(0.95); }
                }
            `;
            document.head.appendChild(style);
        }

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // 关闭功能
        const closeModal = () => {
            panel.style.animation = 'xgetSlideOut 0.2s ease-out forwards';
            overlay.style.animation = 'xgetFadeIn 0.2s ease-out reverse forwards';
            setTimeout(() => overlay.remove(), 200);
        };

        panel.querySelector('.xget-modal-close').addEventListener('click', closeModal);
        panel.querySelector('.xget-modal-close').addEventListener('mouseenter', (e) => e.target.style.color = '#1f2937');
        panel.querySelector('.xget-modal-close').addEventListener('mouseleave', (e) => e.target.style.color = '#9ca3af');
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

        return { overlay, panel, close: closeModal };
    }

    // 统计面板
    function showStatsPanel() {
        const stats = CONFIG.stats;
        const successRate = stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : 0;
        const domain = getAcceleratorDomain();

        const content = `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
                <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 16px; border-radius: 12px; text-align: center; color: white;">
                    <div style="font-size: 28px; font-weight: 700;">${stats.total}</div>
                    <div style="font-size: 12px; opacity: 0.9;">总下载</div>
                </div>
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 16px; border-radius: 12px; text-align: center; color: white;">
                    <div style="font-size: 28px; font-weight: 700;">${stats.success}</div>
                    <div style="font-size: 12px; opacity: 0.9;">成功</div>
                </div>
                <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 16px; border-radius: 12px; text-align: center; color: white;">
                    <div style="font-size: 28px; font-weight: 700;">${stats.failed}</div>
                    <div style="font-size: 12px; opacity: 0.9;">失败</div>
                </div>
            </div>

            <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="color: #64748b; font-size: 13px;">成功率</span>
                    <span style="color: #1f2937; font-weight: 600;">${successRate}%</span>
                </div>
                <div style="background: #e2e8f0; border-radius: 999px; height: 8px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #10b981 0%, #34d399 100%); height: 100%; width: ${successRate}%; transition: width 0.5s;"></div>
                </div>
            </div>

            <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #64748b; font-size: 13px;">当前加速域名</span>
                    <span style="color: #1f2937; font-size: 13px; font-weight: 500;">${domain}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #64748b; font-size: 13px;">服务器状态</span>
                    <span style="color: ${CONFIG.serverStatus.available ? '#10b981' : '#ef4444'}; font-size: 13px; font-weight: 500;">
                        ${CONFIG.serverStatus.available ? '✅ 可用' : '❌ 不可用'}
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #64748b; font-size: 13px;">调试模式</span>
                    <span style="color: #1f2937; font-size: 13px; font-weight: 500;">${CONFIG.debug ? '开启' : '关闭'}</span>
                </div>
            </div>

            <button id="xget-reset-stats-btn" style="
                width: 100%;
                padding: 12px;
                background: #fee2e2;
                color: #dc2626;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
            ">🔄 重置统计数据</button>

            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
                <span style="color: #9ca3af; font-size: 12px;">🎨 增强优化版 UP：毕加索自画像</span>
            </div>
        `;

        const { panel, close } = createModal('xget-stats-panel', '📊 加速统计', content);

        panel.querySelector('#xget-reset-stats-btn').addEventListener('click', () => {
            if (confirm('确定要重置所有统计数据吗？')) {
                CONFIG.stats = { total: 0, success: 0, failed: 0 };
                GM_setValue('xget_stats', CONFIG.stats);
                showNotification('统计数据已重置', 'success');
                close();
                setTimeout(() => showStatsPanel(), 300);
            }
        });
    }

    // 排除列表面板
    function showExcludeListPanel() {
        const content = `
            <div style="margin-bottom: 16px; padding: 12px; background: #fef3c7; border-radius: 8px; font-size: 12px; color: #92400e;">
                💡 每行一个规则，支持正则表达式（如 <code style="background: #fde68a; padding: 2px 4px; border-radius: 3px;">/test/</code>）或普通文本匹配
            </div>

            <textarea id="xget-exclude-textarea" style="
                width: 100%;
                height: 200px;
                padding: 12px;
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                font-size: 13px;
                font-family: 'Monaco', 'Menlo', monospace;
                resize: vertical;
                box-sizing: border-box;
                transition: border-color 0.2s;
            " placeholder="输入要排除的 URL 模式...&#10;例如:&#10;/releases/tag/&#10;example.com&#10;/\.md$/">${CONFIG.excludeList.join('\n')}</textarea>

            <div style="display: flex; gap: 12px; margin-top: 16px;">
                <button id="xget-exclude-save-btn" style="
                    flex: 1;
                    padding: 12px;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                ">💾 保存</button>
                <button id="xget-exclude-clear-btn" style="
                    padding: 12px 20px;
                    background: #f3f4f6;
                    color: #6b7280;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 14px;
                ">清空</button>
            </div>
        `;

        const { panel, close } = createModal('xget-exclude-panel', '🚫 排除列表', content);

        const textarea = panel.querySelector('#xget-exclude-textarea');
        textarea.addEventListener('focus', () => textarea.style.borderColor = '#10b981');
        textarea.addEventListener('blur', () => textarea.style.borderColor = '#e5e7eb');

        panel.querySelector('#xget-exclude-save-btn').addEventListener('click', () => {
            const newList = textarea.value.split('\n').filter(x => x.trim());
            CONFIG.excludeList = newList;
            GM_setValue('xget_exclude_list', newList);
            refreshExcludeMatchers();
            showNotification(`已保存 ${newList.length} 条排除规则`, 'success');
            close();
        });

        panel.querySelector('#xget-exclude-clear-btn').addEventListener('click', () => {
            textarea.value = '';
        });
    }

    // 测试转换面板
    function showTestPanel() {
        const content = `
            <div style="margin-bottom: 16px;">
                <label style="display: block; color: #374151; font-size: 13px; font-weight: 500; margin-bottom: 8px;">输入要测试的 URL</label>
                <input id="xget-test-input" type="text" style="
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 13px;
                    box-sizing: border-box;
                    transition: border-color 0.2s;
                " placeholder="https://github.com/user/repo/releases/download/...">
            </div>

            <button id="xget-test-btn" style="
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 16px;
            ">🧪 测试转换</button>

            <div id="xget-test-result" style="display: none;">
                <div style="background: #f8fafc; border-radius: 12px; padding: 16px;">
                    <div style="margin-bottom: 12px;">
                        <div style="color: #64748b; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">原始 URL</div>
                        <div id="xget-test-original" style="color: #1f2937; font-size: 12px; word-break: break-all; font-family: monospace; background: #e2e8f0; padding: 8px; border-radius: 6px;"></div>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <div style="color: #64748b; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">转换后 URL</div>
                        <div id="xget-test-converted" style="color: #10b981; font-size: 12px; word-break: break-all; font-family: monospace; background: #d1fae5; padding: 8px; border-radius: 6px;"></div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <div style="flex: 1; text-align: center; padding: 8px; background: white; border-radius: 8px;">
                            <div style="color: #64748b; font-size: 11px;">是否下载链接</div>
                            <div id="xget-test-isdownload" style="font-size: 14px; font-weight: 600; margin-top: 4px;"></div>
                        </div>
                        <div style="flex: 1; text-align: center; padding: 8px; background: white; border-radius: 8px;">
                            <div style="color: #64748b; font-size: 11px;">加速类型</div>
                            <div id="xget-test-type" style="font-size: 14px; font-weight: 600; margin-top: 4px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const { panel } = createModal('xget-test-panel', '🧪 测试 URL 转换', content);

        const input = panel.querySelector('#xget-test-input');
        input.addEventListener('focus', () => input.style.borderColor = '#3b82f6');
        input.addEventListener('blur', () => input.style.borderColor = '#e5e7eb');

        panel.querySelector('#xget-test-btn').addEventListener('click', () => {
            const testUrl = input.value.trim();
            if (!testUrl) {
                showNotification('请输入 URL', 'warning');
                return;
            }

            const converted = convertToAcceleratorURL(testUrl);
            const isDownload = isDownloadLink(testUrl, null);
            const resultDiv = panel.querySelector('#xget-test-result');

            panel.querySelector('#xget-test-original').textContent = testUrl;
            panel.querySelector('#xget-test-converted').textContent = converted;
            panel.querySelector('#xget-test-isdownload').innerHTML = isDownload 
                ? '<span style="color: #10b981;">✅ 是</span>' 
                : '<span style="color: #ef4444;">❌ 否</span>';
            panel.querySelector('#xget-test-type').textContent = getAcceleratorType();

            resultDiv.style.display = 'block';
        });

        // 回车触发测试
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') panel.querySelector('#xget-test-btn').click();
        });
    }

    // 高级设置面板
    function showAdvancedSettingsPanel() {
        const content = `
            <div style="space-y: 16px;">
                <!-- 重试次数 -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="color: #1f2937; font-size: 14px; font-weight: 500;">重试次数</div>
                            <div style="color: #64748b; font-size: 12px;">URL 转换失败时的重试次数</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button class="xget-retry-btn" data-action="minus" style="width: 32px; height: 32px; border: none; background: #e2e8f0; border-radius: 8px; cursor: pointer; font-size: 16px;">−</button>
                            <span id="xget-retry-value" style="width: 30px; text-align: center; font-size: 18px; font-weight: 600;">${CONFIG.maxRetries}</span>
                            <button class="xget-retry-btn" data-action="plus" style="width: 32px; height: 32px; border: none; background: #e2e8f0; border-radius: 8px; cursor: pointer; font-size: 16px;">+</button>
                        </div>
                    </div>
                </div>

                <!-- 通知开关 -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="color: #1f2937; font-size: 14px; font-weight: 500;">显示通知</div>
                            <div style="color: #64748b; font-size: 12px;">下载加速时显示提示通知</div>
                        </div>
                        <label style="position: relative; width: 50px; height: 28px;">
                            <input type="checkbox" id="xget-notification-toggle" ${CONFIG.showNotification ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                            <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: ${CONFIG.showNotification ? '#10b981' : '#cbd5e1'}; border-radius: 28px; transition: 0.3s;">
                                <span style="position: absolute; height: 22px; width: 22px; left: ${CONFIG.showNotification ? '25px' : '3px'}; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
                            </span>
                        </label>
                    </div>
                </div>

                <!-- 自动检测 -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="color: #1f2937; font-size: 14px; font-weight: 500;">自动检测服务器</div>
                            <div style="color: #64748b; font-size: 12px;">下载前检测加速服务器可用性</div>
                        </div>
                        <label style="position: relative; width: 50px; height: 28px;">
                            <input type="checkbox" id="xget-autocheck-toggle" ${CONFIG.autoCheck ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                            <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: ${CONFIG.autoCheck ? '#10b981' : '#cbd5e1'}; border-radius: 28px; transition: 0.3s;">
                                <span style="position: absolute; height: 22px; width: 22px; left: ${CONFIG.autoCheck ? '25px' : '3px'}; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
                            </span>
                        </label>
                    </div>
                </div>

                <!-- 调试模式 -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="color: #1f2937; font-size: 14px; font-weight: 500;">调试模式</div>
                            <div style="color: #64748b; font-size: 12px;">在控制台输出详细日志</div>
                        </div>
                        <label style="position: relative; width: 50px; height: 28px;">
                            <input type="checkbox" id="xget-debug-toggle" ${CONFIG.debug ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                            <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: ${CONFIG.debug ? '#10b981' : '#cbd5e1'}; border-radius: 28px; transition: 0.3s;">
                                <span style="position: absolute; height: 22px; width: 22px; left: ${CONFIG.debug ? '25px' : '3px'}; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
                            </span>
                        </label>
                    </div>
                </div>

                <!-- 强力拦截 -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="color: #1f2937; font-size: 14px; font-weight: 500;">强力拦截模式</div>
                            <div style="color: #64748b; font-size: 12px;">阻止其他脚本干扰下载拦截</div>
                        </div>
                        <label style="position: relative; width: 50px; height: 28px;">
                            <input type="checkbox" id="xget-strong-toggle" ${CONFIG.strongIntercept ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                            <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: ${CONFIG.strongIntercept ? '#10b981' : '#cbd5e1'}; border-radius: 28px; transition: 0.3s;">
                                <span style="position: absolute; height: 22px; width: 22px; left: ${CONFIG.strongIntercept ? '25px' : '3px'}; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
                            </span>
                        </label>
                    </div>
                </div>

                <button id="xget-save-advanced-btn" style="
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                ">💾 保存设置</button>
            </div>
        `;

        const { panel, close } = createModal('xget-advanced-panel', '🔧 高级设置', content);

        // 重试次数按钮
        let retryValue = CONFIG.maxRetries;
        const retryDisplay = panel.querySelector('#xget-retry-value');
        panel.querySelectorAll('.xget-retry-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.action === 'plus' && retryValue < 5) retryValue++;
                if (btn.dataset.action === 'minus' && retryValue > 0) retryValue--;
                retryDisplay.textContent = retryValue;
            });
        });

        // 开关样式更新
        const updateToggle = (checkbox) => {
            const span = checkbox.nextElementSibling;
            const dot = span.querySelector('span');
            span.style.background = checkbox.checked ? '#10b981' : '#cbd5e1';
            dot.style.left = checkbox.checked ? '25px' : '3px';
        };

        panel.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => updateToggle(checkbox));
        });

        // 保存按钮
        panel.querySelector('#xget-save-advanced-btn').addEventListener('click', () => {
            CONFIG.maxRetries = retryValue;
            CONFIG.showNotification = panel.querySelector('#xget-notification-toggle').checked;
            CONFIG.autoCheck = panel.querySelector('#xget-autocheck-toggle').checked;
            CONFIG.debug = panel.querySelector('#xget-debug-toggle').checked;
            CONFIG.strongIntercept = panel.querySelector('#xget-strong-toggle').checked;

            GM_setValue('xget_max_retries', CONFIG.maxRetries);
            GM_setValue('xget_show_notification', CONFIG.showNotification);
            GM_setValue('xget_auto_check', CONFIG.autoCheck);
            GM_setValue('xget_debug', CONFIG.debug);
            GM_setValue('xget_strong_intercept', CONFIG.strongIntercept);

            showNotification('设置已保存', 'success');
            close();
        });
    }

    // 显示加速源选择器界面
    function showAcceleratorSelector() {
        // 移除已存在的选择器
        const existing = document.getElementById('xget-accelerator-selector');
        if (existing) existing.remove();

        const currentDomain = getAcceleratorDomain();
        const allAccelerators = getAllAccelerators();

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'xget-accelerator-selector';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        // 创建选择器面板
        const panel = document.createElement('div');
        panel.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 18px; color: #1f2937;">⚙️ 选择加速源</h2>
                <button id="xget-close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280;">&times;</button>
            </div>
            
            <div style="margin-bottom: 16px; padding: 12px; background: #f3f4f6; border-radius: 8px; font-size: 13px; color: #4b5563;">
                当前使用: <strong style="color: #10b981;">${currentDomain}</strong>
            </div>

            <div style="margin-bottom: 16px; padding: 10px; background: #fef3c7; border-radius: 8px; font-size: 12px; color: #92400e;">
                💡 提示：<span style="color: #065f46; background: #d1fae5; padding: 1px 4px; border-radius: 3px;">全平台</span> 支持 GitHub、GitLab、Hugging Face 等所有平台；
                <span style="color: #991b1b; background: #fee2e2; padding: 1px 4px; border-radius: 3px;">仅 GitHub</span> 在其他平台会自动回退到 Xget 官方
            </div>

            <div style="margin-bottom: 16px;">
                <div style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">📡 预设加速源</div>
                <div id="xget-preset-list"></div>
            </div>

            <div style="margin-bottom: 16px;">
                <div style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">👤 自定义加速源</div>
                <div id="xget-custom-list"></div>
                <button id="xget-add-custom-btn" style="
                    width: 100%;
                    padding: 10px;
                    margin-top: 8px;
                    background: #f3f4f6;
                    border: 2px dashed #d1d5db;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    color: #6b7280;
                    transition: all 0.2s;
                ">➕ 添加自定义加速源</button>
            </div>

            <div style="margin-bottom: 16px; padding: 12px; background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border: 1px solid #667eea30; border-radius: 8px;">
                <div style="font-size: 13px; font-weight: 600; color: #4c1d95; margin-bottom: 8px;">🚀 推荐自建加速服务</div>
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
                    公共加速源稳定性无法保证，建议使用 Cloudflare Workers 免费自建：
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <a href="https://github.com/xixu-me/xget" target="_blank" rel="noopener" style="
                        display: inline-block;
                        padding: 6px 12px;
                        background: #10b981;
                        color: white;
                        border-radius: 6px;
                        font-size: 12px;
                        text-decoration: none;
                    ">⭐ Xget (全平台)</a>
                    <a href="https://github.com/hunshcn/gh-proxy" target="_blank" rel="noopener" style="
                        display: inline-block;
                        padding: 6px 12px;
                        background: #3b82f6;
                        color: white;
                        border-radius: 6px;
                        font-size: 12px;
                        text-decoration: none;
                    ">gh-proxy (仅GitHub)</a>
                </div>
            </div>

            <div id="xget-test-result" style="display: none; margin-bottom: 16px; padding: 12px; border-radius: 8px; font-size: 13px;"></div>

            <div style="display: flex; gap: 12px;">
                <button id="xget-test-all-btn" style="
                    flex: 1;
                    padding: 12px;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                ">🔍 测试所有加速源</button>
            </div>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // 渲染预设加速源列表
        const presetList = panel.querySelector('#xget-preset-list');
        PRESET_ACCELERATORS.forEach(acc => {
            presetList.appendChild(createAcceleratorItem(acc, currentDomain, false));
        });

        // 渲染自定义加速源列表
        const customList = panel.querySelector('#xget-custom-list');
        if (CONFIG.userAccelerators.length === 0) {
            customList.innerHTML = '<div style="padding: 12px; color: #9ca3af; font-size: 13px; text-align: center;">暂无自定义加速源</div>';
        } else {
            CONFIG.userAccelerators.forEach(acc => {
                customList.appendChild(createAcceleratorItem(acc, currentDomain, true));
            });
        }

        // 关闭按钮
        panel.querySelector('#xget-close-btn').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // 添加自定义加速源
        panel.querySelector('#xget-add-custom-btn').addEventListener('click', () => {
            showAddCustomAcceleratorDialog();
        });

        // 测试所有加速源
        panel.querySelector('#xget-test-all-btn').addEventListener('click', async () => {
            const btn = panel.querySelector('#xget-test-all-btn');
            btn.disabled = true;
            btn.textContent = '⏳ 测试中...';
            
            const results = await testAllAccelerators();
            
            const resultDiv = panel.querySelector('#xget-test-result');
            resultDiv.style.display = 'block';
            
            const availableCount = results.filter(r => r.available).length;
            if (availableCount > 0) {
                resultDiv.style.background = '#d1fae5';
                resultDiv.style.color = '#065f46';
                resultDiv.innerHTML = `✅ 测试完成: ${availableCount}/${results.length} 个加速源可用`;
            } else {
                resultDiv.style.background = '#fee2e2';
                resultDiv.style.color = '#991b1b';
                resultDiv.innerHTML = `❌ 测试完成: 所有加速源均不可用`;
            }
            
            btn.disabled = false;
            btn.textContent = '🔍 测试所有加速源';
            
            // 更新列表中的状态指示
            updateAcceleratorListStatus(results);
        });
    }

    // 创建加速源列表项
    function createAcceleratorItem(acc, currentDomain, isCustom) {
        const item = document.createElement('div');
        const isSelected = acc.domain === currentDomain;
        const platformInfo = acc.platforms === 'all' ? '全平台' : (acc.description || '仅 GitHub');
        
        item.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
            margin-bottom: 8px;
            background: ${isSelected ? '#ecfdf5' : '#f9fafb'};
            border: 2px solid ${isSelected ? '#10b981' : 'transparent'};
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        `;
        item.dataset.domain = acc.domain;

        item.innerHTML = `
            <div style="flex: 1;">
                <div style="font-size: 14px; font-weight: 500; color: #1f2937;">
                    ${acc.name} ${isSelected ? '✓' : ''}
                </div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">
                    ${acc.domain}
                </div>
                <div style="font-size: 11px; margin-top: 4px;">
                    <span style="background: ${acc.type === 'xget' ? '#dbeafe' : '#fef3c7'}; color: ${acc.type === 'xget' ? '#1e40af' : '#92400e'}; padding: 2px 6px; border-radius: 4px;">${acc.type}</span>
                    <span style="background: ${acc.platforms === 'all' ? '#d1fae5' : '#fee2e2'}; color: ${acc.platforms === 'all' ? '#065f46' : '#991b1b'}; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">${platformInfo}</span>
                </div>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
                <span class="xget-status-indicator" style="width: 8px; height: 8px; border-radius: 50%; background: #d1d5db;"></span>
                ${isCustom ? '<button class="xget-delete-btn" style="background: none; border: none; cursor: pointer; color: #ef4444; font-size: 16px;">🗑️</button>' : ''}
            </div>
        `;

        // 选择加速源
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('xget-delete-btn')) return;
            selectAccelerator(acc);
        });

        // 删除自定义加速源
        if (isCustom) {
            item.querySelector('.xget-delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`确定要删除加速源 "${acc.name}" 吗？`)) {
                    deleteCustomAccelerator(acc.domain);
                }
            });
        }

        return item;
    }

    // 选择加速源
    function selectAccelerator(acc) {
        CONFIG.customDomain = acc.domain;
        CONFIG.customType = acc.type;
        GM_setValue('xget_custom_domain', acc.domain);
        GM_setValue('xget_custom_type', acc.type);
        
        // 重置服务器状态缓存
        CONFIG.serverStatus.lastCheck = 0;
        GM_setValue('xget_server_status', CONFIG.serverStatus);
        
        // 根据平台支持情况显示不同提示
        let message = `已切换到 ${acc.name}`;
        if (acc.platforms !== 'all') {
            message += `\n⚠️ 该加速源仅支持 GitHub，其他平台将自动回退到 Xget 官方`;
            showNotification(message, 'warning', 4000);
        } else {
            showNotification(message, 'success');
        }
        
        // 关闭选择器并刷新页面
        const selector = document.getElementById('xget-accelerator-selector');
        if (selector) selector.remove();
        
        setTimeout(() => location.reload(), 800);
    }

    // 显示添加自定义加速源对话框
    function showAddCustomAcceleratorDialog() {
        const name = prompt('请输入加速源名称:');
        if (!name) return;
        
        const domain = prompt('请输入加速源域名 (不含 https://):');
        if (!domain) return;
        
        const typeChoice = prompt('请选择加速源类型:\n1. xget (格式: /gh/path，通常支持多平台)\n2. ghproxy (格式: /https://github.com/path，通常仅支持 GitHub)\n\n输入 1 或 2:', '1');
        if (!typeChoice) return;
        
        const type = typeChoice === '1' ? 'xget' : 'ghproxy';
        const testPath = type === 'ghproxy' ? '/https://github.com/robots.txt' : '/gh/robots.txt';
        
        const platformChoice = prompt('请选择支持的平台:\n1. 全平台 (GitHub, GitLab, Hugging Face 等)\n2. 仅 GitHub\n\n输入 1 或 2:', type === 'xget' ? '1' : '2');
        if (!platformChoice) return;
        
        const platforms = platformChoice === '1' ? 'all' : ['github.com', 'raw.githubusercontent.com', 'gist.github.com', 'codeload.github.com', 'objects.githubusercontent.com'];
        const description = platformChoice === '1' ? '支持所有平台' : '仅支持 GitHub';
        
        const newAcc = {
            domain: domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, ''),
            name: name.trim(),
            type: type,
            testPath: testPath,
            platforms: platforms,
            description: description
        };
        
        // 检查是否已存在
        if (getAllAccelerators().some(a => a.domain === newAcc.domain)) {
            showNotification('该加速源已存在', 'error');
            return;
        }
        
        CONFIG.userAccelerators.push(newAcc);
        GM_setValue('xget_user_accelerators', CONFIG.userAccelerators);
        
        showNotification(`已添加加速源: ${newAcc.name}`, 'success');
        
        // 刷新选择器
        showAcceleratorSelector();
    }

    // 删除自定义加速源
    function deleteCustomAccelerator(domain) {
        CONFIG.userAccelerators = CONFIG.userAccelerators.filter(a => a.domain !== domain);
        GM_setValue('xget_user_accelerators', CONFIG.userAccelerators);
        
        // 如果删除的是当前使用的加速源，重置为默认
        if (CONFIG.customDomain === domain) {
            CONFIG.customDomain = '';
            CONFIG.customType = 'xget';
            GM_setValue('xget_custom_domain', '');
            GM_setValue('xget_custom_type', 'xget');
        }
        
        showNotification('已删除加速源', 'success');
        showAcceleratorSelector();
    }

    // 测试所有加速源
    async function testAllAccelerators() {
        const allAccelerators = getAllAccelerators();
        const results = [];
        
        for (const acc of allAccelerators) {
            const testUrl = `https://${acc.domain}${acc.testPath}`;
            const available = await testSingleAccelerator(testUrl);
            results.push({ domain: acc.domain, available });
        }
        
        return results;
    }

    // 测试单个加速源
    function testSingleAccelerator(testUrl) {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(false), 5000);
            
            GM_xmlhttpRequest({
                method: 'HEAD',
                url: testUrl,
                timeout: 5000,
                onload: function(response) {
                    clearTimeout(timeout);
                    resolve(response.status >= 200 && response.status < 400);
                },
                onerror: function() {
                    clearTimeout(timeout);
                    resolve(false);
                },
                ontimeout: function() {
                    clearTimeout(timeout);
                    resolve(false);
                }
            });
        });
    }

    // 更新加速源列表状态指示
    function updateAcceleratorListStatus(results) {
        results.forEach(result => {
            const item = document.querySelector(`[data-domain="${result.domain}"]`);
            if (item) {
                const indicator = item.querySelector('.xget-status-indicator');
                if (indicator) {
                    indicator.style.background = result.available ? '#10b981' : '#ef4444';
                }
            }
        });
    }

    // 在控制台显示艺术字 Logo（优雅的署名方式）
    function showConsoleBanner() {
        const styles = [
            'color: #10b981; font-size: 16px; font-weight: bold;',
            'color: #3b82f6; font-size: 12px;',
            'color: #6b7280; font-size: 11px;'
        ];
        
        console.log('%c⚡ Xget 加速器增强优化版', styles[0]);
        console.log('%c🎨 UP：毕加索自画像', styles[1]);
        console.log('%c✨ 感谢使用本增强版脚本 | v3.3', styles[2]);
    }

    // 彩蛋：特殊组合键显示作者信息
    function setupEasterEgg() {
        let keySequence = [];
        const secretCode = ['x', 'g', 'e', 't']; // 输入 "xget" 触发
        
        document.addEventListener('keydown', (e) => {
            keySequence.push(e.key.toLowerCase());
            if (keySequence.length > secretCode.length) {
                keySequence.shift();
            }
            
            if (keySequence.join('') === secretCode.join('')) {
                showAuthorInfo();
                keySequence = [];
            }
        });
    }

    // 显示作者信息（彩蛋触发）
    function showAuthorInfo() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            animation: fadeInScale 0.3s ease-out;
        `;
        
        modal.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 15px;">🎨</div>
            <div style="font-size: 24px; font-weight: 700; margin-bottom: 10px;">Xget 加速器增强优化版</div>
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 20px;">Enhanced & Optimized Edition v3.3</div>
            <div style="border-top: 1px solid rgba(255,255,255,0.3); padding-top: 20px;">
                <div style="font-size: 16px; margin-bottom: 8px;">✨ UP 主</div>
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 15px;">毕加索自画像</div>
                <div style="font-size: 13px; opacity: 0.8;">
                    感谢使用本增强版脚本<br>
                    已优化：性能、稳定性、错误处理
                </div>
            </div>
            <div style="margin-top: 20px; font-size: 11px; opacity: 0.6;">点击任意处关闭</div>
        `;
        
        // 添加动画
        if (!document.getElementById('xget-modal-style')) {
            const style = document.createElement('style');
            style.id = 'xget-modal-style';
            style.textContent = `
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // 点击关闭
        modal.addEventListener('click', () => {
            modal.style.animation = 'fadeInScale 0.2s ease-out reverse';
            setTimeout(() => modal.remove(), 200);
        });
        
        document.body.appendChild(modal);
    }

    // 初始化
    function init() {
        // 显示控制台 Banner
        showConsoleBanner();
        
        // 设置彩蛋
        setupEasterEgg();
        
        debugLog('Xget 加速器增强优化版初始化开始');
        debugLog('配置:', CONFIG);
        
        console.log('🎨 Xget 加速器增强优化版已加载 - UP：毕加索自画像 | v3.2');
        setupMenuCommands();

        if (CONFIG.enabled) {
            interceptDownloadLinks();
            
            // 延迟添加指示器，确保页面已加载
            setTimeout(() => {
                addPageIndicator();
            }, 1000);
            
            const domain = getAcceleratorDomain();
            console.log(`Xget 加速已启用 - 域名: ${domain}`);
            console.log(`统计: 成功 ${CONFIG.stats.success} / 总计 ${CONFIG.stats.total}`);
            debugLog('初始化完成');
        } else {
            debugLog('加速功能已禁用');
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();