// ==UserScript==
// @name         Xiaomi MiMo Studio 去水印
// @namespace    https://github.com/wang93wei/Xiaomi-MiMo-Studio-Watermark-Remover
// @version      1.4.0
// @description  自动检测并移除 Xiaomi MiMo Studio 页面中的水印内容（Canvas水印）
// @author       AlanWang
// @license      MIT
// @homepageURL  https://github.com/wang93wei/Xiaomi-MiMo-Studio-Watermark-Remover
// @supportURL   https://github.com/wang93wei/Xiaomi-MiMo-Studio-Watermark-Remover/issues
// @match        https://aistudio.xiaomimimo.com/*
// @match        https://aistudio.xiaomimimo.com/#/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559263/Xiaomi%20MiMo%20Studio%20%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/559263/Xiaomi%20MiMo%20Studio%20%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 配置常量 ==========
    const CONFIG = {
        // 日志配置
        ENABLE_LOG: false,

        // API配置
        API_URL: 'https://aistudio.xiaomimimo.com/open-apis/user/mi/get',
        DEFAULT_TIMEZONE: 'Asia/Shanghai',
        FETCH_TIMEOUT: 10000,

        // 水印文本配置
        MAX_WATERMARK_LENGTH: 500,
        MIN_WATERMARK_LENGTH: 1,
        BASE64_MATCH_MIN_LENGTH: 20,
        BASE64_MATCH_MAX_LENGTH: 50,

        // Canvas检测配置
        VIEWPORT_COVERAGE_THRESHOLD: 0.9,

        // 重试配置
        MAX_RETRIES: 5,
        PAGE_LOAD_RETRIES: 3,
        INITIAL_RETRY_DELAY: 1000,
        RETRY_BACKOFF_MULTIPLIER: 1.5,

        // 轮询配置
        MAX_POLL_COUNT: 20,
        POLL_INTERVAL: 500,

        // 页面加载配置
        PAGE_LOAD_WAIT_TIME: 2000,

        // 安全配置
        MAX_REPEATED_CHARS: 10,
        MAX_REPEATED_SUBSTRINGS: 5,
        MAX_NESTED_BRACKETS: 20,

        // Canvas拦截配置
        ENABLE_CANVAS_INTERCEPT: true,
    };

    // ========== 错误统计 ==========
    const errorStats = {
        fetchErrors: 0,
        canvasErrors: 0,
    };

    // ========== 日志工具 ==========
    const logger = {
        log: (...args) => {
            if (CONFIG.ENABLE_LOG) {
                console.log('[去水印脚本]', ...args);
            }
        },
        warn: (...args) => {
            if (CONFIG.ENABLE_LOG) {
                console.warn('[去水印脚本]', ...args);
            }
        },
        error: (...args) => {
            console.error('[去水印脚本]', ...args);
        },
        stat: (type) => {
            if (Object.prototype.hasOwnProperty.call(errorStats, type)) {
                errorStats[type]++;
            }
        },
        getStats: () => ({ ...errorStats }),
    };

    // ========== 状态管理 ==========
    const state = {
        watermarkText: null,
        watermarkCandidates: [],
        processedElements: new WeakSet(),
        pollTimer: null,
        resizeHandler: null,
    };

    // ========== 工具函数 ==========
    const formatErrorContext = (error, additionalContext = {}) => ({
        error: error?.message,
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...additionalContext,
    });

    const containsWatermark = (text) => {
        if (text == null || typeof text !== 'string') return false;
        if (!Array.isArray(state.watermarkCandidates) || state.watermarkCandidates.length === 0) return false;
        return state.watermarkCandidates.some((candidate) => text.includes(candidate));
    };

    const isSafeWatermarkText = (text) => {
        if (!text || typeof text !== 'string') return false;
        if (text.length === 0 || text.length > CONFIG.MAX_WATERMARK_LENGTH) return false;

        const dangerousPatterns = [
            new RegExp(`(.+)\\1{${CONFIG.MAX_REPEATED_CHARS},}`),
            new RegExp(`(.+?)(\\1+){${CONFIG.MAX_REPEATED_SUBSTRINGS},}`),
            new RegExp(`[\\(\\)\\[\\]\\{\\}]{${CONFIG.MAX_NESTED_BRACKETS},}`),
        ];

        return !dangerousPatterns.some((pattern) => pattern.test(text));
    };

    const rebuildWatermarkCandidates = () => {
        const candidates = [];

        if (!state.watermarkText || typeof state.watermarkText !== 'string') {
            state.watermarkCandidates = [];
            logger.warn('WATERMARK_TEXT 无效，清空候选列表');
            return;
        }

        candidates.push(state.watermarkText);

        try {
            const decoded = atob(state.watermarkText);
            if (decoded && typeof decoded === 'string') {
                candidates.push(decoded);

                try {
                    const bytes = new Uint8Array(decoded.length);
                    for (let i = 0; i < decoded.length; i++) {
                        bytes[i] = decoded.charCodeAt(i);
                    }
                    const utf8 = new TextDecoder('utf-8').decode(bytes);
                    if (utf8 && typeof utf8 === 'string' && utf8 !== decoded) {
                        candidates.push(utf8);
                    }
                } catch {
                    // UTF-8 解码失败，忽略
                }
            }
        } catch {
            // Base64 解码失败，忽略
        }

        state.watermarkCandidates = Array.from(
            new Set(candidates.filter((c) => c && typeof c === 'string' && c.length > 0))
        );
        logger.log('水印匹配候选:', state.watermarkCandidates);
    };

    const cleanup = () => {
        if (state.pollTimer) {
            clearInterval(state.pollTimer);
            state.pollTimer = null;
        }
        if (state.resizeHandler) {
            window.removeEventListener('resize', state.resizeHandler);
            state.resizeHandler = null;
        }
    };

    // ========== Canvas拦截 ==========
    const interceptCanvas = () => {
        if (!CONFIG.ENABLE_CANVAS_INTERCEPT) {
            logger.log('Canvas 拦截已禁用，跳过');
            return;
        }

        if (CanvasRenderingContext2D.prototype._watermarkIntercepted) {
            logger.log('Canvas 拦截器已安装，跳过重复安装');
            return;
        }

        const interceptMethod = (prototype, methodName, originalMethod) => {
            Object.defineProperty(prototype, methodName, {
                value: function(...args) {
                    try {
                        const text = args[0];
                        if (text && containsWatermark(String(text))) {
                            return;
                        }
                        return originalMethod.apply(this, args);
                    } catch (e) {
                        logger.warn(`${methodName} 拦截出错，使用原始实现:`, e);
                        logger.stat('canvasErrors');
                        return originalMethod.apply(this, args);
                    }
                },
                writable: true,
                configurable: true,
            });
        };

        const interceptDrawImage = (prototype, methodName, originalMethod) => {
            Object.defineProperty(prototype, methodName, {
                value: function(...args) {
                    try {
                        const image = args[0];
                        if (image?.src && containsWatermark(image.src)) {
                            return;
                        }
                        return originalMethod.apply(this, args);
                    } catch (e) {
                        logger.warn(`${methodName} 拦截出错，使用原始实现:`, e);
                        logger.stat('canvasErrors');
                        return originalMethod.apply(this, args);
                    }
                },
                writable: true,
                configurable: true,
            });
        };

        try {
            const originalFillText = CanvasRenderingContext2D.prototype.fillText;
            const originalStrokeText = CanvasRenderingContext2D.prototype.strokeText;
            const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;

            interceptMethod(CanvasRenderingContext2D.prototype, 'fillText', originalFillText);
            interceptMethod(CanvasRenderingContext2D.prototype, 'strokeText', originalStrokeText);
            interceptDrawImage(CanvasRenderingContext2D.prototype, 'drawImage', originalDrawImage);

            Object.defineProperty(CanvasRenderingContext2D.prototype, '_watermarkIntercepted', {
                value: true,
                writable: true,
                configurable: true,
            });
        } catch (e) {
            logger.error('拦截 CanvasRenderingContext2D 失败:', e);
            logger.stat('canvasErrors');
        }

        try {
            if (typeof OffscreenCanvasRenderingContext2D !== 'undefined' &&
                !OffscreenCanvasRenderingContext2D.prototype._watermarkIntercepted) {
                const offscreenOriginalFillText = OffscreenCanvasRenderingContext2D.prototype.fillText;
                const offscreenOriginalStrokeText = OffscreenCanvasRenderingContext2D.prototype.strokeText;
                const offscreenOriginalDrawImage = OffscreenCanvasRenderingContext2D.prototype.drawImage;

                interceptMethod(OffscreenCanvasRenderingContext2D.prototype, 'fillText', offscreenOriginalFillText);
                interceptMethod(OffscreenCanvasRenderingContext2D.prototype, 'strokeText', offscreenOriginalStrokeText);
                interceptDrawImage(OffscreenCanvasRenderingContext2D.prototype, 'drawImage', offscreenOriginalDrawImage);

                Object.defineProperty(OffscreenCanvasRenderingContext2D.prototype, '_watermarkIntercepted', {
                    value: true,
                    writable: true,
                    configurable: true,
                });
            }
        } catch (e) {
            logger.warn('拦截 OffscreenCanvas 失败:', e);
            logger.stat('canvasErrors');
        }
    };

    const clearSuspectedWatermarkCanvases = () => {
        const canvases = document.querySelectorAll('canvas');
        if (!canvases?.length) return;

        canvases.forEach((canvas) => {
            if (!canvas || state.processedElements.has(canvas)) return;

            try {
                const style = window.getComputedStyle(canvas);
                if (!style) return;

                const positionLikely = style.position === 'fixed' || style.position === 'absolute';
                const pointerEventsNone = style.pointerEvents === 'none';

                const rect = canvas.getBoundingClientRect();
                const vw = window.innerWidth ?? 0;
                const vh = window.innerHeight ?? 0;
                const coversMostViewport = vw > 0 && vh > 0 &&
                    rect.width >= vw * CONFIG.VIEWPORT_COVERAGE_THRESHOLD &&
                    rect.height >= vh * CONFIG.VIEWPORT_COVERAGE_THRESHOLD;

                if (coversMostViewport && (positionLikely || pointerEventsNone)) {
                    const ctx2d = canvas.getContext('2d');
                    ctx2d?.clearRect(0, 0, canvas.width, canvas.height);

                    if (canvas.style) {
                        canvas.style.backgroundImage = 'none';
                        canvas.style.background = 'none';
                        canvas.style.opacity = '0';
                        canvas.style.visibility = 'hidden';
                        canvas.style.display = 'none';
                    }
                    state.processedElements.add(canvas);
                }
            } catch (e) {
                logger.warn('清理Canvas水印时出错:', e);
            }
        });
    };

    // ========== API请求 ==========
    const fetchWatermark = async () => {
        try {
            logger.log('开始获取水印内容...');
            const browserTimeZone = typeof Intl !== 'undefined' && Intl.DateTimeFormat
                ? (Intl.DateTimeFormat().resolvedOptions().timeZone ?? CONFIG.DEFAULT_TIMEZONE)
                : CONFIG.DEFAULT_TIMEZONE;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);

            let response;
            try {
                response = await fetch(CONFIG.API_URL, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        'x-timezone': browserTimeZone,
                    },
                    credentials: 'include',
                    signal: controller.signal,
                });
            } catch (networkError) {
                clearTimeout(timeoutId);

                const errorContext = formatErrorContext(networkError, {
                    url: CONFIG.API_URL,
                    timeout: CONFIG.FETCH_TIMEOUT,
                });

                if (networkError.name === 'AbortError') {
                    logger.error('获取水印请求超时', errorContext);
                } else if (networkError.name === 'TypeError') {
                    logger.error('网络错误，请检查网络连接', errorContext);
                } else if (networkError.name === 'SecurityError') {
                    logger.error('安全错误，可能是跨域问题', errorContext);
                } else {
                    logger.error('网络请求失败', errorContext);
                }
                logger.stat('fetchErrors');
                return false;
            } finally {
                clearTimeout(timeoutId);
            }

            if (!response.ok) {
                logger.error(`HTTP error! status: ${response.status}`);
                logger.stat('fetchErrors');
                return false;
            }

            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                try {
                    const responseText = await response.text();
                    logger.error('解析 API 响应失败:', jsonError, '响应内容:', responseText);
                } catch (textError) {
                    logger.error('无法读取响应内容:', textError);
                }
                logger.stat('fetchErrors');
                return false;
            }
            logger.log('API 响应:', result);

            if (!result || typeof result !== 'object') {
                logger.warn('API 响应格式无效');
                return false;
            }

            if (typeof result.code !== 'number') {
                logger.warn('API 响应缺少 code 字段');
                return false;
            }

            if (result.code !== 0) {
                logger.warn('API 返回错误码:', result.code);
                return false;
            }

            if (!result.data || typeof result.data !== 'object') {
                logger.warn('API 响应缺少 data 字段');
                return false;
            }

            if (!result.data.watermark || typeof result.data.watermark !== 'string') {
                logger.warn('API 响应缺少 watermark 字段');
                return false;
            }

            state.watermarkText = result.data.watermark;
            rebuildWatermarkCandidates();
            logger.log('成功获取水印内容:', state.watermarkText);
            return true;
        } catch (error) {
            logger.error('获取水印内容时发生未知错误:', formatErrorContext(error));
            logger.stat('fetchErrors');
            return false;
        }
    };

    const detectWatermarkFromPage = () => {
        try {
            if (state.watermarkText) return true;

            logger.log('尝试从页面中检测水印...');

            if (!document.body) return false;

            const base64Pattern = new RegExp(`[A-Za-z0-9+/]{${CONFIG.BASE64_MATCH_MIN_LENGTH},}={0,2}`, 'g');
            const allText = document.body.innerText ?? '';
            const matches = allText.match(base64Pattern);

            if (!matches?.length) return false;

            for (const match of matches) {
                if (match.length >= CONFIG.MIN_WATERMARK_LENGTH &&
                    match.length <= CONFIG.BASE64_MATCH_MAX_LENGTH) {
                    const walker = document.createTreeWalker(
                        document.body,
                        NodeFilter.SHOW_TEXT,
                        null
                    );

                    let node;
                    while ((node = walker.nextNode())) {
                        const textContent = node.textContent ?? '';
                        if (textContent.includes(match)) {
                            state.watermarkText = match;
                            rebuildWatermarkCandidates();
                            logger.log('从页面检测到水印:', state.watermarkText);
                            return true;
                        }
                    }
                }
            }

            return false;
        } catch (error) {
            logger.error('从页面检测水印时出错:', formatErrorContext(error));
            return false;
        }
    };

    const fetchWatermarkWithRetry = async (maxRetries = CONFIG.MAX_RETRIES, delay = CONFIG.INITIAL_RETRY_DELAY) => {
        for (let i = 0; i < maxRetries; i++) {
            logger.log(`尝试获取水印 (${i + 1}/${maxRetries})...`);

            const success = await fetchWatermark();
            if (success && state.watermarkText) {
                return true;
            }

            if (i < maxRetries - 1) {
                logger.log(`等待 ${delay}ms 后重试...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= CONFIG.RETRY_BACKOFF_MULTIPLIER;
            }
        }

        logger.log('API 获取失败，尝试从页面检测水印...');
        if (detectWatermarkFromPage()) {
            return true;
        }

        logger.error('无法获取水印内容，脚本将无法正常工作');
        return false;
    };

    // ========== 启动水印移除 ==========
    const startWatermarkRemoval = () => {
        if (!state.watermarkText) {
            logger.warn('水印内容为空，无法启动移除功能');
            return false;
        }

        logger.log('启动水印移除功能，水印内容:', state.watermarkText);

        try {
            interceptCanvas();
            clearSuspectedWatermarkCanvases();
        } catch (error) {
            logger.error('启动水印移除功能时出错:', error);
            return false;
        }

        cleanup();

        let pollCount = 0;

        state.pollTimer = setInterval(() => {
            pollCount++;
            if (pollCount > CONFIG.MAX_POLL_COUNT) {
                clearInterval(state.pollTimer);
                state.pollTimer = null;
                logger.log('轮询检测完成');
                return;
            }

            clearSuspectedWatermarkCanvases();
        }, CONFIG.POLL_INTERVAL);

        state.resizeHandler = () => {
            logger.log('窗口大小改变，重新检测水印');
            clearSuspectedWatermarkCanvases();
        };
        window.addEventListener('resize', state.resizeHandler);

        return true;
    };

    // ========== 主函数 ==========
    const main = async () => {
        logger.log('脚本开始运行...');

        const watermarkFetched = await fetchWatermarkWithRetry();

        if (watermarkFetched && state.watermarkText) {
            startWatermarkRemoval();
        } else {
            logger.log('等待页面完全加载后重试...');
            window.addEventListener('load', async () => {
                await new Promise((resolve) => setTimeout(resolve, CONFIG.PAGE_LOAD_WAIT_TIME));
                const retrySuccess = await fetchWatermarkWithRetry(CONFIG.PAGE_LOAD_RETRIES, CONFIG.INITIAL_RETRY_DELAY * 2);
                if (retrySuccess && state.watermarkText) {
                    startWatermarkRemoval();
                } else if (detectWatermarkFromPage()) {
                    startWatermarkRemoval();
                }
            });
        }

        const stats = logger.getStats();
        const totalErrors = stats.fetchErrors + stats.canvasErrors;
        if (totalErrors > 0) {
            console.warn('[去水印脚本] 错误统计:', stats);
        }
    };

    // ========== 启动脚本 ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
