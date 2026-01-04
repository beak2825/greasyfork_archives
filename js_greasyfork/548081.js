// ==UserScript==
// @name         PS Style+ v1.0
// @namespace    https://github.com/xJodye/ps-style-plus
// @version      1.1
// @description  Custom avatars + colors + chat icons (Still Experimental)
// @match        https://play.pokemonshowdown.com/*
// @match        https://*.psim.us/*
// @match        https://replay.pokemonshowdown.com/*
// @match        https://play.dawn-ps.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548081/PS%20Style%2B%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/548081/PS%20Style%2B%20v10.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.psStylePlusLoaded) return;
    window.psStylePlusLoaded = true;

    const CONFIG = {
        VERSION: '1.0',
        STYLES_URL: 'https://gist.githubusercontent.com/xJodye/e3e65806dadeb702f423d5da9b4d3cce/raw/styles.json',
        CACHE_DURATION: 30 * 60 * 1000,
        CHUNK_SIZE: 20,
        BATCH_DELAY: 16,
        PRELOAD_BATCH_SIZE: 10,
        PRELOAD_DELAY: 50
    };

    /*
Example usage - add custom user styles here:

const LOCAL_OVERRIDES = {
   testuser123: {
       color: 'FF6B6B',  // Hex color without # (coral red)
       avatar: 'https://play.pokemonshowdown.com/sprites/trainers-custom/testuser.png',
       icon: 'https://www.smogon.com/media/forums/images/test-icon.png',
   },

   anothertestuser: {
       color: '4ECDC4',  // Hex color without # (teal)
       avatar: 'https://play.pokemonshowdown.com/sprites/trainers/may.png',
       icon: '',  // Leave empty if no custom icon
   }
};

Add more users following the same pattern...
Usernames must be all lowercase and match exactly
These changes will be visible only to you, and override any styles in the remote copy.
*/

    const LOCAL_OVERRIDES = {};

    const CACHE_KEY = `psStyles_v${CONFIG.VERSION}`;
    const USER_CACHE_KEY = `psUserStyles_v${CONFIG.VERSION}`;

    const state = {
        CUSTOM: {},
        TEMP_CUSTOM: {},
        USER_TEMP_STORAGE: {},
        stylesLoaded: false,
        processedElements: new WeakSet(),
        updateQueue: new Set(),
        updateTimeout: null,
        globalTooltip: null,
        lastKnownUser: null,
        lastDetectedUser: null,
        preloadedIcons: new Set(),
        preloadedAvatars: new Set(),
        observedUserlists: new WeakSet()
    };

    const SEL = {
        trainers: '.battle .trainer, .trainer',
        popups: '.ps-popup .userdetails',
        names: '.username, .trainername, .userlink, strong, .usernametext',
        sprite: '.trainersprite, img.trainersprite',
        chatNames: '.chat-log .username, .chat-log .usernametext, .battle-log .username, .battle-log .usernametext, .pm-log .username, .pm-log .usernametext',
        chatInputLabel: '.chat-log-add label, .chatbox label, label',
        userlistContainer: '.userlist',
        topRightName: '.userbar .username .usernametext'
    };

    const utils = {
        cleaned: s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim(),
        isBold: el => {
            const fw = window.getComputedStyle(el).fontWeight;
            return el.tagName === 'STRONG' || fw === 'bold' || parseInt(fw, 10) >= 600;
        },
        getCurrentUser: () => {
            const selectors = [
                '.userbar .username .usernametext',
                '.userbar .username',
                '.userbar strong',
                '.userbar .usernametext',
                'button.username .usernametext',
                '.ps-popup .userdetails .username',
                '[name="username"]',
                '.username.cur'
            ];

            for (const selector of selectors) {
                try {
                    const el = document.querySelector(selector);
                    if (el && el.textContent && el.textContent.trim()) {
                        const username = el.textContent.trim();
                        const result = utils.cleaned(username);
                        if (result !== state.lastDetectedUser) {
                            console.log('[PS Style+] Current user detected:', result || 'none');
                            state.lastDetectedUser = result;
                        }
                        return result;
                    }
                } catch (e) {
                    console.warn('[PS Style+] Error checking selector', selector, ':', e.message);
                }
            }

            if (state.lastDetectedUser !== null) {
                console.log('[PS Style+] User detection failed - no valid elements found');
                state.lastDetectedUser = null;
            }
            return null;
        },

        getCustomStyles: userid => {
            const localOverride = LOCAL_OVERRIDES[userid];
            const temp = state.TEMP_CUSTOM[userid];
            const persistent = state.USER_TEMP_STORAGE[userid];
            const gist = state.CUSTOM[userid];

            if (localOverride) return localOverride;
            if (temp) return temp;
            if (persistent) return persistent;
            if (gist) return gist;
            return null;
        },
        debounce: (func, delay) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        }
    };

    const userManager = {
        saveUserData: () => {
            try {
                localStorage.setItem(USER_CACHE_KEY, JSON.stringify(state.USER_TEMP_STORAGE));
                console.log('[PS Style+] Saved user data:', Object.keys(state.USER_TEMP_STORAGE).length, 'users');
            } catch (e) {
                console.error('[PS Style+] Failed to save user data:', e.message);
            }
        },
        loadUserData: () => {
            try {
                const cached = localStorage.getItem(USER_CACHE_KEY);
                if (cached) {
                    state.USER_TEMP_STORAGE = JSON.parse(cached);
                    console.log('[PS Style+] Loaded user data:', Object.keys(state.USER_TEMP_STORAGE).length, 'users');
                }
            } catch (e) {
                console.error('[PS Style+] Failed to load user data:', e.message);
            }
        },
        onUserChange: newUser => {
            console.log('[PS Style+] User changed from', state.lastKnownUser, 'to', newUser);
            if (!newUser) return;

            if (state.lastKnownUser && state.lastKnownUser !== newUser) {
                const tempStyles = state.TEMP_CUSTOM[state.lastKnownUser];
                const persistentStyles = state.USER_TEMP_STORAGE[state.lastKnownUser];

                const gistStyles = state.CUSTOM[state.lastKnownUser];

                const oldUserStyles = tempStyles || persistentStyles || gistStyles || {};

                const localOverrideStyles = LOCAL_OVERRIDES[newUser];
                const existingTempStyles = state.TEMP_CUSTOM[newUser];
                const existingPersistentStyles = state.USER_TEMP_STORAGE[newUser];
                const newUserGistStyles = state.CUSTOM[newUser];

                let finalCustomizations = null;

                if (localOverrideStyles) {
                    finalCustomizations = localOverrideStyles;
                } else if (existingTempStyles || existingPersistentStyles) {
                    finalCustomizations = existingTempStyles || existingPersistentStyles;
                } else if (newUserGistStyles) {
                    finalCustomizations = newUserGistStyles;
                } else if (oldUserStyles.avatar || oldUserStyles.color || oldUserStyles.icon) {
                    finalCustomizations = oldUserStyles;
                }

                if (finalCustomizations && finalCustomizations !== newUserGistStyles && !localOverrideStyles) {
                    console.log('[PS Style+] Transferring customizations to new user:', newUser);
                    state.TEMP_CUSTOM[newUser] = {
                        ...finalCustomizations
                    };
                    state.USER_TEMP_STORAGE[newUser] = {
                        ...finalCustomizations
                    };
                    userManager.saveUserData();
                }

                if (finalCustomizations) {
                    setTimeout(() => {
                        ui._applyChanges();
                    }, 100);
                }
            }

            if (state.USER_TEMP_STORAGE[newUser] && !state.TEMP_CUSTOM[newUser] && !LOCAL_OVERRIDES[newUser]) {
                state.TEMP_CUSTOM[newUser] = {
                    ...state.USER_TEMP_STORAGE[newUser]
                };
                setTimeout(() => {
                    ui._applyChanges();
                }, 100);
            }

            state.lastKnownUser = newUser;
        }
    };

    const cacheManager = {
        get: () => {
            try {
                const cached = localStorage.getItem(CACHE_KEY);
                const timestamp = localStorage.getItem(CACHE_KEY + '_time');
                if (cached && timestamp) {
                    const age = Date.now() - parseInt(timestamp, 10);
                    if (age < CONFIG.CACHE_DURATION) {
                        return JSON.parse(cached);
                    } else {
                        console.log('[PS Style+] Cache expired, age:', Math.round(age / 1000 / 60), 'minutes');
                    }
                }
            } catch (e) {
                console.error('[PS Style+] Cache read error:', e.message);
            }
            return null;
        },
        set: styles => {
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(styles));
                localStorage.setItem(CACHE_KEY + '_time', Date.now().toString());
            } catch (e) {
                console.error('[PS Style+] Cache write error:', e.message);
                try {
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('psStyles_')) {
                            localStorage.removeItem(key);
                        }
                    });
                } catch (e2) {
                    console.error('[PS Style+] Cache cleanup failed:', e2.message);
                }
            }
        },
        clear: () => {
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(CACHE_KEY + '_time');
            console.log('[PS Style+] Cache cleared');
        }
    };

    const styleApplicator = {
        colorElement: (el, userid) => {
            const cs = utils.getCustomStyles(userid);
            if (!cs?.color) {
                el.classList.add('ps-processed');
                return;
            }
            if (el.closest('.trainer') || el.closest('.linklist') || el.closest('.section') || el.closest('.battle-history')) {
                el.classList.add('ps-processed');
                return;
            }
            try {
                const color = cs.color.startsWith('#') ? cs.color : '#' + cs.color;
                el.style.setProperty('color', color, 'important');
                el.style.fontWeight = utils.isBold(el) ? 'bold' : '400';
                el.classList.add('ps-processed');
            } catch (e) {
                console.error('[PS Style+] Failed to apply color for', userid, ':', e.message);
                el.classList.add('ps-processed');
            }
        },
        replaceAvatar: (spriteEl, userid) => {
            const cs = utils.getCustomStyles(userid);
            if (!spriteEl) return;
            spriteEl.dataset.psProcessed = '1';
            if (!cs?.avatar || spriteEl.dataset.psCustomAvatar) return;

            if (spriteEl.classList.contains('picon') || spriteEl.src?.includes('pokeball') || spriteEl.style.backgroundImage?.includes('pokeball')) {
                return;
            }

            tooltipManager.add(spriteEl, userid, true);
            if (state.preloadedAvatars.has(cs.avatar)) {
                styleApplicator._setAvatarImage(spriteEl, cs.avatar);
                return;
            }
            spriteEl.dataset.preloadAvatar = 'loading';
            preloader.avatar(userid);
            const img = new Image();
            img.onload = () => {
                console.log('[PS Style+] Avatar loaded successfully for', userid);
                styleApplicator._setAvatarImage(spriteEl, cs.avatar);
            };
            img.onerror = () => {
                console.warn('[PS Style+] Avatar failed to load for', userid, ':', cs.avatar);
                spriteEl.dataset.psCustomAvatar = 'failed';
            };
            img.src = cs.avatar;
        },
        _setAvatarImage: (spriteEl, avatarUrl) => {
            if (spriteEl.tagName === 'IMG') {
                spriteEl.src = avatarUrl;
                spriteEl.style.objectFit = 'contain';
            } else {
                spriteEl.style.backgroundImage = `url("${avatarUrl}")`;
                spriteEl.style.backgroundSize = 'contain';
                spriteEl.style.backgroundRepeat = 'no-repeat';
                spriteEl.style.backgroundPosition = 'center';
            }
            spriteEl.dataset.psCustomAvatar = '1';
        },
        addChatIcon: (nameElement, iconUrl) => {
            if (!iconUrl || !nameElement || nameElement.dataset.psIconAdded) return;
            try {
                const messageLine = nameElement.closest('.chat-log-line') ||
                    nameElement.closest('div') ||
                    nameElement.parentElement;
                if (messageLine?.querySelector('.ps-chat-icon')) return;
                preloader.icon(iconUrl);
                const icon = iconManager.create(iconUrl, 'ps-chat-icon', {
                    marginRight: '4px',
                    paddingBottom: '8px',
                    height: '32px',
                    width: '32px',
                    verticalAlign: 'middle',
                    display: 'inline-block'
                });
                nameElement.dataset.psIconAdded = 'true';
                nameElement.parentNode.insertBefore(icon, nameElement);
            } catch (e) {
                console.error('[PS Style+] Failed to add chat icon:', e.message);
            }
        },
        addUserlistIcon: (button, iconUrl) => {
            if (!iconUrl || button.querySelector('.ps-custom-icon')) return;
            try {
                preloader.icon(iconUrl);
                const icon = iconManager.create(iconUrl, 'ps-custom-icon', {
                    position: 'absolute',
                    top: '65%',
                    right: '-8px',
                    height: '32px',
                    width: '32px',
                    transform: 'translateY(-60%)',
                    zIndex: '1',
                    pointerEvents: 'none',
                    opacity: '0.9'
                });
                if (window.getComputedStyle(button).position === 'static') {
                    button.style.position = 'relative';
                }
                button.appendChild(icon);
                styleApplicator._adjustButtonPadding(button);
            } catch (e) {
                console.error('[PS Style+] Failed to add userlist icon:', e.message);
            }
        },
        _adjustButtonPadding: button => {
            const userlist = button.closest('.userlist');
            if (!userlist) return;
            const hasScrollbar = userlist.scrollHeight > userlist.clientHeight;
            const icon = button.querySelector('.ps-custom-icon');
            if (icon) {
                icon.style.right = hasScrollbar ? '-4px' : '4px';
            }
            const iconWidth = 32;
            const extraPad = hasScrollbar ? 28 : 12;
            button.style.paddingRight = (iconWidth + extraPad) + 'px';
        }
    };

    const iconManager = {
        create: (src, className, styles = {}) => {
            const icon = document.createElement('img');
            icon.src = src;
            icon.className = className;
            const defaultStyles = {
                objectFit: 'contain',
                imageRendering: 'pixelated'
            };
            Object.assign(icon.style, defaultStyles, styles);
            return icon;
        }
    };

    const tooltipManager = {
        create: () => {
            if (state.globalTooltip) return;
            state.globalTooltip = document.createElement('div');
            state.globalTooltip.className = 'ps-custom-tooltip';
            Object.assign(state.globalTooltip.style, {
                position: 'fixed',
                background: 'black',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                zIndex: '2147483647',
                opacity: '0',
                pointerEvents: 'none',
                transition: 'opacity 0.2s',
                maxWidth: '300px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
                border: '2px solid #333',
                fontFamily: 'Verdana, Helvetica, Arial, sans-serif',
                lineHeight: '1.4',
                wordWrap: 'break-word'
            });
            document.body.appendChild(state.globalTooltip);
        },
        add: (el, userid, isSprite = false) => {
            const cs = utils.getCustomStyles(userid);
            if (!cs || !el) return;
            tooltipManager.create();
            const container = isSprite ? el : (el.closest('button') || el.parentElement || el);
            if (container.dataset.psTooltipAdded) return;
            container.dataset.psTooltipAdded = 'true';
            const parts = [];
            if (cs.avatar) parts.push('avatar');
            if (cs.color) parts.push('color');
            if (cs.icon) parts.push('icon');
            if (!parts.length) return;
            const show = () => {
                state.globalTooltip.textContent = `Customizations: ${parts.join(', ')} (These customizations are visible only to users using PS Styles+)`;
                const rect = container.getBoundingClientRect();
                state.globalTooltip.style.left = `${rect.left + rect.width / 2 - 150}px`;
                state.globalTooltip.style.top = `${rect.top - state.globalTooltip.offsetHeight - 10}px`;
                const tRect = state.globalTooltip.getBoundingClientRect();
                if (tRect.left < 10) state.globalTooltip.style.left = '10px';
                if (tRect.right > window.innerWidth - 10) state.globalTooltip.style.left = `${window.innerWidth - tRect.width - 10}px`;
                if (tRect.top < 10) state.globalTooltip.style.top = `${rect.bottom + 10}px`;
                state.globalTooltip.style.opacity = '1';
            };
            const hide = () => {
                state.globalTooltip.style.opacity = '0';
            };
            container.addEventListener('mouseenter', show);
            container.addEventListener('mouseleave', hide);
        }
    };

    const preloader = {
        icon: url => {
            if (!url || state.preloadedIcons.has(url)) return;
            state.preloadedIcons.add(url);
            const img = new Image();
            img.src = url;
        },
        avatar: userid => {
            const cs = utils.getCustomStyles(userid);
            if (!cs?.avatar || state.preloadedAvatars.has(cs.avatar)) return;
            state.preloadedAvatars.add(cs.avatar);
            const img = new Image();
            img.src = cs.avatar;
        },
        batchIcons: () => {
            const allIcons = [
                ...Object.values(state.CUSTOM).map(cfg => cfg.icon).filter(Boolean),
                ...Object.values(state.TEMP_CUSTOM).map(cfg => cfg.icon).filter(Boolean)
            ];
            let index = 0;
            const preloadBatch = () => {
                const batch = allIcons.slice(index, index + CONFIG.PRELOAD_BATCH_SIZE);
                batch.forEach(preloader.icon);
                index += CONFIG.PRELOAD_BATCH_SIZE;
                if (index < allIcons.length) {
                    setTimeout(preloadBatch, CONFIG.PRELOAD_DELAY);
                }
            };
            if (allIcons.length > 0) preloadBatch();
        },
        visibleAvatars: () => {
            const visibleUsers = new Set();
            const selectors = [
                '.chat-log .username, .battle-log .username',
                '.userlist .username',
                '.trainer .trainername'
            ];
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    const uid = utils.cleaned(el.textContent.replace(':', ''));
                    if (uid && utils.getCustomStyles(uid)?.avatar) {
                        visibleUsers.add(uid);
                    }
                });
            });
            visibleUsers.forEach(preloader.avatar);
        }
    };

    const buttonFactory = {
        create: (id, text, styles = {}, clickHandler = null) => {
            const button = document.createElement('button');
            button.id = id;
            button.textContent = text;
            const defaultStyles = {
                margin: '2px',
                padding: '4px 12px',
                border: '1px solid',
                fontSize: '9pt',
                cursor: 'pointer'
            };
            Object.assign(button.style, defaultStyles, styles);
            if (clickHandler) {
                button.addEventListener('click', clickHandler);
            }
            return button;
        },
        createAction: (id, text, bgColor, borderColor, clickHandler) => {
            return buttonFactory.create(id, text, {
                background: bgColor,
                color: 'white',
                borderColor: borderColor
            }, clickHandler);
        }
    };

    const cleanup = {
        removeCustomizations: () => {
            document.querySelectorAll('.ps-custom-icon, .ps-chat-icon').forEach(el => el.remove());
            document.querySelectorAll('[data-ps-custom-avatar]').forEach(el => {
                el.removeAttribute('data-ps-custom-avatar');
                if (el.tagName === 'IMG') {
                    el.style.objectFit = '';
                } else {
                    ['backgroundImage', 'backgroundSize', 'backgroundRepeat', 'backgroundPosition']
                    .forEach(prop => {
                        el.style[prop] = ''
                    });
                }
            });

            document.querySelectorAll('.ps-processed').forEach(el => {
                ['color', 'fontWeight'].forEach(prop => {
                    el.style[prop] = ''
                });
            });
        },
        resetProcessedElements: () => {
            state.processedElements = new WeakSet();
            document.querySelectorAll('.ps-processed').forEach(el => {
                el.classList.remove('ps-processed');
            });
            document.querySelectorAll('[data-ps-processed]').forEach(el => {
                el.removeAttribute('data-ps-processed');
            });
        }
    };

    const elementProcessor = {
        quick: el => {
            if (!el || !state.stylesLoaded) return;
            const uid = utils.cleaned(el.textContent.replace(':', ''));
            const cs = utils.getCustomStyles(uid);
            if (!cs) {
                el.classList.add('ps-processed');
                if (el.matches?.('.trainersprite, img.trainersprite')) {
                    el.dataset.psProcessed = '1';
                }
                return;
            }
            if (cs.color && el.matches?.('.username, .trainername, .usernametext, strong, em') ||
                el.tagName === 'STRONG' || el.tagName === 'EM') {
                styleApplicator.colorElement(el, uid);
                tooltipManager.add(el, uid);
            }
            if (cs.avatar && el.matches?.('.trainersprite, img.trainersprite')) {
                styleApplicator.replaceAvatar(el, uid);
            }
            el.classList.add('ps-processed');
            if (el.matches?.('.trainersprite, img.trainersprite')) {
                el.dataset.psProcessed = '1';
            }
        },
        full: el => {
            if (!el || state.processedElements.has(el)) return;
            const uid = utils.cleaned(el.textContent.replace(':', ''));
            const cs = utils.getCustomStyles(uid);
            el.classList.add('ps-processed');
            if (!cs) return;
            const context = elementProcessor._getContext(el);
            switch (context.type) {
                case 'trainer':
                case 'userdetails':
                    if (context.sprite) styleApplicator.replaceAvatar(context.sprite, uid);
                    tooltipManager.add(el, uid, true);
                    break;
                case 'chat':
                    if (cs.color) styleApplicator.colorElement(el, uid);
                    if (cs.icon) styleApplicator.addChatIcon(el, cs.icon);
                    tooltipManager.add(el, uid);
                    break;
                case 'userlist':
                    if (cs.color) styleApplicator.colorElement(el, uid);
                    styleApplicator.addUserlistIcon(el.parentElement, cs.icon);
                    tooltipManager.add(el, uid);
                    break;
                default:
                    if (cs.color) styleApplicator.colorElement(el, uid);
                    tooltipManager.add(el, uid);
            }
            state.processedElements.add(el);
        },
        _getContext: el => {
            if (el.closest('.trainer') || el.closest('.userdetails')) {
                const sprite = el.closest('.trainer')?.querySelector(SEL.sprite) ||
                    el.closest('.userdetails')?.querySelector(SEL.sprite);
                return {
                    type: 'trainer',
                    sprite
                };
            }
            if (el.closest('.chat-log, .battle-log, .pm-log, .chat, .chatbox') ||
                el.matches?.('.chat .username, .chat em, .chat strong')) {
                return {
                    type: 'chat'
                };
            }
            if (el.closest('.userlist') && el.parentElement.classList.contains('username')) {
                return {
                    type: 'userlist'
                };
            }
            return {
                type: 'default'
            };
        },
        container: container => {
            if (!container) return;
            const trainers = container.matches?.('.trainer') ? [container] :
                container.querySelectorAll?.('.trainer') || [];
            trainers.forEach(trainer => {
                const nameEl = trainer.querySelector('.trainername, .username, strong');
                const spriteEl = trainer.querySelector('.trainersprite, img.trainersprite');
                if (nameEl) {
                    const uid = utils.cleaned(nameEl.textContent);
                    elementProcessor.full(nameEl);
                    if (spriteEl) styleApplicator.replaceAvatar(spriteEl, uid);
                } else if (spriteEl) {
                    spriteEl.dataset.psProcessed = '1';
                }
            });
            container.querySelectorAll?.(SEL.names).forEach(el => {
                if (!state.processedElements.has(el)) {
                    elementProcessor.full(el);
                }
            });
            container.querySelectorAll?.(SEL.chatInputLabel).forEach(label => {
                const uid = utils.cleaned(label.textContent.replace(':', ''));
                if (utils.getCustomStyles(uid)) {
                    styleApplicator.colorElement(label, uid);
                    tooltipManager.add(label, uid);
                }
            });
        }
    };

    const batchProcessor = {
        queue: element => {
            state.updateQueue.add(element);
            if (state.updateTimeout) clearTimeout(state.updateTimeout);
            state.updateTimeout = setTimeout(batchProcessor.process, CONFIG.BATCH_DELAY);
        },
        process: () => {
            const elements = Array.from(state.updateQueue);
            state.updateQueue.clear();
            let index = 0;
            const processChunk = () => {
                const chunk = elements.slice(index, index + CONFIG.CHUNK_SIZE);
                chunk.forEach(el => {
                    if (!state.processedElements.has(el)) {
                        elementProcessor.full(el);
                        state.processedElements.add(el);
                    }
                });
                index += CONFIG.CHUNK_SIZE;
                if (index < elements.length) {
                    setTimeout(processChunk, 0);
                }
            };
            processChunk();
        }
    };

    const ui = {
        createGearButton: () => {
            const userbar = document.querySelector('.userbar');
            if (!userbar || document.querySelector('#ps-style-gear-btn')) return;
            const existingButton = userbar.querySelector('.icon.button');
            const brush = buttonFactory.create('ps-style-gear-btn', '', {}, ui._handleGearClick);
            if (existingButton) {
                const styles = window.getComputedStyle(existingButton);
                brush.style.margin = styles.margin;
                brush.style.padding = styles.padding;
                brush.style.fontSize = styles.fontSize;
                brush.style.cursor = styles.cursor;
                brush.style.border = styles.border;
                brush.style.background = styles.background;
                brush.style.verticalAlign = styles.verticalAlign;
                brush.style.display = styles.display;
                brush.style.lineHeight = styles.lineHeight;
                brush.style.height = styles.height;
            }

            brush.style.marginLeft = '4px';

            brush.className = 'icon button ps-processed';
            brush.title = 'Customization';
            brush.setAttribute('aria-label', 'Customization');
            brush.innerHTML = '<i class="fa fa-paint-brush"></i>';
            userbar.appendChild(brush);
        },
        _handleGearClick: e => {
            e.preventDefault();
            e.stopPropagation();
            const panel = document.querySelector('#ps-custom-panel');
            if (!panel) return;
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
            if (panel.style.display === 'block') {
                ui._positionPanel(panel, e.target);
            }
        },
        _positionPanel: (panel, anchor) => {
            const rect = anchor.getBoundingClientRect();
            panel.style.left = Math.min(Math.max(rect.left, 10), window.innerWidth - panel.offsetWidth - 10) + 'px';
            panel.style.top = Math.min(Math.max(rect.bottom + 4, 10), window.innerHeight - panel.offsetHeight - 10) + 'px';
        },
        createPanel: () => {
            if (document.querySelector('#ps-custom-panel')) return;
            const panel = document.createElement('div');
            panel.id = 'ps-custom-panel';
            panel.className = 'ps-popup ps-custom-panel';
            panel.style.cssText = ui._getPanelStyles();
            panel.innerHTML = ui._getPanelHTML();
            document.body.appendChild(panel);
            ui._attachPanelHandlers(panel);
        },
        _getPanelStyles: () => `
position: fixed;
display: none;
min-width: 280px;
max-width: 340px;
z-index: 2147483647;
background: #f8f8f8;
border: 2px solid #aaa;
border-radius: 0;
box-shadow: 2px 2px 8px rgba(0,0,0,0.3);
font-family: Verdana, Helvetica, Arial, sans-serif;
font-size: 10pt;
`,
        _getPanelHTML: () => `
<div style="background: linear-gradient(to bottom, #E6E6FA 0%, #D8BFD8 100%); padding: 8px; border-bottom: 1px solid #aaa; text-align: center;">
<strong style="color: #333; font-size: 11pt;">Customization Menu</strong>
</div>
<div style="padding: 12px; background: #f8f8f8;">
<p style="margin: 0 0 8px 0; font-size: 9pt;"><strong>Avatar URL:</strong></p>
<input type="text" id="ps-avatar-input" style="width: 100%; padding: 3px; border: 1px solid #aaa; font-size: 9pt; margin-bottom: 12px;">
<p style="margin: 0 0 8px 0; font-size: 9pt;"><strong>Color (hex without #):</strong></p>
<input type="text" id="ps-color-input" maxlength="6" style="width: 100%; padding: 3px; border: 1px solid #aaa; font-size: 9pt; margin-bottom: 8px;">
<p style="margin: 0 0 8px 0; font-size: 9pt;"><strong>Icon URL:</strong></p>
<input type="text" id="ps-icon-input" style="width: 100%; padding: 3px; border: 1px solid #aaa; font-size: 9pt; margin-bottom: 8px;">
<div style="text-align: center;" id="button-container">
</div>
<hr style="margin: 12px 0 8px 0; border: none; border-top: 1px solid #ccc;">
<p style="margin: 0; font-size: 8pt; color: #666; text-align: center; line-height: 1.3;">
Temporary preview before submitting on
<a href="https://discord.gg/7xTVcw2StR" target="_blank" style="color: #4a90e2;">Discord</a><br>
Version ${CONFIG.VERSION} - <span id="user-count">${Object.keys(state.CUSTOM).length}</span> users loaded
</p>
</div>
`,
        _attachPanelHandlers: panel => {
            const container = panel.querySelector('#button-container');
            const buttons = [{
                    id: 'ps-apply-btn',
                    text: 'Apply',
                    bg: '#4CAF50',
                    border: '#45a049',
                    handler: ui._handleApply
                },
                {
                    id: 'ps-clear-btn',
                    text: 'Clear',
                    bg: '#f44336',
                    border: '#da190b',
                    handler: ui._handleClear
                },
                {
                    id: 'ps-refresh-btn',
                    text: 'Refresh Data',
                    bg: '#2196F3',
                    border: '#0b7dda',
                    handler: ui._handleRefresh
                },
                {
                    id: 'ps-close-btn',
                    text: 'Close',
                    bg: '#ddd',
                    border: '#aaa',
                    handler: ui._handleClose
                }
            ];
            buttons.forEach(({
                id,
                text,
                bg,
                border,
                handler
            }) => {
                const btn = buttonFactory.createAction(id, text, bg, border, handler);
                container.appendChild(btn);
                if (id !== 'ps-close-btn') container.appendChild(document.createElement('br'));
            });
        },

        _handleApply: () => {
            const currentUser = utils.getCurrentUser();

            if (!currentUser) {
                console.warn('[PS Style+] Apply failed - could not detect current user');
                alert('Could not detect current user. Please make sure you are logged in.');
                return;
            }

            console.log('[PS Style+] Applying customizations for user:', currentUser);

            const panel = document.querySelector('#ps-custom-panel');
            const inputs = {
                color: panel.querySelector('#ps-color-input').value.trim(),
                icon: panel.querySelector('#ps-icon-input').value.trim(),
                avatar: panel.querySelector('#ps-avatar-input').value.trim()
            };

            if (inputs.color && !/^[0-9a-fA-F]{6}$/.test(inputs.color)) {
                console.warn('[PS Style+] Invalid color format:', inputs.color);
                alert('Color must be a 6-character hex code without # (e.g., ff0000 for red)');
                return;
            }

            if (!state.TEMP_CUSTOM[currentUser]) {
                state.TEMP_CUSTOM[currentUser] = {};
            }
            if (!state.USER_TEMP_STORAGE[currentUser]) {
                state.USER_TEMP_STORAGE[currentUser] = {};
            }

            Object.entries(inputs).forEach(([key, value]) => {
                if (value) {
                    state.TEMP_CUSTOM[currentUser][key] = value;
                    state.USER_TEMP_STORAGE[currentUser][key] = value;
                } else {
                    delete state.TEMP_CUSTOM[currentUser][key];
                    delete state.USER_TEMP_STORAGE[currentUser][key];
                }
            });

            if (Object.keys(state.TEMP_CUSTOM[currentUser]).length === 0) {
                delete state.TEMP_CUSTOM[currentUser];
            }
            if (Object.keys(state.USER_TEMP_STORAGE[currentUser]).length === 0) {
                delete state.USER_TEMP_STORAGE[currentUser];
            }

            console.log('[PS Style+] Applied customizations:', inputs);
            userManager.saveUserData();
            ui._applyChanges();
            panel.style.display = 'none';
        },
        _handleClear: () => {
            const currentUser = utils.getCurrentUser();
            if (!currentUser) return;
            console.log('[PS Style+] Clearing customizations for user:', currentUser);
            delete state.TEMP_CUSTOM[currentUser];
            delete state.USER_TEMP_STORAGE[currentUser];
            userManager.saveUserData();
            ui._applyChanges();
            const panel = document.querySelector('#ps-custom-panel');
            panel.style.display = 'none';
        },
        _handleRefresh: async () => {
            const refreshBtn = document.querySelector('#ps-refresh-btn');
            const originalText = refreshBtn.textContent;
            refreshBtn.textContent = 'Loading...';
            refreshBtn.disabled = true;
            try {
                state.TEMP_CUSTOM = {};
                state.USER_TEMP_STORAGE = {};
                state.CUSTOM = {};
                state.stylesLoaded = false;
                cacheManager.clear();
                localStorage.removeItem(USER_CACHE_KEY);
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('psStyles_') || key.startsWith('psUserStyles_')) {
                        localStorage.removeItem(key);
                    }
                });
                cleanup.resetProcessedElements();
                cleanup.removeCustomizations();
                await stylesLoader.load();
                const userCount = document.querySelector('#user-count');
                if (userCount) userCount.textContent = Object.keys(state.CUSTOM).length;
            } catch (error) {
                console.error('[PS Style+] Refresh failed:', error.message);
                alert('Failed to refresh styles. Please try again.');
            } finally {
                refreshBtn.textContent = originalText;
                refreshBtn.disabled = false;
            }
        },
        _handleClose: () => {
            document.querySelector('#ps-custom-panel').style.display = 'none';
        },

        _applyChanges: () => {
            console.log('[PS Style+] Applying changes - resetting and reprocessing');
            cleanup.resetProcessedElements();
            cleanup.removeCustomizations();
            setTimeout(() => {
                processor.processAll();
            }, 50);
        }
    };

    const stylesLoader = {
        load: async () => {
            const cached = cacheManager.get();
            if (cached) {
                state.CUSTOM = cached;
                console.log('[PS Style+] Using cached styles:', Object.keys(cached).length, 'users');
                state.stylesLoaded = true;
                preloader.batchIcons();
                preloader.visibleAvatars();
                processor.processAll();
                return;
            }
            try {
                console.log('[PS Style+] Fetching remote styles from:', CONFIG.STYLES_URL);
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                const resp = await fetch(CONFIG.STYLES_URL + '?_=' + Date.now(), {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const remoteStyles = await resp.json();
                state.CUSTOM = stylesLoader._mergeStyles(remoteStyles);
                console.log('[PS Style+] Remote fetch success:', Object.keys(state.CUSTOM).length, 'styles loaded');
                cacheManager.set(state.CUSTOM);
            } catch (error) {
                console.warn('[PS Style+] Remote fetch failed, using local only:', error.message);
                state.CUSTOM = stylesLoader._mergeStyles({});
            }
            state.stylesLoaded = true;
            preloader.batchIcons();
            preloader.visibleAvatars();
            processor.processAll();
        },
        _mergeStyles: remoteStyles => {
            const allUsernames = new Set([...Object.keys(remoteStyles), ...Object.keys(LOCAL_OVERRIDES)]);
            const merged = {};
            allUsernames.forEach(u => {
                const combined = stylesLoader._mergeUserStyles(remoteStyles[u], LOCAL_OVERRIDES[u]);
                if (combined.avatar || combined.color || combined.icon) {
                    merged[u] = combined;
                }
            });
            return merged;
        },
        _mergeUserStyles: (remoteUser = {}, localUser = {}) => ({
            avatar: localUser.avatar || remoteUser.avatar || '',
            color: localUser.color || remoteUser.color || '',
            icon: localUser.icon || remoteUser.icon || ''
        })
    };

    const processor = {
        processAll: () => {
            if (!state.stylesLoaded) return;
            document.querySelectorAll(SEL.sprite).forEach(sprite => {
                const trainer = sprite.closest('.trainer');
                if (trainer) {
                    const nameEl = trainer.querySelector('.trainername, strong, .username');
                    if (nameEl) {
                        const uid = utils.cleaned(nameEl.textContent);
                        styleApplicator.replaceAvatar(sprite, uid);
                        tooltipManager.add(sprite, uid, true);
                    }
                } else {
                    sprite.dataset.psProcessed = '1';
                }
            });
            document.querySelectorAll(SEL.names).forEach(elementProcessor.full);
            document.querySelectorAll(SEL.chatInputLabel).forEach(label => {
                const uid = utils.cleaned(label.textContent.replace(':', ''));
                if (utils.getCustomStyles(uid)) {
                    styleApplicator.colorElement(label, uid);
                    tooltipManager.add(label, uid);
                }
            });
            document.querySelectorAll(SEL.userlistContainer).forEach(processor.colorUserlist);
        },
        colorUserlist: ul => {
            if (!ul) return;
            const buttons = ul.querySelectorAll('li button.username');
            buttons.forEach(button => {
                const children = Array.from(button.children).filter(c => {
                    try {
                        return !(c.classList?.contains('group') || c.classList?.contains('ps-custom-icon'));
                    } catch {
                        return true;
                    }
                });
                const nameContainer = children.find(c => c.textContent?.trim().length) || button;
                const textEl = nameContainer.querySelector('span, em, .usernametext') || nameContainer;
                const uid = utils.cleaned(textEl.textContent);
                const cs = utils.getCustomStyles(uid);
                if (cs) {
                    if (cs.color) {
                        textEl.style.setProperty('color', '#' + cs.color, 'important');
                        textEl.style.fontWeight = utils.isBold(textEl) ? 'bold' : '400';
                    }
                    if (cs.icon) styleApplicator.addUserlistIcon(button, cs.icon);
                    if (cs.color || cs.icon) tooltipManager.add(button, uid);
                }
            });
            setTimeout(() => {
                ul.querySelectorAll('.ps-custom-icon').forEach(icon => {
                    const button = icon.closest('button');
                    if (button) styleApplicator._adjustButtonPadding(button);
                });
            }, 50);
        }
    };

    const observer = {
        main: new MutationObserver(mutations => {
            if (!state.stylesLoaded) return;
            ui.createGearButton();
            ui.createPanel();
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (node.matches?.('.userlist, [class*="userlist"]')) {
                        observer.userlist(node);
                    }
                    elementProcessor.quick(node);
                    if (node.matches?.('strong, .username, em') && !node.classList.contains('ps-processed')) {
                        const uid = utils.cleaned(node.textContent.replace(':', ''));
                        const cs = utils.getCustomStyles(uid);
                        if (cs?.color) {
                            styleApplicator.colorElement(node, uid);
                            tooltipManager.add(node, uid);
                        }
                    }
                    node.querySelectorAll?.('.username, .trainername, .usernametext, strong, em, .trainersprite, img.trainersprite')
                        .forEach(elementProcessor.quick);
                    node.querySelectorAll?.(SEL.chatInputLabel).forEach(label => {
                        if (label.closest('.userbar')) return;
                        const uid = utils.cleaned(label.textContent.replace(':', ''));
                        if (utils.getCustomStyles(uid)) {
                            styleApplicator.colorElement(label, uid);
                            tooltipManager.add(label, uid);
                        }
                    });
                    elementProcessor.container(node);
                });
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    mutation.target.querySelectorAll?.('strong, em, .username').forEach(el => {
                        if (!el.classList.contains('ps-processed')) {
                            elementProcessor.quick(el);
                        }
                    });
                    mutation.target.querySelectorAll?.(SEL.chatInputLabel).forEach(label => {
                        if (label.closest('.userbar')) return;
                        const uid = utils.cleaned(label.textContent.replace(':', ''));
                        if (utils.getCustomStyles(uid) && !label.classList.contains('ps-processed')) {
                            styleApplicator.colorElement(label, uid);
                            tooltipManager.add(label, uid);
                        }
                    });
                }
            });
            const currentUser = utils.getCurrentUser();
            if (currentUser && currentUser !== state.lastKnownUser) {
                userManager.onUserChange(currentUser);
            }
        }),
        start: () => {
            console.log('[PS Style+] Starting DOM observer');
            observer.main.observe(document.body, {
                childList: true,
                subtree: true
            });
        },
        userlist: ul => {
            if (!ul || state.observedUserlists.has(ul)) return;
            state.observedUserlists.add(ul);
            if (state.stylesLoaded) {
                setTimeout(() => processor.colorUserlist(ul), 50);
            }
            const mo = new MutationObserver(utils.debounce(() => {
                if (state.stylesLoaded) processor.colorUserlist(ul);
            }, 25));
            mo.observe(ul, {
                childList: true,
                subtree: true,
                attributes: true
            });
        },
        chat: () => {
            const chatObserver = new MutationObserver(utils.debounce(() => {
                if (!state.stylesLoaded) return;
                document.querySelectorAll('.chat strong, .chat em, .chatbox strong, .chatbox em').forEach(el => {
                    if (!el.classList.contains('ps-processed')) {
                        const uid = utils.cleaned(el.textContent.replace(':', ''));
                        const cs = utils.getCustomStyles(uid);
                        if (cs?.color) {
                            styleApplicator.colorElement(el, uid);
                            tooltipManager.add(el, uid);
                        }
                    }
                });
                document.querySelectorAll(SEL.chatInputLabel).forEach(label => {
                    if (label.closest('.userbar')) return;
                    const uid = utils.cleaned(label.textContent.replace(':', ''));
                    if (utils.getCustomStyles(uid) && !label.classList.contains('ps-processed')) {
                        styleApplicator.colorElement(label, uid);
                        tooltipManager.add(label, uid);
                    }
                });
            }, 100));
            const chatContainer = document.querySelector('.chat, .chatbox');
            if (chatContainer) {
                chatObserver.observe(chatContainer, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
        }
    };

    const battleHandler = {
        process: (battleContainer = null) => {
            const checkBattles = () => {
                const battles = battleContainer ? [battleContainer] : document.querySelectorAll('.battle');
                battles.forEach(battle => {
                    const trainers = battle.querySelectorAll('.trainer');
                    trainers.forEach(trainer => {
                        const nameEl = trainer.querySelector('.trainername, .username, strong');
                        const spriteEl = trainer.querySelector('.trainersprite, img.trainersprite');
                        if (nameEl) {
                            const uid = utils.cleaned(nameEl.textContent);
                            if (!state.processedElements.has(nameEl)) {
                                elementProcessor.full(nameEl);
                            }
                            if (spriteEl && !spriteEl.dataset.psProcessed) {
                                styleApplicator.replaceAvatar(spriteEl, uid);
                            }
                        } else if (spriteEl && !spriteEl.dataset.psProcessed) {
                            spriteEl.dataset.psProcessed = '1';
                        }
                    });
                });
            };
            if (state.stylesLoaded) {
                checkBattles();
                setTimeout(checkBattles, 300);
            }
        }
    };

    const initializer = {
        existingUserlists: () => {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_ELEMENT, {
                    acceptNode: node => {
                        const className = node.className;
                        if (typeof className === 'string' &&
                            (className.includes('userlist') ||
                                node.classList.contains('ps-room-userlist') ||
                                node.classList.contains('room-userlist'))) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        return NodeFilter.FILTER_SKIP;
                    }
                }
            );
            let node;
            while (node = walker.nextNode()) {
                observer.userlist(node);
            }
        },
        userTracking: () => {
            const detectUser = (attempt = 1, maxAttempts = 10) => {
                const user = utils.getCurrentUser();
                if (user) {
                    state.lastKnownUser = user;
                    return;
                }

                if (attempt < maxAttempts) {
                    const delay = Math.min(500 * attempt, 3000);
                    setTimeout(() => detectUser(attempt + 1, maxAttempts), delay);
                } else {
                    console.warn('[PS Style+] User detection failed after', maxAttempts, 'attempts');
                }
            };

            setTimeout(() => detectUser(), 300);

            setInterval(() => {
                const current = utils.getCurrentUser();
                if (current && current !== state.lastKnownUser) {
                    userManager.onUserChange(current);
                }
            }, 2000);
        },

        waitForPageReady: async () => {
            return new Promise((resolve) => {
                if (document.readyState === 'complete') {
                    resolve();
                    return;
                }

                const checkReady = () => {
                    if (document.readyState === 'complete' ||
                        (document.querySelector('.userbar') || document.querySelector('.mainmenu'))) {
                        resolve();
                    } else {
                        setTimeout(checkReady, 100);
                    }
                };

                checkReady();
            });
        }
    };

    async function initialize() {
        console.log('[PS Style+] Initializing v' + CONFIG.VERSION);
        await initializer.waitForPageReady();
        userManager.loadUserData();
        await stylesLoader.load();
        console.log('[PS Style+] Loaded', Object.keys(state.CUSTOM).length, 'remote styles,', Object.keys(state.USER_TEMP_STORAGE).length, 'user customizations');
        ui.createGearButton();
        ui.createPanel();
        observer.start();
        observer.chat();
        setTimeout(initializer.existingUserlists, 100);
        setTimeout(() => battleHandler.process(), 200);
        initializer.userTracking();

        const allStyles = {
            ...state.CUSTOM,
            ...state.USER_TEMP_STORAGE
        };
        const totalUsers = Object.keys(allStyles).length;
        const avatarCount = Object.values(allStyles).filter(s => s.avatar).length;
        const colorCount = Object.values(allStyles).filter(s => s.color).length;
        const iconCount = Object.values(allStyles).filter(s => s.icon).length;

        console.log('[PS Style+] Initialization complete. Total:', totalUsers, 'users with customizations (', avatarCount, 'avatars,', colorCount, 'colors,', iconCount, 'icons)');
    }

    initialize();
})();