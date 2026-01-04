// ==UserScript==
// @name         WEB EDIT v4.4.0 MEGA ULTIMATE
// @namespace    https://greasyfork.org/ru/scripts/558929-web-edit-v4-1-2-ultimate-full-power/versions
// @version      4.3.0
// @description  Ultimate web editor: HTTP Control, Quick Mode, Anti-AdBlock 2.0, Workspace Access, Nuke Site, 200+ features
// @author       H7S, boberBhrigu
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @copyright    2025 H7S, boberBhrigu
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558929/WEB%20EDIT%20v440%20MEGA%20ULTIMATE.user.js
// @updateURL https://update.greasyfork.org/scripts/558929/WEB%20EDIT%20v440%20MEGA%20ULTIMATE.meta.js
// ==/UserScript==

/*
 * ═══════════════════════════════════════════════════════════════
 * WEB EDIT v4.4.0 MEGA ULTIMATE
 * ═══════════════════════════════════════════════════════════════
 *
 * CHANGELOG v4.4.0:
 * + Fixed Anti-Redirect (menu stays open)
 * + HTTP Request Control (block, modify, repeat)
 * + Quick Mode for CSS/JS/HTML (instant apply)
 * + Import/Export (JSON, ZIP, HTML, CSS, JS)
 * + FPS Limiter (30/60/120/unlimited)
 * + Fixed language switching
 * + Danger Zone: Menu Delete, Nuke Site, Script Loader
 * + Anti-AdBlock 2.0 (advanced bypass)
 * + Workspace Access (DevTools Protocol)
 * + 50+ new features
 *
 * TOTAL: 200+ features
 * ═══════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    const VERSION = '4.4.0';
    const DEBUG = false;

    const state = {
        isOpen: false,
        currentTab: 'home',
        language: localStorage.getItem('webedit_lang') || 'en',
        theme: localStorage.getItem('webedit_theme') || 'dark',
        selectedElement: null,
        elementEditMode: false,
        quickEditMode: false,
        quickModeCSS: localStorage.getItem('webedit_quickcss') === 'true',
        quickModeJS: localStorage.getItem('webedit_quickjs') === 'true',
        quickModeHTML: localStorage.getItem('webedit_quickhtml') === 'true',
        stealthMode: localStorage.getItem('webedit_stealth') === 'true',
        antiReload: localStorage.getItem('webedit_antireload') === 'true',
        antiRedirect: localStorage.getItem('webedit_antiredirect') === 'true',
        antiBot: localStorage.getItem('webedit_antibot') === 'true',
        antiAdBlock: localStorage.getItem('webedit_antiadblock') === 'true',
        showFPS: localStorage.getItem('webedit_showfps') === 'true',
        fpsLimit: parseInt(localStorage.getItem('webedit_fpslimit')) || 60,
        httpRequests: [],
        blockedRequests: [],
        customCSS: localStorage.getItem('webedit_customcss') || '',
        customJS: localStorage.getItem('webedit_customjs') || '',
        loadedScripts: [],
        changes: [],
        history: [],
        hotkeys: {}
    };

    const defaultHotkeys = {
        toggle: 'F2',
        quickEdit: 'F3',
        elementEdit: 'F4',
        stealth: 'Alt+S',
        darkTheme: 'Alt+D',
        export: 'Ctrl+E',
        nuke: 'Ctrl+Shift+Delete'
    };

    try {
        const savedHotkeys = localStorage.getItem('webedit_hotkeys');
        state.hotkeys = savedHotkeys ? JSON.parse(savedHotkeys) : {...defaultHotkeys};
    } catch (e) {
        state.hotkeys = {...defaultHotkeys};
    }

    // ═══════════════════════════════════════════════════════════
    // TRANSLATIONS
    // ═══════════════════════════════════════════════════════════

    const translations = {
        en: {
            appName: 'WEB EDIT',
            home: 'Home',
            textEditor: 'Text',
            elementEdit: 'Element',
            cssEditor: 'CSS',
            jsEditor: 'JS',
            htmlEditor: 'HTML',
            httpControl: 'HTTP',
            devTools: 'Tools',
            importExport: 'I/O',
            settings: 'Settings',
            dangerZone: 'Danger',
            apply: 'Apply',
            close: 'Close',
            enabled: 'ON',
            disabled: 'OFF',
            quickMode: 'Quick Mode',
            blockRequest: 'Block',
            modifyRequest: 'Modify',
            repeatRequest: 'Repeat',
            menuDelete: 'Delete Menu',
            nukeSite: 'Nuke Site',
            loadScript: 'Load Script',
            antiAdBlock: 'Anti-AdBlock 2.0',
            workspaceAccess: 'Workspace'
        },
        ru: {
            appName: 'WEB EDIT',
            home: 'Главная',
            textEditor: 'Текст',
            elementEdit: 'Элемент',
            cssEditor: 'CSS',
            jsEditor: 'JS',
            htmlEditor: 'HTML',
            httpControl: 'HTTP',
            devTools: 'Инструменты',
            importExport: 'Импорт',
            settings: 'Настройки',
            dangerZone: 'Опасно',
            apply: 'Применить',
            close: 'Закрыть',
            enabled: 'ВКЛ',
            disabled: 'ВЫКЛ',
            quickMode: 'Быстрый режим',
            blockRequest: 'Блокировать',
            modifyRequest: 'Изменить',
            repeatRequest: 'Повторить',
            menuDelete: 'Удалить меню',
            nukeSite: 'Уничтожить сайт',
            loadScript: 'Загрузить скрипт',
            antiAdBlock: 'Анти-АдБлок 2.0',
            workspaceAccess: 'Рабочее пространство'
        }
    };

    function t(key) {
        if (!translations || !state || !state.language || !translations[state.language]) {
            return key;
        }
        return translations[state.language][key] || key;
    }

    // ═══════════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════

    function devLog(...args) {
        if (DEBUG && !state.stealthMode) {
            console.log('[WEB EDIT]', ...args);
        }
    }

    function showNotification(message, type = 'success') {
        if (state.stealthMode) return;

        const notification = document.createElement('div');
        notification.className = 'we-notification';
        notification.textContent = message;
        notification.style.cssText = `position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:1000000000;opacity:0;transform:translateY(20px);transition:all 0.3s;font-family:Arial,sans-serif;font-size:14px;font-weight:500;`;

        if (type === 'success') notification.style.background = '#4caf50';
        if (type === 'error') notification.style.background = '#f44336';
        if (type === 'warning') notification.style.background = '#ff9800';
        if (type === 'info') notification.style.background = '#2196f3';

        notification.style.color = '#fff';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function saveToStorage(key, value) {
        try {
            localStorage.setItem('webedit_' + key, JSON.stringify(value));
        } catch (e) {
            console.error('Storage error:', e);
        }
    }

    function loadFromStorage(key, defaultValue = null) {
        try {
            const value = localStorage.getItem('webedit_' + key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    // ═══════════════════════════════════════════════════════════
    // ANTI-REDIRECT SYSTEM (FIXED)
    // ═══════════════════════════════════════════════════════════

    function initAntiRedirect() {
        if (!state.antiRedirect) return;

        // Intercept link clicks
        document.addEventListener('click', function(e) {
            if (!state.antiRedirect) return;

            const link = e.target.closest('a');
            if (link && link.href && !link.closest('#webEditContainer')) {
                e.preventDefault();
                e.stopPropagation();
                showNotification('Link blocked: ' + link.href.substring(0, 50), 'warning');
                return false;
            }
        }, true);

        // Block form submissions
        document.addEventListener('submit', function(e) {
            if (!state.antiRedirect) return;
            if (!e.target.closest('#webEditContainer')) {
                e.preventDefault();
                showNotification('Form submission blocked!', 'warning');
                return false;
            }
        }, true);

        // Intercept window.location changes
        let locationChanging = false;
        const originalLocation = window.location;

        Object.defineProperty(window, 'location', {
            get: function() {
                return originalLocation;
            },
            set: function(value) {
                if (!state.antiRedirect || locationChanging) {
                    locationChanging = false;
                    originalLocation.href = value;
                } else {
                    devLog('Blocked redirect to:', value);
                    showNotification('Redirect blocked!', 'warning');
                }
                return true;
            }
        });

        // Block window.open
        const originalOpen = window.open;
        window.open = function(...args) {
            if (state.antiRedirect) {
                showNotification('Popup blocked!', 'warning');
                return null;
            }
            return originalOpen.apply(this, args);
        };

        devLog('Anti-Redirect system initialized (FIXED)');
    }

    // ═══════════════════════════════════════════════════════════
    // ANTI-BOT CHECK SYSTEM
    // ═══════════════════════════════════════════════════════════

    function initAntiBot() {
        if (!state.antiBot) return;

        // Spoof navigator properties
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false
        });

        Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3, 4, 5]
        });

        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en']
        });

        // Remove automation indicators
        delete window.navigator.__proto__.webdriver;

        // Override Chrome detection
        window.chrome = {
            runtime: {},
            loadTimes: function() {},
            csi: function() {},
            app: {}
        };

        // Spoof permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );

        devLog('Anti-Bot system initialized');
    }

    // ═══════════════════════════════════════════════════════════
    // ANTI-ADBLOCK 2.0
    // ═══════════════════════════════════════════════════════════

    function initAntiAdBlock() {
        if (!state.antiAdBlock) return;

        // Prevent adblock detection
        Object.defineProperty(window, 'canRunAds', {
            get: () => true
        });

        Object.defineProperty(window, 'isAdBlockActive', {
            get: () => false
        });

        // Fake ad elements
        const fakeAd = document.createElement('div');
        fakeAd.className = 'ad ads advertisement';
        fakeAd.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
        document.body.appendChild(fakeAd);

        // Override common adblock checks
        window.adsbygoogle = window.adsbygoogle || [];
        window._gaq = window._gaq || [];
        window.ga = window.ga || function() {};

        devLog('Anti-AdBlock 2.0 initialized');
        showNotification('Anti-AdBlock 2.0 active!', 'info');
    }

  // ═══════════════════════════════════════════════════════════
    // FPS COUNTER WITH LIMITER
    // ═══════════════════════════════════════════════════════════

    let fpsCounter = null;
    let fpsElement = null;
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let currentFPS = 0;

    function initFPSCounter() {
        if (!state.showFPS) return;
        if (fpsElement) return;

        fpsElement = document.createElement('div');
        fpsElement.id = 'weFPSCounter';
        fpsElement.style.cssText = 'position:fixed;top:10px;left:10px;background:rgba(0,0,0,0.8);color:#0f0;padding:8px 12px;border-radius:6px;font-family:monospace;font-size:14px;z-index:999999999;cursor:move;user-select:none;';
        fpsElement.innerHTML = '<div>FPS: <span id="fpsValue">0</span></div><div style="font-size:10px;color:#888;">Limit: ' + (state.fpsLimit === 0 ? 'Unlimited' : state.fpsLimit) + '</div>';
        document.body.appendChild(fpsElement);

        // Make draggable
        makeDraggable(fpsElement);

        function updateFPS(timestamp) {
            frameCount++;
            const elapsed = timestamp - lastFrameTime;

            if (elapsed >= 1000) {
                currentFPS = Math.round((frameCount * 1000) / elapsed);
                const fpsValueEl = document.getElementById('fpsValue');
                if (fpsValueEl) {
                    fpsValueEl.textContent = currentFPS;
                    fpsValueEl.parentElement.style.color = currentFPS >= 50 ? '#0f0' : currentFPS >= 30 ? '#ff0' : '#f00';
                }
                frameCount = 0;
                lastFrameTime = timestamp;
            }

            // FPS Limiter
            if (state.fpsLimit > 0) {
                const targetFrameTime = 1000 / state.fpsLimit;
                const nextFrameTime = lastFrameTime + targetFrameTime;
                const delay = Math.max(0, nextFrameTime - timestamp);
                setTimeout(() => requestAnimationFrame(updateFPS), delay);
            } else {
                requestAnimationFrame(updateFPS);
            }
        }

        updateFPS(performance.now());
        devLog('FPS Counter initialized with limit:', state.fpsLimit);
    }

    function removeFPSCounter() {
        if (fpsElement) {
            fpsElement.remove();
            fpsElement = null;
        }
    }

    function setFPSLimit(limit) {
        state.fpsLimit = limit;
        saveToStorage('fpslimit', limit);
        if (fpsElement) {
            removeFPSCounter();
            initFPSCounter();
        }
        showNotification('FPS limit set to: ' + (limit === 0 ? 'Unlimited' : limit));
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // ═══════════════════════════════════════════════════════════
    // HTTP REQUEST INTERCEPTOR & CONTROL
    // ═══════════════════════════════════════════════════════════

    const blockedURLs = new Set();
    const modifiedRequests = new Map();

    function initHTTPInterceptor() {
        const originalFetch = window.fetch;
        const originalXHR = window.XMLHttpRequest;

        // Intercept Fetch API
        window.fetch = function(...args) {
            const url = args[0];
            const options = args[1] || {};
            const method = options.method || 'GET';

            // Check if URL is blocked
            for (const blockedURL of blockedURLs) {
                if (url.toString().includes(blockedURL)) {
                    devLog('Blocked fetch request:', url);
                    showNotification('Request blocked: ' + url.toString().substring(0, 30), 'warning');
                    return Promise.reject(new Error('Request blocked by WEB EDIT'));
                }
            }

            // Check if request needs modification
            const modKey = url.toString();
            if (modifiedRequests.has(modKey)) {
                const modification = modifiedRequests.get(modKey);
                if (modification.headers) {
                    options.headers = { ...options.headers, ...modification.headers };
                }
                if (modification.method) {
                    options.method = modification.method;
                }
                devLog('Modified request:', url, modification);
            }

            const requestData = {
                id: Date.now() + Math.random(),
                timestamp: new Date().toLocaleTimeString(),
                method: method,
                url: url.toString(),
                type: 'fetch',
                status: 'pending',
                headers: options.headers || {},
                body: options.body || null
            };

            state.httpRequests.unshift(requestData);
            if (state.httpRequests.length > 200) state.httpRequests.pop();

            return originalFetch.apply(this, args)
                .then(response => {
                    requestData.status = response.status;
                    requestData.statusText = response.statusText;
                    return response;
                })
                .catch(error => {
                    requestData.status = 'error';
                    requestData.error = error.message;
                    throw error;
                });
        };

        // Intercept XMLHttpRequest
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;

            let requestData = {
                id: Date.now() + Math.random(),
                timestamp: new Date().toLocaleTimeString(),
                method: '',
                url: '',
                type: 'xhr',
                status: 'pending',
                headers: {},
                body: null
            };

            xhr.open = function(method, url) {
                requestData.method = method;
                requestData.url = url;

                // Check if URL is blocked
                for (const blockedURL of blockedURLs) {
                    if (url.includes(blockedURL)) {
                        devLog('Blocked XHR request:', url);
                        showNotification('Request blocked: ' + url.substring(0, 30), 'warning');
                        return;
                    }
                }

                state.httpRequests.unshift(requestData);
                if (state.httpRequests.length > 200) state.httpRequests.pop();

                return originalOpen.apply(this, arguments);
            };

            xhr.send = function(body) {
                requestData.body = body;

                xhr.addEventListener('load', function() {
                    requestData.status = xhr.status;
                    requestData.statusText = xhr.statusText;
                    requestData.response = xhr.responseText;
                });

                xhr.addEventListener('error', function() {
                    requestData.status = 'error';
                    requestData.error = 'Network error';
                });

                return originalSend.apply(this, arguments);
            };

            return xhr;
        };

        window.XMLHttpRequest.prototype = originalXHR.prototype;
        devLog('HTTP Interceptor initialized with control');
    }

    function blockURL(url) {
        blockedURLs.add(url);
        state.blockedRequests.push(url);
        saveToStorage('blockedurls', Array.from(blockedURLs));
        showNotification('URL blocked: ' + url.substring(0, 30));
        devLog('Blocked URL:', url);
    }

    function unblockURL(url) {
        blockedURLs.delete(url);
        state.blockedRequests = state.blockedRequests.filter(u => u !== url);
        saveToStorage('blockedurls', Array.from(blockedURLs));
        showNotification('URL unblocked: ' + url.substring(0, 30));
    }

    function modifyRequest(url, modifications) {
        modifiedRequests.set(url, modifications);
        showNotification('Request modifier added for: ' + url.substring(0, 30));
        devLog('Modified request:', url, modifications);
    }

    function repeatRequest(requestData) {
        if (requestData.type === 'fetch') {
            const options = {
                method: requestData.method,
                headers: requestData.headers,
                body: requestData.body
            };
            fetch(requestData.url, options)
                .then(() => showNotification('Request repeated successfully!'))
                .catch(err => showNotification('Request failed: ' + err.message, 'error'));
        } else if (requestData.type === 'xhr') {
            const xhr = new XMLHttpRequest();
            xhr.open(requestData.method, requestData.url);
            xhr.onload = () => showNotification('Request repeated successfully!');
            xhr.onerror = () => showNotification('Request failed!', 'error');
            xhr.send(requestData.body);
        }
        devLog('Repeated request:', requestData);
    }

    function clearAllRequests() {
        state.httpRequests = [];
        showNotification('All requests cleared!');
    }

    function exportRequests() {
        const data = {
            timestamp: new Date().toISOString(),
            requests: state.httpRequests,
            blocked: state.blockedRequests
        };
        downloadJSON(data, 'webedit-requests-' + Date.now() + '.json');
        showNotification('Requests exported!');
    }

    // ═══════════════════════════════════════════════════════════
    // CSS EDITOR WITH QUICK MODE
    // ═══════════════════════════════════════════════════════════

    let customStyleElement = null;
    let cssWatcher = null;

    function applyCSSCode(css) {
        if (!customStyleElement) {
            customStyleElement = document.createElement('style');
            customStyleElement.id = 'weCustomCSS';
            document.head.appendChild(customStyleElement);
        }

        customStyleElement.textContent = css;
        state.customCSS = css;
        saveToStorage('customcss', css);
        showNotification('CSS applied!');
        devLog('CSS applied:', css.length, 'characters');
    }

    function clearCustomCSS() {
        if (customStyleElement) {
            customStyleElement.textContent = '';
        }
        state.customCSS = '';
        saveToStorage('customcss', '');
        showNotification('CSS cleared!');
    }

    function enableQuickModeCSS() {
        state.quickModeCSS = true;
        saveToStorage('quickcss', true);

        // Watch for changes
        const textarea = document.getElementById('cssCode');
        if (textarea) {
            if (cssWatcher) clearTimeout(cssWatcher);
            textarea.addEventListener('input', function() {
                clearTimeout(cssWatcher);
                cssWatcher = setTimeout(() => {
                    applyCSSCode(this.value);
                }, 500);
            });
            showNotification('CSS Quick Mode: Auto-apply enabled!', 'info');
        }
    }

    function disableQuickModeCSS() {
        state.quickModeCSS = false;
        saveToStorage('quickcss', false);
        if (cssWatcher) clearTimeout(cssWatcher);
        showNotification('CSS Quick Mode disabled');
    }

    // ═══════════════════════════════════════════════════════════
    // JS EDITOR WITH QUICK MODE
    // ═══════════════════════════════════════════════════════════

    let jsWatcher = null;

    function executeJSCode(code) {
        try {
            const result = eval(code);
            state.customJS = code;
            saveToStorage('customjs', code);
            showNotification('JS executed successfully!');
            devLog('JS executed:', result);
            return result;
        } catch (error) {
            showNotification('JS Error: ' + error.message, 'error');
            console.error('JS execution error:', error);
            return null;
        }
    }

    function enableQuickModeJS() {
        state.quickModeJS = true;
        saveToStorage('quickjs', true);

        const textarea = document.getElementById('jsCode');
        if (textarea) {
            if (jsWatcher) clearTimeout(jsWatcher);
            textarea.addEventListener('input', function() {
                clearTimeout(jsWatcher);
                jsWatcher = setTimeout(() => {
                    executeJSCode(this.value);
                }, 1000);
            });
            showNotification('JS Quick Mode: Auto-execute enabled!', 'info');
        }
    }

    function disableQuickModeJS() {
        state.quickModeJS = false;
        saveToStorage('quickjs', false);
        if (jsWatcher) clearTimeout(jsWatcher);
        showNotification('JS Quick Mode disabled');
    }

    // ═══════════════════════════════════════════════════════════
    // HTML EDITOR WITH QUICK MODE
    // ═══════════════════════════════════════════════════════════

    let htmlWatcher = null;

    function applyHTMLCode(html, target = 'body') {
        try {
            const element = document.querySelector(target);
            if (element && !element.closest('#webEditContainer')) {
                element.innerHTML = html;
                showNotification('HTML applied to ' + target);
                devLog('HTML applied to:', target);
            } else {
                showNotification('Target not found: ' + target, 'error');
            }
        } catch (error) {
            showNotification('HTML Error: ' + error.message, 'error');
            console.error('HTML application error:', error);
        }
    }

    function enableQuickModeHTML() {
        state.quickModeHTML = true;
        saveToStorage('quickhtml', true);

        const textarea = document.getElementById('htmlCode');
        const targetInput = document.getElementById('htmlTarget');
        if (textarea && targetInput) {
            if (htmlWatcher) clearTimeout(htmlWatcher);
            textarea.addEventListener('input', function() {
                clearTimeout(htmlWatcher);
                htmlWatcher = setTimeout(() => {
                    applyHTMLCode(this.value, targetInput.value);
                }, 1000);
            });
            showNotification('HTML Quick Mode: Auto-apply enabled!', 'info');
        }
    }

    function disableQuickModeHTML() {
        state.quickModeHTML = false;
        saveToStorage('quickhtml', false);
        if (htmlWatcher) clearTimeout(htmlWatcher);
        showNotification('HTML Quick Mode disabled');
    }

    // ═══════════════════════════════════════════════════════════
    // SCRIPT LOADER
    // ═══════════════════════════════════════════════════════════

    function loadExternalScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => {
                state.loadedScripts.push(url);
                showNotification('Script loaded: ' + url.substring(url.lastIndexOf('/') + 1));
                devLog('Loaded script:', url);
                resolve();
            };
            script.onerror = () => {
                showNotification('Failed to load: ' + url, 'error');
                reject(new Error('Failed to load script'));
            };
            document.head.appendChild(script);
        });
    }

    function loadScriptFromText(code, name = 'Custom Script') {
        try {
            const script = document.createElement('script');
            script.textContent = code;
            script.setAttribute('data-webedit-script', name);
            document.head.appendChild(script);
            state.loadedScripts.push(name);
            showNotification('Script loaded: ' + name);
            devLog('Loaded custom script:', name);
        } catch (error) {
            showNotification('Script Error: ' + error.message, 'error');
        }
    }

    function loadPopularLibrary(library) {
        const libraries = {
            jquery: 'https://code.jquery.com/jquery-3.6.0.min.js',
            lodash: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
            axios: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
            moment: 'https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js',
            chart: 'https://cdn.jsdelivr.net/npm/chart.js',
            three: 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.min.js',
            gsap: 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js',
            bootstrap: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
            vue: 'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js',
            react: 'https://unpkg.com/react@18/umd/react.production.min.js'
        };

        if (libraries[library]) {
            loadExternalScript(libraries[library]);
        } else {
            showNotification('Library not found: ' + library, 'error');
        }
    }

    // ═══════════════════════════════════════════════════════════
    // IMPORT/EXPORT SYSTEM
    // ═══════════════════════════════════════════════════════════

    function exportAll() {
        const data = {
            version: VERSION,
            timestamp: Date.now(),
            url: window.location.href,
            customCSS: state.customCSS,
            customJS: state.customJS,
            httpRequests: state.httpRequests,
            blockedURLs: state.blockedRequests,
            loadedScripts: state.loadedScripts,
            settings: {
                language: state.language,
                stealthMode: state.stealthMode,
                antiReload: state.antiReload,
                antiRedirect: state.antiRedirect,
                antiBot: state.antiBot,
                antiAdBlock: state.antiAdBlock,
                showFPS: state.showFPS,
                fpsLimit: state.fpsLimit,
                quickModeCSS: state.quickModeCSS,
                quickModeJS: state.quickModeJS,
                quickModeHTML: state.quickModeHTML
            },
            modifications: []
        };

        document.querySelectorAll('[data-webedit-modified]').forEach(el => {
            const selector = el.getAttribute('data-webedit-selector');
            data.modifications.push({
                selector: selector,
                style: el.getAttribute('style'),
                html: el.innerHTML.substring(0, 500)
            });
        });

        downloadJSON(data, 'webedit-export-' + Date.now() + '.json');
        showNotification('Full export completed!');
    }

    function exportCSS() {
        let css = '/* WEB EDIT CSS Export */\n/* Generated: ' + new Date().toLocaleString() + ' */\n\n';
        css += state.customCSS || '/* No custom CSS */';

        downloadText(css, 'webedit-styles-' + Date.now() + '.css');
        showNotification('CSS exported!');
    }

    function exportJS() {
        let js = '// WEB EDIT JS Export\n// Generated: ' + new Date().toLocaleString() + '\n\n';
        js += state.customJS || '// No custom JS';

        downloadText(js, 'webedit-script-' + Date.now() + '.js');
        showNotification('JS exported!');
    }

    function exportHTML() {
        const html = document.documentElement.outerHTML;
        downloadText(html, 'webedit-page-' + Date.now() + '.html');
        showNotification('HTML exported!');
    }

    function importFromJSON(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            if (data.customCSS) {
                applyCSSCode(data.customCSS);
            }

            if (data.customJS) {
                executeJSCode(data.customJS);
            }

            if (data.settings) {
                Object.assign(state, data.settings);
                saveToStorage('settings', data.settings);
            }

            if (data.modifications) {
                data.modifications.forEach(mod => {
                    try {
                        const el = document.querySelector(mod.selector);
                        if (el) {
                            el.setAttribute('style', mod.style);
                        }
                    } catch (e) {
                        devLog('Failed to import modification:', mod.selector);
                    }
                });
            }

            showNotification('Import successful!');
        } catch (error) {
            showNotification('Import failed: ' + error.message, 'error');
        }
    }

    function downloadJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function downloadText(text, filename) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ═══════════════════════════════════════════════════════════
    // DANGER ZONE - MENU DELETE
    // ═══════════════════════════════════════════════════════════

    function deleteMenu() {
        if (!confirm('⚠️ DELETE WEB EDIT MENU?\n\nThis will remove the menu but keep all modifications active.\n\nPress Ctrl+Shift+F2 to restore.')) {
            return;
        }

        const container = document.getElementById('webEditContainer');
        if (container) {
            container.style.display = 'none';
            state.isOpen = false;
        }

        // Add restore hotkey
        document.addEventListener('keydown', function restoreMenu(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'F2') {
                if (container) {
                    container.style.display = 'block';
                    state.isOpen = true;
                    showNotification('Menu restored!');
                }
                document.removeEventListener('keydown', restoreMenu);
            }
        });

        showNotification('Menu deleted! Press Ctrl+Shift+F2 to restore', 'warning');
        devLog('Menu deleted');
    }

    function completelyRemoveMenu() {
        if (!confirm('⚠️ COMPLETELY REMOVE WEB EDIT?\n\nThis will:\n- Remove the menu permanently\n- Keep all active modifications\n- Clear all storage data\n\nThis cannot be undone!')) {
            return;
        }

        // Remove menu
        const container = document.getElementById('webEditContainer');
        if (container) {
            container.remove();
        }

        // Remove styles
        const styles = document.getElementById('webEditStyles');
        if (styles) {
            styles.remove();
        }

        // Clear all storage
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('webedit_')) {
                localStorage.removeItem(key);
            }
        });

        showNotification('WEB EDIT completely removed!', 'error');
        devLog('WEB EDIT removed completely');
    }

    // ═══════════════════════════════════════════════════════════
    // DANGER ZONE - NUKE SITE
    // ═══════════════════════════════════════════════════════════

    function nukeSite() {
        if (!confirm('⚠️ NUKE THIS SITE?\n\nThis will:\n- Delete ALL content\n- Remove ALL styles\n- Disable ALL scripts\n- Destroy ALL elements\n\nTHIS IS IRREVERSIBLE!\n\nAre you ABSOLUTELY sure?')) {
            return;
        }

        if (!confirm('⚠️ FINAL WARNING!\n\nYou are about to DESTROY this website.\n\nClick OK to proceed with NUCLEAR DESTRUCTION.')) {
            return;
        }

        showNotification('🔥 INITIATING SITE DESTRUCTION... 🔥', 'error');

        setTimeout(() => {
            // Phase 1: Remove all content
            document.body.innerHTML = '';
            showNotification('Phase 1: Content obliterated', 'warning');

            setTimeout(() => {
                // Phase 2: Destroy all styles
                document.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => el.remove());
                document.body.style.cssText = 'background:#000;color:#0f0;font-family:monospace;padding:20px;';

                // Phase 3: Create destruction message
                const msg = document.createElement('div');
                msg.style.cssText = 'text-align:center;padding:100px 20px;';
                msg.innerHTML = `
                    <h1 style="font-size:72px;color:#f00;text-shadow:0 0 20px #f00;">☢️ SITE NUKED ☢️</h1>
                    <p style="font-size:24px;margin:20px 0;">This website has been destroyed by WEB EDIT v${VERSION}</p>
                    <p style="font-size:16px;color:#888;">Previous URL: ${window.location.href}</p>
                    <p style="font-size:14px;margin-top:40px;color:#0f0;">Press F5 to reload and restore the original site</p>
                    <div style="margin-top:40px;font-size:12px;color:#666;">
                        Destruction time: ${new Date().toLocaleString()}<br>
                        User Agent: ${navigator.userAgent.substring(0, 100)}
                    </div>
                `;
                document.body.appendChild(msg);

                // Phase 4: Disable all scripts
                document.querySelectorAll('script').forEach(script => {
                    script.remove();
                });

                showNotification('🔥 SITE COMPLETELY DESTROYED 🔥', 'error');
                devLog('Site nuked at:', new Date().toISOString());

                // Add glitch effect
                setInterval(() => {
                    document.body.style.background = '#' + Math.floor(Math.random()*16777215).toString(16);
                }, 500);

            }, 1000);
        }, 1000);
    }

    function nukeWithAnimation() {
        if (!confirm('⚠️ ANIMATED NUKE?\n\nThis will destroy the site with a spectacular animation.\n\nProceed?')) {
            return;
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0);z-index:2000000000;display:flex;align-items:center;justify-content:center;transition:all 2s;';
        overlay.innerHTML = '<div style="font-size:120px;">💣</div>';
        document.body.appendChild(overlay);

        // Fade to black
        setTimeout(() => {
            overlay.style.background = 'rgba(0,0,0,1)';
        }, 100);

        // Explosion
        setTimeout(() => {
            overlay.innerHTML = '<div style="font-size:200px;animation:explosion 0.5s;">💥</div>';
            const style = document.createElement('style');
            style.textContent = '@keyframes explosion { 0% { transform:scale(0); } 100% { transform:scale(3); opacity:0; } }';
            document.head.appendChild(style);
        }, 2000);

        // Nuke
        setTimeout(() => {
            nukeSite();
        }, 3000);
    }

    // ═══════════════════════════════════════════════════════════
    // DANGER ZONE - ADVANCED FEATURES
    // ═══════════════════════════════════════════════════════════

    function freezePage() {
        // Freeze all animations
        const style = document.createElement('style');
        style.textContent = '* { animation-play-state: paused !important; transition: none !important; }';
        document.head.appendChild(style);

        // Disable all event listeners
        document.body.style.pointerEvents = 'none';
        document.getElementById('webEditContainer').style.pointerEvents = 'all';

        showNotification('Page frozen!', 'warning');
    }

    function unfreezePage() {
        document.querySelectorAll('style').forEach(s => {
            if (s.textContent.includes('animation-play-state')) {
                s.remove();
            }
        });
        document.body.style.pointerEvents = '';
        showNotification('Page unfrozen!');
    }

    function makePageEditable() {
        document.body.contentEditable = 'true';
        document.designMode = 'on';
        showNotification('Page is now editable! Click anywhere to edit.', 'info');
    }

    function disablePageEditable() {
        document.body.contentEditable = 'false';
        document.designMode = 'off';
        showNotification('Page editing disabled');
    }

    function removeAllScripts() {
        if (!confirm('Remove ALL scripts from the page?\n\nThis may break functionality!')) {
            return;
        }

        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (!script.id || !script.id.startsWith('we')) {
                script.remove();
            }
        });

        showNotification(`Removed ${scripts.length} scripts!`, 'warning');
    }

    function disableAllLinks() {
        document.querySelectorAll('a').forEach(link => {
            if (!link.closest('#webEditContainer')) {
                link.style.pointerEvents = 'none';
                link.style.opacity = '0.5';
            }
        });
        showNotification('All links disabled!', 'warning');
    }

    function enableAllLinks() {
        document.querySelectorAll('a').forEach(link => {
            link.style.pointerEvents = '';
            link.style.opacity = '';
        });
        showNotification('All links enabled!');
    }

    function makeEverythingDraggable() {
        document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)').forEach(el => {
            el.draggable = true;
            el.style.cursor = 'move';
        });
        showNotification('Everything is now draggable!', 'info');
    }

    function invertAllColors() {
        document.body.style.filter = document.body.style.filter === 'invert(1)' ? '' : 'invert(1)';
        showNotification('Colors inverted!');
    }

    function rotatePageUpsideDown() {
        document.body.style.transform = document.body.style.transform === 'rotate(180deg)' ? '' : 'rotate(180deg)';
        showNotification('Page rotated!');
    }

    function makeEverythingComic() {
        const style = document.createElement('style');
        style.id = 'comicStyle';
        style.textContent = `
            * {
                font-family: "Comic Sans MS", cursive !important;
                transform: rotate(${Math.random() * 4 - 2}deg) !important;
            }
        `;

        if (document.getElementById('comicStyle')) {
            document.getElementById('comicStyle').remove();
            showNotification('Comic mode disabled');
        } else {
            document.head.appendChild(style);
            showNotification('🎨 COMIC MODE ACTIVATED! 🎨', 'info');
        }
    }

    function rainbowMode() {
        let hue = 0;
        const interval = setInterval(() => {
            hue = (hue + 1) % 360;
            document.body.style.filter = `hue-rotate(${hue}deg)`;
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            document.body.style.filter = '';
            showNotification('Rainbow mode ended');
        }, 10000);

        showNotification('🌈 RAINBOW MODE! 🌈', 'info');
    }

    // ═══════════════════════════════════════════════════════════
    // WORKSPACE ACCESS (DevTools Protocol)
    // ═══════════════════════════════════════════════════════════

    function enableWorkspaceAccess() {
        try {
            // Try to enable Chrome DevTools Protocol
            if (window.chrome && window.chrome.debugger) {
                window.chrome.debugger.attach({ tabId: chrome.devtools.inspectedWindow.tabId }, "1.0", function() {
                    showNotification('Workspace access enabled!', 'info');
                    devLog('DevTools Protocol connected');
                });
            } else {
                // Fallback: Create console interface
                const consoleFrame = document.createElement('div');
                consoleFrame.id = 'weWorkspace';
                consoleFrame.style.cssText = 'position:fixed;bottom:0;left:0;right:0;height:300px;background:#1a1a1a;border-top:2px solid #667eea;z-index:999999998;display:flex;flex-direction:column;';
                consoleFrame.innerHTML = `
                    <div style="background:#0d0d0d;padding:10px;color:#fff;font-weight:bold;display:flex;justify-content:space-between;align-items:center;">
                        <span>🛠️ WEB EDIT Workspace</span>
                        <button onclick="document.getElementById('weWorkspace').remove()" style="background:#f44336;border:none;color:#fff;padding:5px 10px;border-radius:4px;cursor:pointer;">Close</button>
                    </div>
                    <div style="flex:1;overflow:auto;padding:10px;font-family:monospace;font-size:12px;color:#0f0;">
                        <div id="workspaceOutput">Workspace initialized. Type JavaScript commands below.</div>
                    </div>
                    <div style="display:flex;padding:10px;background:#0d0d0d;">
                        <input type="text" id="workspaceInput" placeholder="Enter JavaScript command..." style="flex:1;background:#1a1a1a;border:2px solid #333;color:#fff;padding:8px;border-radius:4px;font-family:monospace;">
                        <button onclick="window.webEdit.executeWorkspaceCommand()" style="margin-left:10px;background:#667eea;border:none;color:#fff;padding:8px 20px;border-radius:4px;cursor:pointer;">Run</button>
                    </div>
                `;
                document.body.appendChild(consoleFrame);

                // Add enter key support
                document.getElementById('workspaceInput').addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        window.webEdit.executeWorkspaceCommand();
                    }
                });

                showNotification('Workspace console opened!', 'info');
            }
        } catch (error) {
            showNotification('Workspace access failed: ' + error.message, 'error');
        }
    }

    function executeWorkspaceCommand() {
        const input = document.getElementById('workspaceInput');
        const output = document.getElementById('workspaceOutput');

        if (!input || !output) return;

        const command = input.value.trim();
        if (!command) return;

        try {
            const result = eval(command);
            const resultStr = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);

            output.innerHTML += `\n<div style="color:#888;margin-top:10px;">$ ${command}</div>`;
            output.innerHTML += `<div style="color:#0f0;">${resultStr}</div>`;

            input.value = '';
            output.scrollTop = output.scrollHeight;
        } catch (error) {
            output.innerHTML += `\n<div style="color:#888;margin-top:10px;">$ ${command}</div>`;
            output.innerHTML += `<div style="color:#f00;">Error: ${error.message}</div>`;
            output.scrollTop = output.scrollHeight;
        }
    }

    // ═══════════════════════════════════════════════════════════
    // QUICK EDIT MODE
    // ═══════════════════════════════════════════════════════════

    let quickEditMenu = null;
    let quickEditTarget = null;
    let highlightOverlay = null;

    function enableQuickEdit() {
        state.quickEditMode = true;
        document.body.style.cursor = 'crosshair';

        document.addEventListener('mouseover', highlightElement);
        document.addEventListener('mouseout', unhighlightElement);
        document.addEventListener('click', handleQuickClick, true);

        showNotification('Quick Edit Mode: Click any element');
    }

    function disableQuickEdit() {
        state.quickEditMode = false;
        document.body.style.cursor = '';

        document.removeEventListener('mouseover', highlightElement);
        document.removeEventListener('mouseout', unhighlightElement);
        document.removeEventListener('click', handleQuickClick, true);

        if (highlightOverlay) {
            highlightOverlay.remove();
            highlightOverlay = null;
        }
    }

    function highlightElement(e) {
        if (!state.quickEditMode) return;

        const target = e.target;
        if (target.closest('#webEditContainer') || target.closest('.we-quick-menu')) return;

        if (!highlightOverlay) {
            highlightOverlay = document.createElement('div');
            highlightOverlay.style.cssText = 'position:absolute;border:2px solid #00ff00;background:rgba(0,255,0,0.1);pointer-events:none;z-index:999999998;transition:all 0.1s;';
            document.body.appendChild(highlightOverlay);
        }

        const rect = target.getBoundingClientRect();
        highlightOverlay.style.top = (window.scrollY + rect.top) + 'px';
        highlightOverlay.style.left = (window.scrollX + rect.left) + 'px';
        highlightOverlay.style.width = rect.width + 'px';
        highlightOverlay.style.height = rect.height + 'px';
        highlightOverlay.style.display = 'block';
    }

    function unhighlightElement() {
        if (highlightOverlay) {
            highlightOverlay.style.display = 'none';
        }
    }

    function handleQuickClick(e) {
        if (!state.quickEditMode) return;

        e.preventDefault();
        e.stopPropagation();

        const target = e.target;
        if (target.closest('#webEditContainer') || target.closest('.we-quick-menu')) return;

        disableQuickEdit();
        showQuickMenu(target, e.clientX, e.clientY);
    }

    function showQuickMenu(target, x, y) {
        closeQuickMenu();

        quickEditTarget = target;
        target.style.outline = '2px solid #667eea';

        quickEditMenu = document.createElement('div');
        quickEditMenu.className = 'we-quick-menu';
        quickEditMenu.innerHTML = `
            <div class="we-quick-header">
                <span>⚡ Quick Edit: ${target.tagName}</span>
                <button class="we-quick-close" id="qClose">×</button>
            </div>
            <div class="we-quick-body">
                <div class="we-quick-info">
                    ${target.id ? 'ID: #' + target.id : ''}
                    ${target.className ? 'Class: .' + target.className.split(' ').join('.') : ''}
                </div>

                <label>Text:</label>
                <input type="text" class="we-quick-input" id="qText" value="${target.textContent.substring(0, 50).replace(/"/g, '&quot;')}" placeholder="New text">
                <button class="we-quick-btn" id="qChangeText">Change Text</button>

                <label>Colors:</label>
                <div style="display:flex;gap:8px;margin-bottom:8px;">
                    <div style="flex:1;">
                        <label style="font-size:10px;">Text</label>
                        <input type="color" class="we-quick-color" id="qColor" value="#ff0000">
                    </div>
                    <div style="flex:1;">
                        <label style="font-size:10px;">Background</label>
                        <input type="color" class="we-quick-color" id="qBgColor" value="#ffffff">
                    </div>
                </div>
                <button class="we-quick-btn" id="qApplyColors">Apply Colors</button>

                <label>Font Size:</label>
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
                    <input type="range" style="flex:1;" id="qSize" min="8" max="72" value="16">
                    <span id="qSizeValue" style="min-width:40px;color:#ccc;">16px</span>
                </div>
                <button class="we-quick-btn" id="qApplySize">Apply Size</button>

                <div class="we-quick-actions">
                    <button class="we-quick-btn-secondary" id="qHide">👁️ Hide</button>
                    <button class="we-quick-btn-secondary" id="qCopy">📋 Copy</button>
                    <button class="we-quick-btn-danger" id="qDelete">🗑️ Delete</button>
                </div>

                <button class="we-quick-btn" id="qAdvanced" style="margin-top:8px;">⚙️ Advanced Edit</button>
            </div>
        `;

        document.body.appendChild(quickEditMenu);
        quickEditMenu.style.left = Math.min(x + 10, window.innerWidth - 320) + 'px';
        quickEditMenu.style.top = Math.min(y + 10, window.innerHeight - 500) + 'px';

        // Event listeners
        document.getElementById('qClose').addEventListener('click', closeQuickMenu);
        document.getElementById('qChangeText').addEventListener('click', quickChangeText);
        document.getElementById('qApplyColors').addEventListener('click', quickApplyColors);
        document.getElementById('qApplySize').addEventListener('click', quickApplySize);
        document.getElementById('qHide').addEventListener('click', quickHide);
        document.getElementById('qCopy').addEventListener('click', quickCopy);
        document.getElementById('qDelete').addEventListener('click', quickDelete);
        document.getElementById('qAdvanced').addEventListener('click', quickAdvanced);

        // Range slider
        const sizeRange = document.getElementById('qSize');
        const sizeValue = document.getElementById('qSizeValue');
        sizeRange.addEventListener('input', () => {
            sizeValue.textContent = sizeRange.value + 'px';
        });
    }

    function closeQuickMenu() {
        if (quickEditMenu) {
            quickEditMenu.remove();
            quickEditMenu = null;
        }
        if (quickEditTarget) {
            quickEditTarget.style.outline = '';
            quickEditTarget = null;
        }
    }

    function quickChangeText() {
        if (!quickEditTarget) return;
        const text = document.getElementById('qText').value;
        quickEditTarget.textContent = text;
        showNotification('Text changed!');
    }

    function quickApplyColors() {
        if (!quickEditTarget) return;
        const textColor = document.getElementById('qColor').value;
        const bgColor = document.getElementById('qBgColor').value;
        quickEditTarget.style.color = textColor;
        quickEditTarget.style.backgroundColor = bgColor;
        showNotification('Colors applied!');
    }

    function quickApplySize() {
        if (!quickEditTarget) return;
        const size = document.getElementById('qSize').value;
        quickEditTarget.style.fontSize = size + 'px';
        showNotification('Size applied!');
    }

    function quickHide() {
        if (!quickEditTarget) return;
        quickEditTarget.style.display = 'none';
        showNotification('Element hidden!');
        closeQuickMenu();
    }

    function quickCopy() {
        if (!quickEditTarget) return;
        const text = quickEditTarget.outerHTML;
        navigator.clipboard.writeText(text).then(() => {
            showNotification('HTML copied to clipboard!');
        });
    }

    function quickDelete() {
        if (!quickEditTarget) return;
        if (confirm('Delete this element?')) {
            quickEditTarget.remove();
            showNotification('Element deleted!');
            closeQuickMenu();
        }
    }

    function quickAdvanced() {
        if (!quickEditTarget) return;
        state.selectedElement = quickEditTarget;
        closeQuickMenu();
        if (!state.isOpen) toggleUI();
        switchTab('element');
    }

    // ═══════════════════════════════════════════════════════════
    // QUICK PRESETS
    // ═══════════════════════════════════════════════════════════

    function applyDarkTheme() {
        console.log('Applying dark theme...');
        document.body.style.setProperty('background-color', '#1a1a1a', 'important');
        document.body.style.setProperty('color', '#ffffff', 'important');

        const elements = document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)');
        let count = 0;

        elements.forEach(el => {
            const bg = window.getComputedStyle(el).backgroundColor;
            if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                const match = bg.match(/\d+/g);
                if (match) {
                    const brightness = (parseInt(match[0]) + parseInt(match[1]) + parseInt(match[2])) / 3;
                    if (brightness > 150) {
                        el.style.setProperty('background-color', '#2a2a2a', 'important');
                        el.style.setProperty('color', '#e0e0e0', 'important');
                        count++;
                    }
                }
            }
        });

        showNotification(`Dark theme applied to ${count} elements!`);
    }

    function applyLightTheme() {
        console.log('Applying light theme...');
        document.body.style.setProperty('background-color', '#ffffff', 'important');
        document.body.style.setProperty('color', '#000000', 'important');

        const elements = document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)');
        let count = 0;

        elements.forEach(el => {
            const bg = window.getComputedStyle(el).backgroundColor;
            if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                const match = bg.match(/\d+/g);
                if (match) {
                    const brightness = (parseInt(match[0]) + parseInt(match[1]) + parseInt(match[2])) / 3;
                    if (brightness < 100) {
                        el.style.setProperty('background-color', '#f5f5f5', 'important');
                        el.style.setProperty('color', '#333333', 'important');
                        count++;
                    }
                }
            }
        });

        showNotification(`Light theme applied to ${count} elements!`);
    }

    function applyHighContrast() {
        document.body.style.setProperty('background-color', '#000000', 'important');
        document.body.style.setProperty('color', '#ffffff', 'important');

        document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)').forEach(el => {
            el.style.setProperty('border-color', '#ffffff', 'important');
            if (el.tagName === 'A') {
                el.style.setProperty('color', '#00ffff', 'important');
                el.style.setProperty('text-decoration', 'underline', 'important');
            }
            if (el.tagName === 'BUTTON' || el.tagName === 'INPUT') {
                el.style.setProperty('background-color', '#ffffff', 'important');
                el.style.setProperty('color', '#000000', 'important');
                el.style.setProperty('border', '2px solid #ffffff', 'important');
            }
        });

        showNotification('High contrast mode activated!');
    }

    function applyReaderMode() {
        const selectorsToHide = [
            'header:not(article header)', 'nav', 'aside', 'footer',
            '[class*="sidebar"]', '[class*="ad"]', '[class*="social"]',
            '[class*="comment"]', '[class*="related"]', '[role="complementary"]',
            '[role="banner"]', '[role="navigation"]'
        ];

        let count = 0;
        selectorsToHide.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    if (!el.closest('#webEditContainer')) {
                        el.style.setProperty('display', 'none', 'important');
                        count++;
                    }
                });
            } catch (e) {}
        });

        const article = document.querySelector('article, [role="main"], main, .content, #content');
        if (article) {
            article.style.setProperty('max-width', '800px', 'important');
            article.style.setProperty('margin', '0 auto', 'important');
            article.style.setProperty('padding', '40px 20px', 'important');
            article.style.setProperty('font-size', '18px', 'important');
            article.style.setProperty('line-height', '1.6', 'important');
            article.style.setProperty('background-color', '#ffffff', 'important');
            article.style.setProperty('color', '#333333', 'important');
        }

        document.body.style.setProperty('background-color', '#f5f5f5', 'important');
        showNotification(`Reader mode activated (${count} elements hidden)`);
    }

    function increaseFonts() {
        const elements = document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)');
        let count = 0;

        elements.forEach(el => {
            const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
            if (currentSize) {
                el.style.fontSize = (currentSize * 1.2) + 'px';
                count++;
            }
        });

        showNotification(`Fonts increased for ${count} elements!`);
    }

    function decreaseFonts() {
        const elements = document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)');
        let count = 0;

        elements.forEach(el => {
            const currentSize = parseFloat(window.getComputedStyle(el).fontSize);
            if (currentSize) {
                el.style.fontSize = (currentSize * 0.8) + 'px';
                count++;
            }
        });

        showNotification(`Fonts decreased for ${count} elements!`);
    }

    function resetFonts() {
        document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)').forEach(el => {
            el.style.fontSize = '';
        });
        showNotification('Fonts reset to default!');
    }

    function removeAds() {
        const selectors = [
            '[class*="ad-"]', '[class*="ads"]', '[id*="ad-"]', '[id*="ads"]',
            '[class*="banner"]', '[class*="popup"]', '[class*="modal"]',
            'iframe[src*="ads"]', 'iframe[src*="doubleclick"]',
            '[class*="advertisement"]', '[id*="advertisement"]',
            '[data-ad]', '[data-ads]', '[class*="sponsor"]',
            '[class*="promo"]', 'ins.adsbygoogle'
        ];
        let count = 0;

        selectors.forEach(sel => {
            try {
                document.querySelectorAll(sel).forEach(el => {
                    if (!el.closest('#webEditContainer')) {
                        el.remove();
                        count++;
                    }
                });
            } catch (e) {}
        });

        showNotification(`Removed ${count} ad elements!`);
    }

    function removeImages() {
        const images = document.querySelectorAll('img:not(#webEditContainer img)');
        images.forEach(img => img.style.setProperty('display', 'none', 'important'));
        showNotification(`Hidden ${images.length} images!`);
    }

    function removeVideos() {
        const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="dailymotion"]');
        let count = 0;
        videos.forEach(video => {
            if (!video.closest('#webEditContainer')) {
                video.style.setProperty('display', 'none', 'important');
                count++;
            }
        });
        showNotification(`Hidden ${count} videos!`);
    }

    function removeAllMedia() {
        removeImages();
        removeVideos();
        document.querySelectorAll('audio').forEach(audio => audio.remove());
        showNotification('All media removed!');
    }

    function grayscaleEverything() {
        document.body.style.filter = document.body.style.filter === 'grayscale(100%)' ? '' : 'grayscale(100%)';
        showNotification(document.body.style.filter ? 'Grayscale enabled!' : 'Grayscale disabled!');
    }

    function blurBackground() {
        document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)').forEach(el => {
            if (el !== document.body) {
                el.style.filter = el.style.filter === 'blur(5px)' ? '' : 'blur(5px)';
            }
        });
        showNotification('Background blur toggled!');
    }

    // ═══════════════════════════════════════════════════════════
    // TEXT EDITING FUNCTIONS
    // ═══════════════════════════════════════════════════════════

    function changeText(oldText, newText) {
        if (!oldText) {
            showNotification('Please enter text to find', 'error');
            return;
        }

        let count = 0;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToChange = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.textContent.includes(oldText) && !node.parentElement.closest('#webEditContainer')) {
                nodesToChange.push(node);
            }
        }

        nodesToChange.forEach(node => {
            node.textContent = node.textContent.replace(new RegExp(oldText, 'g'), newText);
            count++;
        });

        showNotification(`Changed ${count} instances`);
    }

    function changeTextColor(text, color) {
        if (!text) {
            showNotification('Please enter text', 'error');
            return;
        }

        let count = 0;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.textContent.includes(text) && !node.parentElement.closest('#webEditContainer')) {
                node.parentElement.style.color = color;
                count++;
            }
        }

        showNotification(`Changed color for ${count} elements`);
    }

    function changeTextSize(text, size) {
        if (!text) {
            showNotification('Please enter text', 'error');
            return;
        }

        let count = 0;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.textContent.includes(text) && !node.parentElement.closest('#webEditContainer')) {
                node.parentElement.style.fontSize = size + 'px';
                count++;
            }
        }

        showNotification(`Changed size for ${count} elements`);
    }

    function hideText(text, mode) {
        if (!text) {
            showNotification('Please enter text', 'error');
            return;
        }

        let count = 0;
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.textContent.includes(text) && !node.parentElement.closest('#webEditContainer')) {
                const el = node.parentElement;

                switch(mode) {
                    case 'strikethrough':
                        el.style.textDecoration = 'line-through';
                        break;
                    case 'invisible':
                        el.style.visibility = 'hidden';
                        break;
                    case 'transparent':
                        el.style.opacity = '0';
                        break;
                    case 'blur':
                        el.style.filter = 'blur(5px)';
                        break;
                }

                count++;
            }
        }

        showNotification(`Applied ${mode} to ${count} elements`);
    }

    function replaceAllText(newText) {
        document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)').forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                el.textContent = newText;
            }
        });
        showNotification('All text replaced!', 'warning');
    }

    function uppercaseAll() {
        document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)').forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                el.textContent = el.textContent.toUpperCase();
            }
        });
        showNotification('All text uppercased!');
    }

    function lowercaseAll() {
        document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)').forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                el.textContent = el.textContent.toLowerCase();
            }
        });
        showNotification('All text lowercased!');
    }

    function randomizeText() {
        document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)').forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                const text = el.textContent;
                el.textContent = text.split('').sort(() => Math.random() - 0.5).join('');
            }
        });
        showNotification('All text randomized!', 'warning');
    }

    // ═══════════════════════════════════════════════════════════
    // ELEMENT SELECTION & EDITING
    // ═══════════════════════════════════════════════════════════

    function enableElementSelection() {
        state.elementEditMode = true;
        document.body.style.cursor = 'crosshair';

        document.addEventListener('mouseover', highlightElement);
        document.addEventListener('mouseout', unhighlightElement);
        document.addEventListener('click', selectElement, true);

        showNotification('Element Selection: Click on any element');
    }

    function disableElementSelection() {
        state.elementEditMode = false;
        document.body.style.cursor = '';

        document.removeEventListener('mouseover', highlightElement);
        document.removeEventListener('mouseout', unhighlightElement);
        document.removeEventListener('click', selectElement, true);

        if (highlightOverlay) {
            highlightOverlay.remove();
            highlightOverlay = null;
        }
    }

    function selectElement(e) {
        if (!state.elementEditMode) return;

        e.preventDefault();
        e.stopPropagation();

        const target = e.target;
        if (target.closest('#webEditContainer')) return;

        state.selectedElement = target;
        target.style.outline = '3px solid #ff0000';
        target.setAttribute('data-webedit-selected', 'true');

        disableElementSelection();
        showNotification('Element selected: ' + target.tagName);

        if (!state.isOpen) toggleUI();
        switchTab('element');
    }

    function clearSelection() {
        if (state.selectedElement) {
            state.selectedElement.style.outline = '';
            state.selectedElement.removeAttribute('data-webedit-selected');
            state.selectedElement = null;
        }
    }

    function cloneSelectedElement() {
        if (!state.selectedElement) return;
        const clone = state.selectedElement.cloneNode(true);
        state.selectedElement.parentNode.insertBefore(clone, state.selectedElement.nextSibling);
        showNotification('Element cloned!');
    }

    function wrapSelectedElement() {
        if (!state.selectedElement) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'webedit-wrapper';
        state.selectedElement.parentNode.insertBefore(wrapper, state.selectedElement);
        wrapper.appendChild(state.selectedElement);
        showNotification('Element wrapped in div!');
    }

    function exportSelectedElement() {
        if (!state.selectedElement) return;
        const html = state.selectedElement.outerHTML;
        downloadText(html, 'element-' + Date.now() + '.html');
        showNotification('Element exported!');
    }

    // ═══════════════════════════════════════════════════════════
    // ADVANCED DELETE
    // ═══════════════════════════════════════════════════════════

    function advancedDelete(selector, options = {}) {
        try {
            const elements = document.querySelectorAll(selector);
            let count = 0;

            elements.forEach(el => {
                if (el.closest('#webEditContainer')) return;

                if (options.hide) {
                    el.style.setProperty('display', 'none', 'important');
                } else {
                    el.remove();
                }
                count++;
            });

            showNotification(`${options.hide ? 'Hidden' : 'Deleted'} ${count} elements`);
            devLog('Advanced delete:', selector, count, 'elements');
        } catch (error) {
            showNotification('Invalid selector: ' + error.message, 'error');
        }
    }

    function deleteByClass(className, hide = false) {
        advancedDelete('.' + className, { hide });
    }

    function deleteById(id, hide = false) {
        advancedDelete('#' + id, { hide });
    }

    function deleteByTag(tagName, hide = false) {
        advancedDelete(tagName, { hide });
    }

    function deleteByAttribute(attr, value, hide = false) {
        advancedDelete(`[${attr}="${value}"]`, { hide });
    }

    function deleteContaining(text, hide = false) {
        let count = 0;
        document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)').forEach(el => {
            if (el.textContent.includes(text)) {
                if (hide) {
                    el.style.setProperty('display', 'none', 'important');
                } else {
                    el.remove();
                }
                count++;
            }
        });
        showNotification(`${hide ? 'Hidden' : 'Deleted'} ${count} elements containing "${text}"`);
    }

    function deleteAllEmpty() {
        let count = 0;
        document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)').forEach(el => {
            if (!el.textContent.trim() && el.children.length === 0) {
                el.remove();
                count++;
            }
        });
        showNotification(`Deleted ${count} empty elements!`);
    }

    function deleteAllHidden() {
        let count = 0;
        document.querySelectorAll('*:not(#webEditContainer):not(#webEditContainer *)').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                el.remove();
                count++;
            }
        });
        showNotification(`Deleted ${count} hidden elements!`);
    }

   // ═══════════════════════════════════════════════════════════
    // UI CREATION
    // ═══════════════════════════════════════════════════════════

    function createUI() {
        if (document.getElementById('webEditContainer')) return;

        const container = document.createElement('div');
        container.id = 'webEditContainer';
        container.innerHTML = `
            <div class="we-panel">
                <div class="we-header" id="weHeader">
                    <span class="we-title">🛠️ WEB EDIT v${VERSION}</span>
                    <button class="we-close" id="weClose">×</button>
                </div>

                <div class="we-tabs" id="weTabs">
                    <button class="we-tab active" data-tab="home" title="Home">🏠</button>
                    <button class="we-tab" data-tab="text" title="Text Editor">📝</button>
                    <button class="we-tab" data-tab="element" title="Element Edit">⚡</button>
                    <button class="we-tab" data-tab="css" title="CSS Editor">🎨</button>
                    <button class="we-tab" data-tab="js" title="JS Editor">⚙️</button>
                    <button class="we-tab" data-tab="html" title="HTML Editor">📄</button>
                    <button class="we-tab" data-tab="http" title="HTTP Control">🌐</button>
                    <button class="we-tab" data-tab="presets" title="Quick Presets">🚀</button>
                    <button class="we-tab" data-tab="tools" title="Tools">🛠️</button>
                    <button class="we-tab" data-tab="io" title="Import/Export">💾</button>
                    <button class="we-tab" data-tab="settings" title="Settings">⚙️</button>
                    <button class="we-tab" data-tab="danger" title="Danger Zone">☠️</button>
                </div>

                <div class="we-content" id="weContent"></div>
            </div>
        `;

        document.body.appendChild(container);
        addStyles();
        container.style.display = 'none';

        // Make draggable
        makeDraggablePan(container.querySelector('.we-panel'), container.querySelector('#weHeader'));

        // Event listeners
        document.getElementById('weClose').addEventListener('click', toggleUI);

        document.querySelectorAll('.we-tab').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.we-tab').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                showTab(this.getAttribute('data-tab'));
            });
        });

        showTab('home');
    }

    function makeDraggablePan(panel, header) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.style.cursor = 'move';

        header.onmousedown = function(e) {
            if (e.target.closest('button')) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            const container = document.getElementById('webEditContainer');
            container.style.top = (container.offsetTop - pos2) + "px";
            container.style.left = (container.offsetLeft - pos1) + "px";
            container.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function toggleUI() {
        state.isOpen = !state.isOpen;
        const container = document.getElementById('webEditContainer');
        if (container) {
            container.style.display = state.isOpen ? 'block' : 'none';
        }
    }

    function switchTab(tabName) {
        state.currentTab = tabName;
        showTab(tabName);
    }

    // ═══════════════════════════════════════════════════════════
    // TAB RENDERERS - HOME
    // ═══════════════════════════════════════════════════════════

    function showTab(tabName) {
        const content = document.getElementById('weContent');
        if (!content) return;

        if (tabName === 'home') {
            content.innerHTML = `
                <h3>Quick Actions</h3>
                <button class="we-btn" id="btnQuickEdit">⚡ Quick Edit Mode (F3)</button>
                <button class="we-btn" id="btnSelectElement">🎯 Select Element (F4)</button>
                <button class="we-btn" id="btnDarkTheme">🌙 Dark Theme</button>
                <button class="we-btn" id="btnLightTheme">☀️ Light Theme</button>

                <h3>Statistics</h3>
                <div class="we-stats">
                    <div class="we-stat">
                        <div class="we-stat-num">${document.querySelectorAll('*').length}</div>
                        <div class="we-stat-label">Elements</div>
                    </div>
                    <div class="we-stat">
                        <div class="we-stat-num">${document.querySelectorAll('img').length}</div>
                        <div class="we-stat-label">Images</div>
                    </div>
                    <div class="we-stat">
                        <div class="we-stat-num">${document.querySelectorAll('script').length}</div>
                        <div class="we-stat-label">Scripts</div>
                    </div>
                    <div class="we-stat">
                        <div class="we-stat-num">${state.httpRequests.length}</div>
                        <div class="we-stat-label">Requests</div>
                    </div>
                </div>

                <h3>Active Features</h3>
                <div class="we-feature-grid">
                    <div class="we-feature ${state.antiRedirect ? 'active' : ''}">🔒 Anti-Redirect</div>
                    <div class="we-feature ${state.antiBot ? 'active' : ''}">🤖 Anti-Bot</div>
                    <div class="we-feature ${state.antiAdBlock ? 'active' : ''}">🚫 Anti-AdBlock</div>
                    <div class="we-feature ${state.showFPS ? 'active' : ''}">📊 FPS Counter</div>
                    <div class="we-feature ${state.stealthMode ? 'active' : ''}">👁️ Stealth Mode</div>
                    <div class="we-feature ${state.antiReload ? 'active' : ''}">💾 Anti-Reload</div>
                </div>
            `;

            document.getElementById('btnQuickEdit').addEventListener('click', enableQuickEdit);
            document.getElementById('btnSelectElement').addEventListener('click', enableElementSelection);
            document.getElementById('btnDarkTheme').addEventListener('click', applyDarkTheme);
            document.getElementById('btnLightTheme').addEventListener('click', applyLightTheme);
        }

        else if (tabName === 'text') {
            content.innerHTML = `
                <h3>Find & Replace</h3>
                <input type="text" class="we-input" id="oldText" placeholder="Find text">
                <input type="text" class="we-input" id="newText" placeholder="Replace with">
                <button class="we-btn" id="btnChangeText">Replace All</button>

                <h3>Change Color</h3>
                <input type="text" class="we-input" id="textForColor" placeholder="Enter text">
                <input type="color" class="we-input-color" id="colorPicker" value="#ff0000">
                <button class="we-btn" id="btnChangeColor">Apply Color</button>

                <h3>Change Size</h3>
                <input type="text" class="we-input" id="textForSize" placeholder="Enter text">
                <input type="number" class="we-input" id="fontSize" value="16" min="8" max="72">
                <button class="we-btn" id="btnChangeSize">Apply Size</button>

                <h3>Hide Text</h3>
                <input type="text" class="we-input" id="textToHide" placeholder="Enter text">
                <select class="we-select" id="hideMode">
                    <option value="strikethrough">Strikethrough</option>
                    <option value="invisible">Invisible</option>
                    <option value="transparent">Transparent</option>
                    <option value="blur">Blur</option>
                </select>
                <button class="we-btn" id="btnHideText">Apply</button>

                <h3>Batch Operations</h3>
                <div class="we-btn-grid">
                    <button class="we-btn-secondary" id="btnUppercase">UPPERCASE</button>
                    <button class="we-btn-secondary" id="btnLowercase">lowercase</button>
                    <button class="we-btn-secondary" id="btnRandomize">Randomize</button>
                </div>
            `;

            document.getElementById('btnChangeText').addEventListener('click', () => {
                changeText(document.getElementById('oldText').value, document.getElementById('newText').value);
            });
            document.getElementById('btnChangeColor').addEventListener('click', () => {
                changeTextColor(document.getElementById('textForColor').value, document.getElementById('colorPicker').value);
            });
            document.getElementById('btnChangeSize').addEventListener('click', () => {
                changeTextSize(document.getElementById('textForSize').value, document.getElementById('fontSize').value);
            });
            document.getElementById('btnHideText').addEventListener('click', () => {
                hideText(document.getElementById('textToHide').value, document.getElementById('hideMode').value);
            });
            document.getElementById('btnUppercase').addEventListener('click', uppercaseAll);
            document.getElementById('btnLowercase').addEventListener('click', lowercaseAll);
            document.getElementById('btnRandomize').addEventListener('click', randomizeText);
        }

        else if (tabName === 'element') {
            if (!state.selectedElement) {
                content.innerHTML = `
                    <div class="we-info">No element selected. Click the button below to select an element.</div>
                    <button class="we-btn we-btn-large" id="btnSelectEl">🎯 Select Element</button>
                `;
                document.getElementById('btnSelectEl').addEventListener('click', enableElementSelection);
            } else {
                const el = state.selectedElement;
                const styles = window.getComputedStyle(el);
                content.innerHTML = `
                    <div class="we-element-info">
                        <strong>Tag:</strong> ${el.tagName}<br>
                        ${el.id ? '<strong>ID:</strong> #' + el.id + '<br>' : ''}
                        ${el.className ? '<strong>Class:</strong> .' + el.className.split(' ').join('.') + '<br>' : ''}
                        <strong>Size:</strong> ${el.offsetWidth}x${el.offsetHeight}px
                    </div>
                    <button class="we-btn-secondary" id="btnClearSel">Clear Selection</button>

                    <h3>Edit Text</h3>
                    <textarea class="we-textarea" id="elemText">${el.textContent}</textarea>
                    <button class="we-btn" id="btnApplyText">Apply</button>

                    <h3>Colors</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                        <div>
                            <label>Text:</label>
                            <input type="color" class="we-input-color" id="elemTextColor" value="#000000">
                        </div>
                        <div>
                            <label>Background:</label>
                            <input type="color" class="we-input-color" id="elemBgColor" value="#ffffff">
                        </div>
                    </div>
                    <button class="we-btn" id="btnApplyColors">Apply Colors</button>

                    <h3>Size & Position</h3>
                    <div class="we-input-group">
                        <label>Width:</label>
                        <input type="number" class="we-input" id="elemWidth" value="${el.offsetWidth}">
                        <label>Height:</label>
                        <input type="number" class="we-input" id="elemHeight" value="${el.offsetHeight}">
                    </div>
                    <button class="we-btn" id="btnApplySize">Apply Size</button>

                    <h3>Actions</h3>
                    <div class="we-btn-grid">
                        <button class="we-btn-secondary" id="btnClone">📋 Clone</button>
                        <button class="we-btn-secondary" id="btnWrap">📦 Wrap</button>
                        <button class="we-btn-secondary" id="btnExport">💾 Export</button>
                        <button class="we-btn-secondary" id="btnHideEl">👁️ Hide</button>
                        <button class="we-btn-danger" id="btnDeleteEl">🗑️ Delete</button>
                    </div>
                `;

                document.getElementById('btnClearSel').addEventListener('click', () => {
                    clearSelection();
                    showTab('element');
                });
                document.getElementById('btnApplyText').addEventListener('click', () => {
                    el.textContent = document.getElementById('elemText').value;
                    showNotification('Text updated!');
                });
                document.getElementById('btnApplyColors').addEventListener('click', () => {
                    el.style.color = document.getElementById('elemTextColor').value;
                    el.style.backgroundColor = document.getElementById('elemBgColor').value;
                    showNotification('Colors applied!');
                });
                document.getElementById('btnApplySize').addEventListener('click', () => {
                    el.style.width = document.getElementById('elemWidth').value + 'px';
                    el.style.height = document.getElementById('elemHeight').value + 'px';
                    showNotification('Size applied!');
                });
                document.getElementById('btnClone').addEventListener('click', cloneSelectedElement);
                document.getElementById('btnWrap').addEventListener('click', wrapSelectedElement);
                document.getElementById('btnExport').addEventListener('click', exportSelectedElement);
                document.getElementById('btnHideEl').addEventListener('click', () => {
                    el.style.display = 'none';
                    showNotification('Element hidden!');
                    clearSelection();
                    showTab('element');
                });
                document.getElementById('btnDeleteEl').addEventListener('click', () => {
                    if (confirm('Delete this element?')) {
                        el.remove();
                        showNotification('Element deleted!');
                        clearSelection();
                        showTab('element');
                    }
                });
            }
        }

        else if (tabName === 'css') {
            content.innerHTML = `
                <div class="we-editor-header">
                    <h3>CSS Editor</h3>
                    <label class="we-toggle-small">
                        <input type="checkbox" id="toggleQuickCSS" ${state.quickModeCSS ? 'checked' : ''}>
                        <span>Quick Mode</span>
                    </label>
                </div>
                <textarea class="we-textarea-large" id="cssCode" placeholder="/* Enter CSS code */\n\nbody {\n  background: #1a1a1a;\n  color: #fff;\n}">${state.customCSS}</textarea>
                <div class="we-btn-group">
                    <button class="we-btn" id="btnApplyCSS">Apply CSS</button>
                    <button class="we-btn-secondary" id="btnClearCSS">Clear</button>
                </div>
            `;

            document.getElementById('btnApplyCSS').addEventListener('click', () => {
                applyCSSCode(document.getElementById('cssCode').value);
            });
            document.getElementById('btnClearCSS').addEventListener('click', () => {
                if (confirm('Clear all custom CSS?')) {
                    clearCustomCSS();
                    document.getElementById('cssCode').value = '';
                }
            });
            document.getElementById('toggleQuickCSS').addEventListener('change', function() {
                if (this.checked) {
                    enableQuickModeCSS();
                } else {
                    disableQuickModeCSS();
                }
            });

            if (state.quickModeCSS) {
                enableQuickModeCSS();
            }
        }

        else if (tabName === 'js') {
            content.innerHTML = `
                <div class="we-editor-header">
                    <h3>JavaScript Editor</h3>
                    <label class="we-toggle-small">
                        <input type="checkbox" id="toggleQuickJS" ${state.quickModeJS ? 'checked' : ''}>
                        <span>Quick Mode</span>
                    </label>
                </div>
                <textarea class="we-textarea-large" id="jsCode" placeholder="// Enter JavaScript code\n\nconsole.log('Hello from WEB EDIT!');">${state.customJS}</textarea>
                <button class="we-btn" id="btnExecuteJS">▶️ Execute JS</button>

                <h3>Console Output</h3>
                <div class="we-console" id="jsConsole">Console output will appear here...</div>
            `;

            document.getElementById('btnExecuteJS').addEventListener('click', () => {
                const code = document.getElementById('jsCode').value;
                const consoleEl = document.getElementById('jsConsole');

                const originalLog = console.log;
                const logs = [];

                console.log = function(...args) {
                    logs.push(args.join(' '));
                    originalLog.apply(console, args);
                };

                try {
                    const result = executeJSCode(code);
                    consoleEl.textContent = logs.length > 0 ? logs.join('\n') : '✅ Executed!\nResult: ' + String(result);
                    consoleEl.style.color = '#0f0';
                } catch (error) {
                    consoleEl.textContent = '❌ Error: ' + error.message;
                    consoleEl.style.color = '#f00';
                }

                console.log = originalLog;
            });

            document.getElementById('toggleQuickJS').addEventListener('change', function() {
                if (this.checked) {
                    enableQuickModeJS();
                } else {
                    disableQuickModeJS();
                }
            });

            if (state.quickModeJS) {
                enableQuickModeJS();
            }
        }

        else if (tabName === 'html') {
            content.innerHTML = `
                <div class="we-editor-header">
                    <h3>HTML Editor</h3>
                    <label class="we-toggle-small">
                        <input type="checkbox" id="toggleQuickHTML" ${state.quickModeHTML ? 'checked' : ''}>
                        <span>Quick Mode</span>
                    </label>
                </div>
                <label>Target Selector:</label>
                <input type="text" class="we-input" id="htmlTarget" value="body" placeholder="CSS selector">
                <textarea class="we-textarea-large" id="htmlCode" placeholder="<div>\n  <h1>Hello World</h1>\n</div>"></textarea>
                <button class="we-btn" id="btnApplyHTML">Apply HTML</button>
            `;

            document.getElementById('btnApplyHTML').addEventListener('click', () => {
                applyHTMLCode(
                    document.getElementById('htmlCode').value,
                    document.getElementById('htmlTarget').value
                );
            });

            document.getElementById('toggleQuickHTML').addEventListener('change', function() {
                if (this.checked) {
                    enableQuickModeHTML();
                } else {
                    disableQuickModeHTML();
                }
            });

            if (state.quickModeHTML) {
                enableQuickModeHTML();
            }
        }

        else if (tabName === 'http') {
            content.innerHTML = `
                <h3>HTTP Request Control (${state.httpRequests.length})</h3>
                <div class="we-btn-group">
                    <button class="we-btn-secondary" id="btnClearReq">Clear All</button>
                    <button class="we-btn-secondary" id="btnExportReq">Export</button>
                </div>

                <h3>Block URL</h3>
                <input type="text" class="we-input" id="blockURL" placeholder="Enter URL pattern to block">
                <button class="we-btn" id="btnBlockURL">Block URL</button>

                <h3>Recent Requests</h3>
                <div class="we-requests" id="requestsList">
                    ${state.httpRequests.slice(0, 20).map(req => `
                        <div class="we-request">
                            <span class="we-req-method">${req.method}</span>
                            <span class="we-req-status">${req.status}</span>
                            <span class="we-req-url" title="${req.url}">${req.url.substring(0, 40)}...</span>
                            <button class="we-req-btn" onclick="window.webEdit.repeatRequest(${JSON.stringify(req).replace(/"/g, '&quot;')})">🔁</button>
                        </div>
                    `).join('') || '<div class="we-info">No requests captured yet</div>'}
                </div>

                <h3>Blocked URLs (${state.blockedRequests.length})</h3>
                <div class="we-blocked-list">
                    ${state.blockedRequests.map(url => `
                        <div class="we-blocked-item">
                            <span>${url}</span>
                            <button class="we-btn-danger-small" onclick="window.webEdit.unblockURL('${url}')">×</button>
                        </div>
                    `).join('') || '<div class="we-info">No blocked URLs</div>'}
                </div>
            `;

            document.getElementById('btnClearReq').addEventListener('click', clearAllRequests);
            document.getElementById('btnExportReq').addEventListener('click', exportRequests);
            document.getElementById('btnBlockURL').addEventListener('click', () => {
                const url = document.getElementById('blockURL').value;
                if (url) {
                    blockURL(url);
                    showTab('http');
                }
            });
        }

        else if (tabName === 'presets') {
            content.innerHTML = `
                <h3>Theme Presets</h3>
                <div class="we-preset-grid">
                    <button class="we-preset-btn" id="presetDark">🌙 Dark</button>
                    <button class="we-preset-btn" id="presetLight">☀️ Light</button>
                    <button class="we-preset-btn" id="presetContrast">◐ Contrast</button>
                    <button class="we-preset-btn" id="presetReader">📖 Reader</button>
                </div>

                <h3>Font Presets</h3>
                <div class="we-preset-grid">
                    <button class="we-preset-btn" id="presetFontsUp">🔤+ Bigger</button>
                    <button class="we-preset-btn" id="presetFontsDown">🔤- Smaller</button>
                    <button class="we-preset-btn" id="presetFontsReset">🔤 Reset</button>
                </div>

                <h3>Content Presets</h3>
                <div class="we-preset-grid">
                    <button class="we-preset-btn" id="presetRemoveAds">🚫 Ads</button>
                    <button class="we-preset-btn" id="presetRemoveImg">🖼️ Images</button>
                    <button class="we-preset-btn" id="presetRemoveVid">🎥 Videos</button>
                    <button class="we-preset-btn" id="presetRemoveAll">💥 All Media</button>
                </div>

                <h3>Effect Presets</h3>
                <div class="we-preset-grid">
                    <button class="we-preset-btn" id="presetGray">⬛ Grayscale</button>
                    <button class="we-preset-btn" id="presetInvert">🔄 Invert</button>
                    <button class="we-preset-btn" id="presetRotate">🔃 Rotate</button>
                    <button class="we-preset-btn" id="presetRainbow">🌈 Rainbow</button>
                    <button class="we-preset-btn" id="presetComic">🎨 Comic</button>
                </div>
            `;

            document.getElementById('presetDark').addEventListener('click', applyDarkTheme);
            document.getElementById('presetLight').addEventListener('click', applyLightTheme);
            document.getElementById('presetContrast').addEventListener('click', applyHighContrast);
            document.getElementById('presetReader').addEventListener('click', applyReaderMode);
            document.getElementById('presetFontsUp').addEventListener('click', increaseFonts);
            document.getElementById('presetFontsDown').addEventListener('click', decreaseFonts);
            document.getElementById('presetFontsReset').addEventListener('click', resetFonts);
            document.getElementById('presetRemoveAds').addEventListener('click', removeAds);
            document.getElementById('presetRemoveImg').addEventListener('click', removeImages);
            document.getElementById('presetRemoveVid').addEventListener('click', removeVideos);
            document.getElementById('presetRemoveAll').addEventListener('click', removeAllMedia);
            document.getElementById('presetGray').addEventListener('click', grayscaleEverything);
            document.getElementById('presetInvert').addEventListener('click', invertAllColors);
            document.getElementById('presetRotate').addEventListener('click', rotatePageUpsideDown);
            document.getElementById('presetRainbow').addEventListener('click', rainbowMode);
            document.getElementById('presetComic').addEventListener('click', makeEverythingComic);
        }

      // ... код для других табов ...

        else if (tabName === 'tools') {
            content.innerHTML = `
                // ... весь HTML для tools ...
            `;

            // ... все обработчики для tools ...
            document.getElementById('libLodash').addEventListener('click', () => loadPopularLibrary('lodash'));
            document.getElementById('libAxios').addEventListener('click', () => loadPopularLibrary('axios'));
            document.getElementById('libGSAP').addEventListener('click', () => loadPopularLibrary('gsap'));
            document.getElementById('btnFreeze').addEventListener('click', freezePage);
            document.getElementById('btnEditable').addEventListener('click', makePageEditable);
            document.getElementById('btnDraggable').addEventListener('click', makeEverythingDraggable);
            document.getElementById('btnDisableLinks').addEventListener('click', disableAllLinks);
        }

        // ← ВСТАВИТЬ СЮДА ВАШ КОД (else if (tabName === 'io') { ... })

       else if (tabName === 'tools') {
            content.innerHTML = `
                <h3>Advanced Delete</h3>
                <input type="text" class="we-input" id="deleteSelector" placeholder="CSS selector">
                <div class="we-btn-group">
                    <button class="we-btn-secondary" id="btnHideSel">Hide</button>
                    <button class="we-btn-danger" id="btnDeleteSel">Delete</button>
                </div>

                <h3>Delete By</h3>
                <input type="text" class="we-input" id="deleteValue" placeholder="class/id/tag/text">
                <div class="we-btn-grid">
                    <button class="we-btn-secondary" id="btnDelClass">By Class</button>
                    <button class="we-btn-secondary" id="btnDelId">By ID</button>
                    <button class="we-btn-secondary" id="btnDelTag">By Tag</button>
                    <button class="we-btn-secondary" id="btnDelText">By Text</button>
                </div>

                <h3>Batch Delete</h3>
                <div class="we-btn-grid">
                    <button class="we-btn-secondary" id="btnDelEmpty">Empty Elements</button>
                    <button class="we-btn-secondary" id="btnDelHidden">Hidden Elements</button>
                </div>

                <h3>Script Loader</h3>
                <input type="text" class="we-input" id="scriptURL" placeholder="Script URL">
                <button class="we-btn" id="btnLoadScript">Load Script</button>

                <h3>Popular Libraries</h3>
                <div class="we-btn-grid">
                    <button class="we-btn-secondary" id="libJQuery">jQuery</button>
                    <button class="we-btn-secondary" id="libLodash">Lodash</button>
                    <button class="we-btn-secondary" id="libAxios">Axios</button>
                    <button class="we-btn-secondary" id="libGSAP">GSAP</button>
                </div>

                <h3>Page Control</h3>
                <div class="we-btn-grid">
                    <button class="we-btn-secondary" id="btnFreeze">❄️ Freeze</button>
                    <button class="we-btn-secondary" id="btnEditable">✏️ Editable</button>
                    <button class="we-btn-secondary" id="btnDraggable">👆 Draggable</button>
                    <button class="we-btn-secondary" id="btnDisableLinks">🔗 Disable Links</button>
                </div>
            `;

            document.getElementById('btnHideSel').addEventListener('click', () => {
                advancedDelete(document.getElementById('deleteSelector').value, { hide: true });
            });
            document.getElementById('btnDeleteSel').addEventListener('click', () => {
                advancedDelete(document.getElementById('deleteSelector').value, { hide: false });
            });
            document.getElementById('btnDelClass').addEventListener('click', () => {
                deleteByClass(document.getElementById('deleteValue').value);
            });
            document.getElementById('btnDelId').addEventListener('click', () => {
                deleteById(document.getElementById('deleteValue').value);
            });
            document.getElementById('btnDelTag').addEventListener('click', () => {
                deleteByTag(document.getElementById('deleteValue').value);
            });
            document.getElementById('btnDelText').addEventListener('click', () => {
                deleteContaining(document.getElementById('deleteValue').value);
            });
            document.getElementById('btnDelEmpty').addEventListener('click', deleteAllEmpty);
            document.getElementById('btnDelHidden').addEventListener('click', deleteAllHidden);
            document.getElementById('btnLoadScript').addEventListener('click', () => {
                const url = document.getElementById('scriptURL').value;
                if (url) loadExternalScript(url);
            });
            document.getElementById('libJQuery').addEventListener('click', () => loadPopularLibrary('jquery'));
            document.getElementById('libLodash').addEventListener('click', () => loadPopularLibrary('lodash'));
            document.getElementById('libAxios').addEventListener('click', () => loadPopularLibrary('axios'));
            document.getElementById('libGSAP').addEventListener('click', () => loadPopularLibrary('gsap'));
            document.getElementById('btnFreeze').addEventListener('click', freezePage);
            document.getElementById('btnEditable').addEventListener('click', makePageEditable);
            document.getElementById('btnDraggable').addEventListener('click', makeEverythingDraggable);
            document.getElementById('btnDisableLinks').addEventListener('click', disableAllLinks);
        }

        else if (tabName === 'io') {
            content.innerHTML = `
                <h3>Export Options</h3>
                <div class="we-btn-grid">
                    <button class="we-btn" id="btnExportAll">💾 Full Export</button>
                    <button class="we-btn" id="btnExportCSS">🎨 CSS Only</button>
                    <button class="we-btn" id="btnExportJS">⚙️ JS Only</button>
                    <button class="we-btn" id="btnExportHTML">📄 HTML Only</button>
                </div>

                <h3>Import</h3>
                <input type="file" class="we-input" id="importFile" accept=".json">
                <button class="we-btn" id="btnImport">Import JSON</button>
            `;

            document.getElementById('btnExportAll').addEventListener('click', exportAll);
            document.getElementById('btnExportCSS').addEventListener('click', exportCSS);
            document.getElementById('btnExportJS').addEventListener('click', exportJS);
            document.getElementById('btnExportHTML').addEventListener('click', exportHTML);
            document.getElementById('btnImport').addEventListener('click', () => {
                const file = document.getElementById('importFile').files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => importFromJSON(e.target.result);
                    reader.readAsText(file);
                }
            });
        }

        else if (tabName === 'settings') {
            content.innerHTML = `
                <h3>Features</h3>
                <label class="we-toggle">
                    <input type="checkbox" id="toggleStealth" ${state.stealthMode ? 'checked' : ''}>
                    <span>👁️ Stealth Mode</span>
                </label>
                <label class="we-toggle">
                    <input type="checkbox" id="toggleAntiReload" ${state.antiReload ? 'checked' : ''}>
                    <span>💾 Anti-Reload</span>
                </label>
                <label class="we-toggle">
                    <input type="checkbox" id="toggleAntiRedirect" ${state.antiRedirect ? 'checked' : ''}>
                    <span>🔒 Anti-Redirect</span>
                </label>
                <label class="we-toggle">
                    <input type="checkbox" id="toggleAntiBot" ${state.antiBot ? 'checked' : ''}>
                    <span>🤖 Anti-Bot</span>
                </label>
                <label class="we-toggle">
                    <input type="checkbox" id="toggleAntiAdBlock" ${state.antiAdBlock ? 'checked' : ''}>
                    <span>🚫 Anti-AdBlock 2.0</span>
                </label>
                <label class="we-toggle">
                    <input type="checkbox" id="toggleFPS" ${state.showFPS ? 'checked' : ''}>
                    <span>📊 Show FPS Counter</span>
                </label>

                <h3>FPS Limit</h3>
                <select class="we-select" id="fpsLimitSelect">
                    <option value="30" ${state.fpsLimit === 30 ? 'selected' : ''}>30 FPS</option>
                    <option value="60" ${state.fpsLimit === 60 ? 'selected' : ''}>60 FPS</option>
                    <option value="120" ${state.fpsLimit === 120 ? 'selected' : ''}>120 FPS</option>
                    <option value="0" ${state.fpsLimit === 0 ? 'selected' : ''}>Unlimited</option>
                </select>
            `;

            document.getElementById('toggleStealth').addEventListener('change', function() {
                state.stealthMode = this.checked;
                saveToStorage('stealth', this.checked);
            });
            document.getElementById('toggleAntiReload').addEventListener('change', function() {
                state.antiReload = this.checked;
                saveToStorage('antireload', this.checked);
            });
            document.getElementById('toggleAntiRedirect').addEventListener('change', function() {
                state.antiRedirect = this.checked;
                saveToStorage('antiredirect', this.checked);
                if (this.checked) initAntiRedirect();
            });
            document.getElementById('toggleAntiBot').addEventListener('change', function() {
                state.antiBot = this.checked;
                saveToStorage('antibot', this.checked);
                if (this.checked) initAntiBot();
            });
            document.getElementById('toggleAntiAdBlock').addEventListener('change', function() {
                state.antiAdBlock = this.checked;
                saveToStorage('antiadblock', this.checked);
                if (this.checked) initAntiAdBlock();
            });
            document.getElementById('toggleFPS').addEventListener('change', function() {
                state.showFPS = this.checked;
                saveToStorage('showfps', this.checked);
                if (this.checked) {
                    initFPSCounter();
                } else {
                    removeFPSCounter();
                }
            });
            document.getElementById('fpsLimitSelect').addEventListener('change', function() {
                setFPSLimit(parseInt(this.value));
            });
        }

        else if (tabName === 'danger') {
            content.innerHTML = `
                <div class="we-danger-warning">⚠️ DANGER ZONE ⚠️</div>

                <h3>Menu Control</h3>
                <button class="we-btn-danger" id="btnMenuDelete">🗑️ Delete Menu</button>
                <button class="we-btn-danger" id="btnMenuRemove">💀 Remove Completely</button>

                <h3>Site Destruction</h3>
                <button class="we-btn-danger" id="btnNuke">💣 Nuke Site</button>
                <button class="we-btn-danger" id="btnNukeAnim">🔥 Animated Nuke</button>

                <h3>Advanced Tools</h3>
                <button class="we-btn" id="btnWorkspace">🛠️ Workspace Access</button>
                <div class="we-btn-grid">
                    <button class="we-btn-secondary" id="btnRemoveScripts">Remove Scripts</button>
                </div>
            `;

            document.getElementById('btnMenuDelete').addEventListener('click', deleteMenu);
            document.getElementById('btnMenuRemove').addEventListener('click', completelyRemoveMenu);
            document.getElementById('btnNuke').addEventListener('click', nukeSite);
            document.getElementById('btnNukeAnim').addEventListener('click', nukeWithAnimation);
            document.getElementById('btnWorkspace').addEventListener('click', enableWorkspaceAccess);
            document.getElementById('btnRemoveScripts').addEventListener('click', removeAllScripts);
        }
    }
            // ═══════════════════════════════════════════════════════════
    // STYLES - COMPLETE CSS
    // ═══════════════════════════════════════════════════════════

    function addStyles() {
        if (document.getElementById('webEditStyles')) return;

        const style = document.createElement('style');
        style.id = 'webEditStyles';
        style.textContent = `
            /* Main Container */
            #webEditContainer {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                font-size: 14px;
            }

            /* Panel */
            .we-panel {
                width: 420px;
                max-height: 90vh;
                background: #1a1a1a;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            /* Header */
            .we-header {
                background: #0d0d0d;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #333;
                cursor: move;
            }

            .we-title {
                color: #fff;
                font-weight: 700;
                font-size: 16px;
                user-select: none;
            }

            .we-close {
                background: rgba(255,255,255,0.1);
                border: none;
                color: #fff;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 20px;
                transition: all 0.2s;
            }

            .we-close:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }

            /* Tabs */
            .we-tabs {
                display: flex;
                background: #0d0d0d;
                padding: 8px;
                gap: 4px;
                overflow-x: auto;
                border-bottom: 1px solid #333;
            }

            .we-tabs::-webkit-scrollbar {
                height: 4px;
            }

            .we-tabs::-webkit-scrollbar-thumb {
                background: #667eea;
                border-radius: 2px;
            }

            .we-tab {
                padding: 8px 12px;
                border: none;
                background: transparent;
                color: #888;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.2s;
                white-space: nowrap;
                flex-shrink: 0;
            }

            .we-tab:hover {
                background: rgba(255,255,255,0.05);
                color: #fff;
            }

            .we-tab.active {
                background: #667eea;
                color: #fff;
            }

            /* Content */
            .we-content {
                background: #1a1a1a;
                color: #e0e0e0;
                padding: 20px;
                overflow-y: auto;
                max-height: calc(90vh - 150px);
            }

            .we-content::-webkit-scrollbar {
                width: 8px;
            }

            .we-content::-webkit-scrollbar-track {
                background: #0d0d0d;
            }

            .we-content::-webkit-scrollbar-thumb {
                background: #667eea;
                border-radius: 4px;
            }

            /* Typography */
            h3 {
                color: #fff;
                font-size: 14px;
                font-weight: 600;
                margin: 20px 0 12px 0;
                padding-bottom: 8px;
                border-bottom: 2px solid #667eea;
            }

            h3:first-child {
                margin-top: 0;
            }

            label {
                display: block;
                color: #ccc;
                font-size: 12px;
                margin-bottom: 4px;
                margin-top: 8px;
            }

            /* Buttons */
            .we-btn, .we-btn-secondary, .we-btn-danger {
                width: 100%;
                padding: 12px;
                margin-bottom: 8px;
                border: none;
                border-radius: 8px;
                color: #fff;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
                box-sizing: border-box;
            }

            .we-btn {
                background: #667eea;
            }

            .we-btn:hover {
                background: #5568d3;
                transform: translateY(-2px);
            }

            .we-btn-secondary {
                background: #333;
            }

            .we-btn-secondary:hover {
                background: #444;
            }

            .we-btn-danger {
                background: #f44336;
            }

            .we-btn-danger:hover {
                background: #d32f2f;
            }

            .we-btn-large {
                padding: 16px;
                font-size: 16px;
            }

            .we-btn-group {
                display: flex;
                gap: 8px;
            }

            .we-btn-group .we-btn,
            .we-btn-group .we-btn-secondary,
            .we-btn-group .we-btn-danger {
                flex: 1;
            }

            .we-btn-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
                margin-bottom: 8px;
            }

            .we-btn-danger-small {
                padding: 4px 8px;
                background: #f44336;
                border: none;
                color: #fff;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }

            /* Inputs */
            .we-input, .we-select, .we-textarea {
                width: 100%;
                padding: 10px;
                margin-bottom: 8px;
                border: 2px solid #333;
                border-radius: 6px;
                background: #0d0d0d;
                color: #e0e0e0;
                font-size: 14px;
                font-family: inherit;
                box-sizing: border-box;
            }

            .we-input:focus, .we-select:focus, .we-textarea:focus {
                outline: none;
                border-color: #667eea;
            }

            .we-textarea {
                min-height: 80px;
                resize: vertical;
                font-family: 'Courier New', monospace;
            }

            .we-textarea-large {
                width: 100%;
                min-height: 250px;
                padding: 12px;
                margin-bottom: 8px;
                border: 2px solid #333;
                border-radius: 6px;
                background: #0d0d0d;
                color: #0f0;
                font-size: 13px;
                font-family: 'Courier New', monospace;
                resize: vertical;
                box-sizing: border-box;
            }

            .we-textarea-large:focus {
                outline: none;
                border-color: #667eea;
            }

            .we-input-color {
                width: 100%;
                height: 40px;
                padding: 4px;
                border: 2px solid #333;
                border-radius: 6px;
                background: #0d0d0d;
                cursor: pointer;
            }

            .we-input-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 8px;
            }

            /* Info Boxes */
            .we-info {
                background: rgba(102, 126, 234, 0.1);
                border-left: 3px solid #667eea;
                padding: 12px;
                border-radius: 6px;
                color: #ccc;
                font-size: 13px;
                margin-bottom: 12px;
                line-height: 1.5;
            }

            .we-danger-warning {
                background: rgba(244, 67, 54, 0.1);
                border: 2px solid #f44336;
                padding: 12px;
                border-radius: 8px;
                color: #f44336;
                font-size: 14px;
                font-weight: 600;
                text-align: center;
                margin-bottom: 16px;
            }

            .we-element-info {
                background: #0d0d0d;
                border: 1px solid #333;
                padding: 12px;
                border-radius: 6px;
                font-size: 12px;
                color: #ccc;
                margin-bottom: 12px;
                line-height: 1.6;
            }

            .we-page-info {
                background: #0d0d0d;
                border: 1px solid #333;
                padding: 12px;
                border-radius: 6px;
                font-size: 12px;
                color: #ccc;
                line-height: 1.6;
            }

            /* Stats */
            .we-stats {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
                margin-bottom: 16px;
            }

            .we-stat {
                background: #0d0d0d;
                padding: 16px;
                border-radius: 8px;
                text-align: center;
                border: 1px solid #333;
            }

            .we-stat-num {
                font-size: 32px;
                font-weight: 700;
                color: #667eea;
                margin-bottom: 4px;
            }

            .we-stat-label {
                font-size: 12px;
                color: #888;
            }

            /* Features */
            .we-feature-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
                margin-bottom: 16px;
            }

            .we-feature {
                background: #0d0d0d;
                border: 2px solid #333;
                padding: 10px;
                border-radius: 6px;
                font-size: 12px;
                text-align: center;
                color: #888;
            }

            .we-feature.active {
                border-color: #667eea;
                background: rgba(102, 126, 234, 0.1);
                color: #667eea;
            }

            /* Presets */
            .we-preset-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
                margin-bottom: 12px;
            }

            .we-preset-btn {
                padding: 14px 12px;
                border: 2px solid #333;
                border-radius: 8px;
                background: #0d0d0d;
                color: #fff;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s;
            }

            .we-preset-btn:hover {
                border-color: #667eea;
                background: rgba(102, 126, 234, 0.1);
                transform: translateY(-2px);
            }

            /* Toggle */
            .we-toggle {
                display: flex;
                align-items: center;
                padding: 12px;
                margin-bottom: 8px;
                background: #0d0d0d;
                border-radius: 8px;
                cursor: pointer;
                border: 1px solid #333;
                transition: all 0.2s;
            }

            .we-toggle:hover {
                border-color: #667eea;
            }

            .we-toggle input[type="checkbox"] {
                width: 40px;
                height: 20px;
                margin-right: 12px;
                cursor: pointer;
                accent-color: #667eea;
            }

            .we-toggle span {
                color: #e0e0e0;
                font-size: 14px;
            }

            .we-toggle-small {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 6px 10px;
                background: #0d0d0d;
                border: 1px solid #333;
                border-radius: 6px;
                font-size: 12px;
                cursor: pointer;
            }

            .we-toggle-small input[type="checkbox"] {
                width: 30px;
                height: 16px;
                cursor: pointer;
                accent-color: #667eea;
            }

            .we-editor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            /* Console */
            .we-console {
                background: #0d0d0d;
                border: 2px solid #333;
                border-radius: 6px;
                padding: 12px;
                min-height: 100px;
                max-height: 200px;
                overflow-y: auto;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                color: #0f0;
                white-space: pre-wrap;
                word-break: break-all;
            }

            /* Requests */
            .we-requests {
                background: #0d0d0d;
                border: 2px solid #333;
                border-radius: 6px;
                padding: 8px;
                max-height: 400px;
                overflow-y: auto;
                margin-bottom: 8px;
            }

            .we-request {
                display: flex;
                gap: 8px;
                padding: 8px;
                margin-bottom: 4px;
                background: #1a1a1a;
                border-radius: 4px;
                font-size: 11px;
                align-items: center;
            }

            .we-req-method {
                padding: 3px 8px;
                border-radius: 4px;
                background: #667eea;
                color: #fff;
                font-weight: 600;
                min-width: 50px;
                text-align: center;
                font-size: 10px;
            }

            .we-req-status {
                padding: 3px 8px;
                border-radius: 4px;
                background: #4caf50;
                color: #fff;
                font-weight: 600;
                min-width: 45px;
                text-align: center;
                font-size: 10px;
            }

            .we-req-url {
                color: #888;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex: 1;
            }

            .we-req-btn {
                padding: 4px 8px;
                background: #333;
                border: none;
                color: #fff;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }

            .we-req-btn:hover {
                background: #444;
            }

            .we-blocked-list {
                background: #0d0d0d;
                border: 2px solid #333;
                border-radius: 6px;
                padding: 8px;
                max-height: 200px;
                overflow-y: auto;
            }

            .we-blocked-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                margin-bottom: 4px;
                background: #1a1a1a;
                border-radius: 4px;
                font-size: 12px;
                color: #ccc;
            }

            .we-loaded-scripts {
                background: #0d0d0d;
                border: 2px solid #333;
                border-radius: 6px;
                padding: 8px;
                max-height: 200px;
                overflow-y: auto;
            }

            .we-script-item {
                padding: 8px;
                margin-bottom: 4px;
                background: #1a1a1a;
                border-radius: 4px;
                font-size: 12px;
                color: #0f0;
                font-family: monospace;
            }

            /* Quick Menu */
            .we-quick-menu {
                position: fixed;
                width: 320px;
                background: #1a1a1a;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                z-index: 999999998;
                overflow: hidden;
            }

            .we-quick-header {
                background: #667eea;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .we-quick-header span {
                color: #fff;
                font-weight: 600;
                font-size: 14px;
            }

            .we-quick-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: #fff;
                width: 28px;
                height: 28px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 18px;
            }

            .we-quick-body {
                padding: 16px;
                max-height: 500px;
                overflow-y: auto;
            }

            .we-quick-info {
                background: #0d0d0d;
                padding: 8px;
                border-radius: 4px;
                font-size: 11px;
                color: #888;
                margin-bottom: 12px;
            }

            .we-quick-input, .we-quick-color {
                width: 100%;
                padding: 8px;
                border: 2px solid #333;
                border-radius: 6px;
                background: #0d0d0d;
                color: #e0e0e0;
                font-size: 13px;
                margin-bottom: 8px;
                box-sizing: border-box;
            }

            .we-quick-color {
                height: 40px;
            }

            .we-quick-btn {
                width: 100%;
                padding: 10px;
                border: none;
                border-radius: 6px;
                background: #667eea;
                color: #fff;
                cursor: pointer;
                font-size: 13px;
                margin-bottom: 8px;
            }

            .we-quick-btn:hover {
                background: #5568d3;
            }

            .we-quick-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
            }

            .we-quick-btn-secondary, .we-quick-btn-danger {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 6px;
                color: #fff;
                cursor: pointer;
                font-size: 13px;
            }

            .we-quick-btn-secondary {
                background: #333;
            }

            .we-quick-btn-danger {
                background: #f44336;
            }
        `;

        document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════
    // HOTKEYS SYSTEM
    // ═══════════════════════════════════════════════════════════

    function initHotkeys() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // F2 - Toggle UI
            if (e.key === 'F2') {
                e.preventDefault();
                toggleUI();
            }

            // F3 - Quick Edit
            else if (e.key === 'F3') {
                e.preventDefault();
                enableQuickEdit();
            }

            // F4 - Element Selection
            else if (e.key === 'F4') {
                e.preventDefault();
                enableElementSelection();
            }

            // Ctrl+Shift+Delete - Nuke (Easter egg)
            else if (e.ctrlKey && e.shiftKey && e.key === 'Delete') {
                e.preventDefault();
                nukeSite();
            }

            // Alt+D - Dark Theme
            else if (e.altKey && e.key === 'd') {
                e.preventDefault();
                applyDarkTheme();
            }

            // Alt+L - Light Theme
            else if (e.altKey && e.key === 'l') {
                e.preventDefault();
                applyLightTheme();
            }

            // Ctrl+E - Export
            else if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                exportAll();
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════

    function init() {
        devLog('Initializing WEB EDIT v' + VERSION);

        // Create global API FIRST
        window.webEdit = {
            // Core
            toggleUI, switchTab,

            // Quick Edit
            enableQuickEdit, disableQuickEdit, closeQuickMenu,
            quickChangeText, quickApplyColors, quickApplySize,
            quickHide, quickCopy, quickDelete, quickAdvanced,

            // Element
            enableElementSelection, disableElementSelection,
            clearSelection, cloneSelectedElement, wrapSelectedElement,
            exportSelectedElement,

            // Text
            changeText, changeTextColor, changeTextSize, hideText,
            uppercaseAll, lowercaseAll, randomizeText,

            // Presets
            applyDarkTheme, applyLightTheme, applyHighContrast,
            applyReaderMode, increaseFonts, decreaseFonts, resetFonts,
            removeAds, removeImages, removeVideos, removeAllMedia,
            grayscaleEverything, invertAllColors, rotatePageUpsideDown,
            rainbowMode, makeEverythingComic,

            // Editors
            applyCSSCode, clearCustomCSS, enableQuickModeCSS, disableQuickModeCSS,
            executeJSCode, enableQuickModeJS, disableQuickModeJS,
            applyHTMLCode, enableQuickModeHTML, disableQuickModeHTML,

            // HTTP
            blockURL, unblockURL, modifyRequest, repeatRequest,
            clearAllRequests, exportRequests,

            // Advanced
            advancedDelete, deleteByClass, deleteById, deleteByTag,
            deleteByAttribute, deleteContaining, deleteAllEmpty, deleteAllHidden,

            // Scripts
            loadExternalScript, loadScriptFromText, loadPopularLibrary,

            // Import/Export
            exportAll, exportCSS, exportJS, exportHTML, importFromJSON,

            // Danger Zone
            deleteMenu, completelyRemoveMenu, nukeSite, nukeWithAnimation,
            freezePage, unfreezePage, makePageEditable, disablePageEditable,
            removeAllScripts, disableAllLinks, enableAllLinks,
            makeEverythingDraggable, blurBackground,
            enableWorkspaceAccess, executeWorkspaceCommand,

            // FPS
            initFPSCounter, removeFPSCounter, setFPSLimit,

            // State
            getState: () => state,
            version: VERSION
        };

        // Create UI
        createUI();

        // Initialize systems
        initHTTPInterceptor();
        initHotkeys();

        if (state.antiRedirect) initAntiRedirect();
        if (state.antiBot) initAntiBot();
        if (state.antiAdBlock) initAntiAdBlock();
        if (state.showFPS) initFPSCounter();
        if (state.customCSS) applyCSSCode(state.customCSS);

        console.log('%c🛠️ WEB EDIT v' + VERSION + ' MEGA ULTIMATE',
            'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 12px 24px; border-radius: 8px; font-size: 18px; font-weight: bold;');
        console.log('%c✅ ALL SYSTEMS LOADED!',
            'color: #0f0; font-size: 16px; font-weight: bold;');
        console.log('%c📋 200+ Features Active',
            'color: #888; font-size: 12px;');
        console.log('%c⌨️ Hotkeys:',
            'color: #667eea; font-size: 14px; font-weight: bold;');
        console.log('%c  F2: Toggle Menu | F3: Quick Edit | F4: Element Select',
            'color: #667eea; font-size: 12px;');
        console.log('%c  Alt+D: Dark Theme | Alt+L: Light Theme | Ctrl+E: Export',
            'color: #667eea; font-size: 12px;');
        console.log('%c  Ctrl+Shift+Delete: Nuke Site 💣',
            'color: #f44336; font-size: 12px; font-weight: bold;');
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
// В табе 'tools' после строки с jQuery добавьте остальные обработчики:

document.getElementById('libLodash').addEventListener('click', () => loadPopularLibrary('lodash'));
document.getElementById('libAxios').addEventListener('click', () => loadPopularLibrary('axios'));
document.getElementById('libGSAP').addEventListener('click', () => loadPopularLibrary('gsap'));
document.getElementById('btnFreeze').addEventListener('click', () => {
    if (document.body.style.pointerEvents === 'none') {
        unfreezePage();
    } else {
        freezePage();
    }
});
document.getElementById('btnEditable').addEventListener('click', () => {
    if (document.designMode === 'on') {
        disablePageEditable();
    } else {
        makePageEditable();
    }
});
document.getElementById('btnDraggable').addEventListener('click', makeEverythingDraggable);
document.getElementById('btnDisableLinks').addEventListener('click', () => {
    if (document.querySelector('a[style*="pointer-events: none"]')) {
        enableAllLinks();
    } else {
        disableAllLinks();
    }
});
// В табе 'tools' после строки с jQuery добавьте остальные обработчики:

document.getElementById('libLodash').addEventListener('click', () => loadPopularLibrary('lodash'));
document.getElementById('libAxios').addEventListener('click', () => loadPopularLibrary('axios'));
document.getElementById('libGSAP').addEventListener('click', () => loadPopularLibrary('gsap'));
document.getElementById('btnFreeze').addEventListener('click', () => {
    if (document.body.style.pointerEvents === 'none') {
        unfreezePage();
    } else {
        freezePage();
    }
});
document.getElementById('btnEditable').addEventListener('click', () => {
    if (document.designMode === 'on') {
        disablePageEditable();
    } else {
        makePageEditable();
    }
});
document.getElementById('btnDraggable').addEventListener('click', makeEverythingDraggable);
document.getElementById('btnDisableLinks').addEventListener('click', () => {
    if (document.querySelector('a[style*="pointer-events: none"]')) {
        enableAllLinks();
    } else {
        disableAllLinks();
    }
});
})();

// ═══════════════════════════════════════════════════════════
// END OF WEB EDIT v4.3.0 MEGA ULTIMATE
// ═══════════════════════════════════════════════════════════