// ==UserScript==
// @name         高级系统伪造 - AdvancedPhoneSpoofer
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  强制网页检测系统为iPadOS(过passkey检测)
// @author       Jeyor1337
// @license       MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553060/%E9%AB%98%E7%BA%A7%E7%B3%BB%E7%BB%9F%E4%BC%AA%E9%80%A0%20-%20AdvancedPhoneSpoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/553060/%E9%AB%98%E7%BA%A7%E7%B3%BB%E7%BB%9F%E4%BC%AA%E9%80%A0%20-%20AdvancedPhoneSpoofer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 防止重复执行消耗性能
    if (window.__systemDetectionScriptExecuted) return;
    window.__systemDetectionScriptExecuted = true;

    // 伪造UserAgent
    const appleUserAgent = 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';
    
    // 重写navigator
    Object.defineProperty(navigator, 'userAgent', { get: () => appleUserAgent });
    Object.defineProperty(navigator, 'platform', { get: () => 'MacIntel' });
    Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 5 });
    Object.defineProperty(navigator, 'vendor', { get: () => 'Apple Computer, Inc.' });

    // 伪造iOS API
    if (window.DeviceMotionEvent) {
        Object.defineProperty(window.DeviceMotionEvent, 'requestPermission', {
            value: () => Promise.resolve('granted'),
            writable: false,
            configurable: false
        });
    }
    
    if (window.DeviceOrientationEvent) {
        Object.defineProperty(window.DeviceOrientationEvent, 'requestPermission', {
            value: () => Promise.resolve('granted'),
            writable: false,
            configurable: false
        });
    }

    // 伪造Apple API支持
    window.ApplePaySession = {
        canMakePayments: () => true,
        canMakePaymentsWithActiveCard: () => true
    };

    if (!window.safari) window.safari = {};
    window.safari.pushNotification = { permission: () => 'default' };

    // 重写CSS渲染特征
    const originalSupports = CSS.supports;
    CSS.supports = function(property, value) {
        if (property === '-webkit-touch-callout' || property === '-webkit-overflow-scrolling') return true;
        return originalSupports.apply(this, arguments);
    };

    // 重写WebGL特征
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
        if (contextType === 'webgl' || contextType === 'experimental-webgl') {
            const context = originalGetContext.call(this, contextType, contextAttributes);
            if (context) {
                const originalGetParameter = context.getParameter;
                context.getParameter = function(pname) {
                    if (pname === context.VENDOR) return 'Apple Inc.';
                    if (pname === context.RENDERER) return 'Apple GPU';
                    return originalGetParameter.call(this, pname);
                };
                
                const originalGetExtension = context.getExtension;
                context.getExtension = function(extensionName) {
                    if (extensionName === 'WEBGL_debug_renderer_info') {
                        return { UNMASKED_VENDOR_WEBGL: 0x9245, UNMASKED_RENDERER_WEBGL: 0x9246 };
                    }
                    return originalGetExtension.call(this, extensionName);
                };
            }
            return context;
        }
        return originalGetContext.call(this, contextType, contextAttributes);
    };

    // 重写媒体特征
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = function(query) {
        if (query === '(pointer:coarse)') return { matches: true };
        if (query === '(pointer:fine)') return { matches: false };
        if (query === '(hover:hover)') return { matches: false };
        return originalMatchMedia.call(this, query);
    };

    // 重写屏幕尺寸和像素比
    Object.defineProperty(screen, 'width', { get: () => 2732 });
    Object.defineProperty(screen, 'height', { get: () => 2048 });
    Object.defineProperty(screen, 'availWidth', { get: () => 2732 });
    Object.defineProperty(screen, 'availHeight', { get: () => 2048 });
    Object.defineProperty(window, 'devicePixelRatio', { get: () => 2 });

    // 重写NFC检测
    if (!window.NDEFReader) {
        window.NDEFReader = function() {
            return { scan: () => Promise.resolve() };
        };
    }

    // 重写Web Serial/USB/HID检测
    Object.defineProperty(navigator, 'serial', { get: () => undefined });
    Object.defineProperty(navigator, 'usb', { get: () => undefined });
    Object.defineProperty(navigator, 'hid', { get: () => undefined });

    // 重写其他检测
    Object.defineProperty(navigator, 'getInstalledRelatedApps', { get: () => undefined });
    Object.defineProperty(navigator, 'standalone', { get: () => true });

    // 伪造PASSKEY/WebAuthn API
    if (!window.PublicKeyCredential) {
        window.PublicKeyCredential = function() {};
        window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = () => Promise.resolve(true);
        
        if (!navigator.credentials) navigator.credentials = {};
        navigator.credentials.create = () => Promise.resolve({
            id: 'mock-credential-id',
            type: 'public-key',
            response: { getTransports: () => ['internal'] }
        });
        
        navigator.credentials.get = () => Promise.resolve({
            id: 'mock-assertion-id',
            type: 'public-key',
            response: {
                authenticatorData: new ArrayBuffer(0),
                clientDataJSON: new ArrayBuffer(0),
                signature: new ArrayBuffer(0),
                userHandle: new ArrayBuffer(0)
            }
        });
    }

    // 伪造Client Hints API
    if (!navigator.userAgentData) {
        navigator.userAgentData = {
            mobile: false,
            platform: 'iPadOS',
            brands: [
                { brand: 'Apple Safari', version: '15' },
                { brand: 'Not;A=Brand', version: '99' }
            ],
            getHighEntropyValues: () => Promise.resolve({
                platform: 'iPadOS', // 统一为iPadOS
                platformVersion: '15.0',
                architecture: 'arm64',
                model: 'iPad13,8',
                uaFullVersion: '15.0',
                fullVersionList: [
                    { brand: 'Apple Safari', version: '15.0' },
                    { brand: 'Not;A=Brand', version: '99' }
                ]
            })
        };
    }

    // 重写高级检测函数(hcf2023专用)
    if (window.performAdvancedDetection) {
        window.performAdvancedDetection = () => Promise.resolve({
            clientHints: {
                available: true,
                fromAPI: {
                    mobile: false,
                    platform: 'iPadOS',
                    brands: [
                        { brand: 'Apple Safari', version: '15' },
                        { brand: 'Not;A=Brand', version: '99' }
                    ]
                },
                highEntropy: {
                    platform: 'iPadOS',
                    platformVersion: '15.0',
                    architecture: 'arm64',
                    model: 'iPad13,8',
                    uaFullVersion: '15.0',
                    fullVersionList: [
                        { brand: 'Apple Safari', version: '15.0' },
                        { brand: 'Not;A=Brand', version: '99' }
                    ]
                }
            },
            passkeyResult: {
                supported: true,
                platformAuthenticator: true,
                osFromCertificate: 'ipados',
                authenticatorInfo: {
                    id: 'mock-credential-id',
                    type: 'public-key',
                    transports: ['internal']
                }
            },
            finalResult: 'iPadOS',
            isTampered: false,
            isUnsupportedBrowser: false
        });
    }

    // 添加iOS特性
    if (!window.webkit) window.webkit = {};
    if (!window.webkit.messageHandlers) window.webkit.messageHandlers = {};
    
    Object.defineProperty(document, 'ontouchstart', {
        get: () => function() {},
        set: () => {}
    });

    // 页面加载完成后自检
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                console.log('Script is successfully loaded.');
                console.log('Spoofer mode: iPadOS');
            }, 1000);
        });
    } else {
        setTimeout(() => {
            console.log('Script is successfully loaded.');
            console.log('Spoofer mode: iPadOS');
        }, 100);
    }
})();
