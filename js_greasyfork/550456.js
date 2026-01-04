// ==UserScript==
// @name         模拟苹果设备特性
// @namespace    https://mzyxsl.cn/
// @version      1.1
// @description  模拟iOS,iPad OS,Mac OS
// @author       mzyxsl
// @match        https://*hcf2023.top/*
// @grant        none
// @license      GPL-3.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550456/%E6%A8%A1%E6%8B%9F%E8%8B%B9%E6%9E%9C%E8%AE%BE%E5%A4%87%E7%89%B9%E6%80%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/550456/%E6%A8%A1%E6%8B%9F%E8%8B%B9%E6%9E%9C%E8%AE%BE%E5%A4%87%E7%89%B9%E6%80%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始属性
    const originalPlatform = navigator.platform;
    const originalVendor = navigator.vendor;
    const originalScreenWidth = screen.width;
    const originalScreenHeight = screen.height;
    const originalDevicePixelRatio = window.devicePixelRatio;
    const originalUserAgentData = navigator.userAgentData;
    const originalCSSSupports = CSS.supports;

    // 设备类型检测函数
    function detectDeviceType() {
        const screenWidth = screen.width;
        const screenHeight = screen.height;
        const maxTouchPoints = navigator.maxTouchPoints || 0;
        const hasTouch = 'ontouchstart' in window;

        // 检测指针类型
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
        const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
        const hasHover = window.matchMedia('(hover: hover)').matches;

        // 屏幕尺寸判断
        const minScreenSize = Math.min(screenWidth, screenHeight);
        const maxScreenSize = Math.max(screenWidth, screen.height);
        const aspectRatio = maxScreenSize / minScreenSize;

        console.log('设备检测参数:', {
            screen: `${screenWidth}x${screenHeight} (min: ${minScreenSize})`,
            touchPoints: maxTouchPoints,
            hasTouch: hasTouch,
            finePointer: hasFinePointer,
            coarsePointer: hasCoarsePointer,
            hasHover: hasHover,
            aspectRatio: aspectRatio.toFixed(2)
        });

        // 移动设备特征判断
        const hasMobileFeatures = hasCoarsePointer || !hasHover || hasTouch;

        // 屏幕尺寸和比例判断
        const isPhoneSize = minScreenSize < 768 && aspectRatio >= 1.5;
        const isTabletSize = minScreenSize >= 768 && minScreenSize < 1200;
        const isDesktopSize = minScreenSize >= 1200 || !hasMobileFeatures;

        // 综合判断逻辑
        if (hasMobileFeatures && isPhoneSize) {
            return 'iphone';
        } else if (hasMobileFeatures && isTabletSize) {
            return 'ipad';
        } else if (isDesktopSize || !hasMobileFeatures) {
            return 'mac';
        }

        return 'mac';
    }

    // 苹果设备配置
    const appleProfiles = {
        // iPhone配置
        iphone: {
            name: 'iPhone',
            platform: 'iPhone',
            vendor: 'Apple Inc.',
            webgl: { vendor: 'Apple GPU', renderer: 'Apple Inc.' },
            screen: { width: 390, height: 844 },
            hasSafariPush: false,
            hasTouch: true,
            maxTouchPoints: 5,
            devicePixelRatio: 3,
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            clientHints: {
                platform: 'iOS',
                mobile: true,
                architecture: 'arm',
                model: 'iPhone15,3',
                platformVersion: '17.0'
            }
        },

        // iPad配置
        ipad: {
            name: 'iPad',
            platform: 'iPad',
            vendor: 'Apple Inc.',
            webgl: { vendor: 'Apple GPU', renderer: 'Apple Inc.' },
            screen: { width: 1024, height: 1366 },
            hasSafariPush: false,
            hasTouch: true,
            maxTouchPoints: 5,
            devicePixelRatio: 2,
            userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            clientHints: {
                platform: 'iOS',
                mobile: true,
                architecture: 'arm',
                model: 'iPad13,8',
                platformVersion: '17.0'
            }
        },

        // Mac配置
        mac: {
            name: 'Mac',
            platform: 'MacIntel',
            vendor: 'Apple Inc.',
            webgl: { vendor: 'Apple GPU', renderer: 'Apple Inc.' },
            screen: { width: originalScreenWidth, height: originalScreenHeight },
            hasSafariPush: true,
            hasTouch: false,
            maxTouchPoints: 0,
            devicePixelRatio: originalDevicePixelRatio,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
            clientHints: {
                platform: 'macOS',
                mobile: false,
                architecture: 'x86',
                model: 'MacBookPro18,3',
                platformVersion: '14.0'
            }
        }
    };

    // 自动检测设备类型
    const detectedDevice = detectDeviceType();
    let currentProfile = appleProfiles[detectedDevice];

    console.log(`🔍 检测结果: ${detectedDevice} -> 伪装成: ${currentProfile.name}`);
    console.log(`📺 屏幕分辨率: ${currentProfile.screen.width}x${currentProfile.screen.height}`);

    // 只伪装必要的属性
    Object.defineProperty(navigator, 'platform', {
        get: () => currentProfile.platform,
        configurable: false
    });

    Object.defineProperty(navigator, 'vendor', {
        get: () => currentProfile.vendor,
        configurable: false
    });

    // 伪装UserAgent
    Object.defineProperty(navigator, 'userAgent', {
        get: () => currentProfile.userAgent,
        configurable: false
    });

    // Client Hints伪装
    function spoofClientHints() {
        if (navigator.userAgentData) {
            Object.defineProperty(navigator, 'userAgentData', {
                get: () => {
                    const original = originalUserAgentData;
                    return {
                        ...original,
                        brands: [
                            {brand: 'Google Chrome', version: '120'},
                            {brand: 'Chromium', version: '120'},
                            {brand: 'Not=A?Brand', version: '24'}
                        ],
                        mobile: currentProfile.clientHints.mobile,
                        platform: currentProfile.clientHints.platform,
                        getHighEntropyValues: function(hints) {
                            return Promise.resolve({
                                architecture: currentProfile.clientHints.architecture,
                                model: currentProfile.clientHints.model,
                                platformVersion: currentProfile.clientHints.platformVersion,
                                fullVersionList: [
                                    {brand: 'Google Chrome', version: '120.0.0.0'},
                                    {brand: 'Chromium', version: '120.0.0.0'},
                                    {brand: 'Not=A?Brand', version: '24.0.0.0'}
                                ]
                            });
                        }
                    };
                },
                configurable: false
            });
        }
    }

    // 拦截Client Hints API请求
    function interceptClientHintsRequests() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            // 如果是Client Hints相关的请求，返回伪造的数据
            if (args[0] && typeof args[0] === 'string' && args[0].includes('/api/client-hints')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        serverSupport: {
                            acceptCH: 'Sec-CH-UA-Platform, Sec-CH-UA-Mobile, Sec-CH-UA-Model',
                            acceptCHLifetime: 86400
                        },
                        detectedOS: currentProfile.clientHints.platform,
                        isMobile: currentProfile.clientHints.mobile,
                        hasHighEntropyData: true,
                        clientHints: {
                            platform: currentProfile.clientHints.platform,
                            mobile: currentProfile.clientHints.mobile,
                            architecture: currentProfile.clientHints.architecture,
                            model: currentProfile.clientHints.model,
                            platformVersion: currentProfile.clientHints.platformVersion
                        }
                    })
                });
            }
            return originalFetch.apply(this, args);
        };
    }

   // WebGL渲染器伪装
    function spoofWebGL() {
        try {
            const originalGetParameter = WebGLRenderingContext.prototype.getParameter;

            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                switch(parameter) {
                    case 37446: return currentProfile.webgl.vendor;
                    case 37445: return currentProfile.webgl.renderer;
                    case this.VENDOR: return 'WebKit';
                    case this.RENDERER: return 'WebKit WebGL';
                    default: return originalGetParameter.call(this, parameter);
                }
            };
        } catch (error) {
            console.warn('WebGL伪装失败:', error);
        }
    }

    // 屏幕尺寸和DPI适配
    function spoofScreen() {
        Object.defineProperty(screen, 'width', {
            get: () => currentProfile.screen.width,
            configurable: false
        });

        Object.defineProperty(screen, 'height', {
            get: () => currentProfile.screen.height,
            configurable: false
        });

        // 设备像素比
        Object.defineProperty(window, 'devicePixelRatio', {
            get: () => currentProfile.devicePixelRatio,
            configurable: false
        });
    }

    // 触控特性伪装
    function spoofTouchFeatures() {
        Object.defineProperty(navigator, 'maxTouchPoints', {
            get: () => currentProfile.maxTouchPoints,
            configurable: false
        });

        if (currentProfile.hasTouch) {
            if (!('ontouchstart' in window)) {
                Object.defineProperty(window, 'ontouchstart', {
                    value: null,
                    configurable: false
                });
            }
        } else {
            if ('ontouchstart' in window) {
                delete window.ontouchstart;
            }
        }
    }

    // CSS特性伪装 - iOS/iPadOS WebKit特性检测
    function spoofCSSFeatures() {
        CSS.supports = function(property, value) {
            const isTouchDevice = currentProfile.hasTouch;

            // 处理 iOS/iPadOS 特定的 CSS 特性
            if (property === '-webkit-touch-callout' && value === 'none') {
                return isTouchDevice;
            }

            if (property === '-webkit-overflow-scrolling' && value === 'touch') {
                return isTouchDevice;
            }

            // 处理字符串形式的查询
            if (arguments.length === 1) {
                const condition = property;
                if (condition === '(-webkit-touch-callout: none)') {
                    return isTouchDevice;
                }
                if (condition === '(-webkit-overflow-scrolling: touch)') {
                    return isTouchDevice;
                }
            }

            // 其他情况调用原始方法
            return originalCSSSupports.apply(this, arguments);
        };

        // 确保 CSS.supports 的绑定正确
        Object.defineProperty(CSS, 'supports', {
            value: CSS.supports,
            writable: false,
            configurable: false
        });
    }

    // 媒体查询伪装
    function spoofMediaQueries() {
        const originalMatchMedia = window.matchMedia;

        window.matchMedia = function(query) {
            const isTouchDevice = currentProfile.hasTouch;

            const mediaResults = {
                '(pointer: fine)': !isTouchDevice,
                '(pointer: coarse)': isTouchDevice,
                '(hover: hover)': !isTouchDevice,
                '(hover: none)': isTouchDevice,
                '(-webkit-touch-callout: none)': isTouchDevice,
                '(-webkit-overflow-scrolling: touch)': isTouchDevice,
                '(display-mode: standalone)': false,
                '(orientation: portrait)': currentProfile.screen.height > currentProfile.screen.width,
                '(orientation: landscape)': currentProfile.screen.width > currentProfile.screen.height
            };

            if (mediaResults.hasOwnProperty(query)) {
                return {
                    matches: mediaResults[query],
                    media: query,
                    addListener: () => {},
                    removeListener: () => {},
                    addEventListener: () => {},
                    removeEventListener: () => {}
                };
            }

            return originalMatchMedia.call(this, query);
        };
    }

    // 苹果设备API模拟
    function spoofAppleAPIs() {
        // Apple Pay - 所有苹果设备都支持
        if (!window.ApplePaySession) {
            window.ApplePaySession = {
                canMakePayments: () => true,
                supportsVersion: () => true
            };
        }

        // Safari Push - 仅限macOS
        if (currentProfile.hasSafariPush) {
            if (!window.safari) window.safari = {};
            window.safari.pushNotification = {
                permission: () => ({ permission: 'default' })
            };
        }

        // iOS权限API - 仅限移动设备
        if (currentProfile.hasTouch) {
            if (typeof DeviceMotionEvent !== 'undefined') {
                DeviceMotionEvent.requestPermission = () => Promise.resolve('granted');
            }
            if (typeof DeviceOrientationEvent !== 'undefined') {
                DeviceOrientationEvent.requestPermission = () => Promise.resolve('granted');
            }

            Object.defineProperty(navigator, 'standalone', {
                get: () => false,
                configurable: false
            });
        }
    }

    // 硬件信息伪装
    function spoofHardwareInfo() {
        // 硬件并发数（苹果设备通常有特定核心数）
        Object.defineProperty(navigator, 'hardwareConcurrency', {
            get: () => currentProfile.name === 'iPhone' ? 6 :
                     currentProfile.name === 'iPad' ? 8 : 10,
            configurable: false
        });

        // 设备内存
        if ('deviceMemory' in navigator) {
            Object.defineProperty(navigator, 'deviceMemory', {
                get: () => currentProfile.name === 'iPhone' ? 4 :
                         currentProfile.name === 'iPad' ? 6 : 8,
                configurable: false
            });
        }
    }

    // 初始化伪装
    function initSpoofing() {
        spoofScreen();
        spoofTouchFeatures();
        spoofCSSFeatures();
        spoofMediaQueries();
        spoofClientHints();
        spoofHardwareInfo();
        interceptClientHintsRequests();
        spoofWebGL();
        spoofAppleAPIs();

        console.log(`ℹ️ 户先生说: 这是${currentProfile.name}`);
    }

    // 立即执行
    initSpoofing();

    // 简化控制接口
    window.appleSpoof = {
        getStatus: function() {
            return {
                originalDevice: detectedDevice,
                spoofingAs: currentProfile.name,
                platform: navigator.platform,
                vendor: navigator.vendor,
                screen: `${screen.width}x${screen.height}`,
                maxTouchPoints: navigator.maxTouchPoints,
                hasTouch: 'ontouchstart' in window,
                clientHints: currentProfile.clientHints,
                cssFeatures: {
                    webkitTouchCallout: CSS.supports('-webkit-touch-callout', 'none'),
                    webkitOverflowScrolling: CSS.supports('-webkit-overflow-scrolling', 'touch')
                }
            };
        },

        switchTo: function(deviceType) {
            if (appleProfiles[deviceType]) {
                currentProfile = appleProfiles[deviceType];

                // 如果是Mac，使用真实分辨率
                if (deviceType === 'mac') {
                    currentProfile.screen.width = originalScreenWidth;
                    currentProfile.screen.height = originalScreenHeight;
                    currentProfile.devicePixelRatio = originalDevicePixelRatio;
                }

                initSpoofing();
                return `已切换到: ${currentProfile.name}`;
            }
            return '无效的设备类型';
        },

        redetect: function() {
            const newDevice = detectDeviceType();
            currentProfile = appleProfiles[newDevice];

            if (newDevice === 'mac') {
                currentProfile.screen.width = originalScreenWidth;
                currentProfile.screen.height = originalScreenHeight;
                currentProfile.devicePixelRatio = originalDevicePixelRatio;
            }

            initSpoofing();
            return `重新检测完成: ${newDevice}`;
        },

        restore: function() {
            Object.defineProperty(navigator, 'platform', { get: () => originalPlatform });
            Object.defineProperty(navigator, 'vendor', { get: () => originalVendor });
            Object.defineProperty(navigator, 'userAgent', { get: () => navigator.userAgent });

            try {
                delete screen.width;
                delete screen.height;
                delete window.devicePixelRatio;
                delete navigator.maxTouchPoints;
                delete navigator.hardwareConcurrency;
                if ('deviceMemory' in navigator) delete navigator.deviceMemory;
            } catch (e) {}

            console.log('已恢复原始设备设置');
        }
    };

})();