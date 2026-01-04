// ==UserScript==
// @name        Handlers Helper (Improved)
// @namespace   Violentmonkey Scripts
// @version     4.9.1
// @description Helper for protocol_hook.lua - Enhanced drag-to-action system for media links with MPV integration. Supports multiple protocols (mpv://, streamlink, yt-dlp) and customizable actions.
// @author      hongmd (improved)
// @license     MIT
// @homepageURL https://github.com/hongmd/userscript-improved
// @supportURL  https://github.com/hongmd/userscript-improved/issues
// @include     *://*/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @run-at      document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/549515/Handlers%20Helper%20%28Improved%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549515/Handlers%20Helper%20%28Improved%29.meta.js
// ==/UserScript==

'use strict';

/**
 * Handlers Helper (Improved) - Modular Version (Fixed Dependencies)
 *
 * This userscript provides enhanced drag-to-action functionality for media links
 * with MPV integration and multiple protocol support.
 *
 * Architecture:
 * - Constants: Configuration and default values (no deps)
 * - Utils: Utility functions (no deps)
 * - State: Global state management (depends on Utils)
 * - LiveChat: Live chat integration (depends on Utils, Constants)
 * - Actions: Action execution logic (depends on Utils, State, LiveChat)
 * - Drag: Drag handling and direction calculation (depends on Utils, State, Constants, Actions)
 * - Menu: Menu command setup (depends on Utils, State, Constants, Drag)
 * - Collection: URL collection system (depends on Utils, State)
 * - YouTube: YouTube-specific features (depends on Utils)
 * - Main: Initialization and orchestration (depends on all)
 */

// ===== MODULE: CONSTANTS =====
const Constants = (() => {
    'use strict';

    const GUIDE = 'Value: pipe ytdl stream mpv iptv';

    const ACTION_EXPLANATIONS = {
        pipe: '📺 pipe (UP) → mpv://mpvy/ → Pipe video to MPV with yt-dlp processing',
        ytdl: '📥 ytdl (DOWN) → mpv://ytdl/ → Download video using yt-dlp',
        stream: '🌊 stream (LEFT) → mpv://stream/ → Stream video using streamlink',
        mpv: '▶️ mpv (RIGHT) → mpv://play/ → Direct play in MPV player',
        iptv: '📋 iptv → mpv://list/ → Add to IPTV playlist'
    };

    const LIVE_WINDOW_WIDTH = 400;
    const LIVE_WINDOW_HEIGHT = 640;
    const DRAG_THRESHOLD = 50;
    const RIGHT_CLICK_DELAY = 200;

    const DEFAULTS = {
        UP: 'pipe',
        DOWN: 'ytdl',
        LEFT: 'stream',
        RIGHT: 'mpv',
        hlsdomain: 'cdn.animevui.com',
        livechat: false,
        total_direction: 4,
        down_confirm: true,
        debug: false
    };

    const DirectionEnum = Object.freeze({
        CENTER: 5,
        RIGHT: 6,
        LEFT: 4,
        UP: 2,
        DOWN: 8,
        UP_LEFT: 1,
        UP_RIGHT: 3,
        DOWN_LEFT: 7,
        DOWN_RIGHT: 9
    });

    return {
        GUIDE,
        ACTION_EXPLANATIONS,
        LIVE_WINDOW_WIDTH,
        LIVE_WINDOW_HEIGHT,
        DRAG_THRESHOLD,
        RIGHT_CLICK_DELAY,
        DEFAULTS,
        DirectionEnum
    };
})();

// ===== MODULE: UTILS =====
const Utils = (() => {
    'use strict';

    const safePrompt = (message, defaultValue) => {
        try {
            const result = window.prompt(message, defaultValue);
            return result === null ? null : result.trim();
        } catch (error) {
            debugError('Prompt error:', error);
            return null;
        }
    };

    const reloadPage = () => {
        try {
            window.location.reload();
        } catch (error) {
            debugError('Reload failed:', error);
        }
    };

    const debugLog = (...args) => {
        // Check if State is available and debug is enabled
        if (typeof State !== 'undefined' && State.settings && State.settings.debug) {
            console.log(...args);
        }
    };

    const debugWarn = (...args) => {
        if (typeof State !== 'undefined' && State.settings && State.settings.debug) {
            console.warn(...args);
        }
    };

    const debugError = (...args) => {
        if (typeof State !== 'undefined' && State.settings && State.settings.debug) {
            console.error(...args);
        } else {
            // Always log errors even if debug is off
            console.error(...args);
        }
    };

    const getParentByTagName = (element, tagName) => {
        if (!element || typeof tagName !== 'string') return null;

        tagName = tagName.toLowerCase();
        let current = element;

        while (current && current.nodeType === Node.ELEMENT_NODE) {
            if (current.tagName && current.tagName.toLowerCase() === tagName) {
                return current;
            }
            current = current.parentNode;
        }
        return null;
    };

    const encodeUrl = (url) => {
        try {
            new URL(url);
            return btoa(url).replace(/[/+=]/g, match =>
                match === '/' ? '_' : match === '+' ? '-' : ''
            );
        } catch (error) {
            debugError('Invalid URL provided to encodeUrl:', url, error);
            return '';
        }
    };

    return {
        safePrompt,
        reloadPage,
        debugLog,
        debugWarn,
        debugError,
        getParentByTagName,
        encodeUrl
    };
})();

// ===== MODULE: STATE =====
const State = (() => {
    'use strict';

    let settings = {};
    let hlsdomainArray = [];
    let collectedUrls = new Map();
    let attachedElements = new WeakSet();

    const init = () => {
        settings = {
            UP: GM_getValue('UP', Constants.DEFAULTS.UP),
            DOWN: GM_getValue('DOWN', Constants.DEFAULTS.DOWN),
            LEFT: GM_getValue('LEFT', Constants.DEFAULTS.LEFT),
            RIGHT: GM_getValue('RIGHT', Constants.DEFAULTS.RIGHT),
            hlsdomain: GM_getValue('hlsdomain', Constants.DEFAULTS.hlsdomain),
            livechat: GM_getValue('livechat', Constants.DEFAULTS.livechat),
            total_direction: GM_getValue('total_direction', Constants.DEFAULTS.total_direction),
            down_confirm: GM_getValue('down_confirm', Constants.DEFAULTS.down_confirm),
            debug: GM_getValue('debug', Constants.DEFAULTS.debug)
        };

        hlsdomainArray = settings.hlsdomain.split(',').filter(d => d.trim());

        // Add CSS class for collected links styling
        GM_addStyle(`
            .hh-collected-link {
                box-sizing: border-box !important;
                border: solid yellow 4px !important;
            }
        `);

        Utils.debugLog('Handlers Helper loaded with settings:', settings);
    };

    const updateSetting = (key, value) => {
        settings[key] = value;
        GM_setValue(key, value);
        Utils.debugLog(`Updated ${key} to:`, value);
    };

    return {
        init,
        get settings() { return settings; },
        get hlsdomainArray() { return hlsdomainArray; },
        set hlsdomainArray(value) { hlsdomainArray = value; },
        get collectedUrls() { return collectedUrls; },
        get attachedElements() { return attachedElements; },
        updateSetting
    };
})();

// ===== MODULE: LIVECHAT =====
const LiveChat = (() => {
    'use strict';

    const openPopout = (chatUrl) => {
        try {
            const features = [
                'fullscreen=no',
                'toolbar=no',
                'titlebar=no',
                'menubar=no',
                'location=no',
                `width=${Constants.LIVE_WINDOW_WIDTH}`,
                `height=${Constants.LIVE_WINDOW_HEIGHT}`
            ].join(',');

            window.open(chatUrl, '', features);
        } catch (error) {
            Utils.debugError('Failed to open popout:', error);
        }
    };

    const openLiveChat = (url) => {
        try {
            const urlObj = new URL(url);
            const href = urlObj.href;

            if (href.includes('www.youtube.com/watch') || href.includes('m.youtube.com/watch')) {
                const videoId = urlObj.searchParams.get('v');
                if (videoId) {
                    openPopout(`https://www.youtube.com/live_chat?is_popout=1&v=${videoId}`);
                }
            } else if (href.match(/https:\/\/.*?\.twitch\.tv\//)) {
                openPopout(`https://www.twitch.tv/popout${urlObj.pathname}/chat?popout=`);
            } else if (href.match(/https:\/\/.*?\.nimo\.tv\//)) {
                try {
                    const selector = `a[href="${urlObj.pathname}"] .nimo-player.n-as-full`;
                    const element = document.querySelector(selector);
                    if (element && element.id) {
                        const streamId = element.id.replace('home-hot-', '');
                        openPopout(`https://www.nimo.tv/popout/chat/${streamId}`);
                    }
                } catch (error) {
                    Utils.debugError('Nimo.tv chat extraction failed:', error);
                }
            }
        } catch (error) {
            Utils.debugError('Live chat opener failed:', error);
        }
    };

    return {
        openLiveChat
    };
})();

// ===== MODULE: ACTIONS =====
const Actions = (() => {
    'use strict';

    const executeAction = (targetUrl, actionType) => {
        Utils.debugLog('Executing action:', actionType, 'for URL:', targetUrl);

        // Check if this is a DOWN action and confirmation is enabled
        if (actionType === State.settings.DOWN && State.settings.down_confirm) {
            const confirmed = confirm(`Confirm DOWN action (${actionType})?\n\nURL: ${targetUrl}\n\nClick OK to proceed or Cancel to abort.`);
            if (!confirmed) {
                Utils.debugLog('DOWN action cancelled by user');
                return;
            }
        }

        let finalUrl = '';
        let app = 'play';
        let isHls = false;

        // Check HLS domains
        for (const domain of State.hlsdomainArray) {
            if (domain && (targetUrl.includes(domain) || document.domain.includes(domain))) {
                if (actionType === 'stream') {
                    targetUrl = targetUrl.replace(/^https?:/, 'hls:');
                }
                isHls = true;
                break;
            }
        }

        // Handle different URL types
        if (targetUrl.startsWith('http') || targetUrl.startsWith('hls:')) {
            finalUrl = targetUrl;
        } else if (targetUrl.startsWith('mpv://')) {
            try {
                location.href = targetUrl;
            } catch (error) {
                Utils.debugError('Failed to navigate to mpv URL:', error);
            }
            return;
        } else {
            finalUrl = location.href;
        }

        // Process collected URLs
        let urlString = '';
        if (State.collectedUrls.size > 0) {
            const urls = Array.from(State.collectedUrls.keys());
            urlString = urls.join(' ');

            // Reset visual indicators
            State.collectedUrls.forEach((element) => {
                try {
                    element.classList.remove('hh-collected-link');
                } catch (error) {
                    Utils.debugError('Failed to reset element class:', error);
                }
            });

            State.collectedUrls.clear();
            Utils.debugLog('Processed collected URLs:', urlString);
        } else {
            urlString = finalUrl;
        }

        // Determine app type and protocol action
        switch (actionType) {
            case 'pipe':
                app = 'mpvy'; // Pipe video stream to MPV with yt-dlp preprocessing
                break;
            case 'iptv':
                app = 'list'; // Add to IPTV playlist
                break;
            case 'stream':
                app = 'stream'; // Stream using streamlink
                break;
            case 'mpv':
            case 'vid':
                app = 'play'; // Direct play in MPV
                break;
            default:
                app = actionType; // Pass through custom actions
        }

        // Build final URL
        const encodedUrl = Utils.encodeUrl(urlString);
        const encodedReferer = Utils.encodeUrl(location.href);
        let protocolUrl = `mpv://${app}/${encodedUrl}/?referer=${encodedReferer}`;

        if (isHls) {
            protocolUrl += '&hls=1';
        }

        Utils.debugLog('Action details:', {
            actionType,
            app,
            finalUrl,
            urlString,
            isHls,
            protocolUrl
        });

        // Open live chat if needed
        if (actionType === 'stream' && State.settings.livechat) {
            LiveChat.openLiveChat(finalUrl);
        }

        Utils.debugLog('Final protocol URL:', protocolUrl);

        try {
            location.href = protocolUrl;
        } catch (error) {
            Utils.debugError('Failed to navigate to protocol URL:', error);
        }
    };

    return {
        executeAction
    };
})();

// ===== MODULE: DRAG =====
const Drag = (() => {
    'use strict';

    const getDirection = (startX, startY, endX, endY) => {
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        Utils.debugLog('Direction calculation:', {
            start: [startX, startY],
            end: [endX, endY],
            delta: [deltaX, deltaY],
            threshold: Constants.DRAG_THRESHOLD
        });

        // Check for center (no movement)
        if (Math.abs(deltaX) < Constants.DRAG_THRESHOLD && Math.abs(deltaY) < Constants.DRAG_THRESHOLD) {
            Utils.debugLog('Direction: CENTER (no movement)');
            return Constants.DirectionEnum.CENTER;
        }

        let direction;

        if (State.settings.total_direction === 4) {
            // 4-direction mode
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                direction = deltaX > 0 ? Constants.DirectionEnum.RIGHT : Constants.DirectionEnum.LEFT;
            } else {
                direction = deltaY > 0 ? Constants.DirectionEnum.DOWN : Constants.DirectionEnum.UP;
            }
            Utils.debugLog('4-direction mode, result:', direction, direction === Constants.DirectionEnum.UP ? '(UP)' : direction === Constants.DirectionEnum.DOWN ? '(DOWN)' : direction === Constants.DirectionEnum.LEFT ? '(LEFT)' : '(RIGHT)');
        } else {
            // 8-direction mode
            if (deltaX === 0) {
                direction = deltaY > 0 ? Constants.DirectionEnum.DOWN : Constants.DirectionEnum.UP;
                Utils.debugLog('8-direction mode, vertical movement, result:', direction);
            } else {
                const slope = deltaY / deltaX;
                const absSlope = Math.abs(slope);

                if (absSlope < 0.4142) { // ~22.5 degrees
                    direction = deltaX > 0 ? Constants.DirectionEnum.RIGHT : Constants.DirectionEnum.LEFT;
                } else if (absSlope > 2.4142) { // ~67.5 degrees
                    direction = deltaY > 0 ? Constants.DirectionEnum.DOWN : Constants.DirectionEnum.UP;
                } else {
                    // Diagonal directions
                    if (deltaX > 0) {
                        direction = deltaY > 0 ? Constants.DirectionEnum.DOWN_RIGHT : Constants.DirectionEnum.UP_RIGHT;
                    } else {
                        direction = deltaY > 0 ? Constants.DirectionEnum.DOWN_LEFT : Constants.DirectionEnum.UP_LEFT;
                    }
                }
                Utils.debugLog('8-direction mode, slope:', slope, 'result:', direction);
            }
        }

        return direction;
    };

    const getDraggableLink = (element) => {
        if (!element) return null;

        let current = element;
        while (current && current !== document) {
            if (current.tagName === 'A' && current.href) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    };

    const makeLinksDraggable = () => {
        // Use a single query and cache the result
        const links = document.querySelectorAll('a[href]:not([draggable="true"])');
        links.forEach(link => {
            link.draggable = true;
            Utils.debugLog('Made link draggable:', link.href);
        });
    };

    const processMutations = (mutations) => {
        let needsUpdate = false;
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const links = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
                        if (links.length > 0) needsUpdate = true;

                        if (node.tagName === 'A' && node.href && !node.draggable) {
                            needsUpdate = true;
                        }
                    }
                });
            }
        });

        if (needsUpdate) {
            makeLinksDraggable();
        }
    };

    const attachDragHandler = (element) => {
        if (!element || State.attachedElements.has(element)) return;

        State.attachedElements.add(element);

        // Make sure elements are draggable - optimized version
        if (element === document) {
            // Use a single observer with throttling
            let observerTimeout;
            const observer = new MutationObserver(function (mutations) {
                // Throttle observer updates to prevent excessive processing
                if (observerTimeout) return;

                observerTimeout = setTimeout(() => {
                    observerTimeout = null;
                    processMutations(mutations);
                }, 100); // 100ms throttle
            });

            observer.observe(document, {
                childList: true,
                subtree: true
            });

            // Initial setup
            makeLinksDraggable();

            // Use event delegation for drag events
            let dragState = null;

            document.addEventListener('dragstart', function (event) {
                const link = getDraggableLink(event.target);
                if (!link) return;

                Utils.debugLog('🚀 Drag started on element:', event.target.tagName, link.href || event.target.src);
                dragState = {
                    startX: event.clientX,
                    startY: event.clientY,
                    target: link
                };

                // Prevent default drag behavior for non-draggable elements
                if (!event.target.draggable) {
                    event.preventDefault();
                    return;
                }
            }, { passive: true });

            document.addEventListener('dragend', function (event) {
                if (!dragState) return;

                Utils.debugLog('🏁 Drag ended');
                const endX = event.clientX;
                const endY = event.clientY;

                const direction = getDirection(dragState.startX, dragState.startY, endX, endY);

                Utils.debugLog(`🎯 Final drag direction: ${direction} (${dragState.startX},${dragState.startY} -> ${endX},${endY})`);
                Utils.debugLog('Current settings:', State.settings);

                const targetHref = dragState.target.href || dragState.target.src;
                if (!targetHref) {
                    Utils.debugWarn('❌ No href or src found on target element');
                    dragState = null;
                    return;
                }

                Utils.debugLog('🔗 Target URL:', targetHref);

                // Execute action based on direction
                switch (direction) {
                    case Constants.DirectionEnum.RIGHT:
                        Utils.debugLog('➡️ Executing RIGHT action:', State.settings.RIGHT);
                        Actions.executeAction(targetHref, State.settings.RIGHT);
                        break;
                    case Constants.DirectionEnum.LEFT:
                        Utils.debugLog('⬅️ Executing LEFT action:', State.settings.LEFT);
                        Actions.executeAction(targetHref, State.settings.LEFT);
                        break;
                    case Constants.DirectionEnum.UP:
                        Utils.debugLog('⬆️ Executing UP action:', State.settings.UP);
                        Actions.executeAction(targetHref, State.settings.UP);
                        break;
                    case Constants.DirectionEnum.DOWN:
                        Utils.debugLog('⬇️ Executing DOWN action:', State.settings.DOWN);
                        Actions.executeAction(targetHref, State.settings.DOWN);
                        break;
                    case Constants.DirectionEnum.UP_LEFT:
                        Utils.debugLog('↖️ Executing UP_LEFT action: list');
                        Actions.executeAction(targetHref, 'list');
                        break;
                    default:
                        Utils.debugLog('❓ Direction not mapped to action:', direction);
                }

                dragState = null;
            }, { passive: true });
        }
    };

    return {
        getDirection,
        attachDragHandler
    };
})();

// ===== MODULE: MENU =====
const Menu = (() => {
    'use strict';

    const showActionHelp = () => {
        const helpText = `🎮 DRAG DIRECTIONS & ACTIONS:

📺 UP (↑): ${State.settings.UP}
   → Pipes video to MPV with yt-dlp processing
   → Good for: YouTube, complex streams

📥 DOWN (↓): ${State.settings.DOWN} ${State.settings.down_confirm ? '(Confirm: ON)' : '(Confirm: OFF)'}
   → Downloads video using yt-dlp
   → Good for: Saving videos locally

🌊 LEFT (←): ${State.settings.LEFT}
   → Streams video using streamlink
   → Good for: Twitch, live streams

▶️ RIGHT (→): ${State.settings.RIGHT}
   → Direct play in MPV player
   → Good for: Direct video files

📋 UP-LEFT (↖): list
   → Adds to IPTV/playlist
   → Good for: Building playlists

🎯 USAGE:
1. Hover over a video link
2. Drag in desired direction
3. Release to trigger action

🔧 Settings: ${State.settings.total_direction} directions, HLS: ${State.settings.hlsdomain.split(',').length} domains

🐛 TROUBLESHOOTING:
- Check browser console (F12) for debug logs
- Make sure links are draggable (script auto-enables)
- Try dragging further than ${Constants.DRAG_THRESHOLD}px
- Look for "🚀 Drag started" and "⬆️ Executing UP action" logs`;

        alert(helpText);
    };

    const testDirections = () => {
        Utils.debugLog('🧪 Testing direction detection:');
        const tests = [
            { name: 'UP', start: [100, 100], end: [100, 50] },
            { name: 'DOWN', start: [100, 100], end: [100, 150] },
            { name: 'LEFT', start: [100, 100], end: [50, 100] },
            { name: 'RIGHT', start: [100, 100], end: [150, 100] },
            { name: 'UP-LEFT', start: [100, 100], end: [50, 50] },
            { name: 'NO MOVEMENT', start: [100, 100], end: [105, 105] }
        ];

        tests.forEach(test => {
            const direction = Drag.getDirection(test.start[0], test.start[1], test.end[0], test.end[1]);
            Utils.debugLog(`${test.name}: (${test.start[0]},${test.start[1]}) -> (${test.end[0]},${test.end[1]}) = Direction ${direction}`);
        });
    };

    const setupMenuCommands = () => {
        // Help command first
        GM_registerMenuCommand('❓ Show Action Help', showActionHelp);
        GM_registerMenuCommand('🧪 Test Directions', testDirections);

        GM_registerMenuCommand(`📺 UP: ${State.settings.UP}`, function () {
            const value = Utils.safePrompt(Constants.GUIDE + '\n\n↑ UP Action (pipe = stream to MPV with yt-dlp)', State.settings.UP);
            if (value) {
                State.updateSetting('UP', value);
                Utils.reloadPage();
            }
        });

        GM_registerMenuCommand(`📥 DOWN: ${State.settings.DOWN}`, function () {
            const value = Utils.safePrompt(Constants.GUIDE + '\n\n↓ DOWN Action (ytdl = download with yt-dlp)', State.settings.DOWN);
            if (value) {
                State.updateSetting('DOWN', value);
                Utils.reloadPage();
            }
        });

        GM_registerMenuCommand(`🌊 LEFT: ${State.settings.LEFT}`, function () {
            const value = Utils.safePrompt(Constants.GUIDE + '\n\n← LEFT Action (stream = use streamlink)', State.settings.LEFT);
            if (value) {
                State.updateSetting('LEFT', value);
                Utils.reloadPage();
            }
        });

        GM_registerMenuCommand(`▶️ RIGHT: ${State.settings.RIGHT}`, function () {
            const value = Utils.safePrompt(Constants.GUIDE + '\n\n→ RIGHT Action (mpv = direct play)', State.settings.RIGHT);
            if (value) {
                State.updateSetting('RIGHT', value);
                Utils.reloadPage();
            }
        });

        GM_registerMenuCommand('HLS Domains', function () {
            const value = Utils.safePrompt('Example: 1.com,2.com,3.com,4.com', State.settings.hlsdomain);
            if (value !== null) {
                State.updateSetting('hlsdomain', value);
                State.hlsdomainArray = value.split(',').filter(d => d.trim());
            }
        });

        GM_registerMenuCommand(`Live Chat: ${State.settings.livechat}`, function () {
            State.updateSetting('livechat', !State.settings.livechat);
            Utils.reloadPage();
        });

        GM_registerMenuCommand(`Directions: ${State.settings.total_direction}`, function () {
            const newValue = State.settings.total_direction === 4 ? 8 : 4;
            State.updateSetting('total_direction', newValue);
            Utils.reloadPage();
        });

        GM_registerMenuCommand(`DOWN Confirm: ${State.settings.down_confirm ? 'ON' : 'OFF'}`, function () {
            State.updateSetting('down_confirm', !State.settings.down_confirm);
            Utils.reloadPage();
        });

        GM_registerMenuCommand(`🐛 Debug Mode: ${State.settings.debug ? 'ON' : 'OFF'}`, function () {
            State.updateSetting('debug', !State.settings.debug);
            Utils.reloadPage();
        });
    };

    return {
        setupMenuCommands
    };
})();

// ===== MODULE: COLLECTION =====
const Collection = (() => {
    'use strict';

    const toggleUrlCollection = (link, target) => {
        if (!link.href) return;

        if (State.collectedUrls.has(link.href)) {
            // Remove from collection
            const element = State.collectedUrls.get(link.href);
            try {
                element.classList.remove('hh-collected-link');
            } catch (error) {
                Utils.debugError('Failed to remove collected link class:', error);
            }
            State.collectedUrls.delete(link.href);
            Utils.debugLog('Removed URL from collection:', link.href);
        } else {
            // Add to collection
            try {
                target.classList.add('hh-collected-link');
            } catch (error) {
                Utils.debugError('Failed to add collected link class:', error);
            }
            State.collectedUrls.set(link.href, target);
            Utils.debugLog('Added URL from collection:', link.href);
        }

        Utils.debugLog('Current collection size:', State.collectedUrls.size);
    };

    const setupRightClickCollection = () => {
        let mouseIsDown = false;
        let isHeld = false;

        document.addEventListener('mousedown', function (event) {
            const link = Utils.getParentByTagName(event.target, 'A');
            if (!link) return;

            mouseIsDown = true;

            // Cleanup listeners
            const handleMouseUp = function () {
                mouseIsDown = false;
                document.removeEventListener('mouseup', handleMouseUp);
            };

            const handleContextMenu = function (contextEvent) {
                if (isHeld) {
                    contextEvent.preventDefault();
                    isHeld = false;
                }
                document.removeEventListener('contextmenu', handleContextMenu);
            };

            document.addEventListener('mouseup', handleMouseUp, { once: true });
            document.addEventListener('contextmenu', handleContextMenu, { once: true });

            // Handle right-click
            if (event.button === 2) {
                setTimeout(function () {
                    if (mouseIsDown) {
                        toggleUrlCollection(link, event.target);
                        mouseIsDown = false;
                        isHeld = true;
                    }
                }, Constants.RIGHT_CLICK_DELAY);
            }
        });
    };

    return {
        setupRightClickCollection
    };
})();

// ===== MODULE: YOUTUBE =====
const YouTube = (() => {
    'use strict';

    const addYouTubeMenuCommand = (label, url, persistent) => {
        GM_registerMenuCommand(label, function () {
            if (persistent) {
                if (url.includes('m.youtube.com')) {
                    GM_setValue('hh_mobile', true);
                } else if (url.includes('www.youtube.com')) {
                    GM_setValue('hh_mobile', false);
                }
            } else {
                GM_deleteValue('hh_mobile');
            }

            try {
                location.replace(url);
            } catch (error) {
                Utils.debugError('Failed to navigate:', error);
            }
        });
    };

    const setupYouTubeFeatures = () => {
        const domain = document.domain;
        if (domain !== 'www.youtube.com' && domain !== 'm.youtube.com') return;

        const firstChar = (location.host || '').charAt(0);

        if (firstChar === 'w') {
            addYouTubeMenuCommand(
                "Switch to YouTube Mobile (Persistent)",
                "https://m.youtube.com/?persist_app=1&app=m",
                true
            );
            addYouTubeMenuCommand(
                "Switch to YouTube Mobile (Temporary)",
                "https://m.youtube.com/?persist_app=0&app=m",
                false
            );
        } else if (firstChar === 'm') {
            addYouTubeMenuCommand(
                "Switch to YouTube Desktop (Persistent)",
                "https://www.youtube.com/?persist_app=1&app=desktop",
                true
            );
            addYouTubeMenuCommand(
                "Switch to YouTube Desktop (Temporary)",
                "https://www.youtube.com/?persist_app=0&app=desktop",
                false
            );

            // Mobile layout improvements
            try {
                GM_addStyle(`
                    ytm-rich-item-renderer {
                        width: 33% !important;
                        margin: 1px !important;
                        padding: 0px !important;
                    }
                `);
            } catch (error) {
                Utils.debugError('Failed to apply YouTube mobile styles:', error);
            }
        }
    };

    return {
        setupYouTubeFeatures
    };
})();

// ===== MODULE: MAIN =====
const Main = (() => {
    'use strict';

    const handleShadowRoots = () => {
        document.addEventListener('mouseover', function (event) {
            if (event.target.shadowRoot && !State.attachedElements.has(event.target)) {
                Drag.attachDragHandler(event.target.shadowRoot);
            }
        });
    };

    const cleanup = () => {
        // Clear collections to free memory
        State.collectedUrls.clear();

        // Remove any visual indicators
        document.querySelectorAll('.hh-collected-link').forEach(el => {
            el.classList.remove('hh-collected-link');
        });

        Utils.debugLog('Handlers Helper cleanup completed');
    };

    const initialize = () => {
        try {
            State.init();
            Menu.setupMenuCommands();
            Drag.attachDragHandler(document);
            Collection.setupRightClickCollection();
            handleShadowRoots();
            YouTube.setupYouTubeFeatures();

            Utils.debugLog('Handlers Helper (Improved) - Modular Version initialized successfully');
            Utils.debugLog('Settings validated and loaded');
        } catch (error) {
            Utils.debugError('Initialization failed:', error);
        }
    };

    // Add cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    return {
        initialize
    };
})();

// ===== INITIALIZATION =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Main.initialize);
} else {
    Main.initialize();
}