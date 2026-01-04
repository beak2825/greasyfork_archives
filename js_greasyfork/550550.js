// ==UserScript==
// @name         Torn Framework
// @version      2.1
// @namespace    http://tampermonkey.net/
// @description  Framework with proper script communication
// @author
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/550550/Torn%20Framework.user.js
// @updateURL https://update.greasyfork.org/scripts/550550/Torn%20Framework.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('=== TORN FRAMEWORK VERSION STARTING ===');

    // Use unsafeWindow to ensure global access
    const globalWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // Prevent multiple instances
    if (globalWindow.TornFramework) {
        console.log('WARNING: TornFramework already exists!', globalWindow.TornFramework);
        return;
    }

    // Global framework object
    globalWindow.TornFramework = {
        version: '2.1-FIXED',
        modules: new Map(),
        initialized: false,
        debug: true
    };

    console.log('Framework object created on globalWindow:', globalWindow.TornFramework);

    // Settings
    let settings = {
        consoleEnabled: GM_getValue('consoleEnabled', true),
        menuVisible: GM_getValue('menuVisible', false)
    };

    function saveSettings() {
        Object.keys(settings).forEach(key => {
            GM_setValue(key, settings[key]);
        });
    }

    // =========================
    // LOGGING SYSTEM
    // =========================
    const logDiv = document.createElement("div");
    logDiv.id = 'torn-framework-console';
    logDiv.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 450px;
        max-height: 300px;
        overflow-y: auto;
        background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,20,0.95));
        color: white;
        font-size: 11px;
        z-index: 999999;
        padding: 12px;
        border-radius: 0 12px 0 0;
        font-family: 'Consolas', 'Monaco', monospace;
        border: 2px solid #37b24d;
        box-shadow: 0 4px 20px rgba(55,178,77,0.3);
        backdrop-filter: blur(10px);
        display: ${settings.consoleEnabled ? 'block' : 'none'};
    `;
    document.body.appendChild(logDiv);

    function log(msg, type = 'info', module = 'FRAMEWORK') {
        try {
            const timestamp = new Date().toLocaleTimeString();
            const p = document.createElement("div");

            const colors = {
                'error': '#ff6b6b',
                'success': '#51cf66',
                'warning': '#ffd43b',
                'info': '#74c0fc',
                'debug': '#9775fa'
            };

            p.style.cssText = `
                color: ${colors[type] || '#ccc'};
                padding: 3px 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                font-size: 10px;
                line-height: 1.3;
            `;

            const moduleColor = module === 'FRAMEWORK' ? '#37b24d' : '#f59f00';
            p.innerHTML = `<span style="color: #666;">[${timestamp}]</span> <span style="color: ${moduleColor}; font-weight: bold;">[${module}]</span> ${msg}`;

            logDiv.appendChild(p);
            logDiv.scrollTop = logDiv.scrollHeight;

            // Limit to 100 logs
            while (logDiv.children.length > 100) {
                logDiv.removeChild(logDiv.firstChild);
            }

            console.log(`[TornFramework:${module}] ${msg}`);
        } catch (error) {
            console.error('Framework logging failed:', error);
        }
    }

    globalWindow.TornFramework.log = log;
    log('Framework logging system initialized', 'success');

    // =========================
    // MAIN MENU SYSTEM
    // =========================
    const modMenu = document.createElement("div");
    modMenu.id = 'torn-framework-menu';
    modMenu.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 420px;
        max-height: 85vh;
        overflow-y: auto;
        background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,20,0.95));
        color: white;
        font-size: 12px;
        z-index: 1000000;
        padding: 20px;
        border-radius: 12px;
        font-family: 'Segoe UI', Arial, sans-serif;
        border: 2px solid #37b24d;
        box-shadow: 0 8px 32px rgba(55,178,77,0.4);
        backdrop-filter: blur(10px);
        display: none;
    `;

    modMenu.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #37b24d; padding-bottom: 15px;">
            <h3 style="margin: 0; color: #37b24d; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Torn Framework v${globalWindow.TornFramework.version}</h3>
            <button id="closeMenu" style="background: linear-gradient(45deg, #f03e3e, #c92a2a); border: none; color: white; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px;">✕</button>
        </div>

        <!-- FRAMEWORK STATUS -->
        <div style="margin-bottom: 15px; padding: 12px; background: linear-gradient(45deg, rgba(55,178,77,0.1), rgba(116,184,22,0.1)); border-radius: 8px; border: 1px solid #37b24d;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 10px; margin-bottom: 8px;">
                <div>Modules: <span id="moduleCount">0</span></div>
                <div>Active: <span id="activeCount">0</span></div>
                <div>Uptime: <span id="uptimeDisplay">0s</span></div>
            </div>
            <div id="moduleList" style="max-height: 80px; overflow-y: auto; font-size: 9px; color: #ccc;"></div>
        </div>

        <!-- FRAMEWORK SETTINGS -->
        <div style="margin-bottom: 15px; border: 1px solid #37b24d; padding: 12px; border-radius: 8px;">
            <h4 style="margin: 0 0 12px 0; color: #37b24d;">Framework Settings</h4>
            <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 8px;">
                <input type="checkbox" id="consoleEnabled" ${settings.consoleEnabled ? 'checked' : ''}>
                <span style="margin-left: 8px;">Debug Console</span>
            </label>
        </div>

        <!-- MODULE SECTIONS WILL BE INJECTED HERE -->
        <div id="moduleMenuSections"></div>
    `;
    document.body.appendChild(modMenu);

    // Menu toggle button
    const menuBtn = document.createElement("button");
    menuBtn.innerHTML = "⚙️";
    menuBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 999999;
        background: linear-gradient(135deg, #37b24d, #51cf66);
        color: white;
        border: none;
        padding: 12px 14px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        box-shadow: 0 4px 16px rgba(55,178,77,0.4);
        transition: all 0.3s ease;
    `;
    menuBtn.onclick = () => {
        const isVisible = modMenu.style.display !== 'none';
        modMenu.style.display = isVisible ? 'none' : 'block';
        menuBtn.style.right = isVisible ? '10px' : '440px';
        if (!isVisible) updateFrameworkStatus();
        settings.menuVisible = !isVisible;
        saveSettings();
    };
    document.body.appendChild(menuBtn);

    // =========================
    // MODULE MANAGEMENT
    // =========================
    globalWindow.TornFramework.registerModule = function (moduleConfig) {
        const {
            name,
            version = '1.0',
            description = '',
            menuSection = null,
            initialize = null,
            cleanup = null,
            isActive = () => false
        } = moduleConfig;

        log(`Module registration attempt: ${name}`, 'info');

        if (!name) {
            log('Module registration failed: name is required', 'error');
            return false;
        }

        if (globalWindow.TornFramework.modules.has(name)) {
            log(`Module ${name} already registered, updating...`, 'warning');
        }

        const module = { name, version, description, menuSection, initialize, cleanup, isActive, registered: Date.now() };
        globalWindow.TornFramework.modules.set(name, module);
        log(`Module registered: ${name} v${version}`, 'success');

        if (menuSection) addModuleMenuSection(name, menuSection);

        if (initialize && typeof initialize === 'function') {
            try {
                initialize();
                log(`Module ${name} initialized`, 'success');
            } catch (error) {
                log(`Module ${name} initialization failed: ${error.message}`, 'error');
            }
        }

        updateFrameworkStatus();
        return true;
    };

    function addModuleMenuSection(moduleName, sectionHTML) {
        const container = document.getElementById('moduleMenuSections');
        if (!container) return;

        const existing = document.getElementById(`module-${moduleName}`);
        if (existing) existing.remove();

        const section = document.createElement('div');
        section.id = `module-${moduleName}`;
        section.style.cssText = 'margin-bottom: 15px; border: 1px solid #f59f00; padding: 12px; border-radius: 8px;';
        section.innerHTML = sectionHTML;

        container.appendChild(section);
        log(`Menu section added for module: ${moduleName}`, 'debug');
    }

    function updateFrameworkStatus() {
        try {
            const moduleCount = globalWindow.TornFramework.modules.size;
            const activeCount = Array.from(globalWindow.TornFramework.modules.values())
                .filter(module => module.isActive()).length;
            const uptime = Math.floor((Date.now() - globalWindow.TornFramework.startTime) / 1000);

            document.getElementById('moduleCount').textContent = moduleCount;
            document.getElementById('activeCount').textContent = activeCount;
            document.getElementById('uptimeDisplay').textContent = `${uptime}s`;

            const moduleList = document.getElementById('moduleList');
            if (moduleList) {
                const moduleInfo = Array.from(globalWindow.TornFramework.modules.values())
                    .map(module => {
                        const status = module.isActive() ? '🟢' : '🔴';
                        return `${status} ${module.name} v${module.version}`;
                    }).join('<br>');
                moduleList.innerHTML = moduleInfo || 'No modules loaded';
            }
        } catch (error) {
            log(`Status update failed: ${error.message}`, 'error');
        }
    }

    // =========================
    // SETTINGS EVENTS
    // =========================
    function setupFrameworkEvents() {
        document.getElementById('closeMenu').onclick = () => {
            modMenu.style.display = 'none';
            menuBtn.style.right = '10px';
            settings.menuVisible = false;
            saveSettings();
        };

        document.getElementById('consoleEnabled').onchange = function () {
            settings.consoleEnabled = this.checked;
            logDiv.style.display = settings.consoleEnabled ? 'block' : 'none';
            saveSettings();
        };
    }

    // =========================
    // INITIALIZATION
    // =========================
    function initFramework() {
        if (globalWindow.TornFramework.initialized) return;

        log('Initializing Torn Framework...', 'success');

        globalWindow.TornFramework.startTime = Date.now();
        globalWindow.TornFramework.initialized = true;

        setupFrameworkEvents();

        if (settings.menuVisible) {
            modMenu.style.display = 'block';
            menuBtn.style.right = '440px';
        }

        log('Framework ready! Modules can now register.', 'success');
        updateFrameworkStatus();

        // Periodically update status
        setInterval(updateFrameworkStatus, 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            log('DOM loaded, initializing framework');
            setTimeout(initFramework, 500);
        });
    } else {
        log('DOM already loaded, initializing framework');
        setTimeout(initFramework, 500);
    }

    log('Framework script completed loading');
})();
