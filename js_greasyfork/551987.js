// ==UserScript==
// @name        ChatGPT Question Sidebar Navigation
// @namespace   vanilla-js-enhanced-fixed
// @version     2.3.0
// @description A lightweight, feature-rich question sidebar for ChatGPT with resizing, dark mode, hover-previews, pinning, and state persistence.
// @match       https://chatgpt.com/*
// @grant       GM_addStyle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/551987/ChatGPT%20Question%20Sidebar%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/551987/ChatGPT%20Question%20Sidebar%20Navigation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. STYLING ---
    const styles = `
        :root {
            --q-nav-bg: #fff;
            --q-nav-text: #333;
            --q-nav-text-secondary: #555;
            --q-nav-border: #e5e5e5;
            --q-nav-hover-bg: #f0f0f0;
            --q-nav-active-bg: #e7f3ff;
            --q-nav-active-text: #1a73e8;
            --q-nav-pin-color: #f6ad55;
            --q-nav-scrollbar-thumb: #ccc;
            --q-nav-scrollbar-track: #f1f1f1;
        }

        html.dark #q-nav-container, html.dark #q-nav-tooltip {
            --q-nav-bg: #2a2a2a;
            --q-nav-text: #f0f0f0;
            --q-nav-text-secondary: #bbb;
            --q-nav-border: #444;
            --q-nav-hover-bg: #3a3a3a;
            --q-nav-active-bg: #1a3c5f;
            --q-nav-active-text: #6ea7f1;
            --q-nav-pin-color: #f6ad55;
            --q-nav-scrollbar-thumb: #555;
            --q-nav-scrollbar-track: #333;
        }

        #q-nav-container {
            position: fixed;
            top: 10vh;
            right: 16px;
            height: auto;
            max-height: 70vh;
            background: var(--q-nav-bg);
            border: 1px solid var(--q-nav-border);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 12px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            font-size: 14px;
            z-index: 9999;
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            color: var(--q-nav-text);
            display: flex;
            flex-direction: column;
            min-width: 180px;
            max-width: 50vw;
        }

        #q-nav-container.q-nav-hidden {
            transform: translateX(calc(100% - 20px));
            opacity: 0.4;
        }

        #q-nav-container.q-nav-hidden:hover {
            transform: translateX(0);
            opacity: 1;
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        #q-nav-resizer {
            position: absolute;
            left: -5px;
            top: 0;
            width: 10px;
            height: 100%;
            cursor: col-resize;
            z-index: 10000;
        }

        #q-nav-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--q-nav-border);
            font-weight: 600;
            user-select: none;
        }

        #q-nav-toggle {
            cursor: pointer;
            padding: 2px;
        }

        #q-nav-list-wrapper {
            overflow-y: auto;
            margin-top: 10px;
            scrollbar-width: thin;
            scrollbar-color: var(--q-nav-scrollbar-thumb) var(--q-nav-scrollbar-track);
        }
        #q-nav-list-wrapper::-webkit-scrollbar { width: 6px; }
        #q-nav-list-wrapper::-webkit-scrollbar-track { background: var(--q-nav-scrollbar-track); border-radius: 3px; }
        #q-nav-list-wrapper::-webkit-scrollbar-thumb { background: var(--q-nav-scrollbar-thumb); border-radius: 3px; }
        #q-nav-list-wrapper::-webkit-scrollbar-thumb:hover { background: #888; }

        .q-nav-section-header {
            font-size: 12px;
            font-weight: bold;
            color: var(--q-nav-text-secondary);
            margin: 10px 0 5px;
            padding: 0 5px;
            text-transform: uppercase;
        }
        .q-nav-section-header:first-child { margin-top: 0; }
        .q-nav-section-divider {
            border: 0;
            border-top: 1px solid var(--q-nav-border);
            margin: 10px 0;
        }

        #q-nav-pinned-list, #q-nav-questions-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        #q-nav-list-wrapper li {
            position: relative;
            display: flex;
            align-items: center;
            padding: 8px 24px 8px 5px;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-radius: 4px;
            color: var(--q-nav-text-secondary);
        }

        #q-nav-list-wrapper li:hover {
            background-color: var(--q-nav-hover-bg);
        }

        #q-nav-list-wrapper li.q-nav-active {
            background-color: var(--q-nav-active-bg);
            color: var(--q-nav-active-text);
            font-weight: 500;
        }

        .q-nav-pin-icon {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.15s;
            fill: var(--q-nav-text-secondary);
        }

        #q-nav-list-wrapper li:hover .q-nav-pin-icon {
            opacity: 0.6;
        }
        .q-nav-pin-icon:hover {
            opacity: 1 !important;
            fill: var(--q-nav-pin-color) !important;
        }
        .q-nav-pinned .q-nav-pin-icon {
            opacity: 1;
            fill: var(--q-nav-pin-color);
        }

        #q-nav-tooltip {
            position: fixed;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            background: var(--q-nav-bg);
            border: 1px solid var(--q-nav-border);
            border-radius: 6px;
            padding: 8px 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            max-width: 400px;
            font-size: 13px;
            z-index: 10001;
            pointer-events: none;
            white-space: pre-wrap;
            line-height: 1.5;
            color: var(--q-nav-text);
        }
    `;

    const ICONS = {
        open: '👁️',
        closed: '👁️‍🗨️',
        pin: `<svg class="q-nav-pin-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
    };

    let sidebarElement = null;
    let tooltipElement = null;
    let questionElements = [];
    let activeIndex = -1;
    let scrollContainer = null;
    let isResizing = false;
    let pageObserver = null;
    let themeObserver = null;
    let currentPath = location.pathname;

    let settings = {
        isOpen: JSON.parse(localStorage.getItem('qNavSettings_isOpen')) ?? true,
        width: localStorage.getItem('qNavSettings_width') || '250px'
    };

    function saveSettings() {
        localStorage.setItem('qNavSettings_isOpen', JSON.stringify(settings.isOpen));
        localStorage.setItem('qNavSettings_width', settings.width);
    }

    function getConversationId() {
        try {
            return location.pathname.split('/c/')[1].split('/')[0];
        } catch (e) {
            return null;
        }
    }

    function loadPinnedItems(convoId) {
        if (!convoId) return [];
        return JSON.parse(localStorage.getItem(`qNavPinned_${convoId}`)) || [];
    }

    function savePinnedItems(convoId, items) {
        if (!convoId) return;
        localStorage.setItem(`qNavPinned_${convoId}`, JSON.stringify(items));
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function getChatContainer() {
        return document.querySelector("main .flex.flex-col.text-sm");
    }

    function queryQuestionElements() {
        const container = getChatContainer();
        if (!container) return [];
        return Array.from(container.querySelectorAll('div[data-message-author-role="user"]'));
    }

    function createSidebar() {
        if (document.getElementById('q-nav-container')) return;

        GM_addStyle(styles);

        sidebarElement = document.createElement('div');
        sidebarElement.id = 'q-nav-container';
        document.body.appendChild(sidebarElement);

        sidebarElement.innerHTML = `
            <div id="q-nav-resizer"></div>
            <div id="q-nav-header">
                <span>📄 Questions</span>
                <span id="q-nav-toggle" title="Toggle Sidebar"></span>
            </div>
            <div id="q-nav-list-wrapper">
                <div id="q-nav-pinned-section" style="display: none;">
                    <div class="q-nav-section-header">Pinned</div>
                    <ul id="q-nav-pinned-list"></ul>
                    <hr class="q-nav-section-divider" />
                </div>
                <div id="q-nav-questions-section" style="display: none;">
                     <div class="q-nav-section-header">Questions</div>
                     <ul id="q-nav-questions-list"></ul>
                </div>
            </div>
        `;

        tooltipElement = document.createElement('div');
        tooltipElement.id = 'q-nav-tooltip';
        document.body.appendChild(tooltipElement);

        sidebarElement.style.width = settings.width;
        if (!settings.isOpen) sidebarElement.classList.add('q-nav-hidden');
        sidebarElement.querySelector('#q-nav-toggle').innerHTML = settings.isOpen ? ICONS.open : ICONS.closed;

        addEventListeners();
        checkDarkMode();
    }

    function updateSidebar() {
        if (!sidebarElement) return;

        const convoId = getConversationId();
        const pinnedItems = loadPinnedItems(convoId);

        const pinnedList = sidebarElement.querySelector('#q-nav-pinned-list');
        const questionsList = sidebarElement.querySelector('#q-nav-questions-list');
        const pinnedSection = sidebarElement.querySelector('#q-nav-pinned-section');
        const questionsSection = sidebarElement.querySelector('#q-nav-questions-section');

        pinnedList.innerHTML = '';
        questionsList.innerHTML = '';

        questionElements = queryQuestionElements();
        const questionData = questionElements.map((el, index) => {
            const textContent = el.querySelector('.whitespace-pre-wrap')?.innerText.trim() || `Question ${index + 1}`;
            const answerEl = el.closest('article[data-turn-id]')?.nextElementSibling?.querySelector('[data-message-author-role="assistant"] .markdown.prose');
            const previewText = answerEl ? answerEl.innerText.trim().substring(0, 250) + (answerEl.innerText.length > 250 ? '...' : '') : '';
            return { el, index, textContent, previewText };
        });

        const pinnedData = [];
        const unpinnedData = [];

        questionData.forEach(item => {
            if (pinnedItems.includes(item.textContent)) {
                pinnedData.push(item);
            } else {
                unpinnedData.push(item);
            }
        });

        const renderItem = (item, isPinned) => {
            const listItem = document.createElement('li');
            listItem.textContent = item.textContent;
            listItem.dataset.index = item.index;
            listItem.dataset.text = item.textContent;
            listItem.dataset.preview = item.previewText;
            listItem.title = item.textContent;
            listItem.innerHTML = `${item.textContent}${ICONS.pin}`;

            if (isPinned) {
                listItem.classList.add('q-nav-pinned');
                pinnedList.appendChild(listItem);
            } else {
                questionsList.appendChild(listItem);
            }
        };

        pinnedData.forEach(item => renderItem(item, true));
        unpinnedData.forEach(item => renderItem(item, false));

        pinnedSection.style.display = pinnedData.length > 0 ? 'block' : 'none';
        questionsSection.style.display = unpinnedData.length > 0 ? 'block' : 'none';

        updateActiveHighlight();
    }

    function handleSidebarInteraction(event) {
        const target = event.target;

        if (target.closest('.q-nav-pin-icon')) {
            event.stopPropagation();
            const listItem = target.closest('li');
            const text = listItem.dataset.text;
            const convoId = getConversationId();
            let pinnedItems = loadPinnedItems(convoId);

            if (pinnedItems.includes(text)) {
                pinnedItems = pinnedItems.filter(item => item !== text);
            } else {
                pinnedItems.push(text);
            }
            savePinnedItems(convoId, pinnedItems);
            updateSidebar();
        } else if (target.closest('li')) {
            if (isResizing) return;
            const index = parseInt(target.closest('li').dataset.index, 10);
            if (!isNaN(index) && questionElements[index]) {
                questionElements[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateActiveHighlight(index);
            }
        }
    }

    const throttledUpdateActiveHighlight = throttle(updateActiveHighlight, 100);

    function updateActiveHighlight(forceIndex = null) {
        if (!sidebarElement || !scrollContainer) return;

        let newActiveIndex = -1;

        if (forceIndex !== null) {
            newActiveIndex = forceIndex;
        } else {
            const threshold = scrollContainer.getBoundingClientRect().top + 100;
            for (let i = questionElements.length - 1; i >= 0; i--) {
                if (questionElements[i].getBoundingClientRect().top <= threshold) {
                    newActiveIndex = i;
                    break;
                }
            }
            if (scrollContainer.scrollHeight - scrollContainer.scrollTop <= scrollContainer.clientHeight + 5) {
                newActiveIndex = questionElements.length - 1;
            }
        }

        if (newActiveIndex !== activeIndex) {
            activeIndex = newActiveIndex;
            const listItems = sidebarElement.querySelectorAll('#q-nav-list-wrapper li');
            let activeLi = null;
            listItems.forEach(li => {
                const isActive = parseInt(li.dataset.index) === activeIndex;
                li.classList.toggle('q-nav-active', isActive);
                if (isActive) activeLi = li;
            });

            if (activeLi) {
                activeLi.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    function addEventListeners() {
        const toggle = sidebarElement.querySelector('#q-nav-toggle');
        const resizer = sidebarElement.querySelector('#q-nav-resizer');
        const listWrapper = sidebarElement.querySelector('#q-nav-list-wrapper');

        toggle.addEventListener('click', () => {
            settings.isOpen = !settings.isOpen;
            sidebarElement.classList.toggle('q-nav-hidden');
            toggle.innerHTML = settings.isOpen ? ICONS.open : ICONS.closed;
            saveSettings();
        });

        resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            const startX = e.clientX;
            const startWidth = sidebarElement.offsetWidth;

            const doDrag = (dragEvent) => {
                const newWidth = startWidth - (dragEvent.clientX - startX);
                if (newWidth > 180 && newWidth < window.innerWidth * 0.5) {
                    settings.width = `${newWidth}px`;
                    sidebarElement.style.width = settings.width;
                }
            };
            const stopDrag = () => {
                document.removeEventListener('mousemove', doDrag);
                document.removeEventListener('mouseup', stopDrag);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                saveSettings();
                setTimeout(() => { isResizing = false; }, 100);
            };
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        });

        listWrapper.addEventListener('click', handleSidebarInteraction);

        listWrapper.addEventListener('mouseover', e => {
            const li = e.target.closest('li');
            if (li && li.dataset.preview) {
                tooltipElement.textContent = li.dataset.preview;
                tooltipElement.style.opacity = '1';
            }
        });
        listWrapper.addEventListener('mouseout', () => {
            tooltipElement.style.opacity = '0';
        });
        listWrapper.addEventListener('mousemove', e => {
            if (tooltipElement.style.opacity === '1') {
                const tooltipRect = tooltipElement.getBoundingClientRect();
                let x = e.clientX + 15;
                let y = e.clientY + 15;

                if (x + tooltipRect.width > window.innerWidth - 10) {
                    x = e.clientX - tooltipRect.width - 15;
                }
                if (y + tooltipRect.height > window.innerHeight - 10) {
                    y = e.clientY - tooltipRect.height - 15;
                }

                tooltipElement.style.left = `${x}px`;
                tooltipElement.style.top = `${y}px`;
            }
        });

        scrollContainer = getChatContainer()?.parentElement;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', throttledUpdateActiveHighlight);
        }
    }

    function checkDarkMode() {
        const isDark = document.documentElement.classList.contains('dark');
        sidebarElement?.classList.toggle('q-nav-dark', isDark);
        tooltipElement?.classList.toggle('q-nav-dark', isDark);
    }

    function initialize() {
        const chatContainer = getChatContainer();
        if (chatContainer && queryQuestionElements().length > 0) {
            if (!sidebarElement) {
                createSidebar();
            }
            updateSidebar();

            if (!pageObserver) {
                pageObserver = new MutationObserver(throttle(updateSidebar, 500));
                pageObserver.observe(chatContainer, { childList: true, subtree: true });
            }
        } else {
            destroy();
        }
    }

    function destroy() {
        if (sidebarElement) {
            sidebarElement.remove();
            sidebarElement = null;
        }
        if (tooltipElement) {
            tooltipElement.remove();
            tooltipElement = null;
        }
        if (pageObserver) {
            pageObserver.disconnect();
            pageObserver = null;
        }
        if (scrollContainer) {
            scrollContainer.removeEventListener('scroll', throttledUpdateActiveHighlight);
            scrollContainer = null;
        }
        questionElements = [];
        activeIndex = -1;
    }

    setInterval(() => {
        const newPath = location.pathname;
        const chatContainer = getChatContainer();

        if (newPath !== currentPath) {
            currentPath = newPath;
            destroy();
            setTimeout(initialize, 2000);
        } else if (!sidebarElement && chatContainer && queryQuestionElements().length > 0) {
            initialize();
        } else if (sidebarElement && !chatContainer) {
            destroy();
        }
    }, 500);

    themeObserver = new MutationObserver(checkDarkMode);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})();