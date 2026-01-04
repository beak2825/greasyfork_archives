// ==UserScript==
// @name         ChatGPT | Table of Contents / TOC
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      3.3
// @author       Piknockyou (vibe-coded; see credits below)
// @license      AGPL-3.0
// @description  Floating Table of Contents sidebar for ChatGPT conversations. Uses backend API for 100% accuracy (no lazy-loading gaps). Draggable toggle button, expandable message headers, click-to-navigate, persistent state.
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557549/ChatGPT%20%7C%20Table%20of%20Contents%20%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/557549/ChatGPT%20%7C%20Table%20of%20Contents%20%20TOC.meta.js
// ==/UserScript==

/*
 * CREDITS & ATTRIBUTION:
 * This Userscript is heavily inspired by the "Scroll" extension by Asker Kurtelli.
 * Original Extension: https://github.com/asker-kurtelli/scroll
 *
 * DIFFERENCE IN ARCHITECTURE:
 * While the UI concept is derived from Scroll, this script utilizes a different backend approach.
 * Instead of scraping the DOM (which relies on messages being rendered), this script fetches
 * the conversation tree directly from ChatGPT's internal `backend-api`. This ensures the
 * Table of Contents is always 100% complete and accurate, bypassing ChatGPT's lazy-loading/virtualization
 * mechanisms that often hide messages from the DOM when they are off-screen.
 */

(function () {
    'use strict';

    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    const CONFIG = {
        defaultWidth: 300,
        headerOffset: 80,
        debounceDelay: 1500,
        buttonSize: 40,
        storageKeys: {
            isOpen: 'chatgpt-toc-isOpen',
            position: 'chatgpt-toc-position'
        },
        colors: {
            bg: '#171717',
            border: '#333',
            text: '#ececec',
            subText: '#999',
            hover: '#2a2a2a',
            userIcon: '#999',
            aiIcon: '#10a37f'
        },
        icons: {
            user: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
            ai: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,
            arrowRight: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
            arrowDown: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`
        }
    };

    // =========================================================================
    // STATE MANAGEMENT (GM Storage)
    // =========================================================================
    function loadIsOpenState() {
        return GM_getValue(CONFIG.storageKeys.isOpen, true);
    }

    function saveIsOpenState(isOpen) {
        GM_setValue(CONFIG.storageKeys.isOpen, isOpen);
    }

    function loadPosition() {
        return GM_getValue(CONFIG.storageKeys.position, { ratioX: 1, ratioY: 0 });
    }

    function savePosition(ratioX, ratioY) {
        GM_setValue(CONFIG.storageKeys.position, { ratioX, ratioY });
    }

    const state = {
        isOpen: loadIsOpenState(),
        accessToken: null,
        elements: {},
        expandedItems: new Set(),
        cachedItems: [],
        isDragging: false
    };

    // =========================================================================
    // UI INITIALIZATION
    // =========================================================================

    // --- Position Management ---
    function setButtonPosition(btn, ratioX, ratioY) {
        const margin = 10;
        const maxX = window.innerWidth - CONFIG.buttonSize - margin;
        const maxY = window.innerHeight - CONFIG.buttonSize - margin;
        btn.style.left = `${Math.max(margin, ratioX * maxX)}px`;
        btn.style.top = `${Math.max(margin, ratioY * maxY)}px`;
    }

    function applyButtonPosition() {
        if (!state.elements.toggle) return;
        const { ratioX, ratioY } = loadPosition();
        setButtonPosition(state.elements.toggle, ratioX, ratioY);
    }

    // --- Smart Sidebar Positioning ---
    function calculateSidebarPosition(btnRect) {
        const margin = 10;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const sidebarWidth = CONFIG.defaultWidth;
        const maxHeight = vh - 2 * margin - 20;

        // Determine if button is in left or right half
        const buttonInLeftHalf = btnRect.left < vw / 2;
        // Determine if button is in top or bottom half
        const buttonInTopHalf = btnRect.top < vh / 2;

        let left, top, height;

        // Horizontal positioning
        if (buttonInLeftHalf) {
            // Position to the right of button, or below if no space
            if (btnRect.right + margin + sidebarWidth <= vw - margin) {
                left = btnRect.right + margin;
            } else {
                left = Math.max(margin, Math.min(btnRect.left, vw - sidebarWidth - margin));
            }
        } else {
            // Position to the left of button, or below if no space
            if (btnRect.left - margin - sidebarWidth >= margin) {
                left = btnRect.left - margin - sidebarWidth;
            } else {
                left = Math.max(margin, Math.min(btnRect.right - sidebarWidth, vw - sidebarWidth - margin));
            }
        }

        // Vertical positioning
        if (buttonInTopHalf) {
            // Align top with button, extend downward
            top = btnRect.top;
            height = Math.min(maxHeight, vh - top - margin);
        } else {
            // Align bottom with button, extend upward
            const bottom = vh - btnRect.bottom;
            height = Math.min(maxHeight, vh - bottom - margin);
            top = vh - bottom - height;
        }

        // Final clamping
        top = Math.max(margin, Math.min(top, vh - 100));
        left = Math.max(margin, Math.min(left, vw - sidebarWidth - margin));
        height = Math.max(150, height);

        return { left, top, height };
    }

    function updateSidebarPosition() {
        const { toggle, sidebar } = state.elements;
        if (!toggle || !sidebar) return;

        const btnRect = toggle.getBoundingClientRect();
        const pos = calculateSidebarPosition(btnRect);

        sidebar.style.left = `${pos.left}px`;
        sidebar.style.top = `${pos.top}px`;
        sidebar.style.right = 'auto';
        sidebar.style.maxHeight = `${pos.height}px`;
    }

    // --- Drag Handling ---
    function startDrag(e, toggle) {
        state.isDragging = true;

        const rect = toggle.getBoundingClientRect();
        const offX = e.clientX - rect.left;
        const offY = e.clientY - rect.top;

        toggle.style.cursor = 'grabbing';

        const onMove = (ev) => {
            const margin = 10;
            const x = Math.max(margin, Math.min(window.innerWidth - CONFIG.buttonSize - margin, ev.clientX - offX));
            const y = Math.max(margin, Math.min(window.innerHeight - CONFIG.buttonSize - margin, ev.clientY - offY));
            toggle.style.left = `${x}px`;
            toggle.style.top = `${y}px`;
        };

        const onUp = () => {
            toggle.style.cursor = 'pointer';
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);

            // Save final position
            const finalRect = toggle.getBoundingClientRect();
            const margin = 10;
            const maxX = window.innerWidth - CONFIG.buttonSize - margin;
            const maxY = window.innerHeight - CONFIG.buttonSize - margin;
            const rx = maxX > 0 ? (finalRect.left - margin) / maxX : 0;
            const ry = maxY > 0 ? (finalRect.top - margin) / maxY : 0;
            savePosition(Math.max(0, Math.min(1, rx)), Math.max(0, Math.min(1, ry)));

            setTimeout(() => {
                state.isDragging = false;
            }, 50);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    // --- Toggle Sidebar ---
    function toggleSidebar() {
        state.isOpen = !state.isOpen;
        const { toggle, sidebar } = state.elements;

        if (state.isOpen) {
            updateSidebarPosition();
            sidebar.style.display = 'block';
        } else {
            sidebar.style.display = 'none';
        }

        updateToggleTooltip(toggle);
        saveIsOpenState(state.isOpen);
    }

    // --- Dynamic Tooltip ---
    function updateToggleTooltip(toggle) {
        if (state.isOpen) {
            toggle.title = 'Left-click: Close TOC\n\n(Close TOC to reposition button)';
        } else {
            toggle.title = 'Left-click: Open TOC\nRight-drag: Move button';
        }
    }

    // --- Main Init ---
    function initUI() {
        const toggle = document.createElement('div');
        toggle.innerHTML = '☰';
        toggle.style.cssText = `
            position: fixed;
            width: ${CONFIG.buttonSize}px; height: ${CONFIG.buttonSize}px;
            background: ${CONFIG.colors.bg}; color: ${CONFIG.colors.text};
            border: 1px solid ${CONFIG.colors.border}; border-radius: 8px;
            z-index: 10001; display: flex; align-items: center; justify-content: center;
            cursor: pointer; font-size: 20px; user-select: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: transform 0.1s, box-shadow 0.2s;
        `;

        // Apply saved position and initial tooltip
        const { ratioX, ratioY } = loadPosition();
        setButtonPosition(toggle, ratioX, ratioY);
        updateToggleTooltip(toggle);

        // Left-click: Toggle sidebar (only if not mid-drag)
        toggle.addEventListener('click', (e) => {
            if (e.button === 0 && !state.isDragging) {
                toggleSidebar();
            }
        });

        // Prevent context menu
        toggle.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        // Right-click drag: Only when TOC is closed
        toggle.addEventListener('mousedown', (e) => {
            if (e.button === 2) {
                e.preventDefault();
                if (!state.isOpen) {
                    startDrag(e, toggle);
                }
            }
        });

        // Hover effect
        toggle.addEventListener('mouseenter', () => {
            toggle.style.transform = 'scale(1.05)';
            toggle.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        });
        toggle.addEventListener('mouseleave', () => {
            toggle.style.transform = 'scale(1)';
            toggle.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });

        const sidebar = document.createElement('div');
        sidebar.style.cssText = `
            position: fixed;
            width: ${CONFIG.defaultWidth}px;
            background: ${CONFIG.colors.bg}; border: 1px solid ${CONFIG.colors.border};
            border-radius: 12px; z-index: 10000;
            display: none;
            overflow-y: auto; overflow-x: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
            font-family: Söhne, ui-sans-serif, system-ui, -apple-system, sans-serif;
            font-size: 13px; color: ${CONFIG.colors.text};
            resize: horizontal; direction: rtl;
        `;

        const content = document.createElement('div');
        content.id = 'toc-content';
        content.style.cssText = 'direction: ltr; padding: 10px;';
        content.innerHTML = '<div style="padding:10px; color:#888;">Initializing...</div>';

        sidebar.appendChild(content);
        document.body.appendChild(toggle);
        document.body.appendChild(sidebar);

        state.elements = { toggle, sidebar, content };

        // Show sidebar if was open, with proper positioning
        if (state.isOpen) {
            updateSidebarPosition();
            sidebar.style.display = 'block';
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            applyButtonPosition();
            if (state.isOpen) {
                updateSidebarPosition();
            }
        });
    }

    // =========================================================================
    // API LOGIC
    // =========================================================================
    async function getAccessToken() {
        try {
            const resp = await fetch('/api/auth/session');
            if (resp.ok) {
                const data = await resp.json();
                return data.accessToken;
            }
        } catch (e) {
            // Silent fail
        }
        return null;
    }

    function getUUID() {
        const match = window.location.pathname.match(/\/c\/([a-f0-9-]{36})/);
        return match ? match[1] : null;
    }

    async function loadConversation() {
        const contentDiv = state.elements.content;
        const uuid = getUUID();

        if (!uuid) {
            contentDiv.innerHTML = '<div style="padding:10px; color:#aaa;">No Conversation ID.</div>';
            return;
        }

        if (!state.accessToken) {
            state.accessToken = await getAccessToken();
        }
        if (!state.accessToken) return;

        // Only show loading on initial load
        if (!contentDiv.textContent.includes('TOC (')) {
            contentDiv.innerHTML = '<div style="padding:10px; color:#aaa;">Loading...</div>';
        }

        try {
            const response = await fetch(`/backend-api/conversation/${uuid}`, {
                headers: {
                    'Authorization': `Bearer ${state.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            processData(data);
        } catch (err) {
            contentDiv.innerHTML = `<div style="padding:10px; color:#f87171;">Error: ${err.message}</div>`;
        }
    }

    // =========================================================================
    // DATA PROCESSING
    // =========================================================================
    function extractHeaders(text) {
        const headers = [];
        const lines = text.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Markdown headers (# Header)
            const mdMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
            if (mdMatch) {
                headers.push({
                    type: 'markdown',
                    text: mdMatch[2].trim(),
                    level: mdMatch[1].length
                });
                continue;
            }

            // Bold headers (**Header** or __Header__)
            const boldMatch = trimmed.match(/^(\*\*|__)(.+?)\1:?$/);
            if (boldMatch) {
                headers.push({
                    type: 'bold',
                    text: boldMatch[2].trim(),
                    level: 3
                });
            }
        }
        return headers;
    }

    function processData(data) {
        if (!data.mapping || !data.current_node) return;

        const thread = [];
        let currId = data.current_node;

        while (currId) {
            const node = data.mapping[currId];
            if (!node) break;

            const msg = node.message;
            if (msg?.content?.parts?.length > 0) {
                const isSystem = msg.author.role === 'system';
                const isInternal = msg.recipient && msg.recipient !== 'all';

                if (!isSystem && !isInternal) {
                    let text = '';
                    if (typeof msg.content.parts[0] === 'string') {
                        text = msg.content.parts[0];
                    } else if (msg.content.content_type === 'code') {
                        text = 'Code Block';
                    }

                    if (text.trim()) {
                        thread.push({
                            id: msg.id,
                            role: msg.author.role,
                            text: text,
                            headers: extractHeaders(text)
                        });
                    }
                }
            }
            currId = node.parent;
        }

        thread.reverse();
        state.cachedItems = thread;
        renderTOC(thread);
    }

    // =========================================================================
    // RENDERING
    // =========================================================================
    function renderTOC(items) {
        const container = document.createElement('div');

        // Header
        const header = document.createElement('div');
        header.style.cssText = 'padding-bottom:10px; border-bottom:1px solid #333; margin-bottom:10px; font-weight:700; font-size:14px; color:#fff;';
        header.textContent = `TOC (${items.length})`;
        container.appendChild(header);

        // Items
        items.forEach(item => {
            const hasHeaders = item.headers.length > 0;
            const isExpanded = state.expandedItems.has(item.id);
            const isUser = item.role === 'user';

            // Main row
            const row = document.createElement('div');
            row.style.cssText = `
                padding: 6px 4px; border-radius: 6px; margin-bottom: 2px;
                display: flex; align-items: center; gap: 6px;
                cursor: pointer; transition: background 0.1s; min-width: 0;
            `;
            row.onmouseenter = () => row.style.background = CONFIG.colors.hover;
            row.onmouseleave = () => row.style.background = 'transparent';
            row.onclick = () => scrollToMessage(item.id);

            // Arrow
            const arrowBox = document.createElement('div');
            arrowBox.style.cssText = `
                width: 16px; height: 16px; flex-shrink: 0;
                display: flex; align-items: center; justify-content: center;
                color: ${CONFIG.colors.subText};
            `;
            if (hasHeaders) {
                arrowBox.innerHTML = isExpanded ? CONFIG.icons.arrowDown : CONFIG.icons.arrowRight;
                arrowBox.onclick = (e) => {
                    e.stopPropagation();
                    toggleExpand(item.id);
                };
                arrowBox.onmouseenter = () => arrowBox.style.color = '#fff';
                arrowBox.onmouseleave = () => arrowBox.style.color = CONFIG.colors.subText;
            }
            row.appendChild(arrowBox);

            // Role icon
            const iconBox = document.createElement('div');
            iconBox.style.cssText = `
                width: 16px; height: 16px; flex-shrink: 0;
                color: ${isUser ? CONFIG.colors.userIcon : CONFIG.colors.aiIcon};
            `;
            iconBox.innerHTML = isUser ? CONFIG.icons.user : CONFIG.icons.ai;
            row.appendChild(iconBox);

            // Title
            const titleSpan = document.createElement('span');
            const cleanTitle = item.text.split('\n')[0].replace(/[#*`_]/g, '').trim() || 'Message';
            titleSpan.textContent = cleanTitle;
            titleSpan.style.cssText = `
                flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                font-weight: ${isUser ? '400' : '500'};
                color: ${isUser ? '#bbb' : '#fff'};
                font-size: 13px;
            `;
            row.appendChild(titleSpan);

            container.appendChild(row);

            // Subheaders
            if (hasHeaders && isExpanded) {
                const subContainer = document.createElement('div');
                subContainer.style.cssText = `
                    margin-left: 22px; border-left: 1px solid ${CONFIG.colors.border};
                    padding-left: 4px; margin-bottom: 4px;
                `;

                item.headers.forEach(h => {
                    const subRow = document.createElement('div');
                    subRow.textContent = h.text;
                    subRow.title = h.text;
                    subRow.style.cssText = `
                        padding: 4px 8px; cursor: pointer; font-size: 12px;
                        color: ${CONFIG.colors.subText};
                        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                        border-radius: 4px;
                    `;
                    subRow.onmouseenter = () => {
                        subRow.style.color = CONFIG.colors.text;
                        subRow.style.background = CONFIG.colors.hover;
                    };
                    subRow.onmouseleave = () => {
                        subRow.style.color = CONFIG.colors.subText;
                        subRow.style.background = 'transparent';
                    };
                    subRow.onclick = (e) => {
                        e.stopPropagation();
                        scrollToHeader(item.id, h.text);
                    };
                    subContainer.appendChild(subRow);
                });

                container.appendChild(subContainer);
            }
        });

        state.elements.content.innerHTML = '';
        state.elements.content.appendChild(container);
    }

    function toggleExpand(id) {
        if (state.expandedItems.has(id)) {
            state.expandedItems.delete(id);
        } else {
            state.expandedItems.add(id);
        }
        renderTOC(state.cachedItems);
    }

    // =========================================================================
    // NAVIGATION
    // =========================================================================
    function scrollToMessage(messageId) {
        const el = document.querySelector(`[data-message-id="${messageId}"]`);
        if (el) {
            smartScrollTo(el);
            flashElement(el);
        }
    }

    function scrollToHeader(messageId, headerText) {
        const messageEl = document.querySelector(`[data-message-id="${messageId}"]`);
        if (!messageEl) return;

        const candidates = messageEl.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b');
        const target = Array.from(candidates).find(el => {
            const elText = el.innerText.trim();
            return elText && (elText.includes(headerText) || headerText.includes(elText));
        });

        if (target) {
            smartScrollTo(target);
            flashElement(target);
        } else {
            smartScrollTo(messageEl);
            flashElement(messageEl);
        }
    }

    function smartScrollTo(element) {
        let scrollContainer = element.parentElement;

        while (scrollContainer && scrollContainer !== document.body) {
            const style = window.getComputedStyle(scrollContainer);
            const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
                                 scrollContainer.scrollHeight > scrollContainer.clientHeight;
            if (isScrollable) break;
            scrollContainer = scrollContainer.parentElement;
        }

        if (scrollContainer && scrollContainer !== document.body) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            const relativeTop = elementRect.top - containerRect.top;
            const targetPosition = scrollContainer.scrollTop + relativeTop - CONFIG.headerOffset;

            scrollContainer.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        } else {
            element.scrollIntoView({ behavior: 'instant', block: 'start' });
            setTimeout(() => {
                const scrollable = document.querySelector('[class*="react-scroll-to-bottom"]') ||
                                   document.querySelector('main');
                if (scrollable) {
                    scrollable.scrollBy({ top: -CONFIG.headerOffset, behavior: 'smooth' });
                }
            }, 50);
        }
    }

    function flashElement(el) {
        const originalTransition = el.style.transition;
        const originalBackground = el.style.backgroundColor;

        el.style.transition = 'background-color 0.4s ease';
        el.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';

        setTimeout(() => {
            el.style.backgroundColor = originalBackground;
            setTimeout(() => {
                el.style.transition = originalTransition;
            }, 400);
        }, 600);
    }

    // =========================================================================
    // AUTO-REFRESH OBSERVER
    // =========================================================================
    function setupObserver() {
        let lastUrl = location.href;
        let debounceTimer = null;
        const knownMessageIds = new Set();

        const observer = new MutationObserver((mutations) => {
            // URL change detection
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                state.expandedItems.clear();
                knownMessageIds.clear();
                clearTimeout(debounceTimer);
                loadConversation();
                return;
            }

            // New message detection
            if (!getUUID()) return;

            let foundNew = false;
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    const msgElements = [];
                    if (node.matches?.('[data-message-id]')) {
                        msgElements.push(node);
                    }
                    if (node.querySelectorAll) {
                        msgElements.push(...node.querySelectorAll('[data-message-id]'));
                    }

                    for (const el of msgElements) {
                        const id = el.getAttribute('data-message-id');
                        if (id && !knownMessageIds.has(id)) {
                            knownMessageIds.add(id);
                            foundNew = true;
                        }
                    }
                }
            }

            if (foundNew) {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(loadConversation, CONFIG.debounceDelay);
            }
        });

        observer.observe(document.body, { subtree: true, childList: true });
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================
    initUI();
    setTimeout(() => {
        loadConversation();
        setupObserver();
    }, CONFIG.debounceDelay);

})();