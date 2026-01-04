// ==UserScript==
// @name         户晨风检测设备欺骗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  模拟macOS, Android, iOS, Windows, Linux,iPadOS
// @author       beiying1337
// @match        https://hcf2023.top/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550261/%E6%88%B7%E6%99%A8%E9%A3%8E%E6%A3%80%E6%B5%8B%E8%AE%BE%E5%A4%87%E6%AC%BA%E9%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/550261/%E6%88%B7%E6%99%A8%E9%A3%8E%E6%A3%80%E6%B5%8B%E8%AE%BE%E5%A4%87%E6%AC%BA%E9%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalUserAgent = navigator.userAgent;
    const originalPlatform = navigator.platform;
    const originalMaxTouchPoints = navigator.maxTouchPoints;

    // Store original properties for reset
    const originalProps = {};
    ['userAgent', 'platform', 'maxTouchPoints', 'vendor', 'product', 'appVersion', 'appName', 'cookieEnabled', 'deviceMemory', 'hardwareConcurrency', 'language', 'languages', 'onLine', 'oscpu', 'plugins', 'productSub', 'serviceWorker', 'storage', 'webdriver', 'webkitTemporaryStorage', 'webkitPersistentStorage', 'xr'].forEach(prop => {
        if (Object.getOwnPropertyDescriptor(Navigator.prototype, prop)) {
            originalProps[prop] = Object.getOwnPropertyDescriptor(Navigator.prototype, prop).get ? navigator[prop] : null;
        } else if (navigator[prop] !== undefined) {
            originalProps[prop] = navigator[prop];
        }
    });

    // Add devicePixelRatio to originalProps
    originalProps.devicePixelRatio = window.devicePixelRatio;

    // Add screen dimensions to originalProps
    originalProps.screen = {
        width: window.screen.width,
        height: window.screen.height
    };

    // Store original window properties for reset
    const originalWindowProps = {};
    ['ApplePaySession', 'safari', 'DeviceMotionEvent', 'NDEFReader'].forEach(prop => {
        if (window[prop] !== undefined) {
            originalWindowProps[prop] = window[prop];
        }
    });

    // Store original CSS.supports for reset
    const originalCSSSupports = CSS.supports;

    // Store original getContext for WebGL proxy
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    // Store original matchMedia for proxy
    const originalMatchMedia = window.matchMedia;

    let currentSimulatedDevice = localStorage.getItem('simulatedDevice') || 'reset'; // Track current simulation and load from localStorage

    const deviceConfigs = {
        'macos': {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'MacIntel',
            maxTouchPoints: 0,
            // Navigator properties
            vendor: 'Google Inc.',
            product: 'Gecko',
            appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            oscpu: 'Intel Mac OS X',
            // Window properties
            ApplePaySession: true,
            safari: { pushNotification: () => {} }, // Mock safari.pushNotification
            DeviceMotionEvent: undefined, // No requestPermission on desktop
            NDEFReader: undefined,
            // CSS.supports
            webkitTouchCallout: false,
            webkitOverflowScrolling: false,
            // WebGL
            webglVendor: 'Apple Inc.',
            webglRenderer: 'Apple GPU',
            // MatchMedia
            pointerCoarse: false,
            pointerFine: true,
            hover: true,
            // Other navigator APIs
            webSerial: true,
            webHID: true,
            webUSB: true,
            getInstalledRelatedApps: undefined, // Explicitly disable for macOS
            standalone: undefined, // Not applicable for desktop
        },
        'android': {
            userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
            platform: 'Android',
            maxTouchPoints: 5,
            vendor: 'Google Inc.',
            product: 'Gecko',
            appVersion: '5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
            appName: 'Netscape',
            oscpu: 'Linux armv8l',
            ApplePaySession: undefined,
            safari: undefined,
            DeviceMotionEvent: undefined,
            NDEFReader: class NDEFReader { constructor() { /* no-op */ } }, // Mock NDEFReader to allow instantiation
            // CSS.supports
            webkitTouchCallout: false,
            webkitOverflowScrolling: false,
            // WebGL
            webglVendor: 'Qualcomm',
            webglRenderer: 'Adreno (TM) 660',
            // MatchMedia
            pointerCoarse: true,
            pointerFine: false,
            hover: false,
            // Other navigator APIs
            webSerial: false,
            webHID: false,
            webUSB: true,
            getInstalledRelatedApps: () => Promise.resolve([]), // Mock getInstalledRelatedApps
            standalone: undefined,
        },
        'ios': {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            platform: 'iPhone',
            maxTouchPoints: 5,
            vendor: 'Apple Computer, Inc.',
            product: 'Gecko',
            appVersion: '5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            appName: 'Netscape',
            oscpu: undefined, // iOS typically doesn't have oscpu
            ApplePaySession: true,
            safari: undefined, // No pushNotification on iOS
            DeviceMotionEvent: { requestPermission: () => Promise.resolve('granted') }, // Mock requestPermission
            NDEFReader: undefined, // Explicitly disable NDEFReader for iOS
            // CSS.supports
            webkitTouchCallout: true,
            webkitOverflowScrolling: true,
            // WebGL
            webglVendor: 'Apple Inc.',
            webglRenderer: 'Apple GPU',
            // MatchMedia
            pointerCoarse: true,
            pointerFine: false,
            hover: false,
            // Other navigator APIs
            webSerial: false,
            webHID: false,
            webUSB: false,
            getInstalledRelatedApps: undefined, // Explicitly disable for iOS
            standalone: true, // PWA standalone mode
            // Add screen dimensions for iOS (e.g., iPhone 8 dimensions)
            screen: [375, 667],
        },
        'ipados': {
            userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            platform: 'MacIntel', // iPadOS 13+ reports as MacIntel
            maxTouchPoints: 5,
            vendor: 'Apple Computer, Inc.',
            product: 'Gecko',
            appVersion: '5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            appName: 'Netscape',
            oscpu: undefined, // iPadOS typically doesn't have oscpu
            ApplePaySession: true,
            safari: undefined, // No pushNotification on iPadOS
            DeviceMotionEvent: { requestPermission: () => Promise.resolve('granted') }, // Mock requestPermission
            NDEFReader: undefined, // Explicitly disable NDEFReader for iPadOS
            // CSS.supports
            webkitTouchCallout: true,
            webkitOverflowScrolling: true,
            // WebGL
            webglVendor: 'Apple Inc.',
            webglRenderer: 'Apple GPU',
            // MatchMedia
            pointerCoarse: true,
            pointerFine: false,
            hover: false,
            // Other navigator APIs
            webSerial: false,
            webHID: false,
            webUSB: false,
            getInstalledRelatedApps: undefined, // Explicitly disable for iPadOS
            standalone: true, // PWA standalone mode
            // Add screen dimensions for iPadOS (e.g., iPad 9th Gen dimensions)
            screen: [810, 1080], // Short side >= 600px
            devicePixelRatio: 1, // Set devicePixelRatio to 1 for iPadOS to ensure shortSideCSS >= 600
        },
        'windows': {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Win32',
            maxTouchPoints: 0,
            vendor: 'Google Inc.',
            product: 'Gecko',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            oscpu: 'Windows NT 10.0; Win64; x64',
            ApplePaySession: undefined,
            safari: undefined,
            DeviceMotionEvent: undefined,
            NDEFReader: undefined,
            // CSS.supports
            webkitTouchCallout: false,
            webkitOverflowScrolling: false,
            // WebGL
            webglVendor: 'Google Inc. (NVIDIA)',
            webglRenderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Direct3D11 vs_5_0 ps_5_0, D3D11)',
            // MatchMedia
            pointerCoarse: false,
            pointerFine: true,
            hover: true,
            // Other navigator APIs
            webSerial: true,
            webHID: true,
            webUSB: true,
            getInstalledRelatedApps: undefined, // Explicitly disable for Windows
            standalone: undefined,
        },
        'linux': {
            userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Linux x86_64',
            maxTouchPoints: 0,
            vendor: 'Google Inc.',
            product: 'Gecko',
            appVersion: '5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            oscpu: 'Linux x86_64',
            ApplePaySession: undefined,
            safari: undefined,
            DeviceMotionEvent: undefined,
            NDEFReader: undefined,
            // CSS.supports
            webkitTouchCallout: false,
            webkitOverflowScrolling: false,
            // WebGL
            webglVendor: 'Mesa/X.Org',
            webglRenderer: 'Mesa Intel(R) HD Graphics 630 (KBL GT2)',
            // MatchMedia
            pointerCoarse: false,
            pointerFine: true,
            hover: true,
            // Other navigator APIs
            webSerial: true,
            webHID: true,
            webUSB: true,
            getInstalledRelatedApps: undefined, // Explicitly disable for Linux
            standalone: undefined,
        },
        'reset': {
            userAgent: originalUserAgent,
            platform: originalPlatform,
            maxTouchPoints: originalMaxTouchPoints,
            // Reset other properties to their original values
            ...originalProps,
            // Reset window properties
            ApplePaySession: originalWindowProps.ApplePaySession,
            safari: originalWindowProps.safari,
            DeviceMotionEvent: originalWindowProps.DeviceMotionEvent,
            NDEFReader: originalWindowProps.NDEFReader,
            // Reset CSS.supports
            webkitTouchCallout: originalCSSSupports?.('-webkit-touch-callout','none') || false,
            webkitOverflowScrolling: originalCSSSupports?.('-webkit-overflow-scrolling','touch') || false,
            // WebGL will be reset by restoring originalGetContext
            webglVendor: null, // Indicate no specific override
            webglRenderer: null, // Indicate no specific override
            // MatchMedia will be reset by restoring originalMatchMedia
            pointerCoarse: null,
            pointerFine: null,
            hover: null,
            // Reset other navigator APIs
            webSerial: 'serial' in navigator,
            webHID: 'hid' in navigator,
            webUSB: 'usb' in navigator,
            getInstalledRelatedApps: 'getInstalledRelatedApps' in navigator ? navigator.getInstalledRelatedApps : undefined,
            standalone: 'standalone' in navigator ? navigator.standalone : undefined,
        }
    };

    function applyNavigatorProperty(prop, value) {
        if (value !== undefined) {
            Object.defineProperty(navigator, prop, {
                value: value,
                writable: true,
                configurable: true
            });
        } else {
            // If value is undefined, try to delete the property or reset to original
            // If value is undefined, explicitly delete the property or set it to undefined
            try {
                delete navigator[prop];
            } catch (e) {
                // If deletion fails (e.g., non-configurable property), set to undefined
                Object.defineProperty(navigator, prop, {
                    value: undefined,
                    writable: true,
                    configurable: true
                });
            }
        }
    }

    function applyWindowProperty(prop, value) {
        if (value !== undefined) {
            window[prop] = value;
        } else {
            if (originalWindowProps[prop] !== undefined) {
                window[prop] = originalWindowProps[prop];
            } else {
                try {
                    delete window[prop];
                } catch (e) {
                    // Cannot delete some native properties
                }
            }
        }
    }

    function applyCSSSupports(config) {
        // Temporarily override CSS.supports for specific checks
        CSS.supports = function(property, value) {
            if (property === '-webkit-touch-callout' && value === 'none') {
                return config.webkitTouchCallout;
            }
            if (property === '-webkit-overflow-scrolling' && value === 'touch') {
                return config.webkitOverflowScrolling;
            }
            return originalCSSSupports.apply(this, arguments);
        };
    }

    function resetCSSSupports() {
        CSS.supports = originalCSSSupports;
    }

    function proxyWebGL(config) {
        HTMLCanvasElement.prototype.getContext = function(type, contextAttributes) {
            if (type === 'webgl' || type === 'experimental-webgl') {
                const gl = originalGetContext.call(this, type, contextAttributes);
                if (gl) {
                    const originalGetParameter = gl.getParameter;
                    gl.getParameter = function(name) {
                        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                        if (debugInfo && name === debugInfo.UNMASKED_VENDOR_WEBGL) {
                            return config.webglVendor || originalGetParameter.call(this, name);
                        }
                        if (debugInfo && name === debugInfo.UNMASKED_RENDERER_WEBGL) {
                            return config.webglRenderer || originalGetParameter.call(this, name);
                        }
                        if (name === gl.VENDOR) {
                            return config.webglVendor || originalGetParameter.call(this, name);
                        }
                        if (name === gl.RENDERER) {
                            return config.webglRenderer || originalGetParameter.call(this, name);
                        }
                        return originalGetParameter.call(this, name);
                    };
                }
                return gl;
            }
            return originalGetContext.call(this, type, contextAttributes);
        };
    }

    function resetWebGLProxy() {
        HTMLCanvasElement.prototype.getContext = originalGetContext;
    }

    function proxyMatchMedia(config) {
        window.matchMedia = function(query) {
            const mockMediaQueryList = {
                matches: false,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => true,
            };

            if (query === '(pointer:coarse)') {
                mockMediaQueryList.matches = config.pointerCoarse;
            } else if (query === '(pointer:fine)') {
                mockMediaQueryList.matches = config.pointerFine;
            } else if (query === '(hover:hover)') {
                mockMediaQueryList.matches = config.hover;
            }
            // Add other media queries if needed
            return mockMediaQueryList;
        };
    }

    function resetMatchMediaProxy() {
        window.matchMedia = originalMatchMedia;
    }

    function setDevice(deviceType) { // Removed reloadPage parameter
        const previousSimulatedDevice = localStorage.getItem('simulatedDevice') || 'reset';
        currentSimulatedDevice = deviceType;
        localStorage.setItem('simulatedDevice', deviceType); // Store selected device

        const config = deviceConfigs[deviceType];

        if (config) {
            // Apply navigator properties
            for (const prop in originalProps) { // Reset all original props first
                applyNavigatorProperty(prop, originalProps[prop]);
            }

            // Special handling for getInstalledRelatedApps
            if (deviceType === 'android') {
                Object.defineProperty(navigator, 'getInstalledRelatedApps', {
                    value: config.getInstalledRelatedApps, // This should be the mock function
                    writable: true,
                    configurable: true
                });
            } else {
                Object.defineProperty(navigator, 'getInstalledRelatedApps', {
                    value: undefined,
                    writable: true,
                    configurable: true
                });
            }

            // Apply other navigator properties, excluding getInstalledRelatedApps as it's handled
            for (const prop in config) { // Then apply specific config props
                if (prop !== 'getInstalledRelatedApps' && ['userAgent', 'platform', 'maxTouchPoints', 'vendor', 'product', 'appVersion', 'appName', 'oscpu', 'webSerial', 'webHID', 'webUSB', 'standalone'].includes(prop)) {
                    applyNavigatorProperty(prop, config[prop]);
                }
            }

            // Apply window properties
            for (const prop in originalWindowProps) { // Reset all original window props first
                applyWindowProperty(prop, originalWindowProps[prop]);
            }
            applyWindowProperty('ApplePaySession', config.ApplePaySession);
            applyWindowProperty('safari', config.safari);
            applyWindowProperty('DeviceMotionEvent', config.DeviceMotionEvent);
            applyWindowProperty('NDEFReader', config.NDEFReader);

            // Apply CSS.supports overrides
            resetCSSSupports(); // Reset first
            applyCSSSupports(config);

            // Apply WebGL proxy
            resetWebGLProxy(); // Reset first
            proxyWebGL(config);

            // Apply MatchMedia proxy
            resetMatchMediaProxy(); // Reset first
            proxyMatchMedia(config);

            // Apply screen dimensions
            if (config.screen) {
                Object.defineProperty(window.screen, 'width', {
                    value: config.screen[0],
                    writable: true,
                    configurable: true
                });
                Object.defineProperty(window.screen, 'height', {
                    value: config.screen[1],
                    writable: true,
                    configurable: true
                });
            } else {
                // Reset screen dimensions to original if not specified in config
                Object.defineProperty(window.screen, 'width', {
                    value: originalProps.screen.width,
                    writable: true,
                    configurable: true
                });
                Object.defineProperty(window.screen, 'height', {
                    value: originalProps.screen.height,
                    writable: true,
                    configurable: true
                });
            }

            // Apply devicePixelRatio
            if (config.devicePixelRatio !== undefined) {
                Object.defineProperty(window, 'devicePixelRatio', {
                    value: config.devicePixelRatio,
                    writable: true,
                    configurable: true
                });
            } else {
                // Reset devicePixelRatio to original
                Object.defineProperty(window, 'devicePixelRatio', {
                    value: originalProps.devicePixelRatio,
                    writable: true,
                    configurable: true
                });
            }

            console.log(`Device simulated as: ${deviceType}`);
            console.log(`New User Agent: ${navigator.userAgent}`);
            console.log(`New Platform: ${navigator.platform}`);
            console.log(`New Max Touch Points: ${navigator.maxTouchPoints}`);
            console.log(`New WebGL Vendor: ${config.webglVendor}`);
            console.log(`New WebGL Renderer: ${config.webglRenderer}`);
            console.log(`New MatchMedia (pointer:coarse): ${window.matchMedia('(pointer:coarse)').matches}`);
            console.log(`New MatchMedia (pointer:fine): ${window.matchMedia('(pointer:fine)').matches}`);
            console.log(`New MatchMedia (hover:hover): ${window.matchMedia('(hover:hover)').matches}`);
            console.log(`New Screen Width: ${window.screen.width}`);
            console.log(`New Screen Height: ${window.screen.height}`);
            console.log(`New Device Pixel Ratio: ${window.devicePixelRatio}`);


            // Re-run detection logic
            if (window.detect) {
                window.detect();
            }
        } else if (deviceType === 'reset') {
            // Reset all properties to original
            for (const prop in originalProps) {
                applyNavigatorProperty(prop, originalProps[prop]);
            }
            for (const prop in originalWindowProps) {
                applyWindowProperty(prop, originalWindowProps[prop]);
            }
            resetCSSSupports();
            resetWebGLProxy();
            resetMatchMediaProxy(); // Reset matchMedia

            // Reset screen dimensions
            Object.defineProperty(window.screen, 'width', {
                value: originalProps.screen.width,
                writable: true,
                configurable: true
            });
            Object.defineProperty(window.screen, 'height', {
                value: originalProps.screen.height,
                writable: true,
                configurable: true
            });

            // Reset devicePixelRatio
            Object.defineProperty(window, 'devicePixelRatio', {
                value: originalProps.devicePixelRatio,
                writable: true,
                configurable: true
            });

            console.log('Device simulation reset to original.');
            localStorage.removeItem('simulatedDevice'); // Clear stored device

            // Re-run detection logic
            if (window.detect) {
                window.detect();
            }
        }
    }

    function createUI() {
        const uiContainer = document.createElement('div');
        uiContainer.id = 'device-simulator-ui';
        uiContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 8px;
            font-family: sans-serif;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        const title = document.createElement('div');
        title.textContent = '模拟设备';
        title.style.fontWeight = 'bold';
        uiContainer.appendChild(title);

        const select = document.createElement('select');
        select.style.cssText = `
            padding: 5px;
            border-radius: 4px;
            border: 1px solid #555;
            background: #333;
            color: white;
            margin-bottom: 5px; /* Add some space below the select */
        `;

        const options = [
            { value: 'reset', text: '原始设备' },
            { value: 'macos', text: 'macOS' },
            { value: 'android', text: 'Android' },
            { value: 'ios', text: 'iOS' },
            { value: 'ipados', text: 'iPadOS' },
            { value: 'windows', text: 'Windows' },
            { value: 'linux', text: 'Linux' }
        ];

        options.forEach(optData => {
            const option = document.createElement('option');
            option.value = optData.value;
            option.textContent = optData.text;
            select.appendChild(option);
        });

        select.addEventListener('change', (event) => {
            setDevice(event.target.value);
            location.reload(); // Reload only when user explicitly changes device
        });

        uiContainer.appendChild(select);
        document.body.appendChild(uiContainer);

        // Set the initial selected value based on localStorage
        select.value = currentSimulatedDevice;

        // Add "屏蔽毒蘑菇" checkbox
        const mushroomToggleContainer = document.createElement('div');
        mushroomToggleContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        const mushroomCheckbox = document.createElement('input');
        mushroomCheckbox.type = 'checkbox';
        mushroomCheckbox.id = 'block-mushroom-toggle';
        mushroomCheckbox.style.cssText = `
            margin: 0;
        `;
        const mushroomLabel = document.createElement('label');
        mushroomLabel.htmlFor = 'block-mushroom-toggle';
        mushroomLabel.textContent = '屏蔽毒蘑菇 (WebGL)';
        mushroomLabel.style.fontSize = '12px';
        mushroomToggleContainer.appendChild(mushroomCheckbox);
        mushroomToggleContainer.appendChild(mushroomLabel);
        uiContainer.appendChild(mushroomToggleContainer);

        mushroomCheckbox.addEventListener('change', (event) => {
            if (window.toggleCanvas) {
                window.toggleCanvas(!event.target.checked); // checked means block, so enable = !checked
            } else {
                console.warn('window.toggleCanvas is not available yet.');
            }
        });

        // Set initial state of the checkbox based on current canvas status
        const updateMushroomCheckbox = () => {
            if (window.getCanvasStatus) {
                mushroomCheckbox.checked = window.getCanvasStatus().disabled;
            } else {
                // Default to unchecked (canvas enabled) if status not available
                mushroomCheckbox.checked = false;
            }
        };

        // Update checkbox state after UI creation and after setDevice
        updateMushroomCheckbox();
        window.addEventListener('load', updateMushroomCheckbox); // Ensure it's updated after script.js loads

    }

    // Apply the stored device simulation immediately on script load
    setDevice(currentSimulatedDevice);

    // Ensure the mushroom checkbox is updated after setDevice applies initial canvas state
    window.addEventListener('load', () => {
        if (window.getCanvasStatus) {
            const mushroomCheckbox = document.getElementById('block-mushroom-toggle');
            if (mushroomCheckbox) {
                mushroomCheckbox.checked = window.getCanvasStatus().disabled;
            }
        }
    });

    // In page load完成后创建UI
    window.addEventListener('load', createUI);

    // 确保在插件加载时，如果页面已经加载，UI也能被创建
    if (document.readyState === 'complete') {
        createUI();
    }
})();
