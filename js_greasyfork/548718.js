// ==UserScript==
// @name         EarlyX
// @namespace    http://tampermonkey.net/
// @version      0.2.17
// @description  Detects and allows modifying feature flags
// @author       blankspeaker
// @match        https://x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.x.com/*
// @icon         https://x.com/favicon.ico
// @grant        none
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548718/EarlyX.user.js
// @updateURL https://update.greasyfork.org/scripts/548718/EarlyX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[EarlyX] Script starting...');

// Poll for __INITIAL_STATE__ instead of intercepting (fallback if defineProperty causes hangs)
const statePoll = setInterval(() => {
    if (window.__INITIAL_STATE__) {
        try {
            console.log('[EarlyX] Detected __INITIAL_STATE__ via poll');
            const state = window.__INITIAL_STATE__;
            if (state && state.featureSwitch && state.featureSwitch.user && state.featureSwitch.user.config) {
                // Capture current defaults first
                for (const flag in state.featureSwitch.user.config) {
                    const val = state.featureSwitch.user.config[flag].value;
                    if (val !== undefined && val !== null) {
                        let storedVal;
                        if (typeof val === 'string' && (val === 'true' || val === 'false')) {
                            storedVal = val === 'true';
                        } else {
                            storedVal = val;
                        }
                        if (!(flag in discoveredFlags)) {
                            discoveredFlags[flag] = storedVal;
                            discoveredTimestamps[flag] = Date.now();
                            console.log('[EarlyX] Discovered via state: ' + flag + ' = ' + storedVal);
                        } else if (discoveredFlags[flag] !== storedVal) {
                            console.log('[EarlyX] Updating default via state for ' + flag + ' from ' + discoveredFlags[flag] + ' to ' + storedVal);
                            discoveredFlags[flag] = storedVal;
                        }
                    }
                }
                if (state.userClaim && state.userClaim.config && state.userClaim.config.subscriptions) {
                    for (const flag in state.userClaim.config.subscriptions) {
                        const val = state.userClaim.config.subscriptions[flag].value;
                        if (val !== undefined && val !== null) {
                            let storedVal;
                            if (typeof val === 'string' && (val === 'true' || val === 'false')) {
                                storedVal = val === 'true';
                            } else {
                                storedVal = val;
                            }
                            if (!(flag in discoveredFlags)) {
                                discoveredFlags[flag] = storedVal;
                                discoveredTimestamps[flag] = Date.now();
                                console.log('[EarlyX] Discovered via state: ' + flag + ' = ' + storedVal);
                            } else if (discoveredFlags[flag] !== storedVal) {
                                console.log('[EarlyX] Updating default via state for ' + flag + ' from ' + discoveredFlags[flag] + ' to ' + storedVal);
                                discoveredFlags[flag] = storedVal;
                            }
                        }
                    }
                }
                saveDiscovered();

                // Now apply overrides - only for known flags
                for (const flag in userOverrides) {
                    if (flag in discoveredFlags) {
                        applyOverrideToState(flag, userOverrides[flag]);
                    }
                }
                console.log('[EarlyX] Applied overrides via poll');
            } else {
                console.warn('[EarlyX] __INITIAL_STATE__ structure not as expected in poll');
            }
        } catch (e) {
            console.error('[EarlyX] Error applying overrides in poll:', e);
        }
        clearInterval(statePoll);
    }
}, 10);  // Check every 10ms; adjust if needed

    // Global for debug mode
    window.__DEBUG_MODE__ = true;

    // Preloaded boolean flags from page source, updated with all boolean flags
    const PRELOADED_FLAGS = {
//"responsive_web_mobile_app_spotlight_v1_display": false,
//"responsive_web_not_a_bot_signups_enabled": false,
//"responsive_web_ocf_2fa_x_migration": false
    };

    // Storage for discovered flags and user overrides
    let discoveredFlags = JSON.parse(localStorage.getItem('earlyxDiscoveredFlags') || '{}');
    let discoveredTimestamps = JSON.parse(localStorage.getItem('earlyxDiscoveredTimestamps') || '{}');
    let userOverrides = JSON.parse(localStorage.getItem('earlyxOverrides') || '{}');  // {flagName: userValue}

    // Preload flags if not already discovered
    Object.keys(PRELOADED_FLAGS).forEach(flag => {
        if (!(flag in discoveredFlags)) {
            discoveredFlags[flag] = PRELOADED_FLAGS[flag];
            discoveredTimestamps[flag] = Date.now() - 86400000; // Set to yesterday to not highlight as new
        }
    });

    function saveDiscovered() {
        localStorage.setItem('earlyxDiscoveredFlags', JSON.stringify(discoveredFlags));
        localStorage.setItem('earlyxDiscoveredTimestamps', JSON.stringify(discoveredTimestamps));
    }

    function convertToType(value, targetType) {
        if (targetType === 'boolean') {
            return value === true || value === 'true';
        } else if (targetType === 'number') {
            return parseFloat(value) || 0;
        } else {
            return String(value);
        }
    }

    function applyOverrideToState(flag, overrideValue) {
        try {
            const state = window.__INITIAL_STATE__;
            if (!state) return;
            const defaultVal = discoveredFlags[flag];
            if (defaultVal === undefined) return;
            const targetType = typeof defaultVal;
            const typedOverride = convertToType(overrideValue, targetType);
            let config;
            if (flag.startsWith('subscriptions_')) {
                if (!state.userClaim) state.userClaim = {config: {subscriptions: {}}};
                else if (!state.userClaim.config) state.userClaim.config = {subscriptions: {}};
                else if (!state.userClaim.config.subscriptions) state.userClaim.config.subscriptions = {};
                config = state.userClaim.config.subscriptions;
            } else {
                if (!state.featureSwitch) state.featureSwitch = {user: {config: {}}};
                else if (!state.featureSwitch.user) state.featureSwitch.user = {config: {}};
                else if (!state.featureSwitch.user.config) state.featureSwitch.user.config = {};
                config = state.featureSwitch.user.config;
            }
            if (typedOverride === undefined) {
                delete config[flag];
            } else {
                config[flag] = { value: typedOverride };
            }
            console.log('[EarlyX] Applied typed override to state for ' + flag + ' (' + targetType + ')');
        } catch (e) {
            console.error('[EarlyX] Error applying override to state for ' + flag + ':', e);
        }
    }

    // UI Elements
    let toggleButton = null;
    let modal = null;
    let flagList = null;
    let searchInput = null;
    let addFlagInput = null;
    let addFlagCheckbox = null;
    let addFlagButton = null;
    let title = null;
    let buttonContainer = null;
    let addFlagSection = null;
    let activeTab = 'all';

    // Drag variables
    let isDragging = false;
    let wasDragged = false;
    let dragOffset = {x: 0, y: 0};
    let modalOpen = false;
    let moveListeners = null;

    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    function startDrag(e) {
        if (!modalOpen) return;
        wasDragged = false;
        isDragging = true;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        const rect = toggleButton.getBoundingClientRect();
        dragOffset.x = clientX - rect.left;
        dragOffset.y = clientY - rect.top;
        e.preventDefault();
        e.stopPropagation();
    }

    function drag(e) {
        if (!isDragging) return;
        wasDragged = true;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        toggleButton.style.left = (clientX - dragOffset.x) + 'px';
        toggleButton.style.top = (clientY - dragOffset.y) + 'px';
        toggleButton.style.right = 'auto';
        localStorage.setItem('earlyxButtonPosition', JSON.stringify({
            top: toggleButton.style.top,
            left: toggleButton.style.left,
            right: 'auto'
        }));
        e.preventDefault();
        e.stopPropagation();
    }

    function stopDrag() {
        isDragging = false;
    }

    function moveToTouch(e) {
        if (isDragging || !modalOpen) return;
        const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
        const rect = toggleButton.getBoundingClientRect();
        const halfWidth = rect.width / 2;
        const halfHeight = rect.height / 2;
        toggleButton.style.left = (clientX - halfWidth) + 'px';
        toggleButton.style.top = (clientY - halfHeight) + 'px';
        toggleButton.style.right = 'auto';
        localStorage.setItem('earlyxButtonPosition', JSON.stringify({
            top: toggleButton.style.top,
            left: toggleButton.style.left,
            right: 'auto'
        }));
        e.preventDefault();
        e.stopPropagation();
    }

    // Debounce for UI updates
    let updateTimeout = null;
    function scheduleUpdateFlagList() {
        if (updateTimeout) clearTimeout(updateTimeout);
        updateTimeout = setTimeout(updateFlagList, 100);
    }

    function updateVisibility() {
        if (addFlagSection) {
            addFlagSection.style.display = activeTab === 'manual' ? 'block' : 'none';
        }
    }

    function updateButtonColor(hasNewFlags) {
        if (toggleButton) {
            if (hasNewFlags) {
                toggleButton.style.backgroundColor = '#1d9bf0';
                toggleButton.style.border = '2px solid #FFD700';
                toggleButton.style.color = '#FFD700';
            } else {
                toggleButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                toggleButton.style.border = 'none';
                toggleButton.style.color = 'white';
            }
        }
    }

    // Wait for webpack function (fixed definition)
    function waitForWebpack(callback) {
        if (window.webpackChunk_twitter_responsive_web) {
            callback();
            return;
        }
        const observer = new MutationObserver(function() {
            if (window.webpackChunk_twitter_responsive_web) {
                observer.disconnect();
                callback();
            }
        });
        observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }

    // Hook webpack to patch FeatureSwitches module
    function hookWebpackPush() {
        if (!window.webpackChunk_twitter_responsive_web) return;
        const originalPush = window.webpackChunk_twitter_responsive_web.push;
        window.webpackChunk_twitter_responsive_web.push = function(chunk) {
            console.log('[EarlyX] Processing chunk:', chunk[0]);
            try {
                for (const [moduleId, mod] of Object.entries(chunk[1] || {})) {
                    if (mod && (typeof mod === 'function' || (mod.default && typeof mod.default === 'function'))) {
                        const targetMod = mod.default || mod;
                        const modStr = targetMod.toString ? targetMod.toString() : '';
                        const patterns = ['isTrue', 'getBooleanValue', 'isEnabled', 'getFeatureFlag', 'flags[', 'addFlag'];
                        const matchedPattern = patterns.find(function(pattern) { return modStr.includes(pattern); });
                        if (matchedPattern) {
                            console.log('[EarlyX] Matched \'' + matchedPattern + '\' in module ' + moduleId + '. Snippet: ' + modStr.substring(0, 150) + '...');
                            try {
                                const originalFactory = targetMod;
                                const patchedFactory = function(...args) {
                                    const instance = originalFactory.apply(this, args);
                                    const booleanMethods = ['isTrue', 'getBooleanValue', 'isEnabled'];
                                    const generalMethod = 'getFeatureFlag';
                                    booleanMethods.forEach(function(method) {
                                        if (instance && typeof instance[method] === 'function' && !instance[method]._earlyx_patched) {
                                            const originalMethod = instance[method];
                                            instance[method]._earlyx_patched = true;
                                            instance[method] = function(flag) {
                                                const defaultValue = originalMethod.call(this, flag);
                                                if (typeof defaultValue !== 'boolean') return defaultValue;
                                                let storedVal = defaultValue;
                                                if (!(flag in discoveredFlags)) {
                                                    discoveredFlags[flag] = storedVal;
                                                    discoveredTimestamps[flag] = Date.now();
                                                    saveDiscovered();
                                                    console.log('[EarlyX] Discovered boolean flag: ' + flag + ' (default: ' + discoveredFlags[flag] + ')');
                                                    updateButtonColor(true);
                                                    scheduleUpdateFlagList();
                                                    if (flag in userOverrides) {
                                                        applyOverrideToState(flag, userOverrides[flag]);
                                                    }
                                                } else if (discoveredFlags[flag] !== storedVal) {
                                                    console.log('[EarlyX] Updating boolean default via method for ' + flag + ' from ' + discoveredFlags[flag] + ' to ' + storedVal);
                                                    discoveredFlags[flag] = storedVal;
                                                    saveDiscovered();
                                                    scheduleUpdateFlagList();
                                                }
                                                if (flag in userOverrides) {
                                                    console.log('[EarlyX] Overridden boolean flag: ' + flag + ' (user: ' + userOverrides[flag] + ', default: ' + discoveredFlags[flag] + ')');
                                                    return Boolean(userOverrides[flag]);
                                                }
                                                return discoveredFlags[flag];
                                            };
                                        }
                                    });
                                    if (instance && typeof instance[generalMethod] === 'function' && !instance[generalMethod]._earlyx_patched) {
                                        const originalMethod = instance[generalMethod];
                                        instance[generalMethod]._earlyx_patched = true;
                                        instance[generalMethod] = function(flag) {
                                            const defaultValue = originalMethod.call(this, flag);
                                            if (defaultValue === undefined) return defaultValue;
                                            let storedVal = defaultValue;
                                            if (typeof defaultValue === 'boolean') {
                                                storedVal = defaultValue;
                                            } else {
                                                storedVal = String(defaultValue);
                                            }
                                            if (!(flag in discoveredFlags)) {
                                                discoveredFlags[flag] = storedVal;
                                                discoveredTimestamps[flag] = Date.now();
                                                saveDiscovered();
                                                console.log('[EarlyX] Discovered flag via getFeatureFlag: ' + flag + ' (default: ' + discoveredFlags[flag] + ')');
                                                updateButtonColor(true);
                                                scheduleUpdateFlagList();
                                                if (flag in userOverrides) {
                                                    applyOverrideToState(flag, userOverrides[flag]);
                                                }
                                            } else if (discoveredFlags[flag] !== storedVal) {
                                                console.log('[EarlyX] Updating default via getFeatureFlag for ' + flag + ' from ' + discoveredFlags[flag] + ' to ' + storedVal);
                                                discoveredFlags[flag] = storedVal;
                                                saveDiscovered();
                                                scheduleUpdateFlagList();
                                            }
                                            if (flag in userOverrides) {
                                                console.log('[EarlyX] Overridden flag via getFeatureFlag: ' + flag + ' (user: ' + userOverrides[flag] + ', default: ' + discoveredFlags[flag] + ')');
                                                const defType = typeof discoveredFlags[flag];
                                                let returnVal = userOverrides[flag];
                                                if (defType === 'boolean') {
                                                    returnVal = Boolean(returnVal);
                                                } else if (defType === 'number') {
                                                    returnVal = parseFloat(returnVal) || 0;
                                                }
                                                return returnVal;
                                            }
                                            const defType = typeof discoveredFlags[flag];
                                            let returnDefault = discoveredFlags[flag];
                                            if (defType === 'boolean') {
                                                returnDefault = Boolean(returnDefault);
                                            } else if (defType === 'number') {
                                                returnDefault = parseFloat(returnDefault) || 0;
                                            }
                                            return returnDefault;
                                        };
                                    }
                                    if (matchedPattern === 'flags[' || matchedPattern === 'addFlag') {
                                        return [false, function() { console.log('[EarlyX] Simulated addFlag'); }];
                                    }
                                    return instance;
                                };
                                // Replace in chunk[1]
                                chunk[1][moduleId] = patchedFactory;
                                console.log('[EarlyX] Replaced module ' + moduleId + ' for ' + matchedPattern);
                            } catch (patchErr) {
                                console.error('[EarlyX] Patch failed for module ' + moduleId + ':', patchErr);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('[EarlyX] Chunk processing error:', err);
            }
            return originalPush.apply(this, arguments);
        };
        console.log('[EarlyX] Webpack push hooked.');
    }

    // Export flags to a file
    function exportFlags() {
        const data = JSON.stringify(userOverrides, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'earlyx_flags.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('[EarlyX] Exported flags to earlyx_flags.json');
    }

    // Import flags from a file
    function importFlags(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedFlags = JSON.parse(e.target.result);
                for (let flag in importedFlags) {
                    userOverrides[flag] = importedFlags[flag];
                    applyOverrideToState(flag, importedFlags[flag]);
                }
                localStorage.setItem('earlyxOverrides', JSON.stringify(userOverrides));
                updateFlagList();
                console.log('[EarlyX] Imported flags from file');
                // Reset file input
                event.target.value = '';
            } catch (err) {
                console.error('[EarlyX] Error importing flags:', err);
                alert('Failed to import flags: Invalid JSON file');
            }
        };
        reader.readAsText(file);
    }

    // Reset flags to defaults
    function resetFlags() {
        userOverrides = {};
        discoveredFlags = {};
        discoveredTimestamps = {};
        localStorage.setItem('earlyxOverrides', JSON.stringify(userOverrides));
        localStorage.setItem('earlyxDiscoveredFlags', JSON.stringify(discoveredFlags));
        localStorage.setItem('earlyxDiscoveredTimestamps', JSON.stringify(discoveredTimestamps));
        localStorage.setItem('earlyxInitialized', 'false');
        localStorage.removeItem('earlyxButtonPosition');
        updateFlagList();
        updateButtonColor(false);
        if (toggleButton) {
            toggleButton.style.top = '10px';
            toggleButton.style.right = '10px';
            toggleButton.style.left = 'auto';
        }
        console.log('[EarlyX] Reset all flags to defaults');
    }

    // Create UI Button
    function createToggleButton() {
        if (toggleButton) return;
        toggleButton = document.createElement('button');
        toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wrench"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>';
        toggleButton.style.position = 'fixed';
        toggleButton.style.zIndex = '9999';
        toggleButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        toggleButton.style.backdropFilter = 'blur(10px)';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '20px';
        toggleButton.style.padding = '10px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.display = 'flex';
        toggleButton.style.alignItems = 'center';
        toggleButton.style.justifyContent = 'center';

        toggleButton.style.top = '10px';
        toggleButton.style.right = '10px';

        // Load saved position
        const savedPos = JSON.parse(localStorage.getItem('earlyxButtonPosition') || '{"top":"10px","right":"10px","left":null}');
        if (savedPos.top) toggleButton.style.top = savedPos.top;
        if (savedPos.right) toggleButton.style.right = savedPos.right;
        if (savedPos.left !== null) toggleButton.style.left = savedPos.left;

        // Mouse events
        toggleButton.addEventListener('mousedown', startDrag, {passive: false});
        document.addEventListener('mousemove', drag, {passive: false});
        document.addEventListener('mouseup', stopDrag);

        // Touch events for mobile dragging
        if (isMobile) {
            toggleButton.addEventListener('touchstart', startDrag, {passive: false});
            document.addEventListener('touchmove', drag, {passive: false});
            document.addEventListener('touchend', stopDrag);
        }

        toggleButton.addEventListener('click', function(e) {
            if (wasDragged) {
                wasDragged = false;
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            openModal();
        });

        document.body.appendChild(toggleButton);
    }

    // Create Modal UI
    function openModal() {
        modalOpen = true;
        if (toggleButton) {
            toggleButton.style.zIndex = '10001';
        }
        if (isMobile && moveListeners) {
            // Add move listeners for mobile
            document.addEventListener('touchend', moveListeners.touchend, {passive: false});
        }
        if (modal) {
            modal.style.display = 'flex';
            updateVisibility();
            return;
        }
        moveListeners = {};
        modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.zIndex = '10000';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        // Removed onclick to prevent closing on outside click

        const panel = document.createElement('div');
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        panel.style.backdropFilter = 'blur(10px)';
        panel.style.color = 'white';
        panel.style.padding = '20px';
        panel.style.borderRadius = '15px';
        panel.style.maxWidth = '800px';
        panel.style.width = window.innerWidth <= 600 ? '100%' : '90%'; // Full width on mobile
        panel.style.margin = window.innerWidth <= 600 ? '0' : 'auto'; // Remove margins on mobile
        panel.style.maxHeight = '80%';
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        panel.style.position = 'relative';
        panel.style.border = '1px solid #ccc';

        title = document.createElement('h2');
        title.innerHTML = 'EarlyX Feature Flags Manager (' + Object.keys(discoveredFlags).length + ' discovered)';
        title.style.marginBottom = '10px';
        title.style.color = 'white';
        title.style.position = 'sticky';
        title.style.top = '0';
        title.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        title.style.zIndex = '10001';
        title.style.padding = '10px 0';

        const showPreloadedCheckbox = document.createElement('input');
        showPreloadedCheckbox.type = 'checkbox';
        showPreloadedCheckbox.id = 'showPreloaded';
        showPreloadedCheckbox.checked = true; // Default to showing
        showPreloadedCheckbox.style.position = 'absolute';
        showPreloadedCheckbox.style.top = '10px';
        showPreloadedCheckbox.style.right = '10px';
        showPreloadedCheckbox.onchange = scheduleUpdateFlagList;

        searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search flags...';
        searchInput.style.width = '100%';
        searchInput.style.padding = '10px';
        searchInput.style.marginBottom = '10px';
        searchInput.style.border = '1px solid #ccc';
        searchInput.style.borderRadius = '5px';
        searchInput.style.backgroundColor = '#333';
        searchInput.style.color = 'white';
        searchInput.oninput = scheduleUpdateFlagList;

        // Add Flag Section
        addFlagSection = document.createElement('div');
        addFlagSection.style.marginBottom = '10px';
        addFlagSection.innerHTML = '<strong>Add New Flag:</strong><br>';

        addFlagInput = document.createElement('input');
        addFlagInput.type = 'text';
        addFlagInput.placeholder = 'Enter flag name...';
        addFlagInput.style.width = '70%';
        addFlagInput.style.padding = '5px';
        addFlagInput.style.marginRight = '5px';
        addFlagInput.style.backgroundColor = '#333';
        addFlagInput.style.color = 'white';
        addFlagInput.style.border = '1px solid #ccc';
        addFlagInput.style.borderRadius = '5px';

        addFlagCheckbox = document.createElement('input');
        addFlagCheckbox.type = 'checkbox';
        addFlagCheckbox.style.marginRight = '5px';

        addFlagButton = document.createElement('button');
        addFlagButton.innerHTML = 'Add';
        addFlagButton.style.padding = '5px 10px';
        addFlagButton.style.backgroundColor = '#1d9bf0';
        addFlagButton.style.color = 'white';
        addFlagButton.style.border = 'none';
        addFlagButton.style.borderRadius = '5px';
        addFlagButton.style.cursor = 'pointer';
        addFlagButton.onclick = function() {
            const flagName = addFlagInput.value.trim();
            if (flagName && !(flagName in discoveredFlags) && !(flagName in userOverrides)) {
                userOverrides[flagName] = addFlagCheckbox.checked;
                localStorage.setItem('earlyxOverrides', JSON.stringify(userOverrides));
                applyOverrideToState(flagName, addFlagCheckbox.checked);
                addFlagInput.value = '';
                addFlagCheckbox.checked = false;
                updateFlagList();
                console.log('[EarlyX] Added manual flag: ' + flagName + ' = ' + userOverrides[flagName]);
            }
        };

        addFlagSection.appendChild(addFlagInput);
        addFlagSection.appendChild(addFlagCheckbox);
        addFlagSection.appendChild(document.createTextNode('Enabled'));
        addFlagSection.appendChild(addFlagButton);

        const tabsContainer = document.createElement('div');
        tabsContainer.style.display = 'flex';
        tabsContainer.style.marginBottom = '10px';

        const allTabBtn = document.createElement('button');
        allTabBtn.innerHTML = 'All';
        allTabBtn.style.padding = '10px 15px';
        allTabBtn.style.backgroundColor = '#1d9bf0';
        allTabBtn.style.color = 'white';
        allTabBtn.style.border = 'none';
        allTabBtn.style.borderRadius = '5px';
        allTabBtn.style.cursor = 'pointer';
        allTabBtn.style.marginRight = '5px';
        allTabBtn.onclick = function() {
            activeTab = 'all';
            allTabBtn.style.backgroundColor = '#1d9bf0';
            changedTabBtn.style.backgroundColor = '#666';
            manualTabBtn.style.backgroundColor = '#666';
            updateFlagList();
            updateVisibility();
        };

        const changedTabBtn = document.createElement('button');
        changedTabBtn.innerHTML = 'Changed';
        changedTabBtn.style.padding = '10px 15px';
        changedTabBtn.style.backgroundColor = '#666';
        changedTabBtn.style.color = 'white';
        changedTabBtn.style.border = 'none';
        changedTabBtn.style.borderRadius = '5px';
        changedTabBtn.style.cursor = 'pointer';
        changedTabBtn.style.marginRight = '5px';
        changedTabBtn.onclick = function() {
            activeTab = 'changed';
            changedTabBtn.style.backgroundColor = '#1d9bf0';
            allTabBtn.style.backgroundColor = '#666';
            manualTabBtn.style.backgroundColor = '#666';
            updateFlagList();
            updateVisibility();
        };

        const manualTabBtn = document.createElement('button');
        manualTabBtn.innerHTML = 'Manual';
        manualTabBtn.style.padding = '10px 15px';
        manualTabBtn.style.backgroundColor = '#666';
        manualTabBtn.style.color = 'white';
        manualTabBtn.style.border = 'none';
        manualTabBtn.style.borderRadius = '5px';
        manualTabBtn.style.cursor = 'pointer';
        manualTabBtn.onclick = function() {
            activeTab = 'manual';
            manualTabBtn.style.backgroundColor = '#1d9bf0';
            allTabBtn.style.backgroundColor = '#666';
            changedTabBtn.style.backgroundColor = '#666';
            updateFlagList();
            updateVisibility();
        };

        tabsContainer.appendChild(allTabBtn);
        tabsContainer.appendChild(changedTabBtn);
        tabsContainer.appendChild(manualTabBtn);

        flagList = document.createElement('div');
        flagList.id = 'flagList';
        flagList.style.overflowY = 'auto';
        flagList.style.flex = '1';
        updateFlagList();

        buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'sticky';
        buttonContainer.style.bottom = '0';
        buttonContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        buttonContainer.style.padding = '10px 0';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.zIndex = '10001';
        buttonContainer.style.alignItems = 'center';

        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';

        const importBtn = document.createElement('button');
        importBtn.innerHTML = 'Import';
        importBtn.style.padding = '10px';
        importBtn.style.backgroundColor = '#666';
        importBtn.style.color = 'white';
        importBtn.style.border = 'none';
        importBtn.style.borderRadius = '5px';
        importBtn.style.cursor = 'pointer';
        importBtn.style.marginRight = '5px';
        importBtn.onclick = function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = importFlags;
            input.click();
        };

        const exportBtn = document.createElement('button');
        exportBtn.innerHTML = 'Export';
        exportBtn.style.padding = '10px';
        exportBtn.style.backgroundColor = '#666';
        exportBtn.style.color = 'white';
        exportBtn.style.border = 'none';
        exportBtn.style.borderRadius = '5px';
        exportBtn.style.cursor = 'pointer';
        exportBtn.style.marginRight = '5px';
        exportBtn.onclick = exportFlags;

        const resetBtn = document.createElement('button');
        resetBtn.innerHTML = 'Reset';
        resetBtn.style.padding = '10px';
        resetBtn.style.backgroundColor = '#666';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '5px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.style.marginRight = '5px';
        resetBtn.onclick = resetFlags;

        const saveBtn = document.createElement('button');
        saveBtn.innerHTML = 'Save & Reload';
        saveBtn.style.padding = '10px';
        saveBtn.style.backgroundColor = '#1d9bf0';
        saveBtn.style.color = 'white';
        saveBtn.style.border = 'none';
        saveBtn.style.borderRadius = '5px';
        saveBtn.style.cursor = 'pointer';
        saveBtn.style.marginRight = '5px';
        saveBtn.onclick = function() {
            localStorage.setItem('earlyxOverrides', JSON.stringify(userOverrides));
            // Remove new highlighting and sorting
            Object.keys(discoveredTimestamps).forEach(flag => {
                discoveredTimestamps[flag] = Date.now() - 259200001; // More than 72 hours ago
            });
            saveDiscovered();
            localStorage.setItem('earlyxInitialized', 'true');
            updateButtonColor(false);
            location.reload();
        };

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = 'Close';
        closeBtn.style.padding = '10px';
        closeBtn.style.backgroundColor = '#1d9bf0';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '5px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = closeModal;

        buttonsDiv.appendChild(importBtn);
        buttonsDiv.appendChild(exportBtn);
        buttonsDiv.appendChild(resetBtn);
        buttonsDiv.appendChild(saveBtn);
        buttonsDiv.appendChild(closeBtn);

        buttonContainer.appendChild(buttonsDiv);

        panel.appendChild(title);
        panel.appendChild(showPreloadedCheckbox);
        panel.appendChild(searchInput);
        panel.appendChild(addFlagSection);
        panel.appendChild(tabsContainer);
        panel.appendChild(flagList);
        panel.appendChild(buttonContainer);
        modal.appendChild(panel);
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        updateVisibility();

        if (isMobile) {
            // Add move listeners for mobile tap outside
            moveListeners.touchend = (e) => {
                if (e.target === modal || modal.contains(e.target)) return;
                moveToTouch(e);
            };
            document.addEventListener('touchend', moveListeners.touchend, {passive: false});
        }
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
        modalOpen = false;
        if (toggleButton) {
            toggleButton.style.zIndex = '9999';
        }
        if (isMobile && moveListeners) {
            document.removeEventListener('touchend', moveListeners.touchend);
        }
    }

    function updateFlagList() {
        if (!flagList) return;
        const searchTerm = searchInput.value.toLowerCase();
        const showPreloaded = document.getElementById('showPreloaded') ? document.getElementById('showPreloaded').checked : true;
        let flagsToShow = [];

        // Only show flags with values
        Object.keys(discoveredFlags).filter(flag => discoveredFlags[flag] !== undefined).sort().forEach(function(flag) {
            const defaultValue = discoveredFlags[flag];
            const isBooleanFlag = typeof defaultValue === 'boolean';
            const currentValue = flag in userOverrides ? userOverrides[flag] : defaultValue;
            const isChanged = flag in userOverrides && (isBooleanFlag ? userOverrides[flag] !== defaultValue : true);
            let show = !searchTerm || flag.toLowerCase().includes(searchTerm);
            if (activeTab === 'changed' && !isChanged) show = false;
            if (activeTab === 'manual') show = false;
            if (!showPreloaded && (flag in PRELOADED_FLAGS) && !isChanged) show = false;
            if (show) {
                flagsToShow.push({flag, isChanged, isManual: false, defaultValue, currentValue, isBooleanFlag});
            }
        });

        // Manual flags
        Object.keys(userOverrides).filter(flag => !(flag in discoveredFlags)).sort().forEach(function(flag) {
            const currentValue = userOverrides[flag];
            const isBooleanFlag = typeof currentValue === 'boolean';
            let show = !searchTerm || flag.toLowerCase().includes(searchTerm);
            if (activeTab === 'manual' || activeTab === 'all' || activeTab === 'changed') {
                // show remains based on search
            } else {
                show = false;
            }
            if (show) {
                flagsToShow.push({flag, isChanged: true, isManual: true, defaultValue: null, currentValue, isBooleanFlag});
            }
        });

        const isFirstLaunchOrReset = localStorage.getItem('earlyxInitialized') !== 'true';

        // Sort flagsToShow: new flags at top, then alphabetical, unless first launch or reset
        if (!isFirstLaunchOrReset) {
            flagsToShow.sort((a, b) => {
                const aNew = (Date.now() - (discoveredTimestamps[a.flag] || 0) < 259200000 && !a.isManual) ? 1 : 0; // 72 hours = 259200000 ms
                const bNew = (Date.now() - (discoveredTimestamps[b.flag] || 0) < 259200000 && !b.isManual) ? 1 : 0;
                if (aNew !== bNew) return bNew - aNew; // New first
                return a.flag.localeCompare(b.flag);
            });
        } else {
            flagsToShow.sort((a, b) => a.flag.localeCompare(b.flag));
        }

        // Check for new flags to update button color
        const hasNewFlags = flagsToShow.some(item => !isFirstLaunchOrReset && (Date.now() - (discoveredTimestamps[item.flag] || 0) < 259200000 && !item.isManual));
        updateButtonColor(hasNewFlags);

        // Save scroll position
        const scrollTop = flagList.scrollTop;

        // Build HTML string
        let html = '';
        const isMobile = window.innerWidth <= 600;
        const infoFontSize = isMobile ? '12px' : '14px';
        const rowStyle = 'display: flex; justify-content: space-between; align-items: center; padding: 5px; border-bottom: 1px solid #333; color: white; gap: 10px;';
        const infoStyle = `color: white; word-break: break-word; flex: 1 1 auto; min-width: 100px; font-size: ${infoFontSize};`;
        const booleanValueContStyle = 'flex: 0 0 auto; min-width: 20px; margin-left: auto; display: flex; justify-content: flex-end; align-items: center;';
        const nonBooleanValueContStyle = 'flex: 0 0 auto; min-width: 120px; margin-left: auto; display: flex; gap: 5px; align-items: center; justify-content: flex-end;';

        flagsToShow.forEach(function(item) {
            const {flag, isChanged, isManual, currentValue, isBooleanFlag, defaultValue} = item;
            const isNew = !isFirstLaunchOrReset && (Date.now() - (discoveredTimestamps[flag] || 0) < 259200000 && !isManual);
            let strongStyle = isChanged ? 'color: #FFD700;' : (isNew ? 'color: lightblue;' : 'color: inherit;');
            const infoHtml = `<strong style="${strongStyle}">${flag}${isManual ? ' (manual)' : ''}</strong>`;
            let valueHtml = '';
            const isOverridden = flag in userOverrides;
            const displayValueStr = isBooleanFlag ? (currentValue ? 'true' : 'false') : String(currentValue || '');
            if (isBooleanFlag) {
                const checked = currentValue === true ? 'checked' : '';
                valueHtml = `<input type="checkbox" class="flag-checkbox" data-flag="${flag}" ${checked}>`;
                html += `<div class="flag-row" style="${rowStyle}"><div class="info" style="${infoStyle}">${infoHtml}</div><div class="value-container" style="${booleanValueContStyle}">${valueHtml}</div></div>`;
            } else {
                const enableChecked = isOverridden ? 'checked' : '';
                const inputWidth = Math.max(80, Math.min(displayValueStr.length * 6 + 20, 120));
                valueHtml = `
                    <input type="text" class="value-input" data-flag="${flag}" value="${displayValueStr}" style="width: ${inputWidth}px; padding: 2px; background-color: #333; color: white; border: 1px solid #ccc; border-radius: 3px; text-align: right;">
                    <input type="checkbox" class="enable-checkbox" data-flag="${flag}" ${enableChecked}>
                `;
                html += `<div class="flag-row" style="${rowStyle}"><div class="info" style="${infoStyle}">${infoHtml}</div><div class="value-container" style="${nonBooleanValueContStyle}">${valueHtml}</div></div>`;
            }
        });

        flagList.innerHTML = html;

        // Attach event listeners for boolean checkboxes
        document.querySelectorAll('.flag-checkbox').forEach(function(checkbox) {
            const flag = checkbox.dataset.flag;
            checkbox.onchange = function() {
                const newValue = this.checked;
                userOverrides[flag] = newValue;
                localStorage.setItem('earlyxOverrides', JSON.stringify(userOverrides));
                applyOverrideToState(flag, newValue);
                console.log('[EarlyX] Toggled ' + flag + ' to ' + newValue);
                scheduleUpdateFlagList();
            };
        });

        // Attach event listeners for non-boolean enable checkboxes
        document.querySelectorAll('.enable-checkbox').forEach(function(cb) {
            const flag = cb.dataset.flag;
            cb.onchange = function() {
                const input = document.querySelector(`.value-input[data-flag="${flag}"]`);
                if (this.checked) {
                    userOverrides[flag] = input.value;
                } else {
                    delete userOverrides[flag];
                }
                localStorage.setItem('earlyxOverrides', JSON.stringify(userOverrides));
                applyOverrideToState(flag, this.checked ? userOverrides[flag] : undefined);
                console.log('[EarlyX] ' + (this.checked ? 'Enabled' : 'Disabled') + ' override for ' + flag);
                scheduleUpdateFlagList();
            };
        });

        // Attach event listeners for non-boolean value inputs
        document.querySelectorAll('.value-input').forEach(function(input) {
            const flag = input.dataset.flag;
            input.oninput = function() {
                const enableCb = document.querySelector(`.enable-checkbox[data-flag="${flag}"]`);
                if (enableCb && enableCb.checked) {
                    userOverrides[flag] = this.value;
                    localStorage.setItem('earlyxOverrides', JSON.stringify(userOverrides));
                    applyOverrideToState(flag, this.value);
                    console.log('[EarlyX] Set override for ' + flag + ' to ' + this.value);
                }
                // If not checked, don't save, but allow typing (input is always editable)
            };
        });

        // Restore scroll position
        flagList.scrollTop = scrollTop;

        // Update title
        const discoveredCount = Object.keys(discoveredFlags).filter(flag => discoveredFlags[flag] !== undefined).length;
        const manualCount = Object.keys(userOverrides).filter(flag => !(flag in discoveredFlags)).length;
        const totalFlags = discoveredCount + manualCount;
        const preloadedCount = Object.keys(PRELOADED_FLAGS).length;
        let titleText = 'EarlyX Feature Flags Manager (' + totalFlags + ' total: ' + discoveredCount + ' discovered + ' + manualCount + ' manual overrides)';
        if (showPreloaded) {
            titleText += ' + ' + preloadedCount + ' preloaded';
        }
        if (title) title.innerHTML = titleText;
    }

    // Global poll for instances (with visited Set to avoid recursion)
    let pollAttempts = 0;
    const maxPoll = 30;
    const globalPoll = setInterval(function() {
        pollAttempts++;
        let patched = false;
        const visited = new Set();
        try {
            function searchForFlags(obj, path = '') {
                if (obj && typeof obj === 'object' && !obj._earlyx_patched && !visited.has(obj)) {
                    visited.add(obj);
                    const booleanMethods = ['isTrue', 'getBooleanValue', 'isEnabled'];
                    const generalMethod = 'getFeatureFlag';
                    let hasMethod = false;
                    booleanMethods.forEach(function(method) {
                        if (obj[method] && typeof obj[method] === 'function') {
                            hasMethod = true;
                            const originalMethod = obj[method];
                            obj[method] = function(flag) {
                                const defaultValue = originalMethod.call(this, flag);
                                if (typeof defaultValue !== 'boolean') return defaultValue;
                                let storedVal = defaultValue;
                                if (!(flag in discoveredFlags)) {
                                    discoveredFlags[flag] = storedVal;
                                    discoveredTimestamps[flag] = Date.now();
                                    saveDiscovered();
                                    console.log('[EarlyX] Discovered boolean flag: ' + flag + ' (default: ' + discoveredFlags[flag] + ')');
                                    updateButtonColor(true);
                                    scheduleUpdateFlagList();
                                    if (flag in userOverrides) {
                                        applyOverrideToState(flag, userOverrides[flag]);
                                    }
                                } else if (discoveredFlags[flag] !== storedVal) {
                                    console.log('[EarlyX] Updating boolean default via method for ' + flag + ' from ' + discoveredFlags[flag] + ' to ' + storedVal);
                                    discoveredFlags[flag] = storedVal;
                                    saveDiscovered();
                                    scheduleUpdateFlagList();
                                }
                                if (flag in userOverrides) {
                                    console.log('[EarlyX] Overridden boolean flag: ' + flag + ' (user: ' + userOverrides[flag] + ', default: ' + discoveredFlags[flag] + ')');
                                    return Boolean(userOverrides[flag]);
                                }
                                return discoveredFlags[flag];
                            };
                        }
                    });
                    if (obj[generalMethod] && typeof obj[generalMethod] === 'function') {
                        hasMethod = true;
                        const originalMethod = obj[generalMethod];
                        obj[generalMethod] = function(flag) {
                            const defaultValue = originalMethod.call(this, flag);
                            if (defaultValue === undefined) return defaultValue;
                            let storedVal = defaultValue;
                            if (typeof defaultValue === 'boolean') {
                                storedVal = defaultValue;
                            } else {
                                storedVal = String(defaultValue);
                            }
                            if (!(flag in discoveredFlags)) {
                                discoveredFlags[flag] = storedVal;
                                discoveredTimestamps[flag] = Date.now();
                                saveDiscovered();
                                console.log('[EarlyX] Discovered flag via getFeatureFlag: ' + flag + ' (default: ' + discoveredFlags[flag] + ')');
                                updateButtonColor(true);
                                scheduleUpdateFlagList();
                                if (flag in userOverrides) {
                                    applyOverrideToState(flag, userOverrides[flag]);
                                }
                            } else if (discoveredFlags[flag] !== storedVal) {
                                console.log('[EarlyX] Updating default via getFeatureFlag for ' + flag + ' from ' + discoveredFlags[flag] + ' to ' + storedVal);
                                discoveredFlags[flag] = storedVal;
                                saveDiscovered();
                                scheduleUpdateFlagList();
                            }
                            if (flag in userOverrides) {
                                console.log('[EarlyX] Overridden flag via getFeatureFlag: ' + flag + ' (user: ' + userOverrides[flag] + ', default: ' + discoveredFlags[flag] + ')');
                                const defType = typeof discoveredFlags[flag];
                                let returnVal = userOverrides[flag];
                                if (defType === 'boolean') {
                                    returnVal = Boolean(returnVal);
                                } else if (defType === 'number') {
                                    returnVal = parseFloat(returnVal) || 0;
                                }
                                return returnVal;
                            }
                            const defType = typeof discoveredFlags[flag];
                            let returnDefault = discoveredFlags[flag];
                            if (defType === 'boolean') {
                                returnDefault = Boolean(returnDefault);
                            } else if (defType === 'number') {
                                returnDefault = parseFloat(returnDefault) || 0;
                            }
                            return returnDefault;
                        };
                    }
                    if (hasMethod) {
                        if (obj.flags) {
                            // Merge overrides
                            for (const flag in userOverrides) {
                                if (flag in discoveredFlags) {
                                    const defaultVal = discoveredFlags[flag];
                                    const targetType = typeof defaultVal;
                                    let strValue = convertToType(userOverrides[flag], targetType);
                                    obj.flags[flag] = strValue;
                                }
                            }
                            console.log('[EarlyX] Merged overrides into ' + path + '.flags');
                        }
                        obj._earlyx_patched = true;
                        patched = true;
                        console.log('[EarlyX] Patched ' + path);
                    }
                    for (const key in obj) {
                        if (typeof obj[key] === 'object' && obj[key] !== null) {
                            const subPath = path ? path + '.' + key : key;
                            searchForFlags(obj[key], subPath);
                        }
                    }
                }
            }
            searchForFlags(window);
        } catch (err) {
            console.error('[EarlyX] Global poll error:', err);
        }
        if (patched || pollAttempts >= maxPoll) {
            clearInterval(globalPoll);
            console.log(patched ? '[EarlyX] Global patching done.' : '[EarlyX] No globals found.');
        }
    }, 1000);

    // Wait for DOM to add UI
    function initUI() {
        if (document.body) {
            createToggleButton();
            // Initial check for new flags
            const isFirstLaunchOrReset = localStorage.getItem('earlyxInitialized') !== 'true';
            const hasNewFlags = !isFirstLaunchOrReset && Object.values(discoveredTimestamps).some(ts => Date.now() - ts < 259200000);
            updateButtonColor(hasNewFlags);
        } else {
            setTimeout(initUI, 500);
        }
    }

    waitForWebpack(function() {
        hookWebpackPush();
        initUI();
        console.log('[EarlyX] Ready. Interact with site to discover flags, then use UI to toggle.');
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }
})();