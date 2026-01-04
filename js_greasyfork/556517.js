// ==UserScript==
// @name         GeoGuessr Force Focus Mode
// @description  Enjoy playing with Hyperfocus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       AaronThug - Forked by yuri
// @license      MIT
// @icon         https://www.geoguessr.com/favicon.ico
// @match        https://www.geoguessr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556517/GeoGuessr%20Force%20Focus%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/556517/GeoGuessr%20Force%20Focus%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LS_KEY = "__GEOGUESSR_FOCUS_MODE__";

    function getState() {
        return localStorage.getItem(LS_KEY) === "true";
    }

    function setState(v) {
        localStorage.setItem(LS_KEY, v ? "true" : "false");
    }

    function injectCSS() {
        const style = document.createElement("style");
        style.textContent = `
            .geotoggle-container {
                margin-top: 20px;
                display: flex;
                width: 100%;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                cursor: pointer;
                user-select: none;
            }

            .geotoggle-label {
                margin-left: 8px;
                color: white;
            }

            .geotoggle-switch {
                position: relative;
                width: 40px;
                height: 20px;
                background: #777;
                border-radius: 20px;
                transition: background 0.25s;
            }

            .geotoggle-switch.on {
                background: #4ade80 !important; /* green */
            }

            .geotoggle-slider {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                transition: left 0.25s;
            }

            .geotoggle-switch.on .geotoggle-slider {
                left: 22px;
            }
        `;
        document.head.appendChild(style);
    }

    function createToggle() {
        const wrapper = document.createElement("div");
        wrapper.className = "geotoggle-container";

        const label = document.createElement("span");
        label.className = "geotoggle-label";
        label.textContent = "Focus Mode";

        const switchEl = document.createElement("div");
        switchEl.className = "geotoggle-switch";
        if (getState()) switchEl.classList.add("on");

        const slider = document.createElement("div");
        slider.className = "geotoggle-slider";

        switchEl.appendChild(slider);
        wrapper.appendChild(switchEl);
        wrapper.appendChild(label);

        wrapper.addEventListener("click", () => {
            const isOn = switchEl.classList.toggle("on");
            setState(isOn);
            location.reload(true);
        });

        return wrapper;
    }

    let focusModeEnabled = true;
    let MY_USERNAME = '';

    const MULTI_PATH = '/multiplayer';

    // GeoGuessr sometimes changes the hashed class a bit (0fy5 vs 0fy56, etc.)
    const CHAT_CONTAINER_CLASSES = [
        'chat-log_scrollContainer__0fy5',
        'chat-log_scrollContainer__0fy56'
    ];

    function isChatContainer(el) {
        if (!el || !el.classList) return false;
        return CHAT_CONTAINER_CLASSES.some(c => el.classList.contains(c));
    }

    function queryChatContainer() {
        const selector = CHAT_CONTAINER_CLASSES.map(c => '.' + c).join(',');
        return document.querySelector(selector);
    }

    function detectMyUsername() {
        const duelsNickElement = document.querySelector('.user-nick_nick__sRjZ2.user-nick_visibleOverflow__oR46v');
        if (duelsNickElement && duelsNickElement.textContent) {
            const username = duelsNickElement.textContent.replace(/\s+/g, ' ').trim();
            if (username.length > 0 && username.length < 30) {
                MY_USERNAME = username;
                return true;
            }
        }
        try {
            const userData = localStorage.getItem('gg-user-data');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.nick || user.username || user.name) {
                    MY_USERNAME = user.nick || user.username || user.name;
                    return true;
                }
            }
        } catch (e) {}

        const profileSelectors = [
            '[data-qa="navbar-profile-button"]',
            '.navbar-profile-button',
            '.profile-button'
        ];
        for (const selector of profileSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                const username = element.textContent.trim();
                if (username.length > 0 && username.length < 30 && !username.includes('Profile')) {
                    MY_USERNAME = username;
                    return true;
                }
            }
        }
        return false;
    }

    function censorName(element, size = 1) {
        if (!element || !element.textContent) return;
        const text = element.textContent.trim();
        if (text === MY_USERNAME) return;
        if (text.length < 2 || /^\d+$/.test(text)) return;
        element.textContent = '?????'.repeat(size);
    }

    function censorChatMessage(message) {
        if (window.location.pathname !== MULTI_PATH) return;
        if (!message || !message.textContent || message.dataset.censored) return;

        const text = message.textContent.trim();
        if (text.includes('has guessed') || text.includes('guessed')) {
            const username = text.split(/has guessed|guessed/)[0].trim();
            if (username !== MY_USERNAME) {
                message.textContent = message.textContent.replace(username, '?');
                message.dataset.censored = 'true';
            }
        }
    }

    function censorOpponentNames() {
        if (!getState()) return;
        if (window.location.pathname !== MULTI_PATH && !window.location.pathname.includes("/summary")) return;
        if (!focusModeEnabled) return;

        const matchmakingNames = document.querySelectorAll('.summon-glow-text_root__iYz_y');
        matchmakingNames.forEach(element => {
            if (element.closest('.ranked-leaderboard_root__kpVHS')) return;
            const textNodes = Array.from(element.childNodes).filter(node =>
                node.nodeType === Node.TEXT_NODE && node.textContent.trim()
            );
            textNodes.forEach(textNode => {
                const text = textNode.textContent.trim();
                if (text !== MY_USERNAME && text.length > 1) {
                    textNode.textContent = '?';
                    const shadowElement = element.querySelector('.summon-glow-text_shadowPlaceholder___MC0p');
                    if (shadowElement) shadowElement.textContent = '?';
                }
            });
        });

        document.querySelectorAll(".health-bar-2_avatarContainer__Q1G0O").forEach((el, i) => {
            if (i <= 0) return;
            el.style.display = "none";
        });
         document.querySelectorAll(".in-game-stats-overlay_cardWrapper__mCAp_").forEach((el, i) => {
            if (i <= 0) return;
            el.style.display = "none";
        });

        document.querySelectorAll(".health-bar-2_flag__s_DJX img").forEach((el, i) => {
            if (i <= 0) return;
            el.src = "https://i.ibb.co/rGKGH9Nv/earth-americas.png";
        });

        document.querySelectorAll(".post-guess-player-spectator_avatarCam__MTwKL").forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll(".post-guess-player-spectator_playerInfo__7FNe2").forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll(".post-game-message_systemMessage__sZY3O span").forEach(el => {
            el.textContent = '????';
        });

        document.querySelectorAll(".polite-pin_wrapper__S5mx5 svg image").forEach((el, i) => {
            if (i <= 0) return;
            el.remove();
        });

        document.querySelectorAll(".row_additionalStats__k_bb0").forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll(".row_avatar__6HG7W").forEach(el => {
            el.style.display = 'none';
        });
         document.querySelectorAll(".player-stats-card_matchHistoryContainer__rjVLM").forEach(el => {
            el.style.display = 'none';
        });
document.querySelectorAll(".center-content_rivalryContainer__ynety").forEach(el => {
            el.style.display = 'none';
        });

        document.querySelectorAll(".row_points__raL_9").forEach(el => {
            el.textContent = '????';
        });

        if (window.location.pathname.includes("/summary")) {
            document.querySelectorAll(".styles_image__vpfH1").forEach(el => {
            el.style.display = 'none';
        });

        }

        const chatContainer = queryChatContainer();
        if (chatContainer) {
            const messages = Array.from(chatContainer.children);
            messages.forEach(message => {
                if (!message.dataset.censored) {
                    censorChatMessage(message);
                }
            });
        }

        const healthBarNames = document.querySelectorAll('.health-bar-2_nick__dWcMx');
        healthBarNames.forEach(element => {
            if (element.closest('.ranked-leaderboard_root__kpVHS')) return;
            censorName(element);
        });

        document.querySelectorAll(".avatar_titleAvatarImage__sXIP7").forEach(el => {
            el.style.display = 'none';
        });

        document.querySelectorAll(".user-nick_flairsWrapper__XtEGd").forEach(el => {
            el.style.display = 'none';
        });

        document.querySelectorAll(".avatar_titleAvatar__JsMrO").forEach(el => {
            el.style.display = 'none';
        });

        const additionalSelectors = [
            '[class*="nick"]:not(.user-nick_visibleOverflow__oR46v)',
            '[class*="player-name"]',
            '[class*="opponent"]',
        ];
        additionalSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.closest('.side-tray_body__30bbe')) return;
                if (element.closest('.ranked-leaderboard_root__kpVHS')) return;
                if (!element.classList.contains('summon-glow-text_root__iYz_y') &&
                    !element.classList.contains('health-bar-2_nick__dWcMx') &&
                    !element.classList.contains('user-nick_visibleOverflow__oR46v')) {
                    if (element.textContent && element.textContent.trim() && element.textContent.trim().length > 1) {
                        censorName(element);
                    }
                }
            });
        });
    }

    function waitForHeader() {
        const selector = ".game-modes_inner__Ywx8O";

        const interval = setInterval(() => {
            const header = document.querySelector(selector);
            if (header && !document.getElementById("geotoggle-focus")) {
                const toggle = createToggle();
                toggle.id = "geotoggle-focus";
                header.appendChild(toggle);
                clearInterval(interval);
            }
        }, 400);
    }

    injectCSS();
    waitForHeader();

    // --- MAIN MUTATION OBSERVER (THROTTLED) ---

    let updateScheduled = false;
    const UPDATE_DELAY = 80; // ms: small but avoids spam

    const observer = new MutationObserver(function(mutations) {
        const isMultiplayer = window.location.pathname === MULTI_PATH || window.location.pathname.includes("/summary");

        // Handle new chat messages in "real time"
        if (isMultiplayer) {
            for (const mutation of mutations) {
                if (
                    mutation.type === 'childList' &&
                    mutation.addedNodes.length > 0 &&
                    isChatContainer(mutation.target)
                ) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && !node.dataset.censored) {
                            censorChatMessage(node);
                        }
                    }
                }
            }
        }

        // Throttled full scan for opponent names & UI
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldUpdate = true;
                break;
            }
        }

        if (!shouldUpdate) return;
        if (!focusModeEnabled || !isMultiplayer) return;

        if (updateScheduled) return;
        updateScheduled = true;

        setTimeout(() => {
            updateScheduled = false;
            if (!focusModeEnabled) return;
            if (window.location.pathname !== MULTI_PATH && !window.location.pathname.includes("/summary")) return;
            if (!MY_USERNAME) detectMyUsername();
            censorOpponentNames();
        }, UPDATE_DELAY);
    });

    function startObserver() {
        if (!document.body) return;
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }

    // Initial pass
    setTimeout(() => {
        detectMyUsername();
        censorOpponentNames();
    }, 1000);

    // --- URL CHANGE HANDLING (no extra MutationObserver) ---

    let lastUrl = location.href;

    function handleUrlChange() {
        const url = location.href;
        if (url === lastUrl) return;
        lastUrl = url;

        setTimeout(() => {
            if (!MY_USERNAME) detectMyUsername();
            censorOpponentNames();
        }, 500);
    }

    const originalPushState = history.pushState;
    history.pushState = function() {
        const result = originalPushState.apply(this, arguments);
        handleUrlChange();
        return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        const result = originalReplaceState.apply(this, arguments);
        handleUrlChange();
        return result;
    };

    document.addEventListener('keydown', (e) => {
        if (window.location.pathname === '/multiplayer') {
            if (e.key === 'Tab' || e.keyCode === 9) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });

    window.addEventListener('popstate', handleUrlChange);
})();
