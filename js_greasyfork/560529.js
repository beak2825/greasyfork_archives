// ==UserScript==
// @name         FictionLab Enhanced
// @namespace    Violentmonkey Scripts
// @version      0.1
// @description  Add new features to FictionLab.ai and hide UI elements
// @author       Skeleton8595
// @license      MIT
// @match        https://fictionlab.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fictionlab.ai
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560529/FictionLab%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/560529/FictionLab%20Enhanced.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // DO NOT CHANGE - USE SETTINGS MENU
    // Open Fictionlab, click your Userscript Extension Icon -> FictionLab Enhanced Settings
    // If you don't have a settings menu, look for a better Userscript Extension
    const DEFAULT_CONFIG = {
        CLEANUP_BOT_LABEL: false,
        CLEANUP_EDITED_LABEL: false,
        CLEANUP_REGENERATE_BUTTON: false,
        CLEANUP_REGENERATE_NAVIGATION: false,
        CLEANUP_AUDIO_ICON: false,
        CLEANUP_TRANSLATION_ICON: false,
        CLEANUP_CONTINUE_ICON: false,
        CLEANUP_FEEDBACK_BUTTON: false,
        CLEANUP_SIDEBAR_HOME: false,
        CLEANUP_SIDEBAR_MY_SCENARIOS: false,
        CLEANUP_SIDEBAR_CREATE: false,
        CLEANUP_SIDEBAR_PLUS_BUTTON: false,
        CLEANUP_REMINDER_TEXT: false,
        CLEANUP_CHOICES_BUTTON: false,
        CLEANUP_RATING_BOX: false,
        CLEANUP_MODALS: false,
        HEADER_HIDE_COMPLETELY: false,
        HEADER_SHOW_ON_HOVER: false,
        ENTER_KEY_ENABLED: false,
        ARROW_KEYS_ENABLED: false,
        HIDE_CONTINUE_MESSAGES_ENABLED: false
    };

    let CONFIG = {};

    function loadConfig() {
        const saved = GM_getValue('fictionlab_config');
        CONFIG = Object.assign({}, DEFAULT_CONFIG, saved || {});
        return CONFIG;
    }

    function saveConfig() {
        GM_setValue('fictionlab_config', CONFIG);
        return true;
    }

    function resetConfig() {
        CONFIG = Object.assign({}, DEFAULT_CONFIG);
        saveConfig();
        location.reload();
    }

    function createConfigUI() {
        const existing = document.querySelector('#fl-config');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'fl-config';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: #1a1a1a;
            border-radius: 8px;
            width: 500px;
            max-height: 80vh;
            overflow: hidden;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            background: #2a2a2a;
            padding: 12px 20px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const title = document.createElement('div');
        title.textContent = 'FictionLab Enhanced Settings';
        title.style.cssText = `
            color: #fff;
            font-weight: 600;
            font-size: 14px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #888;
            font-size: 20px;
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
        `;
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#444';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'none';
        });
        closeBtn.onclick = () => overlay.remove();

        header.appendChild(title);
        header.appendChild(closeBtn);

        const content = document.createElement('div');
        content.style.cssText = `
            padding: 16px 20px;
            max-height: 60vh;
            overflow-y: auto;
        `;

        const categories = [
            {
                name: 'Hide UI Elements',
                subcategories: [
                    {
                        name: 'Messages',
                        settings: [
                            { key: 'CLEANUP_BOT_LABEL', label: 'Hide "FictionLab" Label', desc: 'Remove "FictionLab" label from messages' },
                            { key: 'CLEANUP_EDITED_LABEL', label: 'Hide "EDITED" Label', desc: 'Remove "EDITED" label from messages' }
                        ]
                    },
                    {
                        name: 'Message Bottom Menu',
                        settings: [
                            { key: 'CLEANUP_REGENERATE_BUTTON', label: 'Hide Regenerate Button', desc: 'Hide the regenerate button (circle icon)' },
                            { key: 'CLEANUP_REGENERATE_NAVIGATION', label: 'Hide Regenerate Navigation', desc: 'Hide navigation arrows (< 1/2 >)' },
                            { key: 'CLEANUP_AUDIO_ICON', label: 'Hide Speaker Icon', desc: 'Hide text-to-speech icon' },
                            { key: 'CLEANUP_TRANSLATION_ICON', label: 'Hide Translate Icon', desc: 'Hide translation icon' },
                            { key: 'CLEANUP_CONTINUE_ICON', label: 'Hide Continue Message Icon', desc: 'Hide message continuation icon' },
                            { key: 'CLEANUP_FEEDBACK_BUTTON', label: 'Hide "Give Feedback" Button', desc: 'Hide "Give Feedback" button' }
                        ]
                    },
                    {
                        name: 'Sidebar',
                        settings: [
                            { key: 'CLEANUP_SIDEBAR_HOME', label: 'Hide "Home Page"', desc: 'Hide "Home Page" button from sidebar' },
                            { key: 'CLEANUP_SIDEBAR_MY_SCENARIOS', label: 'Hide "My Scenarios"', desc: 'Hide "My Scenarios" button from sidebar' },
                            { key: 'CLEANUP_SIDEBAR_CREATE', label: 'Hide "Create Content"', desc: 'Hide "Create Content" button from sidebar' },
                            { key: 'CLEANUP_SIDEBAR_PLUS_BUTTON', label: 'Hide "Try FictionLab+"', desc: 'Hide "Try FictionLab+" button from sidebar' }
                        ]
                    },
                    {
                        name: 'Other',
                        settings: [
                            { key: 'CLEANUP_REMINDER_TEXT', label: 'Hide AI Reminder', desc: 'Hide "Everything is AI" text' },
                            { key: 'CLEANUP_CHOICES_BUTTON', label: 'Hide Suggestion Button', desc: 'Hide suggestion button (lightbulb)' },
                            { key: 'CLEANUP_RATING_BOX', label: 'Hide Ratingbox', desc: 'Hide "What do you think about this scenario?"' },
                            { key: 'CLEANUP_MODALS', label: 'Hide FictionLab+ Popup', desc: 'Hide FictionLab+ popups' }
                        ]
                    }
                ]
            },
            {
                name: 'Chat Header',
                subcategories: [
                    {
                        name: '',
                        settings: [
                            { key: 'HEADER_HIDE_COMPLETELY', label: 'Hide Completely', desc: 'Completely hide the header' },
                            { key: 'HEADER_SHOW_ON_HOVER', label: 'Show on Hover', desc: 'Hide by default, show on hover' }
                        ]
                    }
                ]
            },
            {
                name: 'Keyboard',
                subcategories: [
                    {
                        name: '',
                        settings: [
                            { key: 'ENTER_KEY_ENABLED', label: 'Enter Key', desc: 'Press enter to trigger "continue message"' },
                            { key: 'ARROW_KEYS_ENABLED', label: 'Arrow Keys', desc: 'Use left and right arrow to generate a new message/switch between them' }
                        ]
                    }
                ]
            },
            {
                name: 'Experimental',
                subcategories: [
                    {
                        name: '',
                        settings: [
                            { key: 'HIDE_CONTINUE_MESSAGES_ENABLED', label: 'Hide "continue" Messages', desc: 'Hide messages that only contain "continue"' }
                        ]
                    }
                ]
            }
        ];

        categories.forEach(category => {
            const section = document.createElement('div');
            section.style.marginBottom = '16px';

            const sectionTitle = document.createElement('div');
            sectionTitle.textContent = category.name;
            sectionTitle.style.cssText = `
                color: #fff;
                font-weight: 600;
                margin-bottom: 12px;
                padding-bottom: 4px;
                border-bottom: 1px solid #444;
                font-size: 16px;
            `;

            section.appendChild(sectionTitle);

            category.subcategories.forEach(subcategory => {
                if (subcategory.name) {
                    const subcategoryTitle = document.createElement('div');
                    subcategoryTitle.textContent = subcategory.name;
                    subcategoryTitle.style.cssText = `
                        color: #ccc;
                        font-weight: 500;
                        margin: 8px 0 6px 8px;
                        font-size: 14px;
                    `;
                    section.appendChild(subcategoryTitle);
                }

                subcategory.settings.forEach(setting => {
                    const item = document.createElement('div');
                    item.style.cssText = `
                        margin-bottom: 6px;
                        padding: 6px 8px 6px ${subcategory.name ? '16px' : '8px'};
                        border-radius: 4px;
                        transition: background 0.2s;
                    `;

                    item.addEventListener('mouseenter', () => {
                        item.style.background = '#2a2a2a';
                    });
                    item.addEventListener('mouseleave', () => {
                        item.style.background = 'transparent';
                    });

                    const row = document.createElement('div');
                    row.style.cssText = `
                        display: flex;
                        align-items: center;
                        margin-bottom: 2px;
                    `;

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = CONFIG[setting.key];
                    checkbox.id = setting.key;
                    checkbox.style.cssText = `
                        margin-right: 8px;
                        cursor: pointer;
                    `;

                    const label = document.createElement('label');
                    label.htmlFor = setting.key;
                    label.textContent = setting.label;
                    label.style.cssText = `
                        color: #fff;
                        cursor: pointer;
                        flex: 1;
                    `;

                    row.appendChild(checkbox);
                    row.appendChild(label);

                    const desc = document.createElement('div');
                    desc.textContent = setting.desc;
                    desc.style.cssText = `
                        color: #888;
                        margin-left: 20px;
                        font-size: 12px;
                    `;

                    item.appendChild(row);
                    item.appendChild(desc);
                    section.appendChild(item);
                });
            });

            content.appendChild(section);
        });

        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 12px 20px;
            background: #2a2a2a;
            border-top: 1px solid #333;
            display: flex;
            justify-content: space-between;
        `;

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset to Default';
        resetBtn.style.cssText = `
            background: #444;
            color: #fff;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
        `;
        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.background = '#555';
        });
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.background = '#444';
        });
        resetBtn.onclick = () => {
            if (confirm('Reset all settings to default?')) resetConfig();
        };

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save & Apply';
        saveBtn.style.cssText = `
            background: #4CAF50;
            color: #fff;
            border: none;
            padding: 6px 16px;
            border-radius: 4px;
            cursor: pointer;
        `;
        saveBtn.addEventListener('mouseenter', () => {
            saveBtn.style.background = '#5CBF5F';
        });
        saveBtn.addEventListener('mouseleave', () => {
            saveBtn.style.background = '#4CAF50';
        });
        saveBtn.onclick = () => {
            categories.forEach(category => {
                category.subcategories.forEach(subcategory => {
                    subcategory.settings.forEach(setting => {
                        const checkbox = document.getElementById(setting.key);
                        CONFIG[setting.key] = checkbox.checked;
                    });
                });
            });

            if (saveConfig()) {
                overlay.remove();
                location.reload();
            }
        };

        footer.appendChild(resetBtn);
        footer.appendChild(saveBtn);

        dialog.appendChild(header);
        dialog.appendChild(content);
        dialog.appendChild(footer);
        overlay.appendChild(dialog);

        document.body.appendChild(overlay);

        const headerHideCheckbox = document.getElementById('HEADER_HIDE_COMPLETELY');
        const headerHoverCheckbox = document.getElementById('HEADER_SHOW_ON_HOVER');

        if (headerHideCheckbox && headerHoverCheckbox) {
            headerHideCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    headerHoverCheckbox.checked = false;
                }
            });

            headerHoverCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    headerHideCheckbox.checked = false;
                }
            });
        }

        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    function generateCleanupCSS() {
        const rules = [];

        if (CONFIG.CLEANUP_BOT_LABEL) {
            rules.push('.bot-mess-logo { display: none !important; }');
        }

        if (CONFIG.CLEANUP_EDITED_LABEL) {
            rules.push('.edited-marker { display: none !important; }');
        }

        if (CONFIG.CLEANUP_REMINDER_TEXT) {
            rules.push('.message-reminder { display: none !important; }');
        }

        if (CONFIG.CLEANUP_CHOICES_BUTTON) {
            rules.push('.choices-button { display: none !important; }');
        }

        if (CONFIG.CLEANUP_SIDEBAR_PLUS_BUTTON) {
            rules.push('.lab-plus-button { display: none !important; }');
        }

        if (CONFIG.CLEANUP_FEEDBACK_BUTTON) {
            rules.push('.bot-chat-feedback { display: none !important; }');
            rules.push('.bottom-menu-right { display: none !important; }');
        }

        if (CONFIG.CLEANUP_RATING_BOX) {
            rules.push('.chat-scenario-rate-box { display: none !important; }');
        }

        if (CONFIG.CLEANUP_MODALS) {
            rules.push('.premium-background, .premium-wrapper, .premium-modal { display: none !important; }');
        }

        if (CONFIG.CLEANUP_SIDEBAR_MY_SCENARIOS) {
            rules.push('a.main-button[href^="/user/"] { display: none !important; }');
        }

        if (CONFIG.CLEANUP_SIDEBAR_CREATE) {
            rules.push('a.main-button[href="/create"] { display: none !important; }');
        }

        if (CONFIG.CLEANUP_SIDEBAR_HOME) {
            rules.push('a.main-button[href="/"] { display: none !important; }');
        }

        if (CONFIG.CLEANUP_REGENERATE_BUTTON) {
            rules.push(`
                .bottom-bot-menu svg.chat-bottom-icon:has(path[d^="M12 5V1L7 6l5 5V7c3.31"]) {
                    display: none !important;
                }
            `);
        }

        if (CONFIG.CLEANUP_REGENERATE_NAVIGATION) {
            rules.push(`
                .bottom-bot-menu .regenerated-menu {
                    display: none !important;
                }
            `);
        }

        if (CONFIG.CLEANUP_AUDIO_ICON) {
            rules.push(`
                .bottom-bot-menu svg.chat-bottom-icon:has(path[d^="M3 9v6h4l5 5V4L7 9"]) {
                    display: none !important;
                }
            `);
        }

        if (CONFIG.CLEANUP_TRANSLATION_ICON) {
            rules.push(`
                .bottom-bot-menu svg.chat-bottom-icon:has(path[d^="M20 5h-9.12L10 2H4c-1.1"]) {
                    display: none !important;
                }
            `);
        }

        if (CONFIG.CLEANUP_CONTINUE_ICON) {
            rules.push(`
                .bottom-bot-menu svg.continue-message {
                    display: none !important;
                }
            `);
        }

        const allIconsDisabled = CONFIG.CLEANUP_REGENERATE_BUTTON &&
            CONFIG.CLEANUP_AUDIO_ICON &&
            CONFIG.CLEANUP_TRANSLATION_ICON &&
            CONFIG.CLEANUP_CONTINUE_ICON &&
            CONFIG.CLEANUP_FEEDBACK_BUTTON;

        if (allIconsDisabled) {
            rules.push('.bottom-bot-menu { display: none !important; }');
        }

        return rules.join('\n');
    }

    function generateHeaderCSS() {
        const rules = [];

        if (CONFIG.HEADER_HIDE_COMPLETELY) {
            rules.push('.chat-container-header { display: none !important; }');
        } else if (CONFIG.HEADER_SHOW_ON_HOVER) {
            rules.push(`
                .chat-container-header {
                    position: fixed !important;
                    top: 0;
                    left: 0;
                    right: 0;
                    transform: translateY(-100%);
                    opacity: 0;
                    pointer-events: none;
                    transition: transform 0.25s ease, opacity 0.25s ease;
                    z-index: 1000;
                }
                .chat-container-header.visible {
                    transform: translateY(0);
                    opacity: 1;
                    pointer-events: auto;
                }
                .header-hover-zone {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 16px;
                    z-index: 1001;
                    cursor: default;
                }
            `);
        }

        return rules.join('\n');
    }

    function clickElement(el) {
        if (!el) return;
        ['mousedown', 'mouseup', 'click'].forEach(type => {
            try {
                el.dispatchEvent(new MouseEvent(type, {
                    bubbles: true,
                    cancelable: true
                }));
            } catch (e) {
                try {
                    el.dispatchEvent(new Event(type, {
                        bubbles: true,
                        cancelable: true
                    }));
                } catch (e2) {}
            }
        });
    }

    function setupEnterKey() {
        if (!CONFIG.ENTER_KEY_ENABLED) return;

        function getInput() {
            return document.querySelector('#chat-input');
        }

        function isInputEmpty() {
            const input = getInput();
            return input && input.value.trim() === '';
        }

        function triggerLastContinue() {
            const botMessages = document.querySelectorAll('.bot-mess');
            if (!botMessages.length) return false;

            const lastBot = botMessages[botMessages.length - 1];
            const continueBtn = lastBot.querySelector('.continue-message');

            if (!continueBtn) return false;

            clickElement(continueBtn);
            return true;
        }

        document.addEventListener('keydown', function(e) {
            if (e.key !== 'Enter') return;
            if (!isInputEmpty()) return;

            const ok = triggerLastContinue();
            if (ok) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }, true);
    }

    function setupArrowKeys() {
        if (!CONFIG.ARROW_KEYS_ENABLED) return;

        function getLastBotMenu() {
            const bots = document.querySelectorAll('.bot-mess');
            if (!bots.length) return null;

            const lastBot = bots[bots.length - 1];
            return lastBot.querySelector('.bottom-bot-menu');
        }

        function handleArrow(key) {
            const menu = getLastBotMenu();
            if (!menu) return false;

            const regeneratedMenu = menu.querySelector('.regenerated-menu');

            if (!regeneratedMenu) {
                if (key === 'ArrowRight') {
                    const regenerateBtn = menu.querySelector('svg.chat-bottom-icon');
                    if (regenerateBtn) {
                        clickElement(regenerateBtn);
                        return true;
                    }
                }
                return false;
            }

            const arrows = regeneratedMenu.querySelectorAll('svg');
            if (arrows.length < 2) return false;

            if (key === 'ArrowLeft') {
                clickElement(arrows[0]);
                return true;
            }

            if (key === 'ArrowRight') {
                clickElement(arrows[1]);
                return true;
            }

            return false;
        }

        document.addEventListener('keydown', function(e) {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

            const active = document.activeElement;

            if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT') && active.value.trim() !== '') {
                return;
            }

            const handled = handleArrow(e.key);
            if (handled) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }, true);
    }

    function initHideContinueMessages() {
        if (!CONFIG.HIDE_CONTINUE_MESSAGES_ENABLED) return;

        function isContinueMessage(messageElement) {
            const userActionText = messageElement.querySelector('.user-action-text');
            if (!userActionText) return false;
            const text = userActionText.textContent.trim().toLowerCase();
            return text === 'continue';
        }

        function hideContinueMessages() {
            const userMessages = document.querySelectorAll('.user-mess');
            userMessages.forEach(message => {
                if (isContinueMessage(message)) {
                    message.style.display = 'none';
                    message.dataset.continueHidden = 'true';
                }
            });
        }

        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('user-mess')) {
                                shouldCheck = true;
                            }
                            if (node.querySelectorAll) {
                                const userMessages = node.querySelectorAll('.user-mess');
                                if (userMessages.length > 0) {
                                    shouldCheck = true;
                                }
                            }
                        }
                    });
                }
            });
            if (shouldCheck) {
                setTimeout(hideContinueMessages, 100);
            }
        });

        const chatContainer = document.querySelector('.box-chat-container') || document.querySelector('.chat-container');
        if (chatContainer) {
            observer.observe(chatContainer, {
                childList: true,
                subtree: true
            });
            setTimeout(hideContinueMessages, 500);
        } else {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            const interval = setInterval(() => {
                const chatContainer = document.querySelector('.box-chat-container') || document.querySelector('.chat-container');
                if (chatContainer) {
                    clearInterval(interval);
                    observer.disconnect();
                    observer.observe(chatContainer, {
                        childList: true,
                        subtree: true
                    });
                    hideContinueMessages();
                }
            }, 1000);
        }
    }

    function initHeaderHover() {
        if (!CONFIG.HEADER_SHOW_ON_HOVER || CONFIG.HEADER_HIDE_COMPLETELY) return;

        const hotzone = document.createElement('div');
        hotzone.className = 'header-hover-zone';
        document.body.prepend(hotzone);

        function attachHover(header) {
            if (!header) return;
            const showHeader = () => header.classList.add('visible');
            const hideHeader = () => header.classList.remove('visible');

            hotzone.addEventListener('mouseenter', showHeader);
            hotzone.addEventListener('mouseleave', hideHeader);
            header.addEventListener('mouseenter', showHeader);
            header.addEventListener('mouseleave', hideHeader);
        }

        const observer = new MutationObserver(() => {
            const header = document.querySelector('.chat-container-header');
            if (header && !header.dataset.hoverAttached) {
                attachHover(header);
                header.dataset.hoverAttached = "true";
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        loadConfig();

        GM_registerMenuCommand('FictionLab Enhanced Settings', createConfigUI);

        const cleanupCSS = generateCleanupCSS();
        const headerCSS = generateHeaderCSS();
        const combinedCSS = cleanupCSS + '\n' + headerCSS;

        if (combinedCSS.trim()) {
            GM_addStyle(combinedCSS);
        }

        if (CONFIG.HEADER_SHOW_ON_HOVER && !CONFIG.HEADER_HIDE_COMPLETELY) {
            initHeaderHover();
        }

        setupEnterKey();
        setupArrowKeys();

        if (CONFIG.HIDE_CONTINUE_MESSAGES_ENABLED) {
            initHideContinueMessages();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();