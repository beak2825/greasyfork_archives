// ==UserScript==
// @name         DDM V2
// @namespace    http://tampermonkey.net/
// @version      2.2.7
// @description  Messagerie version dynamique et live
// @author       Laïn
// @match        https://www.dreadcast.eu/Main
// @match        https://www.dreadcast.net/Main
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dreadcast.net
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557947/DDM%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/557947/DDM%20V2.meta.js
// ==/UserScript==
     
    (function() {
        'use strict';
     
        const CONFIG = {
            OPEN_MENU_DELAY: 100,
            OPEN_FOLDER_DELAY: 100,
            SELECT_FOLDER_DELAY: 150,
            OPEN_CONVERSATION_DELAY: 300,
            CLOSE_DELAY: 200,
            REFRESH_AFTER_SEND_DELAY: 500,
            INITIAL_WINDOW_WIDTH: 500,
            INITIAL_WINDOW_HEIGHT: 600,
            WINDOW_Z_INDEX_BASE: 100005,
            WINDOW_OFFSET: 30,
            MAX_MESSAGES_DISPLAYED: 5,
            INBOX_FOLDER_ID: 0,
            SENT_FOLDER_ID: -1,
            AVATAR_TOOLTIP_DELAY: 300,
            AVATAR_CACHE_ENABLED: true,
            OPTIONS: {
                STORAGE_KEY: 'ddm-messaging-options',
                DEFAULTS: {
                    theme: {
                        primaryColor: '#000000',
                        secondaryColor: '#00d9ff'
                    },
                    accessibility: {
                        fontSize: 14,
                        textColor: '#ffffff',
                        defaultWindowWidth: 500,
                        defaultWindowHeight: 600,
                        secondaryDDM: false,
                        disableQuickSend: false,
                        defaultOpenDrawer: false,
                        performanceMode: false
                    },
                    sounds: {
                        openConversationUrl: 'https://opengameart.org/sites/default/files/audio_preview/GUI%20Sound%20Effects_031.mp3.ogg',
                        closedConversationUrl: 'https://orangefreesounds.com/wp-content/uploads/2020/10/Simple-notification-alert.mp3',
                        openConversationVolume: 0.5,
                        closedConversationVolume: 0.5,
                        enabled: true
                    },
                    comback: {
                        headers: [
                            { id: 'WRIT', icon: '📝', label: 'Message écrit' },
                            { id: 'AUDI', icon: '🔊', label: 'Message audio' },
                            { id: 'VIDE', icon: '🎥', label: 'Message vidéo' },
                            { id: 'DECK', icon: '💻', label: 'Depuis un deck' },
                            { id: 'NORP', icon: '✖', label: 'Message HRP' }
                        ],
                        quickActions: {
                            CLIP: { icon: '📎', label: 'Pièce jointe', defaultLabel: 'Pièce jointe' },
                            ACKN: { icon: '📨', label: 'Accusé de réception', defaultLabel: 'Accusé de réception' },
                            UPLD: { icon: '📤', label: 'Envoi de données en cours', defaultLabel: 'Envoi de données en cours' },
                            DWLD: { icon: '🔃', label: 'Chargement en cours, veuillez patienter', defaultLabel: 'Chargement en cours, veuillez patienter' },
                            FILE: { icon: '📄', label: 'Fichier', defaultLabel: 'Fichier' },
                            PLAY: { icon: '▶️', label: 'Lecture', defaultLabel: 'Lecture' },
                            WRIT: { icon: '📝', label: 'Message écrit', defaultLabel: 'Message écrit' },
                            AUDI: { icon: '🔊', label: 'Message audio', defaultLabel: 'Message audio' },
                            VIDE: { icon: '🎥', label: 'Message vidéo', defaultLabel: 'Message vidéo' },
                            DECK: { icon: '💻', label: 'Depuis un deck', defaultLabel: 'Depuis un deck' },
                            NORP: { icon: '✖', label: 'Message HRP', defaultLabel: 'Message HRP' }
                        },
                        activeQuickActions: ['CLIP', 'ACKN', 'UPLD', 'DWLD', 'FILE', 'PLAY']
                    }
                }
            },
            SELECTORS: {
                CONVERSATION_WINDOW: 'div[id^="db_message_"]',
                MESSAGE_LIST_ITEM: 'li[id^="message_"]',
                CURRENT_FOLDER: '#current_folder',
                FOLDER_LIST: '#folder_list',
                MESSAGE_LIST: '#liste_messages'
            }
        };
     
        class LRUCache {
            constructor(maxSize = 500, storagePrefix = null) {
                this.maxSize = maxSize;
                this.cache = new Map();
                this.storagePrefix = storagePrefix;
            }
     
            get(key) {
                if (this.cache.has(key)) {
                    const value = this.cache.get(key);
                    this.cache.delete(key);
                    this.cache.set(key, value);
                    return value;
                }

                if (this.storagePrefix) {
                    try {
                        const stored = localStorage.getItem(this.storagePrefix + key);
                        if (stored) {
                            this.cache.set(key, stored);
                            if (this.cache.size > this.maxSize) {
                                const firstKey = this.cache.keys().next().value;
                                this.cache.delete(firstKey);
                            }
                            return stored;
                        }
                    } catch (e) {}
                }

                return undefined;
            }
     
            set(key, value) {
                if (this.cache.has(key)) {
                    this.cache.delete(key);
                } else if (this.cache.size >= this.maxSize) {
                    const firstKey = this.cache.keys().next().value;
                    this.cache.delete(firstKey);
                }
                this.cache.set(key, value);

                if (this.storagePrefix) {
                    try {
                        localStorage.setItem(this.storagePrefix + key, value);
                    } catch (e) {}
                }
            }
     
            has(key) {
                return this.cache.has(key) || (this.storagePrefix && localStorage.getItem(this.storagePrefix + key) !== null);
            }
        }
     
        const STATE = {
            openConversations: new Set(),
            openConversationWindows: new Map(),
            conversationFolders: new Map(),
            mutedConversations: new Set(),
            playerName: null,
            activeConversationID: null,
            pendingRefreshes: new Set(),
            scrollTimers: new Map(),
            messageContentCache: new LRUCache(500, 'ddm_msg_'),
            lastMessageIDs: new Map(),
            allMetadataCache: new Map(),
            avatarCache: new LRUCache(200),
            tooltipTimer: null,
            collapsedWindows: new Map(),
            loadingTimeouts: new Map(),
            userOptions: null,
            sharedDOMParser: new DOMParser(),
            programmaticClick: false,
            observers: new Map(),
            sharedObserver: null,
            regex: {
                conversationTitle: /\[(.+?)\]\s*(.*)/,
                messageID: /message_(\d+)/,
                conversID: /convers_(\d+)/,
                dbMessageID: /db_message_(\d+)/,
                folderID: /folder_(\d+)/,
                senderLine: /Message de (.+)/,
                urlPattern: /(https?:\/\/[^\s]+)/gi,
                imageExtensions: /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i,
                hexColor: /^#[0-9A-F]{6}$/i
            }
        };
     
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
     
        const DragManager = {
            activeWindow: null,
            isDragging: false,
            startX: 0,
            startY: 0,
            startLeft: 0,
            startTop: 0,
            rafId: null,
     
            init() {
                document.addEventListener('mousemove', (e) => {
                    if (!this.isDragging || !this.activeWindow) return;
                    if (this.rafId) return;
     
                    this.rafId = requestAnimationFrame(() => {
                        const dx = e.clientX - this.startX;
                        const dy = e.clientY - this.startY;
                        this.activeWindow.style.left = `${this.startLeft + dx}px`;
                        this.activeWindow.style.top = `${this.startTop + dy}px`;
                        this.rafId = null;
                    });
                });
     
                document.addEventListener('mouseup', () => {
                    if (this.isDragging && this.activeWindow) {
                        const header = this.activeWindow.querySelector('.conv-window-header');
                        if (header) header.style.cursor = 'grab';
                        if (this.rafId) cancelAnimationFrame(this.rafId);
                        this.rafId = null;
                    }
                    this.isDragging = false;
                    this.activeWindow = null;
                });
            },
     
            startDrag(windowEl, e) {
                this.isDragging = true;
                this.activeWindow = windowEl;
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.startLeft = windowEl.offsetLeft;
                this.startTop = windowEl.offsetTop;
     
                const header = windowEl.querySelector('.conv-window-header');
                if (header) header.style.cursor = 'grabbing';
            }
        };
     
        const ResizeManager = {
            activeWindow: null,
            isResizing: false,
            startX: 0,
            startY: 0,
            startWidth: 0,
            startHeight: 0,
            rafId: null,
     
            init() {
                document.addEventListener('mousemove', (e) => {
                    if (!this.isResizing || !this.activeWindow) return;
                    if (this.rafId) return;
     
                    this.rafId = requestAnimationFrame(() => {
                        const dx = e.clientX - this.startX;
                        const dy = e.clientY - this.startY;
                        const newWidth = Math.max(300, this.startWidth + dx);
                        const newHeight = Math.max(400, this.startHeight + dy);
                        this.activeWindow.style.width = `${newWidth}px`;
                        this.activeWindow.style.height = `${newHeight}px`;
                        this.rafId = null;
                    });
                });
     
                document.addEventListener('mouseup', () => {
                    if (this.isResizing && this.rafId) {
                        cancelAnimationFrame(this.rafId);
                        this.rafId = null;
                    }
                    this.isResizing = false;
                    this.activeWindow = null;
                });
            },
     
            startResize(windowEl, e) {
                this.isResizing = true;
                this.activeWindow = windowEl;
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.startWidth = windowEl.offsetWidth;
                this.startHeight = windowEl.offsetHeight;
            }
        };
     
        function debouncedScrollToBottom(container, conversationID) {
            if (STATE.scrollTimers.has(conversationID)) {
                clearTimeout(STATE.scrollTimers.get(conversationID));
            }
     
            const timer = setTimeout(() => {
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight;
                });
                STATE.scrollTimers.delete(conversationID);
            }, 50);
     
            STATE.scrollTimers.set(conversationID, timer);
        }
     
        async function fetchWithTimeout(url, options = {}, timeout = 10000, retries = 1) {
            for (let attempt = 0; attempt <= retries; attempt++) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), timeout);
     
                    const response = await fetch(url, {
                        ...options,
                        signal: controller.signal
                    });
     
                    clearTimeout(timeoutId);
                    return response;
                } catch (error) {
                    if (attempt === retries) {
                        throw error;
                    }
                    await sleep(500);
                }
            }
        }
     
        function sanitizeHTML(html) {
            const temp = document.createElement('div');
            temp.textContent = html;
            return temp.innerHTML;
        }
     
        function parseTimestamp(ts) {
            if (!ts) return 0;
            let parts = ts.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
            if (parts) {
                const [, day, month, year, hours, minutes] = parts;
                return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes)).getTime();
            }
            parts = ts.match(/(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{2})/);
            if (parts) {
                const [, hours, minutes, day, month, year] = parts;
                return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes)).getTime();
            }
            return 0;
        }
     
    function createMessageBubble(message, noAnimation = false) {
        const bubbleEl = document.createElement('div');
        
        const playerName = STATE.playerName || getPlayerName();
        const isMentioned = playerName && !message.isSentByPlayer && message.body && message.body.includes(playerName);
        
        bubbleEl.className = `message-bubble ${message.isSentByPlayer ? 'sent' : 'received'}${isMentioned ? ' mentioned' : ''}`;
        bubbleEl.dataset.messageId = message.messageID;

        if (noAnimation) {
            bubbleEl.style.animation = 'none';
        }

        const avatarUrl = `https://www.dreadcast.net/images/avatars/${encodeURIComponent(message.sender)}.png`;
        const isAvatarCached = CONFIG.AVATAR_CACHE_ENABLED && STATE.avatarCache.has(message.sender);
        const avatarLoading = isAvatarCached ? 'eager' : 'lazy';

        let displayBody = message.body || '';
        let headerHtml = '';
        
        const headerRegex = /^\s*【\s*([^】]+)\s*】\s*/;
        const match = displayBody.match(headerRegex);

        if (match) {
            const headerContent = match[1]; 
            displayBody = displayBody.replace(headerRegex, '');
            
            headerHtml = ` <span style="color: var(--accent-primary); font-weight: bold;">- 【 ${sanitizeHTML(headerContent)} 】</span>`;
        }

        bubbleEl.innerHTML = `
            <div class="avatar-container">
                <img class="message-avatar" src="${avatarUrl}" alt="${sanitizeHTML(message.sender)}" loading="${avatarLoading}" onerror="this.style.display='none'">
                <div class="avatar-tooltip">
                    <img src="${avatarUrl}" alt="${sanitizeHTML(message.sender)}" loading="lazy" onerror="this.parentElement.style.display='none'">
                </div>
            </div>
            <div class="message-content">
                <div class="message-sender">${sanitizeHTML(message.sender)}${headerHtml}</div>
                <div class="message-text" style="font-size: ${STATE.userOptions.accessibility.fontSize}px; color: ${STATE.userOptions.accessibility.textColor};">${linkifyText(displayBody)}</div>
                <div class="message-time">${sanitizeHTML(message.timestamp)}</div>
            </div>
        `;

        if (CONFIG.AVATAR_CACHE_ENABLED && !isAvatarCached) {
            STATE.avatarCache.set(message.sender, true);
        }

        setupAvatarTooltipPositioning(bubbleEl);
        setupLinkPreviews(bubbleEl);

        return bubbleEl;
    }
     
        function linkifyText(text) {
            if (!text) return '';
     
            const sanitized = sanitizeHTML(text);
     
            return sanitized.replace(STATE.regex.urlPattern, (url) => {
                const cleanUrl = url.replace(/[.,!?;:)]$/, '');
                const punctuation = url.length > cleanUrl.length ? url.slice(cleanUrl.length) : '';
     
                return `<a href="${cleanUrl}" class="message-link" target="_blank" rel="noopener noreferrer" data-url="${cleanUrl}">${cleanUrl}</a>${punctuation}`;
            });
        }
     
        async function fetchLinkPreview(url) {
            try {
                const cacheKey = `preview_${url}`;
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    return JSON.parse(cached);
                }
     
                const isImage = STATE.regex.imageExtensions.test(url);
     
                if (isImage) {
                    const preview = {
                        type: 'image',
                        url: url,
                        title: url.split('/').pop().split('?')[0]
                    };
                    sessionStorage.setItem(cacheKey, JSON.stringify(preview));
                    return preview;
                }
     
                try {
                    const urlObj = new URL(url);
                    const preview = {
                        type: 'link',
                        domain: urlObj.hostname,
                        title: urlObj.hostname
                    };
                    sessionStorage.setItem(cacheKey, JSON.stringify(preview));
                    return preview;
                } catch (e) {
                    return { type: 'link', domain: 'Lien', title: 'Lien externe' };
                }
     
            } catch (error) {
                return null;
            }
        }
     
        function setupLinkPreviews(messageElement) {
            const links = messageElement.querySelectorAll('.message-link');
     
            links.forEach(link => {
                const url = link.dataset.url;
                if (!url) return;
     
                let tooltip = null;
                let loadTimeout = null;
     
                link.addEventListener('mouseenter', () => {
                    loadTimeout = setTimeout(async () => {
                        const preview = await fetchLinkPreview(url);
                        if (!preview) return;
     
                        tooltip = document.createElement('div');
                        tooltip.className = 'link-preview-tooltip';
     
                        if (preview.type === 'image') {
                            tooltip.innerHTML = `
                                <div class="link-preview-image-container">
                                    <img src="${preview.url}" alt="${preview.title}" onerror="this.parentElement.innerHTML='<div class=\'link-preview-error\'>Impossible de charger l\\'image</div>'">
                                </div>
                                <div class="link-preview-title">${sanitizeHTML(preview.title)}</div>
                            `;
                        } else {
                            tooltip.innerHTML = `
                                <div class="link-preview-domain">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                                        <path d="M8 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                                    </svg>
                                    ${sanitizeHTML(preview.domain)}
                                </div>
                                <div class="link-preview-title">${sanitizeHTML(preview.title)}</div>
                            `;
                        }
     
                        document.body.appendChild(tooltip);
     
                        const linkRect = link.getBoundingClientRect();
                        const tooltipRect = tooltip.getBoundingClientRect();
     
                        let left = linkRect.left + (linkRect.width / 2) - (tooltipRect.width / 2);
                        let top = linkRect.top - tooltipRect.height - 10;
     
                        if (left < 10) left = 10;
                        if (left + tooltipRect.width > window.innerWidth - 10) {
                            left = window.innerWidth - tooltipRect.width - 10;
                        }
     
                        if (top < 10) {
                            top = linkRect.bottom + 10;
                        }
     
                        tooltip.style.left = `${left}px`;
                        tooltip.style.top = `${top}px`;
     
                        requestAnimationFrame(() => {
                            tooltip.classList.add('visible');
                        });
                    }, 300);
                });
     
                link.addEventListener('mouseleave', () => {
                    if (loadTimeout) {
                        clearTimeout(loadTimeout);
                        loadTimeout = null;
                    }
                    if (tooltip) {
                        tooltip.remove();
                        tooltip = null;
                    }
                });
            });
        }
     
        const SoundManager = {
            audioCache: new Map(),
     
            preloadSound(url) {
                if (!url || this.audioCache.has(url)) return;
     
                try {
                    const audio = new Audio(url);
                    audio.preload = 'auto';
                    this.audioCache.set(url, audio);
                } catch (error) {
                }
            },
     
            playSound(url, volume = 0.5) {
                if (!url || !STATE.userOptions?.sounds?.enabled) return;
     
                try {
                    let audio = this.audioCache.get(url);
     
                    if (!audio) {
                        audio = new Audio(url);
                        this.audioCache.set(url, audio);
                    }
     
                    audio.volume = Math.max(0, Math.min(1, volume));
     
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                        });
                    }
                } catch (error) {
                }
            },
     
            playOpenConversationSound(conversationID = null) {
                if (!STATE.userOptions?.sounds) return;
                if (conversationID && STATE.mutedConversations.has(conversationID)) return;
                this.playSound(
                    STATE.userOptions.sounds.openConversationUrl,
                    STATE.userOptions.sounds.openConversationVolume
                );
            },
     
            playClosedConversationSound(conversationID = null) {
                if (!STATE.userOptions?.sounds) return;
                if (conversationID && STATE.mutedConversations.has(conversationID)) return;
                this.playSound(
                    STATE.userOptions.sounds.closedConversationUrl,
                    STATE.userOptions.sounds.closedConversationVolume
                );
            },
     
            preloadUserSounds() {
                if (!STATE.userOptions?.sounds) return;
                this.preloadSound(STATE.userOptions.sounds.openConversationUrl);
                this.preloadSound(STATE.userOptions.sounds.closedConversationUrl);
            }
        };
     
        function loadUserOptions() {
            try {
                const stored = localStorage.getItem(CONFIG.OPTIONS.STORAGE_KEY);
                if (stored) {
                    STATE.userOptions = JSON.parse(stored);
                    if (!STATE.userOptions.sounds) {
                        STATE.userOptions.sounds = JSON.parse(JSON.stringify(CONFIG.OPTIONS.DEFAULTS.sounds));
                    }
                    if (!STATE.userOptions.comback) {
                        STATE.userOptions.comback = JSON.parse(JSON.stringify(CONFIG.OPTIONS.DEFAULTS.comback));
                    }
                } else {
                    STATE.userOptions = JSON.parse(JSON.stringify(CONFIG.OPTIONS.DEFAULTS));
                }
            } catch (error) {
                STATE.userOptions = JSON.parse(JSON.stringify(CONFIG.OPTIONS.DEFAULTS));
            }
            applyUserOptions();
        }
     
        function saveUserOptions() {
            try {
                localStorage.setItem(CONFIG.OPTIONS.STORAGE_KEY, JSON.stringify(STATE.userOptions));
                applyUserOptions();
            } catch (error) {
            }
        }
     
        function loadMutedConversations() {
            try {
                const stored = localStorage.getItem('ddm-muted-conversations');
                if (stored) {
                    const mutedArray = JSON.parse(stored);
                    STATE.mutedConversations = new Set(mutedArray);
                }
            } catch (error) {
                STATE.mutedConversations = new Set();
            }
        }
     
        function saveMutedConversations() {
            try {
                const mutedArray = Array.from(STATE.mutedConversations);
                localStorage.setItem('ddm-muted-conversations', JSON.stringify(mutedArray));
            } catch (error) {
            }
        }
     
        function toggleMuteConversation(conversationID) {
            if (STATE.mutedConversations.has(conversationID)) {
                STATE.mutedConversations.delete(conversationID);
            } else {
                STATE.mutedConversations.add(conversationID);
            }
            saveMutedConversations();
            updateMuteCheckbox(conversationID);
        }
     
        function updateMuteCheckbox(conversationID) {
            const windowEl = STATE.openConversationWindows.get(conversationID);
            if (!windowEl) return;
     
            const checkbox = windowEl.querySelector('.mute-checkbox');
            if (checkbox) {
                checkbox.checked = STATE.mutedConversations.has(conversationID);
            }
        }
     
        function applyUserOptions() {
            if (!STATE.userOptions) return;

            if (STATE.userOptions.accessibility.performanceMode) {
                document.body.classList.add('ddm-low-perf');
            } else {
                document.body.classList.remove('ddm-low-perf');
            }
     
            const root = document.documentElement;
            const primaryColor = STATE.userOptions.theme.primaryColor;
     
            root.style.setProperty('--bg-primary', primaryColor);
            root.style.setProperty('--bg-secondary', adjustColorBrightness(primaryColor, 10));
            root.style.setProperty('--bg-panel', adjustColorBrightness(primaryColor, 20));
            root.style.setProperty('--accent-primary', STATE.userOptions.theme.secondaryColor);
            root.style.setProperty('--accent-secondary', adjustColorBrightness(STATE.userOptions.theme.secondaryColor, -20));
            root.style.setProperty('--border-color', STATE.userOptions.theme.secondaryColor);
     
            document.querySelectorAll('.modern-conversation-window').forEach(windowEl => {
                const messages = windowEl.querySelectorAll('.message-text');
                messages.forEach(msg => {
                    msg.style.fontSize = `${STATE.userOptions.accessibility.fontSize}px`;
                    msg.style.color = STATE.userOptions.accessibility.textColor;
                });
            });
        }
     
        function adjustColorBrightness(hex, percent) {
            const num = parseInt(hex.replace('#', ''), 16);
            const amt = Math.round(2.55 * percent);
            const R = Math.max(0, Math.min(255, (num >> 16) + amt));
            const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
            const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
            return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
        }
     
        const DOMHelpers = {
            messageMenuBtn: null,
            currentFolderEl: null,
            folderList: null,
            messageList: null,
     
            getMessageMenuBtn() {
                if (!this.messageMenuBtn || !document.contains(this.messageMenuBtn)) {
                    this.messageMenuBtn = document.querySelector('#display_messagerie');
                }
                return this.messageMenuBtn;
            },
     
            getCurrentFolderEl() {
                if (!this.currentFolderEl || !document.contains(this.currentFolderEl)) {
                    this.currentFolderEl = document.querySelector('#current_folder');
                }
                return this.currentFolderEl;
            },
     
            getFolderList() {
                if (!this.folderList || !document.contains(this.folderList)) {
                    this.folderList = document.querySelector('#folder_list');
                }
                return this.folderList;
            },
     
            getMessageList() {
                if (!this.messageList || !document.contains(this.messageList)) {
                    this.messageList = document.querySelector('#liste_messages');
                }
                return this.messageList;
            },
     
            clearCache() {
                this.messageMenuBtn = null;
                this.currentFolderEl = null;
                this.folderList = null;
                this.messageList = null;
            }
        };
     
        async function ensureMessageMenuOpen() {
            const messageMenuBtn = DOMHelpers.getMessageMenuBtn();
            if (messageMenuBtn && !messageMenuBtn.classList.contains('selected')) {
                messageMenuBtn.click();
                await sleep(CONFIG.OPEN_MENU_DELAY);
                return true;
            }
            return false;
        }
     
        async function ensureFolderDropdownVisible() {
            const folderDropdown = document.querySelector('#folder_list');
            if (folderDropdown && folderDropdown.style.display === 'none') {
                const folderBtn = document.querySelector('.folder_list');
                if (folderBtn) {
                    folderBtn.click();
                    await sleep(CONFIG.OPEN_FOLDER_DELAY);
                }
            }
        }
     
        async function navigateToFolder(folderID) {
            const currentFolderEl = DOMHelpers.getCurrentFolderEl();
            const currentFolderId = currentFolderEl ? parseInt(currentFolderEl.dataset.id, 10) : null;
     
            if (currentFolderId === folderID) {
                return true;
            }
     
            await ensureFolderDropdownVisible();
     
            const targetFolder = document.querySelector(`#folder_${folderID}`);
            if (targetFolder) {
                targetFolder.click();
                await sleep(CONFIG.SELECT_FOLDER_DELAY);
                return true;
            }
            return false;
        }
     
        function getPlayerName() {
            if (STATE.playerName) return STATE.playerName;
            const pseudoElement = document.querySelector('#txt_pseudo');
            if (pseudoElement) {
                STATE.playerName = pseudoElement.textContent.trim();
                return STATE.playerName;
            }
            return null;
        }
     
        function getOpenConversationIDs() {
            const originalElements = document.querySelectorAll(CONFIG.SELECTORS.CONVERSATION_WINDOW);
            const modernElements = document.querySelectorAll('.modern-conversation-window[data-conversation-id]');
     
            const ids = [];
     
            originalElements.forEach(el => {
                const match = el.id.match(/db_message_(\d+)/);
                if (match) {
                    ids.push(parseInt(match[1], 10));
                }
            });
     
            modernElements.forEach(el => {
                const convId = parseInt(el.dataset.conversationId, 10);
                if (convId && !ids.includes(convId)) {
                    ids.push(convId);
                }
            });
     
            return ids;
        }
     
        function updateOpenConversationsState() {
            const currentlyOpen = getOpenConversationIDs();
     
            STATE.openConversations.clear();
            currentlyOpen.forEach(id => STATE.openConversations.add(id));
        }
     
        async function parseConversationDOM(conversationID, initialLoadCount = 5) {
            try {
                const convElement = document.querySelector(`#db_message_${conversationID}`);
                if (!convElement) {
                    return null;
                }
     
                const titleEl = convElement.querySelector('.title');
                const title = titleEl ? titleEl.textContent.trim() : 'Unknown';

                const participantsP = convElement.querySelector('.zone_conversation p');
                const participantsStr = participantsP ? participantsP.textContent.trim() : '';
                const participants = participantsStr.split(',').map(p => p.trim()).filter(p => p);
     
                const conversationList = convElement.querySelectorAll('.zone_conversation .conversation');
                const playerName = getPlayerName();
                const allMessageMetadata = [];
     
                conversationList.forEach(convDiv => {
                    const idMatch = convDiv.id.match(STATE.regex.conversID);
                    if (!idMatch) return;
     
                    const messageID = parseInt(idMatch[1], 10);
                    const ligne1 = convDiv.querySelector('.ligne1');
                    const ligne2 = convDiv.querySelector('.ligne2');
     
                    const timestamp = ligne1 ? ligne1.textContent.trim() : '';
                    const senderLine = ligne2 ? ligne2.textContent.trim() : '';
     
                    const senderMatch = senderLine.match(STATE.regex.senderLine);
                    const sender = senderMatch ? senderMatch[1].trim() : 'Unknown';
     
                    allMessageMetadata.push({
                        messageID,
                        sender,
                        timestamp,
                        isSentByPlayer: playerName && sender === playerName,
                        body: null
                    });
                });

                allMessageMetadata.sort((a, b) => {
                    const timeDiff = parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp);
                    return timeDiff !== 0 ? timeDiff : a.messageID - b.messageID;
                });

                const totalMessages = allMessageMetadata.length;
                const recentMetadata = allMessageMetadata.slice(-initialLoadCount);
     
                const initialMessages = [];
                const CONCURRENCY_LIMIT = 2;
     
                const windowEl = STATE.openConversationWindows.get(conversationID);
     
                const numBatches = Math.ceil(recentMetadata.length / CONCURRENCY_LIMIT);
     
                for (let batchNum = numBatches - 1; batchNum >= 0; batchNum--) {
                    const startIdx = batchNum * CONCURRENCY_LIMIT;
                    const endIdx = Math.min(startIdx + CONCURRENCY_LIMIT, recentMetadata.length);
                    const batch = recentMetadata.slice(startIdx, endIdx);
     
                    const batchResults = await Promise.allSettled(
                        batch.map(meta =>
                            fetchMessageContent(meta.messageID, conversationID)
                                .then(body => ({ ...meta, body: body || '...' }))
                                .catch(() => ({ ...meta, body: '...' }))
                        )
                    );
     
                    const loadedMessages = batchResults
                        .filter(result => result.status === 'fulfilled')
                        .map(result => result.value);
     
                    initialMessages.push(...loadedMessages);
     
                    if (windowEl) {
                        const container = windowEl.querySelector('.conv-messages-container');
     
                        if (batchNum === numBatches - 1 && container) {
                            const loadingPlaceholder = container.querySelector('.loading-placeholder');
                            if (loadingPlaceholder) {
                                loadingPlaceholder.remove();
                            }
                        }
     
                        if (batchNum === numBatches - 1) {
                            loadedMessages.forEach(msg => {
                                addMessageToWindow(windowEl, msg, true);
                            });
                        } else {
                            for (let i = loadedMessages.length - 1; i >= 0; i--) {
                                insertMessageAtTop(windowEl, loadedMessages[i]);
                            }
                        }
                    }
                }

                initialMessages.sort((a, b) => {
                    const timeDiff = parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp);
                    return timeDiff !== 0 ? timeDiff : a.messageID - b.messageID;
                });

                const hasMore = totalMessages > initialLoadCount;                if (allMessageMetadata.length > 0) {
                    const maxMessageID = Math.max(...allMessageMetadata.map(m => m.messageID));
                    STATE.lastMessageIDs.set(conversationID, maxMessageID);
                }
     
                return {
                    conversationID,
                    title,
                    messages: initialMessages,
                    allMetadata: allMessageMetadata,
                    totalMessages,
                    hasMore,
                    participants
                };
     
            } catch (error) {
                return null;
            }
        }
     
        async function loadMoreMessages(conversationID, allMetadata, currentlyLoaded, batchSize = null) {
            const windowEl = STATE.openConversationWindows.get(conversationID);
            if (!windowEl || !document.body.contains(windowEl)) {
                return;
            }
     
            const loadBtn = windowEl.querySelector('.load-more-btn');
            if (loadBtn) {
                loadBtn.disabled = true;
                loadBtn.textContent = 'Chargement...';
            }
     
            const totalMessages = allMetadata.length;
            const remainingMessages = totalMessages - currentlyLoaded;
     
            if (batchSize === null) {
                batchSize = remainingMessages > 30 ? 15 : 20;
            }
     
            const startIdx = Math.max(0, totalMessages - currentlyLoaded - batchSize);
            const endIdx = totalMessages - currentlyLoaded;
            const batchMetadata = allMetadata.slice(startIdx, endIdx);
     
            const loadedMessages = [];
            const CONCURRENCY_LIMIT = 3;
     
            for (let i = 0; i < batchMetadata.length; i += CONCURRENCY_LIMIT) {
                const batch = batchMetadata.slice(i, i + CONCURRENCY_LIMIT);
     
                const batchPromises = batch.map(meta =>
                    fetchMessageContent(meta.messageID, conversationID)
                        .then(body => ({ ...meta, body: body || '...' }))
                        .catch(() => ({ ...meta, body: '...' }))
                );
     
                const results = await Promise.allSettled(batchPromises);
                results.forEach(result => {
                    if (result.status === 'fulfilled') {
                        loadedMessages.push(result.value);
                    }
                });
            }

            loadedMessages.sort((a, b) => {
                const timeDiff = parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
                return timeDiff !== 0 ? timeDiff : b.messageID - a.messageID;
            });

            const container = windowEl.querySelector('.conv-messages-container');
            const scrollHeightBefore = container.scrollHeight;
            const scrollTopBefore = container.scrollTop;
     
            loadedMessages.forEach(message => {
                insertMessageBeforeFirstMessage(windowEl, message);
            });
     
            if (scrollTopBefore > 0) {
                const scrollHeightAfter = container.scrollHeight;
                container.scrollTop = scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
            }
     
            const newLoadedCount = currentlyLoaded + loadedMessages.length;
            const remainingCount = totalMessages - newLoadedCount;
     
            windowEl.dataset.loadedCount = newLoadedCount;
     
            if (loadBtn) {
                if (remainingCount > 0) {
                    const nextBatch = remainingCount > 30 ? 15 : Math.min(20, remainingCount);
                    loadBtn.disabled = false;
                    loadBtn.textContent = `Charger ${nextBatch} messages précédents (${remainingCount} restants)`;
                } else {
                    loadBtn.remove();
                }
            }
        }
     
        function insertMessageBeforeFirstMessage(windowEl, message) {
            const container = windowEl.querySelector('.conv-messages-container');
            if (!container) return;
     
            const existingBubble = container.querySelector(`[data-message-id="${message.messageID}"]`);
            if (existingBubble) return;
     
            const bubbleEl = createMessageBubble(message, true);
     
            const loadMoreBtn = container.querySelector('.load-more-btn');
            const firstBubble = container.querySelector('.message-bubble');
     
            if (loadMoreBtn) {
                container.insertBefore(bubbleEl, loadMoreBtn.nextSibling);
            } else if (firstBubble) {
                container.insertBefore(bubbleEl, firstBubble);
            } else {
                container.appendChild(bubbleEl);
            }
        }
     
        async function fetchMessageContent(messageID, conversationID) {
            const cacheKey = `${conversationID}_${messageID}`;
            if (STATE.messageContentCache.has(cacheKey)) {
                return STATE.messageContentCache.get(cacheKey);
            }
     
            try {
                const url = `/Menu/Messaging/action=ReadMessage&id_message=${messageID}&id_conversation=${conversationID}`;
                const response = await fetchWithTimeout(url, {}, 10000, 1);
     
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
     
                const xmlText = await response.text();
                const xmlDoc = STATE.sharedDOMParser.parseFromString(xmlText, 'text/xml');
     
                const messageEl = xmlDoc.querySelector('message');
                const content = messageEl ? messageEl.textContent.trim() : null;
     
                if (content) {
                    STATE.messageContentCache.set(cacheKey, content);
                }
     
                return content;
     
            } catch (error) {
                return null;
            }
        }
     
        function parseFolderResponse(xmlText) {
            try {
                const xmlDoc = STATE.sharedDOMParser.parseFromString(xmlText, 'text/xml');
     
                const parseError = xmlDoc.querySelector('parsererror');
                if (parseError) {
                    throw new Error('XML parse error');
                }
     
                const folderNameEl = xmlDoc.querySelector('folder_name');
                const folderName = folderNameEl ? folderNameEl.textContent : 'Unknown';
     
                const conversations = [];
                const messageElements = xmlDoc.querySelectorAll('li[id^="message_"]');
     
                messageElements.forEach(li => {
                    const idMatch = li.id.match(STATE.regex.messageID);
                    if (!idMatch) return;
     
                    const conversationID = parseInt(idMatch[1], 10);
     
                    const hasNew = li.className.includes('new');
     
                    const titleEl = li.querySelector('.message_titre');
                    const authorEl = li.querySelector('.message_auteur');
                    const dateEl = li.querySelector('.message_date');
                    const imgEl = li.querySelector('img');
     
                    conversations.push({
                        id: conversationID,
                        title: titleEl ? titleEl.textContent.trim() : '',
                        sender: authorEl ? authorEl.textContent.trim() : '',
                        timestamp: dateEl ? dateEl.innerHTML : '',
                        avatar: imgEl ? imgEl.src : '',
                        hasNew: hasNew
                    });
                });
     
                return {
                    folderName: folderName,
                    conversations: conversations
                };
     
            } catch (error) {
                return null;
            }
        }
     
        function interceptXHR() {
            const originalOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;
     
            XMLHttpRequest.prototype.open = function(method, url) {
                this._dmmMethod = method;
                this._dmmURL = url;
                return originalOpen.apply(this, arguments);
            };
     
            XMLHttpRequest.prototype.send = function(body) {
                const xhr = this;
     
                const handler = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const url = xhr._dmmURL;
     
                        try {
                            if (url && url.includes('/Check')) {
                                handleCheckResponse(xhr.responseText);
                            }
     
                            else if (xhr._dmmMethod === 'POST' && url && url.includes('/Menu/Messaging/NewMessage')) {
                                handleNewMessageSent(body, xhr.responseText);
                            }
                        } catch (error) {
                        }
                    }
                };
     
                xhr.addEventListener('readystatechange', handler);
                return originalSend.apply(this, arguments);
            };
        }
     
        function handleCheckResponse(responseText) {
            try {
                const match = responseText.match(/<evenement\s+type="nouveau_message">.*?<folder_(\d+)\s+quantite="\d+"\s+id_conversation="(\d+)"\s*\/?>/s);
     
                if (match) {
                    const folderID = parseInt(match[1], 10);
                    const conversationID = parseInt(match[2], 10);
     
                    STATE.conversationFolders.set(conversationID, folderID);
     
                    const isWindowOpen = STATE.openConversationWindows.has(conversationID);
                    const isMuted = STATE.mutedConversations.has(conversationID);
     
                    if (isWindowOpen) {
                        refreshConversationViaUI(conversationID, folderID);
                    } else if (isMuted) {
                        clearMutedConversationNotification(conversationID, folderID);
                    } else {
                        SoundManager.playClosedConversationSound(conversationID);
                    }
                }
            } catch (error) {
            }
        }
     
        function handleNewMessageSent(body, responseText) {
            try {
                let conversationID = null;
     
                if (body instanceof URLSearchParams) {
                    conversationID = body.get('nm_idConvers');
                } else if (typeof body === 'string') {
                    const params = new URLSearchParams(body);
                    conversationID = params.get('nm_idConvers');
                }
     
                if (conversationID) {
                    const convID = parseInt(conversationID, 10);
                    const xmlDoc = STATE.sharedDOMParser.parseFromString(responseText, 'text/xml');
                    const resultat = xmlDoc.querySelector('resultat');
                    const success = resultat && resultat.getAttribute('value') === 'true';
     
                    if (success) {
                        setTimeout(async () => {
                            const folderID = STATE.conversationFolders.get(convID);
                            if (folderID !== undefined) {
                                await refreshConversationViaUI(convID, folderID);
                            }
                        }, CONFIG.REFRESH_AFTER_SEND_DELAY);
                    }
                }
            } catch (error) {
            }
        }
     
        function captureUIState() {
            const messageMenuBtn = DOMHelpers.getMessageMenuBtn();
            const isMessageMenuOpen = messageMenuBtn && messageMenuBtn.classList.contains('selected');
     
            const currentFolderEl = DOMHelpers.getCurrentFolderEl();
            const currentFolderId = currentFolderEl ? parseInt(currentFolderEl.dataset.id, 10) : null;
     
            return {
                isMessageMenuOpen,
                currentFolderId
            };
        }
     
        async function restoreUIState(savedState) {
            if (!savedState) return;
     
            if (savedState.currentFolderId !== null) {
                await navigateToFolder(savedState.currentFolderId);
            }
     
            const messageMenuBtn = DOMHelpers.getMessageMenuBtn();
            if (!savedState.isMessageMenuOpen && messageMenuBtn && messageMenuBtn.classList.contains('selected')) {
                messageMenuBtn.click();
                await sleep(CONFIG.CLOSE_DELAY);
            }
        }
     
        async function refreshConversationViaUI(conversationID, folderID) {
            if (STATE.pendingRefreshes.has(conversationID)) {
                return false;
            }
     
            if (!STATE.openConversationWindows.has(conversationID)) {
                return false;
            }
     
            STATE.pendingRefreshes.add(conversationID);
     
            const uiState = captureUIState();
     
            try {
                STATE.programmaticClick = true;
     
                await ensureMessageMenuOpen();
     
                const success = await navigateToFolder(folderID);
                if (!success) {
                    STATE.programmaticClick = false;
                    await restoreUIState(uiState);
                    return false;
                }
     
                let messageElement = document.querySelector(`#message_${conversationID}`);
                if (!messageElement) {
                    STATE.programmaticClick = false;
                    await restoreUIState(uiState);
                    return false;
                }
     
                const isOpen = document.querySelector(`#db_message_${conversationID}`) !== null;
     
                if (window.nav?.getMessagerie?.()?.openMessage) {
                    if (isOpen) {
                        messageElement.click();
                        await sleep(CONFIG.CLOSE_DELAY);
                    }
                    window.nav.getMessagerie().openMessage(conversationID);
                } else {
                    if (isOpen) {
                        messageElement.click();
                        await sleep(CONFIG.CLOSE_DELAY);
                    }
                    messageElement.click();
                }

                await sleep(CONFIG.OPEN_CONVERSATION_DELAY);

                STATE.programmaticClick = false;

                await addNewMessagesToConversation(conversationID);

                await restoreUIState(uiState);
                
                return true;
     
            } catch (error) {
                STATE.programmaticClick = false;
                await restoreUIState(uiState);
                return false;
     
            } finally {
                STATE.pendingRefreshes.delete(conversationID);
            }
        }
     
        async function addNewMessagesToConversation(conversationID) {
            try {
                const convElement = document.querySelector(`#db_message_${conversationID}`);
                if (!convElement) {
                    return;
                }

                const windowEl = STATE.openConversationWindows.get(conversationID);
                if (!windowEl || !document.body.contains(windowEl)) {
                    return;
                }

                const conversationList = convElement.querySelectorAll('.zone_conversation .conversation');
                const playerName = getPlayerName();
                const lastKnownMessageID = STATE.lastMessageIDs.get(conversationID) || 0;
     
                const newMessages = [];
     
                conversationList.forEach(convDiv => {
                    const idMatch = convDiv.id.match(STATE.regex.conversID);
                    if (!idMatch) return;
     
                    const messageID = parseInt(idMatch[1], 10);
     
                    if (messageID <= lastKnownMessageID) return;
     
                    const ligne1 = convDiv.querySelector('.ligne1');
                    const ligne2 = convDiv.querySelector('.ligne2');
     
                    const timestamp = ligne1 ? ligne1.textContent.trim() : '';
                    const senderLine = ligne2 ? ligne2.textContent.trim() : '';
     
                    const senderMatch = senderLine.match(STATE.regex.senderLine);
                    const sender = senderMatch ? senderMatch[1].trim() : 'Unknown';
     
                    newMessages.push({
                        messageID,
                        sender,
                        timestamp,
                        isSentByPlayer: playerName && sender === playerName,
                        body: null
                    });
                });
     
                if (newMessages.length === 0) {
                    return;
                }
     
                newMessages.sort((a, b) => parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp));
                const maxMessageID = Math.max(...newMessages.map(m => m.messageID));
                STATE.lastMessageIDs.set(conversationID, maxMessageID);
     
                for (const meta of newMessages) {
                    try {
                        const body = await fetchMessageContent(meta.messageID, conversationID);
                        const fullMessage = { ...meta, body: body || '...' };

                        if (fullMessage.isSentByPlayer) {
                            const container = windowEl.querySelector('.conv-messages-container');
                            if (container) {
                                const optimisticBubbles = Array.from(container.querySelectorAll('.message-bubble.sent'));
                                const optimistic = optimisticBubbles.find(b => {
                                    const id = parseInt(b.dataset.messageId, 10);
                                    if (id <= 1000000000000) return false;

                                    const bubbleText = b.querySelector('.message-text').textContent.trim();
                                    const tempDiv = document.createElement('div');
                                    tempDiv.innerHTML = fullMessage.body;
                                    const serverText = tempDiv.textContent.trim();

                                    return bubbleText === serverText;
                                });

                                if (optimistic) {
                                    optimistic.dataset.messageId = fullMessage.messageID;
                                    optimistic.querySelector('.message-text').innerHTML = fullMessage.body;
                                    const timestampEl = optimistic.querySelector('.message-time');
                                    if (timestampEl) {
                                        timestampEl.textContent = fullMessage.timestamp;
                                    }
                                }
                            }
                        }

                        addMessageToWindow(windowEl, fullMessage);
                    } catch (error) {
                        const fullMessage = { ...meta, body: '...' };
                        addMessageToWindow(windowEl, fullMessage);
                    }
                }

                const container = windowEl.querySelector('.conv-messages-container');
                if (container) {
                    const bubbles = Array.from(container.querySelectorAll('.message-bubble'));
                    bubbles.sort((a, b) => {
                        const timeA = parseTimestamp(a.querySelector('.message-time').textContent);
                        const timeB = parseTimestamp(b.querySelector('.message-time').textContent);
                        if (timeA === timeB) {
                             return parseInt(a.dataset.messageId) - parseInt(b.dataset.messageId);
                        }
                        return timeA - timeB;
                    });
                    bubbles.forEach(b => container.appendChild(b));
                    container.scrollTop = container.scrollHeight;
                }
     
            } catch (error) {
            }
        }
     
        function monitorGlobalUnreadCounter() {
            const getIconElement = () => {
                const zone = document.getElementById('zone_messagerie');
                if (!zone) return null;
                return zone.querySelector('.grid-title .icon');
            };
     
            const getBadgeElement = () => {
                const icon = getIconElement();
                if (!icon) return null;
                return icon.querySelector('.nbrmessage');
            };
     
            let hasUnreadMessage = false;
            let lastBadgeText = '';
            let knownNewConversations = new Set();
     
            const checkInitialState = () => {
                const icon = getIconElement();
                const badge = getBadgeElement();
     
                if (icon) {
                    hasUnreadMessage = icon.classList.contains('red');
                    lastBadgeText = badge?.textContent || '';
                }
     
                const content = document.querySelector('#liste_messages .content ul');
                if (content) {
                    content.querySelectorAll('li.message.new').forEach(li => {
                        const convId = li.id.replace('message_', '');
                        knownNewConversations.add(convId);
                    });
                }
            };
     
            setTimeout(checkInitialState, 500);
     
            let badgeThrottleTimer = null;
            const badgeObserver = new MutationObserver((mutations) => {
                if (badgeThrottleTimer) return;
                badgeThrottleTimer = setTimeout(() => { badgeThrottleTimer = null; }, 400);
                const currentIcon = getIconElement();
                const currentBadge = getBadgeElement();
     
                if (!currentIcon) return;
     
                const currentlyHasUnread = currentIcon.classList.contains('red');
                const currentBadgeText = currentBadge?.textContent || '';
     
                if (currentlyHasUnread !== hasUnreadMessage || currentBadgeText !== lastBadgeText) {
                    const oldCount = parseInt(lastBadgeText) || 0;
                    const newCount = parseInt(currentBadgeText) || 0;
     
                    hasUnreadMessage = currentlyHasUnread;
                    lastBadgeText = currentBadgeText;
                }
            });
     
            let conversationThrottleTimer = null;
            const conversationObserver = new MutationObserver((mutations) => {
                if (conversationThrottleTimer) return;
                conversationThrottleTimer = setTimeout(() => { conversationThrottleTimer = null; }, 400);
     
                const content = document.querySelector('#liste_messages .content ul');
                if (!content) return;
     
                const currentNewConversations = new Set();
                content.querySelectorAll('li.message.new').forEach(li => {
                    const convId = li.id.replace('message_', '');
                    currentNewConversations.add(convId);
     
                });
     
                knownNewConversations = currentNewConversations;
            });
     
            const zone = document.getElementById('zone_messagerie');
            if (zone) {
                const iconTarget = zone.querySelector('.grid-title .icon');
                if (iconTarget) {
                    badgeObserver.observe(iconTarget, {
                        attributes: true,
                        attributeFilter: ['class'],
                        childList: true,
                        characterData: true
                    });
                }
            } else {
                setTimeout(monitorGlobalUnreadCounter, 1000);
                return;
            }
     
            const listContainer = document.querySelector('#liste_messages .content ul');
            if (listContainer) {
                conversationObserver.observe(listContainer, {
                    attributes: true,
                    attributeFilter: ['class'],
                    subtree: false,
                    childList: true
                });
            }
            
            STATE.observers.set('globalUnreadBadge', badgeObserver);
            STATE.observers.set('globalUnreadConversations', conversationObserver);
        }
     
        async function clearMutedConversationNotification(conversationID, folderID) {
            try {
     
                const uiState = captureUIState();
     
                await ensureMessageMenuOpen();
                await navigateToFolder(folderID);
     
                let messageElement = document.querySelector(`#message_${conversationID}`);
                if (!messageElement) {
                    await restoreUIState(uiState);
                    return;
                }
     
                const hideStyle = document.createElement('style');
                hideStyle.id = 'temp-hide-messaging';
                hideStyle.textContent = `
                    .modern-conversation-window,
                    div[id^="db_message_"] {
                        display: none !important;
                    }
                `;
                document.head.appendChild(hideStyle);
     
                STATE.programmaticClick = true;
     
                messageElement.click();
                await sleep(200);
     
                messageElement.click();
                await sleep(CONFIG.CLOSE_DELAY);
     
                STATE.programmaticClick = false;
     
                hideStyle.remove();
     
                await restoreUIState(uiState);
     
            } catch (error) {
                STATE.programmaticClick = false;
                const hideStyle = document.getElementById('temp-hide-messaging');
                if (hideStyle) hideStyle.remove();
            }
        }
     
        async function restoreFolder(folderId) {
            try {
                await navigateToFolder(folderId);
            } catch (error) {
            }
        }
     
        async function clearAllMutedConversationsOnStartup() {
            await sleep(1500);
     
            if (STATE.mutedConversations.size === 0) return;
     
            try {
                const messageMenuBtn = document.querySelector('#display_messagerie');
                if (!messageMenuBtn) {
                    return;
                }
     
                const wasMenuClosed = !messageMenuBtn.classList.contains('selected');
                if (wasMenuClosed) {
                    messageMenuBtn.click();
                    await sleep(CONFIG.OPEN_MENU_DELAY);
                }
     
                const folderList = document.querySelectorAll('#folder_list li.folder');
                const foldersToScan = [];
     
                folderList.forEach(folderLi => {
                    const match = folderLi.id.match(STATE.regex.folderID);
                    const folderId = match ? parseInt(match[1], 10) : NaN;
                    if (!isNaN(folderId) && folderId !== CONFIG.SENT_FOLDER_ID) {
                        foldersToScan.push(folderId);
                    }
                });
     
                const initialFolderEl = document.querySelector('#current_folder');
                const initialFolderId = initialFolderEl ? parseInt(initialFolderEl.dataset.id, 10) : CONFIG.INBOX_FOLDER_ID;
     
                const mutedFound = new Map();
     
                for (const folderId of foldersToScan) {
                    await navigateToFolder(folderId);
     
                    const messageList = document.querySelectorAll('#liste_messages li.message.new[id^="message_"]');
                    for (const messageItem of messageList) {
                        const match = messageItem.id.match(STATE.regex.messageID);
                        if (match) {
                            const convId = parseInt(match[1], 10);
                            if (STATE.mutedConversations.has(convId)) {
                                mutedFound.set(convId, folderId);
                                STATE.conversationFolders.set(convId, folderId);
                            }
                        }
                    }
                }
     
                if (mutedFound.size > 0) {
                    const hideStyle = document.createElement('style');
                    hideStyle.id = 'temp-hide-messaging-startup';
                    hideStyle.textContent = `
                        .modern-conversation-window,
                        div[id^="db_message_"] {
                            display: none !important;
                        }
                    `;
                    document.head.appendChild(hideStyle);
     
                    STATE.programmaticClick = true;
     
                    for (const [convId, folderId] of mutedFound.entries()) {
                        await navigateToFolder(folderId);
     
                        const messageElement = document.querySelector(`#message_${convId}`);
                        if (messageElement) {
                            messageElement.click();
                            await sleep(150);
                            messageElement.click();
                            await sleep(150);
                        }
                    }
     
                    STATE.programmaticClick = false;
     
                    hideStyle.remove();
                }
     
                await restoreFolder(initialFolderId);
     
                if (wasMenuClosed && messageMenuBtn) {
                    messageMenuBtn.click();
                }
     
            } catch (error) {
                STATE.programmaticClick = false;
            }
        }
     
        function hideOriginalMessagingUI() {
            const hideStyles = document.createElement('style');
            hideStyles.id = 'live-msg-hide-original';
            hideStyles.textContent = `
                div[id^="db_message_"] {
                    display: none !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                }
                
                div[id^="db_message_"].ddm-show-original {
                    display: block !important;
                    visibility: visible !important;
                    pointer-events: auto !important;
                }
            `;

            document.head.appendChild(hideStyles);
        }        function createPreviewWindow() {
            const existingPreview = document.getElementById('ddm-preview-window');
            if (existingPreview) return existingPreview;
     
            const previewWindow = document.createElement('div');
            previewWindow.id = 'ddm-preview-window';
            previewWindow.className = 'modern-conversation-window ddm-preview';
            previewWindow.style.cssText = `
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: ${STATE.userOptions.accessibility.defaultWindowWidth}px;
                height: ${STATE.userOptions.accessibility.defaultWindowHeight}px;
                z-index: 200001;
            `;
     
            previewWindow.innerHTML = `
                <div class="conv-window-header">
                    <img class="conv-header-avatar" src="https://www.dreadcast.net/images/avatars/Preview.png" alt="Preview" onerror="this.style.display='none'">
                    <div class="conv-header-text">
                        <div class="conv-header-title">Prévisualisation</div>
                        <div class="conv-header-subtitle">Redimensionnez cette fenêtre à votre convenance</div>
                    </div>
                    <button class="conv-close-btn ddm-preview-close">&times;</button>
                </div>
                <div class="conv-messages-container">
                    <div class="message-bubble received">
                        <div class="avatar-container">
                            <img class="message-avatar" src="https://www.dreadcast.net/images/avatars/User1.png" alt="User1" onerror="this.style.display='none'">
                        </div>
                        <div class="message-content">
                            <div class="message-sender">Utilisateur 1</div>
                            <div class="message-text" style="font-size: ${STATE.userOptions.accessibility.fontSize}px; color: ${STATE.userOptions.accessibility.textColor};">Ceci est un exemple de message reçu. Vous pouvez ajuster la taille et la couleur du texte.</div>
                            <div class="message-time">12:34 03/12/25</div>
                        </div>
                    </div>
                    <div class="message-bubble sent">
                        <div class="avatar-container">
                            <img class="message-avatar" src="https://www.dreadcast.net/images/avatars/You.png" alt="You" onerror="this.style.display='none'">
                        </div>
                        <div class="message-content">
                            <div class="message-sender">Vous</div>
                            <div class="message-text" style="font-size: ${STATE.userOptions.accessibility.fontSize}px; color: ${STATE.userOptions.accessibility.textColor};">Ceci est un exemple de message envoyé. Les modifications s'appliquent en temps réel.</div>
                            <div class="message-time">12:35 03/12/25</div>
                        </div>
                    </div>
                </div>
                <div class="conv-input-container">
                    <textarea class="conv-input" placeholder="Prévisualisation..." rows="1" disabled></textarea>
                    <button class="conv-send-btn" disabled>
                        <span class="send-icon">▶</span>
                    </button>
                </div>
                <div class="conv-resize-handle"></div>
            `;
     
            document.body.appendChild(previewWindow);
     
            setupWindowDragging(previewWindow);
            setupWindowResizing(previewWindow);
     
            const closeBtn = previewWindow.querySelector('.ddm-preview-close');
            closeBtn.addEventListener('click', () => {
                const width = previewWindow.offsetWidth;
                const height = previewWindow.offsetHeight;
     
                STATE.userOptions.accessibility.defaultWindowWidth = width;
                STATE.userOptions.accessibility.defaultWindowHeight = height;
                saveUserOptions();
     
                previewWindow.remove();
            });
     
            return previewWindow;
        }
     
        function removePreviewWindow() {
            const preview = document.getElementById('ddm-preview-window');
            if (preview) preview.remove();
        }
     
        function updatePreviewWindow(updates) {
            const preview = document.getElementById('ddm-preview-window');
            if (!preview) return;
     
            if (updates.fontSize !== undefined || updates.textColor !== undefined) {
                const messages = preview.querySelectorAll('.message-text');
                messages.forEach(msg => {
                    if (updates.fontSize !== undefined) {
                        msg.style.fontSize = `${updates.fontSize}px`;
                    }
                    if (updates.textColor !== undefined) {
                        msg.style.color = updates.textColor;
                    }
                });
            }
     
            if (updates.width !== undefined) {
                preview.style.width = `${updates.width}px`;
            }
            if (updates.height !== undefined) {
                preview.style.height = `${updates.height}px`;
            }
        }
     
        function createOptionsModal() {
            const existingModal = document.getElementById('ddm-options-modal');
            if (existingModal) {
                existingModal.style.display = 'flex';
                return;
            }
     
            const modal = document.createElement('div');
            modal.id = 'ddm-options-modal';
            modal.className = 'ddm-options-modal';
            modal.innerHTML = `
                <div class="ddm-options-content">
                    <div class="ddm-options-header">
                        <h2>Options DDM</h2>
                        <button class="ddm-options-close" title="Fermer">&times;</button>
                    </div>
                    <div class="ddm-options-body">
                        <div class="ddm-options-tabs">
                            <button class="ddm-tab-btn active" data-tab="theme">
                                <span>Thème</span>
                            </button>
                            <button class="ddm-tab-btn" data-tab="accessibility">
                                <span>Accessibilité</span>
                            </button>
                            <button class="ddm-tab-btn" data-tab="sounds">
                                <span>Sons</span>
                            </button>
                            <button class="ddm-tab-btn" data-tab="header">
                                <span>Entête</span>
                            </button>
                        </div>
                        <div class="ddm-options-panels">
                            <div class="ddm-panel active" data-panel="theme">
                                <div class="ddm-option-group">
                                    <label for="primary-color">
                                        <span class="label-text">Couleur primaire</span>
                                        <span class="label-desc">Couleur de fond principale</span>
                                    </label>
                                    <div class="ddm-color-input-group">
                                        <input type="color" id="primary-color" value="${STATE.userOptions.theme.primaryColor}">
                                        <input type="text" id="primary-color-text" value="${STATE.userOptions.theme.primaryColor}" placeholder="#000000">
                                    </div>
                                </div>
                                <div class="ddm-option-group">
                                    <label for="secondary-color">
                                        <span class="label-text">Couleur secondaire</span>
                                        <span class="label-desc">Couleur d'accent et bordures</span>
                                    </label>
                                    <div class="ddm-color-input-group">
                                        <input type="color" id="secondary-color" value="${STATE.userOptions.theme.secondaryColor}">
                                        <input type="text" id="secondary-color-text" value="${STATE.userOptions.theme.secondaryColor}" placeholder="#00d9ff">
                                    </div>
                                </div>
                                <button class="ddm-reset-btn" data-reset="theme">↻ Réinitialiser</button>
                            </div>
                            <div class="ddm-panel" data-panel="accessibility">
                                <div class="ddm-text-preview">
                                    <div class="preview-label">Aperçu en temps réel</div>
                                    <div class="preview-bubble">
                                        <div class="preview-text" style="font-size: ${STATE.userOptions.accessibility.fontSize}px; color: ${STATE.userOptions.accessibility.textColor};">Exemple de texte de message</div>
                                    </div>
                                </div>
                                <div class="ddm-option-group">
                                    <label for="font-size">
                                        <span class="label-text">Taille de police</span>
                                        <span class="label-desc">Ajustez la taille du texte des messages</span>
                                    </label>
                                    <div class="ddm-slider-group">
                                        <input type="range" id="font-size" min="12" max="28" value="${STATE.userOptions.accessibility.fontSize}">
                                        <span class="ddm-slider-value">${STATE.userOptions.accessibility.fontSize}px</span>
                                    </div>
                                </div>
                                <div class="ddm-option-group">
                                    <label for="text-color">
                                        <span class="label-text">Couleur du texte</span>
                                        <span class="label-desc">Couleur du texte des messages</span>
                                    </label>
                                    <div class="ddm-color-input-group">
                                        <input type="color" id="text-color" value="${STATE.userOptions.accessibility.textColor}">
                                        <input type="text" id="text-color-text" value="${STATE.userOptions.accessibility.textColor}" placeholder="#ffffff">
                                    </div>
                                </div>
                                <div class="ddm-separator"></div>
                                <div class="ddm-option-group">
                                    <label>
                                        <span class="label-text">Taille par défaut des fenêtres</span>
                                        <span class="label-desc">Ouvrez une prévisualisation pour ajuster la taille. Les modifications sont sauvegardées automatiquement.</span>
                                    </label>
                                    <button class="ddm-preview-window-btn">Ajuster la taille</button>
                                </div>
                                <div class="ddm-separator"></div>
                                <div class="ddm-option-group">
                                    <div class="ddm-option-header">
                                        <div>
                                            <label>
                                                <span class="label-text">Mode Performance (PC Lents)</span>
                                                <span class="label-desc">Désactive les animations, les ombres et les effets de transparence pour améliorer la fluidité.</span>
                                            </label>
                                        </div>
                                        <label class="ddm-toggle-switch">
                                            <input type="checkbox" id="performance-mode" ${STATE.userOptions?.accessibility?.performanceMode ? 'checked' : ''}>
                                            <span class="ddm-toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="ddm-separator"></div>
                                <div class="ddm-option-group">
                                    <div class="ddm-option-header">
                                        <div>
                                            <label>
                                                <span class="label-text">DDM secondaire</span>
                                                <span class="label-desc">Par défaut : clic normal = fenêtre custom • CTRL+clic = fenêtre originale<br>Activé : clic normal = fenêtre originale • CTRL+clic = fenêtre custom</span>
                                            </label>
                                        </div>
                                        <label class="ddm-toggle-switch">
                                            <input type="checkbox" id="secondary-ddm" ${STATE.userOptions?.accessibility?.secondaryDDM ? 'checked' : ''}>
                                            <span class="ddm-toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="ddm-separator"></div>
                                <div class="ddm-option-group">
                                    <div class="ddm-option-header">
                                        <div>
                                            <label>
                                                <span class="label-text">Désac. envoi rapide</span>
                                                <span class="label-desc">Activé : Empêche l'envoi avec ENTER (retour à la ligne)<br>Désactivé : Envoi avec ENTER</span>
                                            </label>
                                        </div>
                                        <label class="ddm-toggle-switch">
                                            <input type="checkbox" id="disable-quick-send" ${STATE.userOptions?.accessibility?.disableQuickSend ? 'checked' : ''}>
                                            <span class="ddm-toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="ddm-option-group">
                                    <div class="ddm-option-header">
                                        <div>
                                            <label>
                                                <span class="label-text">Entête ouvert par défaut</span>
                                                <span class="label-desc">Activé : Le volet d'entête est toujours ouvert et la flèche est masquée<br>Désactivé : Le volet s'ouvre au clic sur la flèche</span>
                                            </label>
                                        </div>
                                        <label class="ddm-toggle-switch">
                                            <input type="checkbox" id="default-open-drawer" ${STATE.userOptions?.accessibility?.defaultOpenDrawer ? 'checked' : ''}>
                                            <span class="ddm-toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                <button class="ddm-reset-btn" data-reset="accessibility">↻ Réinitialiser</button>
                            </div>
                            <div class="ddm-panel" data-panel="sounds">
                                <div class="ddm-option-group">
                                    <div class="ddm-option-header">
                                        <label>
                                            <span class="label-text">Activer les sons</span>
                                            <span class="label-desc">Sons de notification pour les nouveaux messages</span>
                                        </label>
                                        <label class="ddm-toggle-switch">
                                            <input type="checkbox" id="sounds-enabled" ${STATE.userOptions?.sounds?.enabled ? 'checked' : ''}>
                                            <span class="ddm-toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="ddm-separator"></div>
                                <div class="ddm-option-group">
                                    <label for="open-conv-sound">
                                        <span class="label-text">Son - Conversation ouverte</span>
                                        <span class="label-desc">Joué quand un message arrive dans une conversation déjà ouverte</span>
                                    </label>
                                    <input type="text" id="open-conv-sound" class="ddm-url-input" value="${STATE.userOptions?.sounds?.openConversationUrl || CONFIG.OPTIONS.DEFAULTS.sounds.openConversationUrl}" placeholder="https://exemple.com/son.mp3">
                                    <div class="ddm-sound-controls">
                                        <button class="ddm-preview-sound-btn" data-sound-type="open">▶ Tester</button>
                                        <div class="ddm-slider-group">
                                            <span class="ddm-slider-label">Volume</span>
                                            <input type="range" id="open-conv-volume" min="0" max="1" step="0.01" value="${STATE.userOptions?.sounds?.openConversationVolume || CONFIG.OPTIONS.DEFAULTS.sounds.openConversationVolume}">
                                            <span class="ddm-slider-value">${Math.round((STATE.userOptions?.sounds?.openConversationVolume || CONFIG.OPTIONS.DEFAULTS.sounds.openConversationVolume) * 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="ddm-separator"></div>
                                <div class="ddm-option-group">
                                    <label for="closed-conv-sound">
                                        <span class="label-text">Son - Conversation fermée</span>
                                        <span class="label-desc">Joué quand un message arrive dans une conversation non ouverte</span>
                                    </label>
                                    <input type="text" id="closed-conv-sound" class="ddm-url-input" value="${STATE.userOptions?.sounds?.closedConversationUrl || CONFIG.OPTIONS.DEFAULTS.sounds.closedConversationUrl}" placeholder="https://exemple.com/son.mp3">
                                    <div class="ddm-sound-controls">
                                        <button class="ddm-preview-sound-btn" data-sound-type="closed">▶ Tester</button>
                                        <div class="ddm-slider-group">
                                            <span class="ddm-slider-label">Volume</span>
                                            <input type="range" id="closed-conv-volume" min="0" max="1" step="0.01" value="${STATE.userOptions?.sounds?.closedConversationVolume || CONFIG.OPTIONS.DEFAULTS.sounds.closedConversationVolume}">
                                            <span class="ddm-slider-value">${Math.round((STATE.userOptions?.sounds?.closedConversationVolume || CONFIG.OPTIONS.DEFAULTS.sounds.closedConversationVolume) * 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                                <button class="ddm-reset-btn" data-reset="sounds">↻ Réinitialiser</button>
                            </div>
                            <div class="ddm-panel" data-panel="header">
                                <div class="ddm-option-group">
                                    <label>
                                        <span class="label-text">Actions Rapides (Boutons)</span>
                                        <span class="label-desc">Personnalisez le texte inséré par les boutons d'action rapide.</span>
                                    </label>
                                    <div id="quick-actions-list" style="display: flex; flex-direction: column; gap: 10px;">
                                        <!-- Generated via JS -->
                                    </div>
                                </div>
                                <div class="ddm-separator"></div>
                                <div class="ddm-option-group">
                                    <label>
                                        <span class="label-text">Entêtes (Menu Déroulant)</span>
                                        <span class="label-desc">Gérez les entêtes disponibles dans le menu déroulant.</span>
                                    </label>
                                    <div id="headers-list" style="display: flex; flex-direction: column; gap: 10px;">
                                        <!-- Generated via JS -->
                                    </div>
                                    <button id="add-header-btn" class="ddm-reset-btn" style="margin-top: 10px; width: 100%;">+ Ajouter une entête</button>
                                </div>
                                <button class="ddm-reset-btn" data-reset="header">↻ Réinitialiser tout</button>
                            </div>
                        </div>
                    </div>
                    <div class="ddm-options-footer">
                        <button class="ddm-save-btn">Enregistrer</button>
                        <button class="ddm-cancel-btn">Annuler</button>
                    </div>
                </div>
            `;
     
            document.body.appendChild(modal);
            setupOptionsModalEvents(modal);
        }

        function renderHeaderOptions(modal) {
            const quickActionsList = modal.querySelector('#quick-actions-list');
            const headersList = modal.querySelector('#headers-list');
            
            if (!quickActionsList || !headersList) return;
            
            quickActionsList.innerHTML = '';
            const activeActions = STATE.userOptions.comback.activeQuickActions;
            
            activeActions.forEach(actionId => {
                const action = STATE.userOptions.comback.quickActions[actionId];
                if (!action) return;
                
                const row = document.createElement('div');
                row.className = 'ddm-color-input-group';
                row.style.alignItems = 'center';
                row.innerHTML = `
                    <div style="font-size: 24px; width: 40px; text-align: center;">${action.icon}</div>
                    <input type="text" class="quick-action-input" data-id="${actionId}" value="${action.label}" placeholder="Description">
                    <button class="ddm-reset-btn" style="margin: 0; padding: 8px 12px;" title="Réinitialiser" onclick="this.previousElementSibling.value = '${action.defaultLabel}'">↻</button>
                `;
                quickActionsList.appendChild(row);
            });

            headersList.innerHTML = '';
            STATE.userOptions.comback.headers.forEach((header, index) => {
                const row = document.createElement('div');
                row.className = 'ddm-color-input-group header-row';
                row.dataset.id = header.id;
                row.style.alignItems = 'center';
                row.innerHTML = `
                    <input type="text" class="header-icon-input" value="${header.icon}" style="width: 50px; text-align: center;" placeholder="Icone">
                    <input type="text" class="header-label-input" value="${header.label}" placeholder="Libellé">
                    <button class="ddm-reset-btn" style="margin: 0; padding: 8px 12px; color: #ff4444; border-color: #ff4444;" title="Supprimer" onclick="this.parentElement.remove()">✖</button>
                `;
                headersList.appendChild(row);
            });
        }
     
        function setupOptionsModalEvents(modal) {
            renderHeaderOptions(modal);

            const closeBtn = modal.querySelector('.ddm-options-close');
            const cancelBtn = modal.querySelector('.ddm-cancel-btn');
            const saveBtn = modal.querySelector('.ddm-save-btn');
            const tabBtns = modal.querySelectorAll('.ddm-tab-btn');
            const resetBtns = modal.querySelectorAll('.ddm-reset-btn');
     
            const closeModal = () => {
                modal.style.display = 'none';
                removePreviewWindow();
            };
     
            closeBtn.addEventListener('click', closeModal);
            cancelBtn.addEventListener('click', closeModal);
     
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
     
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabName = btn.dataset.tab;
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
     
                    const panels = modal.querySelectorAll('.ddm-panel');
                    panels.forEach(p => p.classList.remove('active'));
                    modal.querySelector(`[data-panel="${tabName}"]`).classList.add('active');
                });
            });
     
            const primaryColorInput = modal.querySelector('#primary-color');
            const primaryColorText = modal.querySelector('#primary-color-text');
            const secondaryColorInput = modal.querySelector('#secondary-color');
            const secondaryColorText = modal.querySelector('#secondary-color-text');
            const textColorInput = modal.querySelector('#text-color');
            const textColorText = modal.querySelector('#text-color-text');
            const fontSizeInput = modal.querySelector('#font-size');
            const fontSizeValue = modal.querySelector('.ddm-slider-value');
     
            primaryColorInput.addEventListener('input', (e) => {
                primaryColorText.value = e.target.value;
            });
     
            primaryColorText.addEventListener('input', (e) => {
                if (STATE.regex.hexColor.test(e.target.value)) {
                    primaryColorInput.value = e.target.value;
                }
            });
     
            secondaryColorInput.addEventListener('input', (e) => {
                secondaryColorText.value = e.target.value;
            });
     
            secondaryColorText.addEventListener('input', (e) => {
                if (STATE.regex.hexColor.test(e.target.value)) {
                    secondaryColorInput.value = e.target.value;
                }
            });
     
            textColorInput.addEventListener('input', (e) => {
                const color = e.target.value;
                textColorText.value = color;
                const previewText = modal.querySelector('.preview-text');
                if (previewText) {
                    previewText.style.color = color;
                }
                updatePreviewWindow({ textColor: color });
            });
     
            textColorText.addEventListener('input', (e) => {
                if (STATE.regex.hexColor.test(e.target.value)) {
                    textColorInput.value = e.target.value;
                    const previewText = modal.querySelector('.preview-text');
                    if (previewText) {
                        previewText.style.color = e.target.value;
                    }
                    updatePreviewWindow({ textColor: e.target.value });
                }
            });
     
            fontSizeInput.addEventListener('input', (e) => {
                const size = e.target.value;
                fontSizeValue.textContent = `${size}px`;
                const previewText = modal.querySelector('.preview-text');
                if (previewText) {
                    previewText.style.fontSize = `${size}px`;
                }
                updatePreviewWindow({ fontSize: parseInt(size) });
            });
     
            const previewWindowBtn = modal.querySelector('.ddm-preview-window-btn');
     
            if (previewWindowBtn) {
                previewWindowBtn.addEventListener('click', () => {
                    createPreviewWindow();
                    updatePreviewWindow({
                        fontSize: parseInt(fontSizeInput.value),
                        textColor: textColorInput.value
                    });
                });
            }
     
            const addHeaderBtn = modal.querySelector('#add-header-btn');
            if (addHeaderBtn) {
                addHeaderBtn.addEventListener('click', () => {
                    const headersList = modal.querySelector('#headers-list');
                    const row = document.createElement('div');
                    row.className = 'ddm-color-input-group header-row';
                    row.style.alignItems = 'center';
                    row.innerHTML = `
                        <input type="text" class="header-icon-input" value="❓" style="width: 50px; text-align: center;" placeholder="Icone">
                        <input type="text" class="header-label-input" value="Nouvelle entête" placeholder="Libellé">
                        <button class="ddm-reset-btn" style="margin: 0; padding: 8px 12px; color: #ff4444; border-color: #ff4444;" title="Supprimer" onclick="this.parentElement.remove()">✖</button>
                    `;
                    headersList.appendChild(row);
                });
            }

            resetBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const section = btn.dataset.reset;
                    if (section === 'theme') {
                        primaryColorInput.value = CONFIG.OPTIONS.DEFAULTS.theme.primaryColor;
                        primaryColorText.value = CONFIG.OPTIONS.DEFAULTS.theme.primaryColor;
                        secondaryColorInput.value = CONFIG.OPTIONS.DEFAULTS.theme.secondaryColor;
                        secondaryColorText.value = CONFIG.OPTIONS.DEFAULTS.theme.secondaryColor;
                    } else if (section === 'accessibility') {
                        fontSizeInput.value = CONFIG.OPTIONS.DEFAULTS.accessibility.fontSize;
                        fontSizeValue.textContent = `${CONFIG.OPTIONS.DEFAULTS.accessibility.fontSize}px`;
                        textColorInput.value = CONFIG.OPTIONS.DEFAULTS.accessibility.textColor;
                        textColorText.value = CONFIG.OPTIONS.DEFAULTS.accessibility.textColor;

                        const performanceModeToggle = modal.querySelector('#performance-mode');
                        if (performanceModeToggle) {
                            performanceModeToggle.checked = CONFIG.OPTIONS.DEFAULTS.accessibility.performanceMode;
                        }
     
                        const secondaryDDMToggle = modal.querySelector('#secondary-ddm');
                        if (secondaryDDMToggle) {
                            secondaryDDMToggle.checked = CONFIG.OPTIONS.DEFAULTS.accessibility.secondaryDDM;
                        }

                        const disableQuickSendToggle = modal.querySelector('#disable-quick-send');
                        if (disableQuickSendToggle) {
                            disableQuickSendToggle.checked = CONFIG.OPTIONS.DEFAULTS.accessibility.disableQuickSend;
                        }

                        const defaultOpenDrawerToggle = modal.querySelector('#default-open-drawer');
                        if (defaultOpenDrawerToggle) {
                            defaultOpenDrawerToggle.checked = CONFIG.OPTIONS.DEFAULTS.accessibility.defaultOpenDrawer;
                        }
     
                        STATE.userOptions.accessibility.defaultWindowWidth = CONFIG.OPTIONS.DEFAULTS.accessibility.defaultWindowWidth;
                        STATE.userOptions.accessibility.defaultWindowHeight = CONFIG.OPTIONS.DEFAULTS.accessibility.defaultWindowHeight;
     
                        const previewText = modal.querySelector('.preview-text');
                        if (previewText) {
                            previewText.style.fontSize = `${CONFIG.OPTIONS.DEFAULTS.accessibility.fontSize}px`;
                            previewText.style.color = CONFIG.OPTIONS.DEFAULTS.accessibility.textColor;
                        }
                        updatePreviewWindow({
                            fontSize: CONFIG.OPTIONS.DEFAULTS.accessibility.fontSize,
                            textColor: CONFIG.OPTIONS.DEFAULTS.accessibility.textColor
                        });
                    } else if (section === 'sounds') {
                        if (soundsEnabledToggle) {
                            soundsEnabledToggle.checked = CONFIG.OPTIONS.DEFAULTS.sounds.enabled;
                        }
                        if (openConvSoundInput) {
                            openConvSoundInput.value = CONFIG.OPTIONS.DEFAULTS.sounds.openConversationUrl;
                        }
                        if (closedConvSoundInput) {
                            closedConvSoundInput.value = CONFIG.OPTIONS.DEFAULTS.sounds.closedConversationUrl;
                        }
                        if (openConvVolumeInput && openConvVolumeValue) {
                            openConvVolumeInput.value = CONFIG.OPTIONS.DEFAULTS.sounds.openConversationVolume;
                            openConvVolumeValue.textContent = `${Math.round(CONFIG.OPTIONS.DEFAULTS.sounds.openConversationVolume * 100)}%`;
                        }
                        if (closedConvVolumeInput && closedConvVolumeValue) {
                            closedConvVolumeInput.value = CONFIG.OPTIONS.DEFAULTS.sounds.closedConversationVolume;
                            closedConvVolumeValue.textContent = `${Math.round(CONFIG.OPTIONS.DEFAULTS.sounds.closedConversationVolume * 100)}%`;
                        }
                    } else if (section === 'header') {
                        STATE.userOptions.comback = JSON.parse(JSON.stringify(CONFIG.OPTIONS.DEFAULTS.comback));
                        renderHeaderOptions(modal);
                    }
                });
            });
     
            const soundsEnabledToggle = modal.querySelector('#sounds-enabled');
            if (soundsEnabledToggle) {
                soundsEnabledToggle.addEventListener('change', (e) => {
                    const soundsPanel = modal.querySelector('[data-panel="sounds"]');
                    if (soundsPanel) {
                        const controls = soundsPanel.querySelectorAll('.ddm-url-input, .ddm-preview-sound-btn, input[type="range"]');
                        controls.forEach(ctrl => {
                            ctrl.disabled = !e.target.checked;
                        });
                    }
                });
            }
     
            const openConvSoundInput = modal.querySelector('#open-conv-sound');
            const closedConvSoundInput = modal.querySelector('#closed-conv-sound');
     
            const openConvVolumeInput = modal.querySelector('#open-conv-volume');
            const openConvVolumeValue = openConvVolumeInput?.nextElementSibling;
            const closedConvVolumeInput = modal.querySelector('#closed-conv-volume');
            const closedConvVolumeValue = closedConvVolumeInput?.nextElementSibling;
     
            if (openConvVolumeInput && openConvVolumeValue) {
                openConvVolumeInput.addEventListener('input', (e) => {
                    const volume = parseFloat(e.target.value);
                    openConvVolumeValue.textContent = `${Math.round(volume * 100)}%`;
                });
            }
     
            if (closedConvVolumeInput && closedConvVolumeValue) {
                closedConvVolumeInput.addEventListener('input', (e) => {
                    const volume = parseFloat(e.target.value);
                    closedConvVolumeValue.textContent = `${Math.round(volume * 100)}%`;
                });
            }
     
            const previewBtns = modal.querySelectorAll('.ddm-preview-sound-btn');
            previewBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const soundType = btn.dataset.soundType;
                    if (soundType === 'open' && openConvSoundInput && openConvVolumeInput) {
                        const url = openConvSoundInput.value.trim();
                        const volume = parseFloat(openConvVolumeInput.value);
                        if (url) {
                            SoundManager.playSound(url, volume);
                        }
                    } else if (soundType === 'closed' && closedConvSoundInput && closedConvVolumeInput) {
                        const url = closedConvSoundInput.value.trim();
                        const volume = parseFloat(closedConvVolumeInput.value);
                        if (url) {
                            SoundManager.playSound(url, volume);
                        }
                    }
                });
            });
     
            saveBtn.addEventListener('click', () => {
                STATE.userOptions.theme.primaryColor = primaryColorInput.value;
                STATE.userOptions.theme.secondaryColor = secondaryColorInput.value;
                STATE.userOptions.accessibility.fontSize = parseInt(fontSizeInput.value);
                STATE.userOptions.accessibility.textColor = textColorInput.value;

                const quickActionInputs = modal.querySelectorAll('.quick-action-input');
                quickActionInputs.forEach(input => {
                    const id = input.dataset.id;
                    if (STATE.userOptions.comback.quickActions[id]) {
                        STATE.userOptions.comback.quickActions[id].label = input.value;
                    }
                });

                const headerRows = modal.querySelectorAll('.header-row');
                const newHeaders = [];
                headerRows.forEach(row => {
                    const icon = row.querySelector('.header-icon-input').value;
                    const label = row.querySelector('.header-label-input').value;
                    let id = row.dataset.id;
                    
                    if (!id) {
                        id = 'CUST_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
                    }
                    
                    newHeaders.push({ id, icon, label });
                });
                STATE.userOptions.comback.headers = newHeaders;

                const performanceModeToggle = modal.querySelector('#performance-mode');
                if (performanceModeToggle) {
                    STATE.userOptions.accessibility.performanceMode = performanceModeToggle.checked;
                }
     
                const secondaryDDMToggle = modal.querySelector('#secondary-ddm');
                if (secondaryDDMToggle) {
                    STATE.userOptions.accessibility.secondaryDDM = secondaryDDMToggle.checked;
                }

                const disableQuickSendToggle = modal.querySelector('#disable-quick-send');
                if (disableQuickSendToggle) {
                    STATE.userOptions.accessibility.disableQuickSend = disableQuickSendToggle.checked;
                }

                const defaultOpenDrawerToggle = modal.querySelector('#default-open-drawer');
                if (defaultOpenDrawerToggle) {
                    STATE.userOptions.accessibility.defaultOpenDrawer = defaultOpenDrawerToggle.checked;
                }
     
                if (!STATE.userOptions.sounds) {
                    STATE.userOptions.sounds = JSON.parse(JSON.stringify(CONFIG.OPTIONS.DEFAULTS.sounds));
                }
     
                if (soundsEnabledToggle) {
                    STATE.userOptions.sounds.enabled = soundsEnabledToggle.checked;
                }
                if (openConvSoundInput) {
                    STATE.userOptions.sounds.openConversationUrl = openConvSoundInput.value.trim();
                }
                if (closedConvSoundInput) {
                    STATE.userOptions.sounds.closedConversationUrl = closedConvSoundInput.value.trim();
                }
                if (openConvVolumeInput) {
                    STATE.userOptions.sounds.openConversationVolume = parseFloat(openConvVolumeInput.value);
                }
                if (closedConvVolumeInput) {
                    STATE.userOptions.sounds.closedConversationVolume = parseFloat(closedConvVolumeInput.value);
                }
     
                SoundManager.preloadUserSounds();
     
                saveUserOptions();
                removePreviewWindow();
                closeModal();
            });
        }

        function getTextWidth(text, font) {
            const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
            const context = canvas.getContext("2d");
            context.font = font;
            const metrics = context.measureText(text);
            return metrics.width;
        }

        function makeBanner(CR_before, headerId, CR_after, isHeader) {
            const header = STATE.userOptions.comback.headers.find(h => h.id === headerId);
            if (!header) return "";

            const banner = `【 ${header.icon} - ${header.label} 】`;
            
            if (!isHeader) {
                return "\n".repeat(CR_before) + banner + "\n".repeat(CR_after);
            }

            const bannerWidth = Math.round(getTextWidth(banner, "12px Trebuchet MS"));
            const spaceWidth = Math.round(getTextWidth(" ", "12px Trebuchet MS"));
            const windowsWidth = 300;
            const nbrSpace = Math.floor(((windowsWidth - bannerWidth) / 2) / spaceWidth);
            const space = " ";
            
            return "\n".repeat(CR_before) + space.repeat(Math.max(0, nbrSpace)) + banner + "\n".repeat(CR_after);
        }

        function setupDrawer(windowEl) {
            const toggleBtn = windowEl.querySelector('.conv-drawer-toggle');
            const drawer = windowEl.querySelector('.conv-drawer');
            const headerSelect = windowEl.querySelector('.conv-header-select');
            const actionsContainer = windowEl.querySelector('.conv-drawer-actions');
            const textarea = windowEl.querySelector('.conv-input');

            if (!toggleBtn || !drawer) return;

            // Check default open option
            if (STATE.userOptions.accessibility.defaultOpenDrawer) {
                drawer.style.display = 'flex';
                windowEl.classList.add('drawer-open');
                toggleBtn.style.display = 'none';
            }

            toggleBtn.addEventListener('click', () => {
                const isHidden = drawer.style.display === 'none';
                drawer.style.display = isHidden ? 'flex' : 'none';
                toggleBtn.textContent = isHidden ? '⏶' : '⏷';
                
                if (isHidden) {
                    windowEl.classList.add('drawer-open');
                } else {
                    windowEl.classList.remove('drawer-open');
                }
            });

            STATE.userOptions.comback.headers.forEach(header => {
                const option = document.createElement('option');
                option.value = header.id;
                option.textContent = `${header.icon} - ${header.label}`;
                headerSelect.appendChild(option);
            });

            if (STATE.userOptions.comback.lastHeaderId) {
                headerSelect.value = STATE.userOptions.comback.lastHeaderId;
            }

            headerSelect.addEventListener('change', () => {
                STATE.userOptions.comback.lastHeaderId = headerSelect.value;
                saveUserOptions();
            });

            STATE.userOptions.comback.activeQuickActions.forEach(actionId => {
                const action = STATE.userOptions.comback.quickActions[actionId];
                if (!action) return;

                const btn = document.createElement('button');
                btn.className = 'conv-action-btn';
                btn.title = action.label;
                btn.textContent = action.icon;
                btn.addEventListener('click', () => {
                    const textToInsert = `【 ${action.icon} - ${action.label} 】\n`;
                    const startPos = textarea.selectionStart;
                    const endPos = textarea.selectionEnd;
                    const text = textarea.value;
                    
                    textarea.value = text.substring(0, startPos) + textToInsert + text.substring(endPos);
                    textarea.focus();
                    textarea.selectionStart = textarea.selectionEnd = startPos + textToInsert.length;
                });
                actionsContainer.appendChild(btn);
            });
        }
     
        function createConversationWindowWithLoading(conversationID) {
            let existingWindow = STATE.openConversationWindows.get(conversationID);
            if (existingWindow && document.body.contains(existingWindow)) {
                bringWindowToFront(existingWindow);
                return existingWindow;
            }
     
            const openWindowsCount = STATE.openConversationWindows.size;
            const offset = openWindowsCount > 0 ? openWindowsCount * CONFIG.WINDOW_OFFSET : 0;
     
            const windowWidth = STATE.userOptions?.accessibility?.defaultWindowWidth || CONFIG.INITIAL_WINDOW_WIDTH;
            const windowHeight = STATE.userOptions?.accessibility?.defaultWindowHeight || CONFIG.INITIAL_WINDOW_HEIGHT;
     
            const centerX = (window.innerWidth - windowWidth) / 2 - offset;
            const centerY = (window.innerHeight - windowHeight) / 2 - offset;
     
            const windowEl = document.createElement('div');
            windowEl.className = 'modern-conversation-window';
            windowEl.dataset.conversationId = conversationID;
            windowEl.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                width: ${windowWidth}px;
                height: ${windowHeight}px;
                z-index: ${CONFIG.WINDOW_Z_INDEX_BASE + openWindowsCount};
                overflow: visible;
            `;
     
            windowEl.innerHTML = `
                <div class="conv-window-header">
                    <div class="conv-header-avatar" style="width: 40px; height: 40px; border-radius: 50%; background: #2d3748;"></div>
                    <div class="conv-header-text">
                        <div class="conv-header-title">Chargement...</div>
                        <div class="conv-header-subtitle">Conversation #${conversationID}</div>
                    </div>
                    <button class="conv-expand-btn" title="Options">+</button>
                    <button class="conv-close-btn">&times;</button>
                </div>
                <div class="conv-secondary-panel" style="display: none;">
                    <button class="conv-invite-btn">Inviter</button>
                    <button class="conv-delete-btn">Suppr</button>
                </div>
                <div class="conv-participants-trigger" style="position: absolute; left: -16px; top: 50%; transform: translateY(-50%); width: 16px; height: 40px; background: var(--bg-panel); border: 1px solid var(--border-color); border-right: none; border-radius: 4px 0 0 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; box-shadow: -2px 0 5px rgba(0,0,0,0.2);">
                    <span style="font-size: 12px; color: var(--accent-primary); font-weight: bold;">‹</span>
                </div>
                <div class="conv-participants-panel" style="position: absolute; right: 100%; top: 0; height: 100%; background: var(--bg-primary); width: 0; overflow: hidden; transition: width 0.3s ease; z-index: 5; border: none; border-radius: 8px 0 0 8px; display: flex; flex-direction: column; box-shadow: -5px 0 15px rgba(0,0,0,0.5);">
                    <div style="padding: 10px; font-weight: bold; color: var(--accent-primary); border-bottom: 1px solid var(--border-color); white-space: nowrap; background: var(--bg-secondary); border-radius: 8px 0 0 0;">Participants</div>
                    <div class="participants-list" style="flex: 1; overflow-y: auto; padding: 10px; color: var(--text-primary);"></div>
                </div>
                <div class="conv-messages-container">
                    <div class="loading-placeholder" style="text-align: center; padding: 60px 20px; color: #a0aec0; font-style: italic;">
                        <div>Chargement des messages...</div>
                    </div>
                </div>
                <div class="conv-invite-container" style="display: none;">
                    <input type="text" class="conv-invite-input" placeholder="Écrire le nom des gens à inviter (ex: Jean~1234, Pierre~5678)..." />
                </div>
                <div class="conv-input-container">
                    <textarea class="conv-input" placeholder="Tapez votre message..." rows="1"></textarea>
                    <button class="conv-send-btn">
                        <span class="send-icon">▶</span>
                    </button>
                </div>
                <div class="conv-bottom-extension">
                    <div class="conv-drawer" style="display: none;">
                        <div class="conv-drawer-headers">
                            <select class="conv-header-select">
                                <option value="NONE">Aucune entête</option>
                            </select>
                        </div>
                        <div class="conv-drawer-actions">
                        </div>
                    </div>
                    <button class="conv-drawer-toggle" title="Outils d'insertion">⏷</button>
                </div>
                <div class="conv-resize-handle"></div>
            `;
     
            document.body.appendChild(windowEl);
     
            STATE.openConversationWindows.set(conversationID, windowEl);
     
            setupWindowDragging(windowEl);
            setupWindowResizing(windowEl);
            setupWindowClose(windowEl, conversationID);
            setupExpandButton(windowEl);
            setupInviteButton(windowEl);
            setupDeleteButton(windowEl, conversationID);
            setupMessageSending(windowEl, conversationID);
            setupWindowFocus(windowEl, conversationID);
            setupDrawer(windowEl);
     
            STATE.activeConversationID = conversationID;
     
            let pollAttempts = 0;
            const maxPollAttempts = 30;
            let pollingActive = true;
     
            const pollForData = () => {
                if (!pollingActive) return;
     
                pollAttempts++;
     
                const gameWindow = document.getElementById(`db_message_${conversationID}`);
                if (gameWindow) {
                    pollingActive = false;
     
                    parseConversationDOM(conversationID, 5).then(convData => {
                        if (convData) {
                            updateConversationWindowWithData(conversationID, convData);
                        }
                    });
                    return;
                }
     
                if (pollAttempts < maxPollAttempts) {
                    setTimeout(pollForData, 400);
                } else {
                    if (window.nav?.getMessagerie?.()?.openMessage) {
                        window.nav.getMessagerie().openMessage(conversationID);
                    }
                }
            };
     
            const immediateCheck = document.getElementById(`db_message_${conversationID}`);
            if (immediateCheck) {
                parseConversationDOM(conversationID, 5).then(convData => {
                    if (convData) {
                        updateConversationWindowWithData(conversationID, convData);
                    }
                });
                pollingActive = false;
            } else {
                setTimeout(pollForData, 50);
            }
     
            return windowEl;
        }
     
        function updateConversationWindowWithData(conversationID, conversationData) {
            const windowEl = STATE.openConversationWindows.get(conversationID);
            if (!windowEl || !document.body.contains(windowEl)) {
                return;
            }
     
            if (STATE.loadingTimeouts?.has(conversationID)) {
                clearTimeout(STATE.loadingTimeouts.get(conversationID));
                STATE.loadingTimeouts.delete(conversationID);
            }
     
            const titleMatch = conversationData.title.match(STATE.regex.conversationTitle);
            const sender = titleMatch ? titleMatch[1] : 'Unknown';
            const subject = titleMatch ? titleMatch[2] : conversationData.title;
     
            const headerTitle = windowEl.querySelector('.conv-header-title');
            const headerSubtitle = windowEl.querySelector('.conv-header-subtitle');
            const headerAvatar = windowEl.querySelector('.conv-header-avatar');
     
            if (headerTitle) headerTitle.textContent = sender;
            if (headerSubtitle) headerSubtitle.textContent = subject;
            if (headerAvatar) {
                headerAvatar.style.backgroundImage = `url(https://www.dreadcast.net/images/avatars/${sender}.png)`;
                headerAvatar.style.backgroundSize = 'cover';
                headerAvatar.style.backgroundPosition = 'center';
            }
     
            const header = windowEl.querySelector('.conv-window-header');
            if (header && !header.querySelector('.mute-label')) {
                const isMuted = STATE.mutedConversations.has(conversationID);
                const closeBtn = header.querySelector('.conv-close-btn');
     
                const muteLabel = document.createElement('label');
                muteLabel.className = 'mute-label';
                muteLabel.title = 'Mute cette conversation';
                muteLabel.innerHTML = `
                    <input type="checkbox" class="mute-checkbox" ${isMuted ? 'checked' : ''}>
                    <span class="mute-icon">Muet</span>
                `;
     
                if (closeBtn) {
                    header.insertBefore(muteLabel, closeBtn);
                } else {
                    header.appendChild(muteLabel);
                }
     
                const muteCheckbox = muteLabel.querySelector('.mute-checkbox');
                if (muteCheckbox) {
                    muteCheckbox.addEventListener('change', (e) => {
                        e.stopPropagation();
                        toggleMuteConversation(conversationID);
                    });
                }
            }
     
            if (conversationData.allMetadata) {
                STATE.allMetadataCache.set(conversationID, conversationData.allMetadata);
                windowEl.dataset.loadedCount = conversationData.messages.length;
                windowEl.dataset.totalMessages = conversationData.totalMessages;
            }

            const participantsList = windowEl.querySelector('.participants-list');
            if (participantsList && conversationData.participants) {
                participantsList.innerHTML = conversationData.participants.map(p => 
                    `<div class="participant-item" data-name="${p}">${p}</div>`
                ).join('');
                
                const longestName = conversationData.participants.reduce((a, b) => a.length > b.length ? a : b, '');
                windowEl.dataset.participantsWidth = Math.max(150, longestName.length * 8 + 40) + 'px';

                setupParticipantTooltips(windowEl, participantsList);
            }
            
            const trigger = windowEl.querySelector('.conv-participants-trigger');
            const panel = windowEl.querySelector('.conv-participants-panel');
            
            if (trigger && panel) {
                const newTrigger = trigger.cloneNode(true);
                trigger.parentNode.replaceChild(newTrigger, trigger);
                
                newTrigger.addEventListener('click', () => {
                    const isOpen = panel.style.width !== '0px' && panel.style.width !== '';
                    if (isOpen) {
                        panel.style.width = '0px';
                        panel.style.border = 'none';
                        newTrigger.innerHTML = '<span style="font-size: 12px; color: var(--accent-primary); font-weight: bold;">‹</span>';
                    } else {
                        panel.style.width = windowEl.dataset.participantsWidth || '200px';
                        panel.style.border = '1px solid var(--border-color)';
                        panel.style.borderRight = 'none';
                        newTrigger.innerHTML = '<span style="font-size: 12px; color: var(--accent-primary); font-weight: bold;">›</span>';
                    }
                });
            }
     
            renderMessages(windowEl, conversationData.messages, conversationData.hasMore, conversationID);
        }
     
        function renderMessages(windowEl, messages, hasMore = false, conversationID = null) {
            const container = windowEl.querySelector('.conv-messages-container');
            if (!container) return;
     
            const existingBubbles = container.querySelectorAll('.message-bubble');
            const existingCount = existingBubbles.length;
            const hasOnlyPlaceholder = container.querySelector('.loading-placeholder') !== null ||
                                        container.querySelector('.no-messages') !== null;
     
            if (existingCount > 0 && !hasOnlyPlaceholder) {
                if (hasMore && conversationID && !container.querySelector('.load-more-btn')) {
                    const loadBtn = document.createElement('button');
                    loadBtn.className = 'load-more-btn';
                    const remainingCount = parseInt(windowEl.dataset.totalMessages) - parseInt(windowEl.dataset.loadedCount);
                    const nextBatch = remainingCount > 30 ? 15 : Math.min(20, remainingCount);
                    loadBtn.textContent = `Charger ${nextBatch} messages précédents (${remainingCount} restants)`;
     
                    loadBtn.addEventListener('click', async () => {
                        const allMetadata = STATE.allMetadataCache.get(conversationID);
                        const currentlyLoaded = parseInt(windowEl.dataset.loadedCount);
                        await loadMoreMessages(conversationID, allMetadata, currentlyLoaded);
                    });
     
                    const firstBubble = container.querySelector('.message-bubble');
                    if (firstBubble) {
                        container.insertBefore(loadBtn, firstBubble);
                    } else {
                        container.appendChild(loadBtn);
                    }
                }
     
                messages.forEach(message => {
                    const exists = container.querySelector(`[data-message-id="${message.messageID}"]`);
                    if (!exists) {
                        prependMessageToWindow(windowEl, message, true);
                    }
                });
     
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight;
                });
                return;
            }
     
            const shouldLoad = hasOnlyPlaceholder || existingCount === 0;
     
            if (shouldLoad) {
                container.innerHTML = '';
     
                if (windowEl._batchBuffer) {
                    windowEl._batchBuffer = [];
                }
                if (windowEl._batchTimer) {
                    clearTimeout(windowEl._batchTimer);
                    windowEl._batchTimer = null;
                }
     
                messages.forEach(message => {
                    addMessageToWindow(windowEl, message, true);
                });
     
                if (hasMore && conversationID && !container.querySelector('.load-more-btn')) {
                    const loadBtn = document.createElement('button');
                    loadBtn.className = 'load-more-btn';
                    const remainingCount = parseInt(windowEl.dataset.totalMessages) - parseInt(windowEl.dataset.loadedCount);
                    const nextBatch = remainingCount > 30 ? 15 : Math.min(20, remainingCount);
                    loadBtn.textContent = `Charger ${nextBatch} messages précédents (${remainingCount} restants)`;
     
                    loadBtn.addEventListener('click', async () => {
                        const allMetadata = STATE.allMetadataCache.get(conversationID);
                        const currentlyLoaded = parseInt(windowEl.dataset.loadedCount);
                        await loadMoreMessages(conversationID, allMetadata, currentlyLoaded);
                    });
     
                    const firstBubble = container.querySelector('.message-bubble');
                    if (firstBubble) {
                        container.insertBefore(loadBtn, firstBubble);
                    } else {
                        container.appendChild(loadBtn);
                    }
                }
     
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight;
                });
            }
        }

        function setupParticipantTooltips(windowEl, participantsList) {
            let tooltip = windowEl.querySelector('.participant-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'participant-tooltip';
                windowEl.appendChild(tooltip);
            }

            let timer = null;

            participantsList.addEventListener('mouseover', (e) => {
                const item = e.target.closest('.participant-item');
                if (!item) return;

                timer = setTimeout(() => {
                    const name = item.dataset.name;
                    const rect = item.getBoundingClientRect();
                    
                    tooltip.innerHTML = `<img src="https://www.dreadcast.net/images/avatars/${name}.png" onerror="this.src='https://www.dreadcast.net/images/avatars/default.png'">`;
                    
                    tooltip.style.left = (rect.right + 10) + 'px';
                    let top = rect.top + (rect.height / 2) - 60;
                    
                    if (top < 10) top = 10;
                    if (top + 120 > window.innerHeight - 10) top = window.innerHeight - 130;
                    
                    tooltip.style.top = top + 'px';
                    tooltip.style.display = 'block';
                    
                    requestAnimationFrame(() => {
                        tooltip.classList.add('visible');
                    });
                }, 500);
            });

            participantsList.addEventListener('mouseout', (e) => {
                const item = e.target.closest('.participant-item');
                if (!item) return;

                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                
                tooltip.classList.remove('visible');
                setTimeout(() => {
                    if (!tooltip.classList.contains('visible')) {
                        tooltip.style.display = 'none';
                    }
                }, 200);
            });
        }
     
        function setupWindowDragging(windowEl) {
            const header = windowEl.querySelector('.conv-window-header');
            const conversationID = parseInt(windowEl.dataset.conversationId, 10);
     
            header.addEventListener('mousedown', (e) => {
                if (e.target.closest('.conv-close-btn')) return;
                DragManager.startDrag(windowEl, e);
                e.preventDefault();
            });
     
            header.addEventListener('dblclick', (e) => {
                if (e.target.closest('button')) return;
     
                const messagesContainer = windowEl.querySelector('.conv-messages-container');
                const inputContainer = windowEl.querySelector('.conv-input-container');
                const resizeHandle = windowEl.querySelector('.conv-resize-handle');
     
                if (STATE.collapsedWindows.get(conversationID)) {
                    const savedState = STATE.collapsedWindows.get(conversationID);
                    windowEl.style.height = savedState.height;
                    windowEl.style.minHeight = '';
                    if (messagesContainer) messagesContainer.style.display = 'flex';
                    if (inputContainer) inputContainer.style.display = 'flex';
                    if (resizeHandle) resizeHandle.style.display = 'block';
                    STATE.collapsedWindows.delete(conversationID);
                    windowEl.classList.remove('collapsed');
                } else {
                    STATE.collapsedWindows.set(conversationID, {
                        height: windowEl.style.height || `${windowEl.offsetHeight}px`
                    });
                    if (messagesContainer) messagesContainer.style.display = 'none';
                    if (inputContainer) inputContainer.style.display = 'none';
                    if (resizeHandle) resizeHandle.style.display = 'none';
                    windowEl.classList.add('collapsed');
                    windowEl.style.minHeight = 'auto';
                    windowEl.style.height = 'auto';
                }
     
                e.preventDefault();
            });
     
            header.style.cursor = 'grab';
        }
     
        function setupWindowResizing(windowEl) {
            const handle = windowEl.querySelector('.conv-resize-handle');
     
            handle.addEventListener('mousedown', (e) => {
                ResizeManager.startResize(windowEl, e);
                e.preventDefault();
                e.stopPropagation();
            });
        }
     
        function setupExpandButton(windowEl) {
            const expandBtn = windowEl.querySelector('.conv-expand-btn');
            const secondaryPanel = windowEl.querySelector('.conv-secondary-panel');

            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = secondaryPanel.style.display !== 'none';
                secondaryPanel.style.display = isVisible ? 'none' : 'flex';
            });
        }

        function setupInviteButton(windowEl) {
            const inviteBtn = windowEl.querySelector('.conv-invite-btn');
            const inviteContainer = windowEl.querySelector('.conv-invite-container');

            inviteBtn.addEventListener('click', () => {
                const isVisible = inviteContainer.style.display !== 'none';
                inviteContainer.style.display = isVisible ? 'none' : 'flex';
            });
        }

        function setupDeleteButton(windowEl, conversationID) {
            const deleteBtn = windowEl.querySelector('.conv-delete-btn');

            deleteBtn.addEventListener('click', () => {
                if (window.nav?.getMessagerie?.()?.deleteMessage) {
                    window.nav.getMessagerie().deleteMessage(conversationID);
                }
                
                const closeBtn = windowEl.querySelector('.conv-close-btn');
                if (closeBtn) {
                    closeBtn.click();
                }
            });
        }

        function setupWindowClose(windowEl, conversationID) {
            const closeBtn = windowEl.querySelector('.conv-close-btn');
     
            closeBtn.addEventListener('click', () => {
                if (windowEl._batchTimer) {
                    clearTimeout(windowEl._batchTimer);
                    windowEl._batchTimer = null;
                }
                windowEl._batchBuffer = null;
                
                if (STATE.scrollTimers.has(conversationID)) {
                    clearTimeout(STATE.scrollTimers.get(conversationID));
                    STATE.scrollTimers.delete(conversationID);
                }
                
                if (STATE.loadingTimeouts.has(conversationID)) {
                    clearTimeout(STATE.loadingTimeouts.get(conversationID));
                    STATE.loadingTimeouts.delete(conversationID);
                }
                
                STATE.observers.forEach((observer, key) => {
                    if (key.includes(`_${conversationID}_`)) {
                        observer.disconnect();
                        STATE.observers.delete(key);
                    }
                });
                
                windowEl.remove();
                STATE.openConversationWindows.delete(conversationID);
                STATE.allMetadataCache.delete(conversationID);
                STATE.collapsedWindows.delete(conversationID);
                STATE.lastMessageIDs.delete(conversationID);
     
                if (STATE.activeConversationID === conversationID) {
                    STATE.activeConversationID = null;
                }
     
                const originalConv = document.querySelector(`#db_message_${conversationID}`);
                if (originalConv) {
                    const messageItem = document.querySelector(`#message_${conversationID}`);
                    if (messageItem) {
                        STATE.programmaticClick = true;
                        messageItem.click();
                        STATE.programmaticClick = false;
                    }
                }
     
            });
        }
     
        function setupMessageSending(windowEl, conversationID) {
            const input = windowEl.querySelector('.conv-input');
            const sendBtn = windowEl.querySelector('.conv-send-btn');
     
            const sendMessage = async () => {
                let messageText = input.value.trim();
                if (!messageText) return;

                const headerSelect = windowEl.querySelector('.conv-header-select');
                if (headerSelect && headerSelect.value !== 'NONE') {
                    const header = makeBanner(1, headerSelect.value, 4, true);
                    messageText = header + messageText;
                }
     
                const playerName = getPlayerName();
                const now = new Date();
                const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)}`;
     
                const optimisticMessage = {
                    messageID: Date.now(),
                    sender: playerName || 'You',
                    body: messageText,
                    timestamp: timestamp,
                    isSentByPlayer: true
                };
     
                addMessageToWindow(windowEl, optimisticMessage);
     
                input.value = '';
                input.style.height = 'auto';

                const inviteInput = windowEl.querySelector('.conv-invite-input');
                const inviteText = inviteInput ? inviteInput.value.trim() : '';
     
                const originalForm = document.querySelector(`#db_message_${conversationID} .zone_reponse`);
                if (!originalForm) {
                    return;
                }
     
                const textArea = originalForm.querySelector('textarea[name="nm_texte"]');
                const idInput = originalForm.querySelector('input[name="nm_idConvers"]');

                let cibleInput = originalForm.querySelector('input[name="nm_cible"]');
                if (!cibleInput && inviteText) {
                    cibleInput = document.createElement('input');
                    cibleInput.type = 'hidden';
                    cibleInput.name = 'nm_cible';
                    originalForm.appendChild(cibleInput);
                }
                if (cibleInput) {
                    cibleInput.value = inviteText;
                }
     
                if (textArea && idInput) {
                    textArea.value = messageText;
                    idInput.value = conversationID;
     
                    const gameSendBtn = originalForm.querySelector('.btnTxt');
                    if (gameSendBtn) {
                        gameSendBtn.click();
                        
                        if (inviteInput) {
                            inviteInput.value = '';
                            const inviteContainer = windowEl.querySelector('.conv-invite-container');
                            if (inviteContainer) {
                                inviteContainer.style.display = 'none';
                            }
                        }
                    }
                }
            };
     
            sendBtn.addEventListener('click', sendMessage);
     
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    if (STATE.userOptions.accessibility.disableQuickSend) {
                        return;
                    }
                    e.preventDefault();
                    sendMessage();
                }
            });
     
            input.addEventListener('input', () => {
                input.style.height = 'auto';
                input.style.height = `${input.scrollHeight}px`;
            });
        }
     
        function addMessageToWindow(windowEl, message, noSound = false) {
            const container = windowEl.querySelector('.conv-messages-container');
            if (!container) return;
     
            const noMessages = container.querySelector('.no-messages');
            if (noMessages) {
                noMessages.remove();
            }
     
            const existingBubble = container.querySelector(`[data-message-id="${message.messageID}"]`);
            if (existingBubble) {
                return;
            }
     
            const bubbleEl = createMessageBubble(message, false);
            container.appendChild(bubbleEl);
     
            const conversationID = parseInt(windowEl.dataset.conversationId, 10);
     
            if (!message.isSentByPlayer && !noSound) {
                SoundManager.playOpenConversationSound(conversationID);
            }
     
            if (!isNaN(conversationID)) {
                debouncedScrollToBottom(container, conversationID);
            }
        }
     
        function prependMessageToWindow(windowEl, message, noAnimation = false) {
            const container = windowEl.querySelector('.conv-messages-container');
            if (!container) return;
     
            const existingBubble = container.querySelector(`[data-message-id="${message.messageID}"]`);
            if (existingBubble) {
                return;
            }
     
            const noMessages = container.querySelector('.no-messages');
            if (noMessages) {
                noMessages.remove();
            }
     
            const loadingPlaceholder = container.querySelector('.loading-placeholder');
            if (loadingPlaceholder) {
                loadingPlaceholder.remove();
            }
     
            const bubbleEl = createMessageBubble(message, noAnimation);
     
            if (!windowEl._batchBuffer) {
                windowEl._batchBuffer = [];
            }
     
            windowEl._batchBuffer.push(bubbleEl);
     
            if (!windowEl._batchTimer) {
                windowEl._batchTimer = setTimeout(() => {
                    const fragment = document.createDocumentFragment();
                    const scrollHeightBefore = container.scrollHeight;
                    const scrollTopBefore = container.scrollTop;
     
                    windowEl._batchBuffer.forEach(el => fragment.appendChild(el));
     
                    const loadMoreBtn = container.querySelector('.load-more-btn');
                    const firstBubble = container.querySelector('.message-bubble');
     
                    if (loadMoreBtn) {
                        container.insertBefore(fragment, loadMoreBtn.nextSibling);
                    } else if (firstBubble) {
                        container.insertBefore(fragment, firstBubble);
                    } else {
                        container.appendChild(fragment);
                    }
     
                    if (scrollTopBefore > 0) {
                        const scrollHeightAfter = container.scrollHeight;
                        container.scrollTop = scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
                    } else {
                        requestAnimationFrame(() => {
                            container.scrollTop = container.scrollHeight;
                        });
                    }
     
                    windowEl._batchBuffer = [];
                    windowEl._batchTimer = null;
                }, 50);
            }
        }
     
        function insertMessageAtTop(windowEl, message) {
            const container = windowEl.querySelector('.conv-messages-container');
            if (!container) return;
     
            const existingBubble = container.querySelector(`[data-message-id="${message.messageID}"]`);
            if (existingBubble) return;
     
            const bubbleEl = createMessageBubble(message, true);
     
            const scrollHeightBefore = container.scrollHeight;
            const scrollTopBefore = container.scrollTop;
     
            const loadMoreBtn = container.querySelector('.load-more-btn');
            const firstBubble = container.querySelector('.message-bubble');
     
            if (loadMoreBtn) {
                container.insertBefore(bubbleEl, loadMoreBtn.nextSibling);
            } else if (firstBubble) {
                container.insertBefore(bubbleEl, firstBubble);
            } else {
                container.appendChild(bubbleEl);
            }
     
            if (scrollTopBefore > 0) {
                const scrollHeightAfter = container.scrollHeight;
                container.scrollTop = scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
            }
        }
     
        function setupAvatarTooltipPositioning(bubbleEl) {
            const avatarContainer = bubbleEl.querySelector('.avatar-container');
            if (!avatarContainer) return;
     
            const avatar = avatarContainer.querySelector('.message-avatar');
            const tooltip = avatarContainer.querySelector('.avatar-tooltip');
            const tooltipImg = tooltip?.querySelector('img');
     
            if (!avatar || !tooltip || !tooltipImg) return;
     
            let isHovering = false;
            let positionCalculated = false;
     
            const calculatePosition = () => {
                if (positionCalculated) return;
     
                const avatarRect = avatar.getBoundingClientRect();
                const windowEl = bubbleEl.closest('.modern-conversation-window');
                const windowRect = windowEl ? windowEl.getBoundingClientRect() : null;
     
                const tooltipWidth = 120;
                const tooltipHeight = 120;
                const offset = 10;
     
                let top, left;
     
                if (bubbleEl.classList.contains('sent')) {
                    left = avatarRect.right + offset;
     
                    if (windowRect && left + tooltipWidth > windowRect.right) {
                        left = avatarRect.left - tooltipWidth - offset;
                    }
                } else {
                    left = avatarRect.left - tooltipWidth - offset;
     
                    if (left < (windowRect?.left || 0)) {
                        left = avatarRect.right + offset;
                    }
                }
     
                top = avatarRect.top - (tooltipHeight / 2) + (avatarRect.height / 2);
     
                if (windowRect) {
                    if (top < windowRect.top) {
                        top = windowRect.top + 10;
                    } else if (top + tooltipHeight > windowRect.bottom) {
                        top = windowRect.bottom - tooltipHeight - 10;
                    }
                }
     
                tooltip.style.top = `${top}px`;
                tooltip.style.left = `${left}px`;
                positionCalculated = true;
            };
     
            avatar.addEventListener('mouseenter', () => {
                isHovering = true;
     
                if (STATE.tooltipTimer) {
                    clearTimeout(STATE.tooltipTimer);
                }
     
                STATE.tooltipTimer = setTimeout(() => {
                    if (isHovering) {
                        calculatePosition();
     
                        if (CONFIG.AVATAR_CACHE_ENABLED) {
                            const sender = avatar.alt;
                            if (!STATE.avatarCache.has(sender)) {
                                STATE.avatarCache.set(sender, true);
                            }
                        }
                    }
                }, CONFIG.AVATAR_TOOLTIP_DELAY);
            });
     
            avatar.addEventListener('mouseleave', () => {
                isHovering = false;
                if (STATE.tooltipTimer) {
                    clearTimeout(STATE.tooltipTimer);
                    STATE.tooltipTimer = null;
                }
            });
     
            if (STATE.sharedObserver) {
                STATE.sharedObserver.observe(avatar);
            }
        }
     
        function setupWindowFocus(windowEl, conversationID) {
            windowEl.addEventListener('mousedown', () => {
                bringWindowToFront(windowEl);
                STATE.activeConversationID = conversationID;
            });
        }
     
        function bringWindowToFront(windowEl) {
            const maxZIndex = Math.max(
                CONFIG.WINDOW_Z_INDEX_BASE,
                ...Array.from(document.querySelectorAll('.modern-conversation-window'))
                    .map(w => parseInt(w.style.zIndex) || 0)
            );
            windowEl.style.zIndex = maxZIndex + 1;
        }
     
        function injectModernUIStyles() {
            const styles = document.createElement('style');
            styles.id = 'modern-messaging-styles';
            styles.textContent = `
                :root {
                    --bg-primary: #000000;
                    --bg-secondary: #0a0a0a;
                    --bg-panel: #151515;
                    --accent-primary: #00d9ff;
                    --accent-secondary: #00a8cc;
                    --text-primary: #ffffff;
                    --text-secondary: #a0aec0;
                    --border-color: #00d9ff;
                    --shadow-color: rgba(0, 217, 255, 0.3);
                }
     
                .modern-conversation-window {
                    position: fixed;
                    background: var(--bg-primary);
                    border-radius: 8px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.9), 0 0 0 1px var(--border-color);
                    display: flex;
                    flex-direction: column;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                    overflow: visible;
                    min-width: 300px;
                    min-height: 400px;
                }

                .conv-window-header {
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    padding: 10px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: grab;
                    user-select: none;
                    border-bottom: 2px solid var(--border-color);
                    border-radius: 8px 8px 0 0;
                }
     
                .conv-window-header:active {
                    cursor: grabbing;
                }

                .participants-list {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                
                .participants-list::-webkit-scrollbar { 
                    display: none;
                }
     
                .conv-header-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                    flex-shrink: 0;
                }
     
                .conv-header-text {
                    flex: 1;
                    min-width: 0;
                }
     
                .conv-header-title {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
     
                .conv-header-subtitle {
                    font-size: 13px;
                    opacity: 0.9;
                    margin: 4px 0 0 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
     
                .conv-expand-btn {
                    width: 32px;
                    height: 32px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-panel);
                    color: var(--accent-primary);
                    font-size: 20px;
                    font-weight: bold;
                    line-height: 1;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: background-color 0.2s, color 0.2s;
                    padding: 0;
                    margin-top: -1px;
                }

                .conv-expand-btn:hover {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                }

                .conv-close-btn {
                    width: 32px;
                    height: 32px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-panel);
                    color: var(--accent-primary);
                    font-size: 24px;
                    line-height: 1;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: background-color 0.2s, color 0.2s;
                    padding: 0;
                    margin-top: -2px;
                }
     
                .conv-close-btn:hover {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                }
     
                .conv-messages-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    background: var(--bg-primary);
                    display: flex;
                    flex-direction: column;
                }
     
                .no-messages {
                    text-align: center;
                    color: var(--text-secondary);
                    padding: 60px 20px;
                    font-style: italic;
                }
     
                .message-bubble {
                    max-width: 75%;
                    margin-bottom: 8px;
                    animation: slideIn 0.3s ease-out;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                }
     
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes mentionGlow {
                    0%, 100% {
                        box-shadow: 0 0 10px rgba(0, 217, 255, 0.35), 0 0 20px rgba(0, 217, 255, 0.15);
                        border-color: rgba(0, 217, 255, 0.8);
                    }
                    50% {
                        box-shadow: 0 0 15px rgba(0, 217, 255, 0.6), 0 0 30px rgba(0, 217, 255, 0.3);
                        border-color: rgba(0, 217, 255, 1);
                    }
                }
     
                .message-bubble.received {
                    align-self: flex-start;
                    flex-direction: row;
                }
     
                .message-bubble.sent {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }
     
                .avatar-container {
                    position: relative;
                    flex-shrink: 0;
                }
     
                .message-avatar {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    object-fit: cover;
                    flex-shrink: 0;
                    margin-top: 4px;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
     
                .message-avatar:hover {
                    transform: scale(1.1);
                    will-change: transform;
                }
     
                .avatar-tooltip {
                    position: fixed;
                    display: none;
                    z-index: 100000;
                    pointer-events: none;
                }
     
                .avatar-tooltip img {
                    width: 120px;
                    height: 120px;
                    border-radius: 8px;
                    object-fit: cover;
                    border: 2px solid var(--accent-primary);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 217, 255, 0.5);
                    background: var(--bg-secondary);
                }

                .participant-item {
                    padding: 4px 8px;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .participant-item:hover {
                    background-color: rgba(0, 217, 255, 0.1);
                    color: var(--accent-primary);
                }

                .participant-tooltip {
                    position: fixed;
                    display: none;
                    z-index: 100005;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .participant-tooltip.visible {
                    opacity: 1;
                }

                .participant-tooltip img {
                    width: 120px;
                    height: 120px;
                    border-radius: 8px;
                    object-fit: cover;
                    border: 2px solid var(--accent-primary);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 217, 255, 0.5);
                    background: var(--bg-secondary);
                }
     
                .avatar-container:hover .avatar-tooltip {
                    display: block;
                }
     
                .message-content {
                    padding: 8px 12px;
                    border-radius: 8px;
                    word-wrap: break-word;
                    flex: 1;
                    min-width: 0;
                }
     
                .message-bubble.received .message-content {
                    background: var(--bg-panel);
                    border-top-left-radius: 0;
                    border: 1px solid var(--accent-primary);
                    box-shadow: 0 0 5px rgba(0, 217, 255, 0.2);
                }
     
            .message-bubble.sent .message-content {
                background: var(--bg-secondary);
                border-top-right-radius: 0;
                border: 1px solid var(--accent-secondary);
                box-shadow: 0 0 5px rgba(0, 168, 204, 0.2);
            }

            .message-bubble.mentioned .message-content {
                background: linear-gradient(135deg, rgba(0, 217, 255, 0.15) 0%, rgba(0, 168, 204, 0.1) 100%);
                border-color: var(--accent-primary);
                box-shadow: 0 0 10px rgba(0, 217, 255, 0.35), 0 0 20px rgba(0, 217, 255, 0.15);
                animation: mentionGlow 2.5s ease-in-out infinite;
            }
 
            .message-sender {
                font-weight: 600;
                font-size: 13px;
                color: var(--accent-primary);
                margin-bottom: 4px;
            }                .message-text {
                    font-size: 14px;
                    color: var(--text-primary);
                    margin: 0;
                    white-space: pre-wrap;
                    word-break: break-word;
                }
     
                .message-time {
                    font-size: 11px;
                    color: var(--text-secondary);
                    margin-top: 4px;
                    text-align: right;
                }
     
                .conv-secondary-panel {
                    background: var(--bg-secondary);
                    padding: 8px 12px;
                    display: flex;
                    gap: 8px;
                    border-bottom: 1px solid var(--border-color);
                    flex-wrap: wrap;
                }

                .conv-invite-btn,
                .conv-delete-btn {
                    padding: 6px 14px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 15px;
                    color: var(--text-primary);
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .conv-invite-btn:hover,
                .conv-delete-btn:hover {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    border-color: var(--accent-primary);
                }

                .conv-invite-container {
                    padding: 8px 12px;
                    background: var(--bg-secondary);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    gap: 8px;
                }

                .conv-invite-input {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 15px;
                    font-size: 13px;
                    font-family: inherit;
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    outline: none;
                }

                .conv-invite-input:focus {
                    border-color: var(--accent-primary);
                }

                .conv-input-container {
                    padding: 12px;
                    background: var(--bg-secondary);
                    display: flex;
                    gap: 8px;
                    align-items: flex-end;
                    border-top: 1px solid var(--border-color);
                    border-radius: 0 0 8px 8px;
                }
     
                .conv-input {
                    flex: 1;
                    padding: 10px 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    font-size: 15px;
                    font-family: inherit;
                    resize: none;
                    max-height: 100px;
                    background: var(--bg-panel);
                    color: var(--text-primary);
                    outline: none;
                    line-height: 1.4;
                    box-sizing: border-box;
                    scrollbar-width: none;
                }

                .conv-input::-webkit-scrollbar {
                    display: none;
                }
     
                .conv-input:focus {
                    border-color: var(--accent-primary);
                }
     
                .conv-send-btn {
                    width: 44px;
                    height: 44px;
                    border: 1px solid var(--border-color);
                    border-radius: 50%;
                    background: var(--bg-panel);
                    color: var(--accent-primary);
                    font-size: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s, color 0.2s, transform 0.15s;
                    flex-shrink: 0;
                    will-change: transform;
                }
     
                .conv-send-btn:hover {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    transform: scale(1.05);
                }
     
                .conv-send-btn:active {
                    transform: scale(0.95);
                }
     
                .send-icon {
                    display: block;
                    transform: translateX(1px);
                }
     
                .conv-resize-handle {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 20px;
                    height: 20px;
                    cursor: nwse-resize;
                }
     
                .conv-resize-handle::before {
                    content: '';
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 0 0 10px 10px;
                    border-color: transparent transparent var(--accent-primary) transparent;
                }
     
                .modern-conversation-window.collapsed {
                    overflow: hidden;
                }
     
                .modern-conversation-window.collapsed .conv-window-header {
                    border-bottom: none;
                }
     
                .conv-messages-container::-webkit-scrollbar {
                    width: 6px;
                }
     
                .conv-messages-container::-webkit-scrollbar-track {
                    background: var(--bg-secondary);
                }
     
                .conv-messages-container::-webkit-scrollbar-thumb {
                    background: var(--accent-secondary);
                    border-radius: 3px;
                }
     
                .conv-messages-container::-webkit-scrollbar-thumb:hover {
                    background: var(--accent-primary);
                }
     
                .load-more-btn {
                    width: calc(100% - 40px);
                    margin: 10px 20px;
                    padding: 12px;
                    background: var(--bg-panel);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    color: var(--accent-primary);
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s, transform 0.15s;
                    text-align: center;
                    will-change: transform;
                }
     
                .load-more-btn:hover:not(:disabled) {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    transform: translateY(-1px);
                }
     
                .load-more-btn:active:not(:disabled) {
                    transform: translateY(0);
                }
     
                .load-more-btn:disabled {
                    opacity: 0.5;
                    cursor: wait;
                }
     
                .message-link {
                    color: var(--accent-primary);
                    text-decoration: none;
                    border-bottom: 1px solid var(--accent-primary);
                    transition: color 0.2s, border-color 0.2s;
                    cursor: pointer;
                    word-break: break-all;
                }
     
                .message-link:hover {
                    color: var(--accent-secondary);
                    border-bottom-color: var(--accent-secondary);
                }
     
                .link-preview-tooltip {
                    position: fixed;
                    background: var(--bg-panel);
                    border: 2px solid var(--accent-primary);
                    border-radius: 8px;
                    padding: 12px;
                    max-width: 300px;
                    z-index: 150000;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 217, 255, 0.5);
                    opacity: 0;
                    transform: translateY(-5px);
                    transition: opacity 0.2s, transform 0.2s;
                    pointer-events: none;
                }
     
                .link-preview-tooltip.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
     
                .link-preview-image-container {
                    width: 100%;
                    max-height: 200px;
                    overflow: hidden;
                    border-radius: 6px;
                    margin-bottom: 8px;
                    background: var(--bg-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
     
                .link-preview-image-container img {
                    width: 100%;
                    height: auto;
                    max-height: 200px;
                    object-fit: contain;
                    display: block;
                }
     
                .link-preview-error {
                    padding: 20px;
                    text-align: center;
                    color: var(--text-secondary);
                    font-size: 12px;
                    font-style: italic;
                }
     
                .link-preview-domain {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--accent-primary);
                    font-size: 12px;
                    font-weight: 500;
                    margin-bottom: 6px;
                }
     
                .link-preview-domain svg {
                    flex-shrink: 0;
                }
     
                .link-preview-title {
                    color: var(--text-primary);
                    font-size: 13px;
                    word-break: break-word;
                    line-height: 1.4;
                }
     
                .ddm-options-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 200000;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
     
                .ddm-options-content {
                    background: var(--bg-primary);
                    border: 2px solid var(--border-color);
                    border-radius: 16px;
                    width: 90%;
                    max-width: 650px;
                    max-height: 85vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 217, 255, 0.2);
                    animation: slideUp 0.3s ease;
                    overflow: hidden;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
     
                .ddm-options-header {
                    padding: 24px 28px;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
                }
     
                .ddm-options-header h2 {
                    margin: 0;
                    color: var(--accent-primary);
                    font-size: 22px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }
     
                .ddm-options-close {
                    width: 36px;
                    height: 36px;
                    border: 1px solid var(--border-color);
                    background: transparent;
                    color: var(--text-secondary);
                    font-size: 28px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.25s ease;
                }
     
                .ddm-options-close:hover {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    border-color: var(--accent-primary);
                    transform: scale(1.05);
                }
     
                .ddm-options-body {
                    flex: 1;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 0;
                }

                .ddm-options-body::-webkit-scrollbar {
                    width: 8px;
                }

                .ddm-options-body::-webkit-scrollbar-track {
                    background: var(--bg-secondary);
                }

                .ddm-options-body::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 4px;
                }

                .ddm-options-body::-webkit-scrollbar-thumb:hover {
                    background: var(--accent-primary);
                }
     
                .ddm-options-tabs {
                    display: flex;
                    gap: 4px;
                    padding: 4px;
                    background: var(--bg-secondary);
                }
     
                .ddm-tab-btn {
                    flex: 1;
                    padding: 12px 16px;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    color: var(--text-secondary);
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .tab-icon {
                    font-size: 16px;
                    opacity: 0.8;
                    transition: all 0.2s ease;
                }
     
                .ddm-tab-btn:hover {
                    background: rgba(0, 217, 255, 0.15);
                    color: var(--accent-primary);
                }

                .ddm-tab-btn:hover .tab-icon {
                    opacity: 1;
                    transform: scale(1.1);
                }
     
                .ddm-tab-btn.active {
                    background: var(--bg-panel);
                    color: var(--accent-primary);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .ddm-tab-btn.active .tab-icon {
                    opacity: 1;
                }
     
                .ddm-options-panels {
                    padding: 28px;
                }
     
                .ddm-panel {
                    display: none;
                    animation: fadeInPanel 0.25s ease;
                }

                @keyframes fadeInPanel {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
     
                .ddm-panel.active {
                    display: block;
                }
     
                .ddm-option-group {
                    margin-bottom: 28px;
                }
     
                .ddm-option-group label {
                    display: block;
                    margin-bottom: 10px;
                }

                .label-text {
                    display: block;
                    color: var(--text-primary);
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }

                .label-desc {
                    display: block;
                    color: var(--text-secondary);
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 1.4;
                    opacity: 0.8;
                }
     
                .ddm-color-input-group {
                    display: flex;
                    gap: 12px;
                    align-items: stretch;
                }
     
                .ddm-color-input-group input[type="color"] {
                    width: 56px;
                    height: 44px;
                    border: 2px solid var(--border-color);
                    border-radius: 10px;
                    cursor: pointer;
                    background: var(--bg-panel);
                    transition: all 0.2s ease;
                }

                .ddm-color-input-group input[type="color"]:hover {
                    border-color: var(--accent-primary);
                    transform: scale(1.05);
                }
     
                .ddm-color-input-group input[type="text"] {
                    flex: 1;
                    padding: 12px 16px;
                    background: var(--bg-panel);
                    border: 2px solid var(--border-color);
                    border-radius: 10px;
                    color: var(--text-primary);
                    font-size: 13px;
                    font-family: 'Courier New', monospace;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
     
                .ddm-color-input-group input[type="text"]:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    background: var(--bg-secondary);
                    box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
                }
     
                .ddm-slider-group {
                    display: flex;
                    gap: 14px;
                    align-items: center;
                }
     
                .ddm-slider-group input[type="range"] {
                    flex: 1;
                    height: 8px;
                    border-radius: 4px;
                    background: linear-gradient(to right, var(--bg-panel) 0%, var(--border-color) 100%);
                    outline: none;
                    -webkit-appearance: none;
                    cursor: pointer;
                }
     
                .ddm-slider-group input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    cursor: pointer;
                    border: 3px solid var(--bg-primary);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    transition: all 0.2s ease;
                }

                .ddm-slider-group input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 3px 10px rgba(0, 217, 255, 0.5);
                }
     
                .ddm-slider-group input[type="range"]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    cursor: pointer;
                    border: 3px solid var(--bg-primary);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    transition: all 0.2s ease;
                }

                .ddm-slider-group input[type="range"]::-moz-range-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 3px 10px rgba(0, 217, 255, 0.5);
                }
     
                .ddm-slider-value {
                    min-width: 55px;
                    text-align: right;
                    color: var(--accent-primary);
                    font-weight: 700;
                    font-size: 14px;
                    font-family: monospace;
                }
     
                .ddm-reset-btn {
                    padding: 10px 20px;
                    background: transparent;
                    border: 2px solid var(--border-color);
                    border-radius: 10px;
                    color: var(--text-secondary);
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    margin-top: 16px;
                }
     
                .ddm-reset-btn:hover {
                    background: var(--bg-panel);
                    color: var(--accent-primary);
                    border-color: var(--accent-primary);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 217, 255, 0.2);
                }
     
                .ddm-options-footer {
                    padding: 20px 28px;
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
                }
     
                .ddm-save-btn,
                .ddm-cancel-btn {
                    padding: 12px 28px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }
     
                .ddm-save-btn {
                    background: var(--accent-primary);
                    border: 2px solid var(--accent-primary);
                    color: var(--bg-primary);
                    box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
                }
     
                .ddm-save-btn:hover {
                    background: var(--accent-secondary);
                    border-color: var(--accent-secondary);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 217, 255, 0.4);
                }
     
                .ddm-cancel-btn {
                    background: transparent;
                    border: 2px solid var(--border-color);
                    color: var(--text-primary);
                }
     
                .ddm-cancel-btn:hover {
                    background: var(--bg-panel);
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                    transform: translateY(-2px);
                }
     
                .ddm-option-desc {
                    color: var(--text-secondary);
                    font-size: 13px;
                    margin: 8px 0 12px 0;
                    line-height: 1.5;
                }
     
                .ddm-text-preview {
                    margin-bottom: 24px;
                    padding: 20px;
                    background: var(--bg-panel);
                    border: 2px solid var(--border-color);
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                .preview-label {
                    color: var(--text-secondary);
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    opacity: 0.7;
                }
     
                .preview-bubble {
                    background: var(--bg-secondary);
                    border: 2px solid var(--accent-secondary);
                    border-radius: 16px;
                    padding: 14px 20px;
                    max-width: 85%;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
     
                .preview-text {
                    word-wrap: break-word;
                    transition: font-size 0.2s, color 0.2s;
                }
     
                .ddm-separator {
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--border-color), transparent);
                    margin: 28px 0;
                    opacity: 0.5;
                }
     
                .ddm-preview-window-btn {
                    width: 100%;
                    padding: 14px 24px;
                    background: var(--accent-primary);
                    border: 2px solid var(--accent-primary);
                    border-radius: 10px;
                    color: var(--bg-primary);
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
                }
     
                .ddm-preview-window-btn:hover {
                    background: var(--accent-secondary);
                    border-color: var(--accent-secondary);
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(0, 217, 255, 0.5);
                }
     
                .modern-conversation-window.ddm-preview {
                    pointer-events: all;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.9), 0 0 0 2px var(--accent-primary), 0 0 20px rgba(0, 217, 255, 0.5);
                }
     
                .ddm-preview .conv-header-avatar {
                    opacity: 0.6;
                }
     
                .ddm-preview .conv-window-header {
                    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-panel) 100%);
                }
     
                .ddm-preview .conv-input,
                .ddm-preview .conv-send-btn {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
     
                .ddm-option-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
     
                .ddm-toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 54px;
                    height: 28px;
                    flex-shrink: 0;
                }
     
                .ddm-toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
     
                .ddm-toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: var(--bg-panel);
                    border: 2px solid var(--border-color);
                    transition: all 0.3s ease;
                    border-radius: 28px;
                }

                .ddm-toggle-slider:hover {
                    border-color: var(--accent-primary);
                }
     
                .ddm-toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 20px;
                    width: 20px;
                    left: 2px;
                    bottom: 2px;
                    background-color: var(--text-secondary);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
     
                input:checked + .ddm-toggle-slider {
                    background-color: var(--accent-primary);
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 10px rgba(0, 217, 255, 0.3);
                }
     
                input:checked + .ddm-toggle-slider:before {
                    transform: translateX(26px);
                    background-color: var(--bg-primary);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                }
     
                .ddm-url-input {
                    width: 100%;
                    padding: 12px 16px;
                    background: var(--bg-panel);
                    border: 2px solid var(--border-color);
                    border-radius: 10px;
                    color: var(--text-primary);
                    font-size: 12px;
                    font-family: 'Courier New', monospace;
                    margin-bottom: 12px;
                    transition: all 0.2s ease;
                }
     
                .ddm-url-input:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    background: var(--bg-secondary);
                    box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
                }
     
                .ddm-url-input:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
     
                .ddm-sound-controls {
                    display: flex;
                    gap: 14px;
                    align-items: center;
                    flex-wrap: wrap;
                }
     
                .ddm-preview-sound-btn {
                    padding: 10px 20px;
                    background: var(--accent-primary);
                    border: 2px solid var(--accent-primary);
                    border-radius: 8px;
                    color: var(--bg-primary);
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    white-space: nowrap;
                    box-shadow: 0 2px 8px rgba(0, 217, 255, 0.3);
                }
     
                .ddm-preview-sound-btn:hover:not(:disabled) {
                    background: var(--accent-secondary);
                    border-color: var(--accent-secondary);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 217, 255, 0.5);
                }
     
                .ddm-preview-sound-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    box-shadow: none;
                }
     
                .ddm-sound-controls .ddm-slider-group {
                    flex: 1;
                    min-width: 220px;
                }
     
                .ddm-slider-label {
                    color: var(--text-secondary);
                    font-size: 12px;
                    font-weight: 600;
                    margin-right: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
     
                .mute-label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    padding: 6px 10px;
                    border-radius: 6px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-panel);
                    transition: all 0.2s;
                    user-select: none;
                }
     
                .mute-label:hover {
                    background: var(--bg-secondary);
                    border-color: var(--accent-primary);
                }
     
                .mute-checkbox {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    accent-color: var(--accent-primary);
                }
     
                .mute-icon {
                    font-size: 18px;
                    line-height: 1;
                }
     
                .mute-checkbox:checked + .mute-icon {
                    filter: grayscale(1) opacity(0.7);
                }

                .modern-conversation-window.drawer-open {
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                }

                .conv-bottom-extension {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 10;
                    pointer-events: none;
                }

                .conv-drawer {
                    width: 100%;
                    background: var(--bg-secondary);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 1px 0 0 0 var(--border-color), -1px 0 0 0 var(--border-color), 0 1px 0 0 var(--border-color);
                    border: none;
                    border-radius: 0 0 8px 8px;
                    padding: 8px 12px;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    pointer-events: auto;
                    margin-top: -1px;
                    animation: slideDown 0.2s ease;
                    box-sizing: border-box;
                }

                .conv-drawer-toggle {
                    width: 40px;
                    height: 18px;
                    background: var(--bg-secondary);
                    /* Bordure simulée pour correspondre au style box-shadow */
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2), 1px 0 0 0 var(--border-color), -1px 0 0 0 var(--border-color), 0 1px 0 0 var(--border-color);
                    border: none;
                    border-radius: 0 0 8px 8px;
                    color: var(--accent-primary);
                    font-size: 12px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: auto;
                    transition: all 0.2s;
                    margin-top: -1px;
                }

                .conv-drawer-toggle:hover {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    height: 22px;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .conv-drawer-headers {
                    flex: 1;
                }

                .conv-header-select {
                    width: 100%;
                    padding: 6px;
                    background: var(--bg-panel);
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    color: var(--text-primary);
                    font-size: 12px;
                }

                .conv-drawer-actions {
                    display: flex;
                    gap: 4px;
                }

                .conv-action-btn {
                    width: 28px;
                    height: 28px;
                    background: var(--bg-panel);
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    color: var(--text-primary);
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .conv-action-btn:hover {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    border-color: var(--accent-primary);
                }

                /* Performance Mode Styles */
                .ddm-low-perf .modern-conversation-window {
                    box-shadow: 0 0 0 1px var(--border-color) !important;
                    backdrop-filter: none !important;
                    animation: none !important;
                    background: var(--bg-primary) !important;
                }
                
                .ddm-low-perf .ddm-options-modal {
                    backdrop-filter: none !important;
                    background: rgba(0, 0, 0, 0.95) !important;
                    animation: none !important;
                }

                .ddm-low-perf .ddm-options-content {
                    box-shadow: none !important;
                    border: 1px solid var(--border-color) !important;
                    animation: none !important;
                }

                .ddm-low-perf .message-bubble {
                    animation: none !important;
                    box-shadow: none !important;
                }

                .ddm-low-perf .message-bubble.mentioned .message-content {
                    animation: none !important;
                    box-shadow: none !important;
                    background: rgba(0, 217, 255, 0.15) !important;
                }

                .ddm-low-perf .conv-drawer,
                .ddm-low-perf .conv-drawer-toggle {
                    box-shadow: none !important;
                    animation: none !important;
                    border: 1px solid var(--border-color) !important;
                }
                
                .ddm-low-perf .avatar-tooltip,
                .ddm-low-perf .link-preview-tooltip,
                .ddm-low-perf .participant-tooltip {
                    box-shadow: none !important;
                    border: 1px solid var(--accent-primary) !important;
                    transition: none !important;
                }
            `;
     
            document.head.appendChild(styles);
        }
     
        function injectOptionsButton() {
            const settingsMenu = document.querySelector('li.parametres.couleur5');
            if (!settingsMenu) {
                setTimeout(injectOptionsButton, 500);
                return;
            }
     
            const submenu = settingsMenu.querySelector('ul');
            if (!submenu) {
                setTimeout(injectOptionsButton, 500);
                return;
            }
     
            const existingBtn = submenu.querySelector('.ddm-options-btn');
            if (existingBtn) return;
     
            const optionsBtn = document.createElement('li');
            optionsBtn.className = 'link couleur2 separator ddm-options-btn';
            optionsBtn.style.cursor = 'pointer';
            optionsBtn.textContent = 'Options DDM';
            optionsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                createOptionsModal();
            });
     
            submenu.appendChild(optionsBtn);
        }
     
        function interceptConversationClicks() {
            const messageList = document.querySelector('#liste_messages');
            if (!messageList) {
                setTimeout(interceptConversationClicks, 500);
                return;
            }
     
            messageList.addEventListener('click', (event) => {
                const conversationItem = event.target.closest('li[id^="message_"]');
                if (!conversationItem) return;
     
                const match = conversationItem.id.match(STATE.regex.messageID);
                if (!match) return;
     
                const conversationID = parseInt(match[1], 10);
     
                if (STATE.programmaticClick) {
                    return;
                }
     
                const secondaryDDMEnabled = STATE.userOptions?.accessibility?.secondaryDDM || false;
                
                const shouldOpenOriginal = secondaryDDMEnabled ? !event.ctrlKey : event.ctrlKey;
                
                if (shouldOpenOriginal) {
                    event.preventDefault();
                    event.stopPropagation();
     
                    if (window.nav?.getMessagerie?.()?.openMessage) {
                        window.nav.getMessagerie().openMessage(conversationID);
                        
                        setTimeout(() => {
                            const gameWindow = document.getElementById(`db_message_${conversationID}`);
                            if (gameWindow) {
                                gameWindow.classList.add('ddm-show-original');
                            }
                        }, 100);
                    }
                    return;
                }
     
                event.preventDefault();
                event.stopPropagation();
     
                if (STATE.openConversationWindows.has(conversationID)) {
                    const existingWindow = STATE.openConversationWindows.get(conversationID);
                    if (document.body.contains(existingWindow)) {
                        existingWindow.remove();
                        STATE.openConversationWindows.delete(conversationID);
                        STATE.allMetadataCache.delete(conversationID);
                        STATE.collapsedWindows.delete(conversationID);
     
                        if (STATE.activeConversationID === conversationID) {
                            STATE.activeConversationID = null;
                        }
     
                        return;
                    }
                }
     
                const currentFolderEl = DOMHelpers.getCurrentFolderEl();
                if (currentFolderEl) {
                    const folderID = parseInt(currentFolderEl.dataset.id, 10);
                    STATE.conversationFolders.set(conversationID, folderID);
                }
     
                const existingGameWindow = document.getElementById(`db_message_${conversationID}`);

                if (existingGameWindow) {
                    STATE.programmaticClick = true;
                    conversationItem.click();

                    setTimeout(() => {
                        conversationItem.click();
                        STATE.programmaticClick = false;
                        
                    }, CONFIG.CLOSE_DELAY);
                } else if (window.nav?.getMessagerie?.()?.openMessage) {
                    window.nav.getMessagerie().openMessage(conversationID);
                }

                createConversationWindowWithLoading(conversationID);            }, true);
        }
     
        function monitorConversationOpening() {
            if (!document.body) {
                setTimeout(monitorConversationOpening, 100);
                return;
            }
     
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.id && node.id.startsWith('db_message_')) {
                                const match = node.id.match(STATE.regex.dbMessageID);
                                if (match) {
                                    const conversationID = parseInt(match[1], 10);
     
                                    if (STATE.openConversationWindows.has(conversationID)) {
                                        parseConversationDOM(conversationID, 5).then(convData => {
                                            if (convData) {
                                                updateConversationWindowWithData(conversationID, convData);
                                            }
                                        });
                                    } else {
                                        node.classList.add('ddm-show-original');
                                    }
                                }
                            }
                        }
                    });
                });
            });
     
            observer.observe(document.body, {
                childList: true,
                subtree: false
            });
            
            STATE.observers.set('conversationOpening', observer);
        }
     
        function init() {
            STATE.playerName = getPlayerName();
     
            loadUserOptions();
            loadMutedConversations();
     
            SoundManager.preloadUserSounds();
     
            DragManager.init();
            ResizeManager.init();

            if ('IntersectionObserver' in window) {
                STATE.sharedObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            const avatar = entry.target;
                            const tooltip = avatar.nextElementSibling;
                            if (tooltip) {
                                const img = tooltip.querySelector('img');
                                if (img) img.loading = 'lazy';
                            }
                        }
                    });
                }, { threshold: 0.1 });
            }
     
            interceptXHR();
     
            hideOriginalMessagingUI();
            injectModernUIStyles();
     
            interceptConversationClicks();
     
            monitorConversationOpening();
     
            monitorGlobalUnreadCounter();
     
            injectOptionsButton();
     
            updateOpenConversationsState();
     
            clearAllMutedConversationsOnStartup();
        }
     
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
     
    })();