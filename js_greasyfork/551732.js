// ==UserScript==
// @name         Torn Chat Question Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.05
// @description  Highlights questions and enables filtering by chatter
// @author       Weav3r
// @match        https://www.torn.com/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/551732/Torn%20Chat%20Question%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/551732/Torn%20Chat%20Question%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.tornQuestionHighlighterLoaded) return;
    window.tornQuestionHighlighterLoaded = true;

    const CONFIG = {
        questionKeywords: ['how to', 'how do', 'how can', 'how should', 'what is', 'what are',
            'where is', 'where can', 'when do', 'when should', 'why is', 'why do',
            'can i', 'should i', 'is there', 'are there', 'do you', 'does anyone',
            'help', 'advice', 'tips', 'guide', 'tutorial', 'explain'],
        debounceDelay: 100,
        maxMessagesToCheck: 50,
        reconnectCheckInterval: 2000
    };

    const questionRegex = new RegExp(
        '\\?|' + CONFIG.questionKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
        'i'
    );

    if (!document.getElementById('torn-qh-styles')) {
        const style = document.createElement('style');
        style.id = 'torn-qh-styles';
        style.textContent = `
            .torn-question-highlight {
                background: linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%) !important;
                box-shadow: inset 3px 0 0 #3b82f6 !important;
                transition: all 0.2s ease !important;
            }
            .torn-question-highlight.new-question {
                animation: questionGlow 1s ease-in-out;
            }
            @keyframes questionGlow {
                0%, 100% { background: linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%); }
                50% { background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%); }
            }
            .torn-question-icon {
                display: inline-block;
                margin-right: 6px;
                font-size: 14px;
                color: #3b82f6;
                opacity: 0.8;
                user-select: none;
                z-index: 1;
                position: relative;
                transform-origin: center;
                max-width: 20px;
                pointer-events: none;
            }
            .torn-message-interactive {
                cursor: pointer;
            }
            .torn-message-selected {
                background: rgba(255, 255, 255, 0.03) !important;
                position: relative;
            }
            .torn-message-actions {
                position: absolute;
                top: -24px;
                right: 8px;
                display: flex;
                gap: 6px;
                z-index: 100;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
            }
            .torn-message-selected .torn-message-actions {
                opacity: 1;
                pointer-events: all;
            }
            .torn-message-action-btn {
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(30, 30, 30, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
                padding: 2px;
            }
            .torn-message-action-btn:hover {
                background: rgba(50, 50, 50, 0.95);
                border-color: rgba(255, 255, 255, 0.4);
                transform: scale(1.1);
            }
            .torn-message-action-btn svg {
                width: 14px;
                height: 14px;
                fill: rgba(255, 255, 255, 0.7);
            }
            .torn-message-action-btn:hover svg {
                fill: rgba(255, 255, 255, 0.95);
            }
            .torn-filtered-message,
            div.torn-filtered-message,
            .root___NVIc9.torn-filtered-message {
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            .torn-filter-badge {
                display: inline-block;
                padding: 4px 12px;
                margin-left: 8px;
                background: #3b82f6;
                color: white;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s ease;
            }
            .torn-filter-badge:hover {
                background: #2563eb;
            }
            .torn-chat-scroll-bottom {
                scroll-behavior: smooth;
            }
        `;
        document.head.appendChild(style);
    }

    let observers = new Map(), processedMsgs = new WeakSet(), allProcessedMsgs = new WeakSet(),
        activeFilters = new Map(), filterBadges = new Map(), processTimeouts = new Map(),
        originalMessageOrders = new Map(), activeFilterUserInfos = new Map(),
        selectedMessages = new Map(), interactiveMessages = new WeakSet(), userInfoCache = new WeakMap(),
        delegatedEventSetup = new WeakSet();

    const SELECTORS = {
        chatRoot: '#chatRoot',
        allChatContainers: '.root___FmdS_.root___ZIY55[id*="public_"], .root___FmdS_.root___ZIY55[id*="private-"]',
        chat: ['.list___jqmw3', '[class*="list__"]', '[class*="scrollContainer__"]'],
        message: '[class*="list__"] > [class*="root__"], .root___NVIc9',
        body: '[class*="message___"], .body___KinHe, .message___xa4rE',
        sender: '[class*="sender___"], .senderContainer___ktdvO',
        textarea: '.textarea___V8HsV, textarea[class*="textarea"]',
        header: '.header___hEWvp, [class*="header"]'
    };

    const getAllChatContainers = () => document.querySelectorAll(SELECTORS.allChatContainers);
    const getChatContainer = (container) =>
        container && SELECTORS.chat.map(s => container.querySelector(s)).find(Boolean);
    const getHeader = (container) =>
        container && container.querySelector(SELECTORS.header);
    const isNewPlayersChat = (container) => container && container.id === 'public_newplayers';
    const getChatId = (container) => container ? container.id : null;

    const isQuestion = text => text && questionRegex.test(text);

    const getUserFromMessage = el => {
        if (userInfoCache.has(el)) {
            return userInfoCache.get(el);
        }

        const sender = el.querySelector(SELECTORS.sender);
        if (!sender) return null;
        const link = sender.querySelector('a[href*="profiles.php?XID="]');
        if (!link) return null;
        const xidMatch = link.getAttribute('href').match(/XID=(\d+)/);
        const textLink = sender.querySelector('a.sender___Ziikt, a[class*="sender"]');

        const userInfo = {
            xid: xidMatch?.[1],
            displayName: textLink?.textContent?.trim().replace(':', '') || ''
        };

        userInfoCache.set(el, userInfo);
        return userInfo;
    };

    const getChatTextarea = (container) => {
        if (!container) return null;
        return container.querySelector(SELECTORS.textarea);
    };

    const replyToUser = (displayName, container) => {
        const textarea = getChatTextarea(container);
        if (!textarea) return;

        const mention = `@${displayName} `;
        textarea.value = mention;
        textarea.focus();

        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const createActionButtons = (messageEl, userInfo, container) => {
        if (!userInfo?.displayName) return null;

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'torn-message-actions';

        const filterBtn = document.createElement('div');
        filterBtn.className = 'torn-message-action-btn';
        filterBtn.title = `Filter messages by ${userInfo.displayName}`;
        filterBtn.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
            </svg>
        `;
        filterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterByUser(userInfo, container);
            deselectMessage(container);
        });

        const replyBtn = document.createElement('div');
        replyBtn.className = 'torn-message-action-btn';
        replyBtn.title = `Reply to ${userInfo.displayName}`;
        replyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
            </svg>
        `;
        replyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            replyToUser(userInfo.displayName, container);
            deselectMessage(container);
        });

        actionsContainer.appendChild(filterBtn);
        actionsContainer.appendChild(replyBtn);

        return actionsContainer;
    };

    const deselectMessage = (container) => {
        const chatId = getChatId(container);
        if (!chatId) return;

        const selectedMessage = selectedMessages.get(chatId);
        if (selectedMessage) {
            selectedMessage.classList.remove('torn-message-selected');
            const actions = selectedMessage.querySelector('.torn-message-actions');
            if (actions) actions.remove();
            selectedMessages.delete(chatId);
        }
    };

    const selectMessage = (messageEl, container) => {
        const chatId = getChatId(container);
        if (!chatId) return;

        const selectedMessage = selectedMessages.get(chatId);

        if (selectedMessage === messageEl) {
            deselectMessage(container);
            return;
        }

        deselectMessage(container);

        const userInfo = getUserFromMessage(messageEl);
        if (!userInfo) return;

        selectedMessages.set(chatId, messageEl);
        messageEl.classList.add('torn-message-selected');

        const actions = createActionButtons(messageEl, userInfo, container);
        if (actions) {
            messageEl.appendChild(actions);
        }
    };

    const makeMessageInteractive = (messageEl) => {
        if (interactiveMessages.has(messageEl)) return;
        interactiveMessages.add(messageEl);
        messageEl.classList.add('torn-message-interactive');
    };

    const clearFilter = (container) => {
        const chatId = getChatId(container);
        if (!chatId) return;

        const activeFilter = activeFilters.get(chatId);
        if (!activeFilter) return;

        const chatContainer = getChatContainer(container);
        const originalMessageOrder = originalMessageOrders.get(chatId) || [];

        if (chatContainer && originalMessageOrder.length > 0) {
            originalMessageOrder.forEach(msg => {
                if (document.contains(msg)) chatContainer.appendChild(msg);
            });
            originalMessageOrders.delete(chatId);
        }

        container?.querySelectorAll('.torn-filtered-message').forEach(el => {
            el.classList.remove('torn-filtered-message');
        });

        const filterBadge = filterBadges.get(chatId);
        filterBadge?.remove();
        filterBadges.delete(chatId);
        activeFilters.delete(chatId);
        activeFilterUserInfos.delete(chatId);
    };

    const separateMessagesByUser = (msgs, userXid) => {
        const userMsgs = [];
        const otherMsgs = [];

        msgs.forEach(msg => {
            const msgUser = getUserFromMessage(msg);
            if (msgUser?.xid === userXid) {
                userMsgs.push(msg);
            } else {
                otherMsgs.push(msg);
            }
        });

        return { userMsgs, otherMsgs };
    };

    const applyFilterClasses = (otherMsgs) => {
        otherMsgs.forEach(msg => msg.classList.add('torn-filtered-message'));
    };

    const reorderMessages = (chatContainer, otherMsgs, userMsgs) => {
        otherMsgs.forEach(msg => chatContainer.appendChild(msg));
        userMsgs.forEach(msg => chatContainer.appendChild(msg));
    };

    const applyFilter = (msgs, container) => {
        const chatId = getChatId(container);
        if (!chatId) return;

        const activeFilter = activeFilters.get(chatId);
        const activeFilterUserInfo = activeFilterUserInfos.get(chatId);
        if (!activeFilter || !activeFilterUserInfo) return;

        const { otherMsgs } = separateMessagesByUser(msgs, activeFilterUserInfo.xid);
        applyFilterClasses(otherMsgs);
    };

    const reapplyFilterOrder = (container) => {
        const chatId = getChatId(container);
        if (!chatId) return;

        const activeFilter = activeFilters.get(chatId);
        const activeFilterUserInfo = activeFilterUserInfos.get(chatId);
        if (!activeFilter || !activeFilterUserInfo) return;

        const chatContainer = getChatContainer(container);
        if (!chatContainer) return;

        const allMsgs = Array.from(container.querySelectorAll(SELECTORS.message));
        const originalMessageOrder = originalMessageOrders.get(chatId) || [];

        allMsgs.forEach(msg => {
            if (!originalMessageOrder.includes(msg)) {
                originalMessageOrder.push(msg);
            }
        });
        originalMessageOrders.set(chatId, originalMessageOrder);

        const { userMsgs, otherMsgs } = separateMessagesByUser(allMsgs, activeFilterUserInfo.xid);
        reorderMessages(chatContainer, otherMsgs, userMsgs);
    };

    const createFilterBadge = (header, displayName, container) => {
        const chatId = getChatId(container);
        if (!chatId) return;

        const badge = document.createElement('span');
        badge.className = 'torn-filter-badge';
        badge.textContent = `${displayName}`;
        badge.onclick = () => clearFilter(container);
        header.appendChild(badge);
        filterBadges.set(chatId, badge);
    };

    const ensureFilterBadge = (container) => {
        const chatId = getChatId(container);
        if (!chatId) return;

        const activeFilter = activeFilters.get(chatId);
        if (!activeFilter) return;

        const header = getHeader(container);
        if (!header || header.querySelector('.torn-filter-badge')) return;

        const activeFilterUserInfo = activeFilterUserInfos.get(chatId);
        createFilterBadge(header, activeFilterUserInfo?.displayName || 'User', container);
    };

    const filterByUser = (userInfo, container) => {
        if (!userInfo?.xid || !container) return;
        const chatId = getChatId(container);
        if (!chatId) return;

        clearFilter(container);
        activeFilters.set(chatId, userInfo.xid);
        activeFilterUserInfos.set(chatId, userInfo);

        const chatContainer = getChatContainer(container);
        if (!chatContainer) return;

        const allMsgs = Array.from(container.querySelectorAll(SELECTORS.message));
        originalMessageOrders.set(chatId, [...allMsgs]);

        const { userMsgs, otherMsgs } = separateMessagesByUser(allMsgs, userInfo.xid);
        applyFilterClasses(otherMsgs);
        reorderMessages(chatContainer, otherMsgs, userMsgs);

        requestAnimationFrame(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });

        const header = getHeader(container);
        if (header) createFilterBadge(header, userInfo.displayName, container);
    };

    const highlightMessage = (el, isNew = false) => {
        if (processedMsgs.has(el)) return;
        processedMsgs.add(el);

        el.classList.add('torn-question-highlighted', 'torn-question-highlight');
        if (isNew) {
            el.classList.add('new-question');
            setTimeout(() => el.classList.remove('new-question'), 1000);
        }

        const sender = el.querySelector(SELECTORS.sender);
        if (sender && !sender.querySelector('.torn-question-icon')) {
            const icon = document.createElement('span');
            icon.className = 'torn-question-icon';
            icon.textContent = '❓';

            const link = sender.querySelector('a[href*="profiles.php"]:not([data-label="avatar"])');
            (link?.parentNode || sender).insertBefore(icon, link?.nextSibling);
        }
    };

    const processMessage = (el, container, isNew = false) => {
        if (allProcessedMsgs.has(el)) return;
        allProcessedMsgs.add(el);

        makeMessageInteractive(el);

        if (isNewPlayersChat(container)) {
            const body = el.querySelector(SELECTORS.body);
            if (body && isQuestion(body.textContent?.toLowerCase().trim())) {
                highlightMessage(el, isNew);
            }
        }
    };

    const debouncedProcess = (mutations, container) => {
        const chatId = getChatId(container);
        if (!chatId) return;

        const timeout = processTimeouts.get(chatId);
        clearTimeout(timeout);

        const newTimeout = setTimeout(() => {
            if (!container || !document.contains(container)) return;

            const newMsgs = new Set();
            for (const m of mutations) {
                if (m.type !== 'childList') continue;
                for (const n of m.addedNodes) {
                    if (n.nodeType === 1 && container.contains(n)) {
                        n.classList?.contains('root___NVIc9') ? newMsgs.add(n) :
                            n.querySelectorAll?.(SELECTORS.message).forEach(msg => newMsgs.add(msg));
                    }
                }
            }

            const activeFilter = activeFilters.get(chatId);
            newMsgs.forEach(m => {
                processMessage(m, container, true);
                if (activeFilter) {
                    const msgUser = getUserFromMessage(m);
                    if (msgUser?.xid && msgUser.xid !== activeFilter) {
                        m.classList.add('torn-filtered-message');
                    }
                }
            });
        }, CONFIG.debounceDelay);

        processTimeouts.set(chatId, newTimeout);
    };

    const processExisting = (container) => {
        if (!container || !document.contains(container)) return;

        const msgs = container.querySelectorAll(SELECTORS.message);
        const recent = msgs.length > CONFIG.maxMessagesToCheck ?
            Array.from(msgs).slice(-CONFIG.maxMessagesToCheck) : msgs;

        recent.forEach(m => processMessage(m, container));

        const chatId = getChatId(container);
        const activeFilter = activeFilters.get(chatId);
        if (activeFilter) {
            applyFilter(msgs, container);
            reapplyFilterOrder(container);
            ensureFilterBadge(container);
        }
    };

    const checkActive = (container) => {
        return container?.classList.contains('visible___dJHqr') && container.style.display !== 'none';
    };

    const setupDelegatedEvents = (chatContainer, container) => {
        if (delegatedEventSetup.has(chatContainer)) return;
        delegatedEventSetup.add(chatContainer);

        chatContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.closest('a') ||
                e.target.closest('.torn-message-action-btn')) {
                return;
            }

            const messageEl = e.target.closest(SELECTORS.message);
            if (messageEl && interactiveMessages.has(messageEl)) {
                selectMessage(messageEl, container);
            }
        });
    };

    const initChatContainer = (container) => {
        if (!container) return;
        const chatId = getChatId(container);
        if (!chatId) return;

        if (!checkActive(container)) return;

        const chatContainer = getChatContainer(container);
        if (!chatContainer) return;

        const existingObserver = observers.get(chatId);
        existingObserver?.disconnect();

        setupDelegatedEvents(chatContainer, container);

        processExisting(container);

        const observer = new MutationObserver((mutations) => {
            debouncedProcess(mutations, container);
        });
        observer.observe(chatContainer, { childList: true, subtree: true });
        observers.set(chatId, observer);
    };

    const initAllChats = () => {
        const allContainers = getAllChatContainers();
        allContainers.forEach(container => {
            initChatContainer(container);
        });
    };

    const monitorInterval = setInterval(() => {
        initAllChats();

        observers.forEach((observer, chatId) => {
            const container = document.getElementById(chatId);
            if (!container || !document.contains(container)) {
                observer.disconnect();
                observers.delete(chatId);
                processTimeouts.delete(chatId);
            }
        });
    }, CONFIG.reconnectCheckInterval);

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(() => {
                const allContainers = getAllChatContainers();
                allContainers.forEach(container => {
                    if (checkActive(container) && observers.has(getChatId(container))) {
                        processExisting(container);
                    }
                });
            }, 300);
        }
    });

    document.addEventListener('click', (e) => {
        selectedMessages.forEach((message, chatId) => {
            const container = document.getElementById(chatId);
            if (container && !container.contains(e.target)) {
                deselectMessage(container);
            }
        });
    }, true);

    document.readyState === 'loading' ?
        document.addEventListener('DOMContentLoaded', initAllChats) : initAllChats();

    setTimeout(initAllChats, 2000);

    window.addEventListener('beforeunload', () => {
        observers.forEach(observer => observer.disconnect());
        clearInterval(monitorInterval);
    });

})();
