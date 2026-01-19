// ==UserScript==
// @name         DeepSeek Folder Organizer
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Advanced folder organization for DeepSeek conversations
// @author       You
// @match        https://chat.deepseek.com/*
// @icon         https://chat.deepseek.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/563256/DeepSeek%20Folder%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/563256/DeepSeek%20Folder%20Organizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('=== DeepSeek Folder Organizer Loading ===');

    // Storage keys
    const FOLDERS_KEY = 'deepseek_folders';
    const ASSIGNMENTS_KEY = 'deepseek_assignments';
    const SETTINGS_KEY = 'deepseek_settings';

    // No default folders - start with empty array
    const AVAILABLE_ICONS = [
        // Folder icons
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M2 8h20"/></svg>',

        // File/document icons
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',

        // Category icons
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',

        // Code/tech icons
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>',

        // Star/favorite icons
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',

        // Learning/education icons
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m4 19 8-8"/><path d="m20 5-8 8"/><path d="m15 4 5 5"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',

        // Personal icons
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',

        // Work icons
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 3v4"/><path d="M8 3v4"/><path d="M4 11h16"/></svg>',

        // Miscellaneous icons
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
    ];

    // Available colors
    const AVAILABLE_COLORS = ['#10a37f', '#4285f4', '#ea4335', '#fbbc04', '#34a853', '#7b7b7b', '#a142f4', '#f442d7', '#42f4e8', '#f4a142'];

    // Global state
    let isFolderSidebarVisible = false;
    let selectedFolderId = null;

    // Initialize storage
    function initializeStorage() {
        if (!GM_getValue(FOLDERS_KEY)) {
            GM_setValue(FOLDERS_KEY, []); // Empty array, no default folders
        }
        if (!GM_getValue(ASSIGNMENTS_KEY)) {
            GM_setValue(ASSIGNMENTS_KEY, {});
        }
        if (!GM_getValue(SETTINGS_KEY)) {
            GM_setValue(SETTINGS_KEY, {
                showFolderTags: true,
                autoCategorize: false,
                sidebarWidth: '220'
            });
        }
    }

    // Wait for page to fully load
    setTimeout(init, 2000);

    // Mutation observer for dynamic content
    let observer;

    function init() {
        console.log('Initializing Folder Organizer...');

        initializeStorage();

        // Add the folder button to the sidebar
        addFolderButton();

        // Setup folder sidebar
        setupFolderSidebar();

        // Setup observer for conversation list changes
        setupMutationObserver();

        // Apply folder tags to existing conversations
        applyFolderTags();

        // Add global click listener to close context menus
        document.addEventListener('click', () => {
            hideContextMenu();
            hideFolderMenu();
        });
    }

    function setupMutationObserver() {
        const targetNode = document.querySelector('div[class*="_5a8ac7a"]')?.parentElement;
        if (!targetNode) {
            console.log('Target node not found, retrying...');
            setTimeout(setupMutationObserver, 1000);
            return;
        }

        observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                }
            });
            if (shouldUpdate) {
                setTimeout(applyFolderTags, 500);
                setTimeout(updateFolderCounts, 500);
            }
        });

        observer.observe(targetNode, { childList: true, subtree: true });
    }

    function addFolderButton() {
        // Try to find the sidebar container where buttons are
        const sidebarSelectors = [
            'nav[class*="sidebar"]',
            'div[class*="sidebar"]',
            'div[class*="chat-sidebar"]',
            'div[class*="conversations"]'
        ];

        let sidebarContainer;
        for (const selector of sidebarSelectors) {
            sidebarContainer = document.querySelector(selector);
            if (sidebarContainer) break;
        }

        if (!sidebarContainer) {
            console.error('Could not find sidebar container, retrying...');
            setTimeout(addFolderButton, 1000);
            return;
        }

        // Check if button already exists
        if (document.querySelector('.ds-folder-toggle-btn')) {
            return;
        }

        // Find where to insert the button (look for the "New Chat" button)
        const newChatBtn = document.querySelector('div._5a8ac7a, button:has(> svg)');
        const insertAfter = newChatBtn || sidebarContainer.firstChild;

        // Create folder toggle button
        const folderBtn = document.createElement('button');
        folderBtn.className = 'ds-folder-toggle-btn';
        folderBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Folders
        `;

        folderBtn.style.cssText = `
            width: calc(100% - 16px);
            margin: 8px;
            padding: 10px 12px;
            background: ${isFolderSidebarVisible ? '#10a37f' : 'transparent'};
            color: ${isFolderSidebarVisible ? 'white' : '#ececf1'};
            border: 1px solid ${isFolderSidebarVisible ? '#10a37f' : '#565869'};
            border-radius: 6px;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
        `;

        // Hover effect
        folderBtn.addEventListener('mouseenter', () => {
            if (!isFolderSidebarVisible) {
                folderBtn.style.background = 'rgba(255,255,255,0.1)';
                folderBtn.style.borderColor = '#8e8ea0';
            }
        });
        folderBtn.addEventListener('mouseleave', () => {
            if (!isFolderSidebarVisible) {
                folderBtn.style.background = 'transparent';
                folderBtn.style.borderColor = '#565869';
            }
        });

        // Button click action - toggle folder sidebar
        folderBtn.addEventListener('click', toggleFolderSidebar);

        // Insert after New Chat button or at the top
        insertAfter.parentNode.insertBefore(folderBtn, insertAfter.nextSibling);
        console.log('✅ Folder button added to sidebar');
    }

    function setupFolderSidebar() {
        // Remove existing folder sidebar if present
        const existingSidebar = document.querySelector('.ds-folder-sidebar');
        if (existingSidebar) existingSidebar.remove();

        const folders = GM_getValue(FOLDERS_KEY, []);
        const assignments = GM_getValue(ASSIGNMENTS_KEY, {});
        const settings = GM_getValue(SETTINGS_KEY, {});

        // Count conversations per folder
        const folderCounts = {};
        folders.forEach(folder => {
            folderCounts[folder.id] = Object.values(assignments).filter(f => f === folder.id).length;
        });

        // Create sidebar container
        const sidebar = document.createElement('div');
        sidebar.className = 'ds-folder-sidebar';
        sidebar.style.cssText = `
            position: fixed;
            right: 0;
            top: 0;
            bottom: 0;
            width: ${settings.sidebarWidth || 220}px;
            background: #202123;
            border-left: 1px solid #565869;
            padding: 16px 0;
            overflow-y: auto;
            z-index: 1000;
            transform: translateX(${isFolderSidebarVisible ? '0' : '100%'});
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
        `;

        // Create header
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 0 16px 16px;
            border-bottom: 1px solid #565869;
            margin-bottom: 16px;
        `;
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="color: #ececf1; margin: 0; font-size: 14px; font-weight: 600;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    Folders
                </h3>
                <button class="ds-add-folder-btn"
                        style="background: #10a37f; color: white; border: none; border-radius: 6px; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                    +
                </button>
            </div>
            <div style="color: #8e8ea0; font-size: 12px;">
                ${Object.keys(assignments).length} conversations organized
            </div>
        `;

        // Create folder list
        const folderList = document.createElement('div');
        folderList.className = 'ds-folder-list';
        folderList.style.cssText = `
            padding: 0 16px;
            flex: 1;
            overflow-y: auto;
        `;

        // Add All Conversations option
        const allItem = createFolderItem('all', {
            name: 'All Conversations',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
            color: '#ececf1'
        }, Object.keys(assignments).length);
        allItem.addEventListener('click', () => filterByFolder(null));
        folderList.appendChild(allItem);

        // Add each folder
        folders.forEach(folder => {
            const count = folderCounts[folder.id] || 0;
            const item = createFolderItem(folder.id, folder, count);
            folderList.appendChild(item);
        });

        // Assemble sidebar
        sidebar.appendChild(header);
        sidebar.appendChild(folderList);

        // Add event listeners
        sidebar.querySelector('.ds-add-folder-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            showAddFolderModal();
        });

        document.body.appendChild(sidebar);

        // Add overlay when sidebar is open
        if (isFolderSidebarVisible) {
            addSidebarOverlay();
        }
    }

    function createFolderItem(folderId, folder, count) {
        const item = document.createElement('div');
        item.className = 'ds-folder-item';
        item.setAttribute('data-folder-id', folderId);
        item.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            margin: 4px 0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            color: #ececf1;
            font-size: 14px;
            border: 1px solid transparent;
            position: relative;
        `;

        // Apply background if selected
        if (selectedFolderId === folderId) {
            item.style.background = 'rgba(16, 163, 127, 0.1)';
            item.style.borderColor = 'rgba(16, 163, 127, 0.3)';
        }

        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
                <div class="ds-folder-icon" style="width: 16px; height: 16px; color: ${folder.id === 'all' ? '#ececf1' : folder.color};">
                    ${folder.icon}
                </div>
                <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                             color: ${folder.id === 'all' ? '#ececf1' : folder.color}">
                    ${folder.name}
                </span>
            </div>
            <span class="ds-folder-count" style="background: #565869; color: #8e8ea0; padding: 2px 8px; border-radius: 10px; font-size: 11px; min-width: 20px; text-align: center;">
                ${count}
            </span>
        `;

        // Left click to select/filter
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedFolderId = folderId;
            if (folderId === 'all') {
                filterByFolder(null);
            } else {
                filterByFolder(folderId);
            }
            updateFolderSelection();
        });

        // Right click for context menu
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectedFolderId = folderId;
            updateFolderSelection();
            if (folderId !== 'all') {
                showFolderContextMenu(e, folder);
            }
        });

        item.addEventListener('mouseenter', () => {
            if (selectedFolderId !== folderId) {
                item.style.background = 'rgba(255,255,255,0.05)';
                item.style.borderColor = 'rgba(255,255,255,0.1)';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (selectedFolderId !== folderId) {
                item.style.background = '';
                item.style.borderColor = 'transparent';
            }
        });

        return item;
    }

    function updateFolderSelection() {
        document.querySelectorAll('.ds-folder-item').forEach(item => {
            const folderId = item.getAttribute('data-folder-id');
            if (selectedFolderId === folderId) {
                item.style.background = 'rgba(16, 163, 127, 0.1)';
                item.style.borderColor = 'rgba(16, 163, 127, 0.3)';
            } else {
                item.style.background = '';
                item.style.borderColor = 'transparent';
            }
        });
    }

    function updateFolderCounts() {
        const folders = GM_getValue(FOLDERS_KEY, []);
        const assignments = GM_getValue(ASSIGNMENTS_KEY, {});

        // Update all conversations count
        const allItem = document.querySelector('.ds-folder-item[data-folder-id="all"] .ds-folder-count');
        if (allItem) {
            allItem.textContent = Object.keys(assignments).length;
        }

        // Update each folder count
        folders.forEach(folder => {
            const count = Object.values(assignments).filter(f => f === folder.id).length;
            const countElement = document.querySelector(`.ds-folder-item[data-folder-id="${folder.id}"] .ds-folder-count`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }

    function showFolderContextMenu(e, folder) {
        hideContextMenu();
        hideFolderMenu();

        const menu = document.createElement('div');
        menu.className = 'ds-context-menu';
        menu.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            background: #343541;
            border: 1px solid #565869;
            border-radius: 6px;
            padding: 8px 0;
            z-index: 1002;
            min-width: 180px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        const menuItems = [
            { icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>', text: 'Rename', action: () => showRenameFolderModal(folder) },
            { icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', text: 'Customize', action: () => showCustomizeFolderModal(folder) },
            { icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="12" y1="7" x2="12" y2="13"/></svg>', text: 'Manage Conversations', action: () => showManageFolderModal(folder) },
            { separator: true },
            { icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>', text: 'Delete', action: () => deleteFolder(folder), danger: true }
        ];

        menuItems.forEach(item => {
            if (item.separator) {
                const separator = document.createElement('div');
                separator.style.cssText = 'height: 1px; background: #565869; margin: 4px 0;';
                menu.appendChild(separator);
            } else {
                const menuItem = document.createElement('div');
                menuItem.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-size: 14px;
                    color: ${item.danger ? '#ef4444' : '#ececf1'};
                    transition: background 0.2s;
                `;
                menuItem.innerHTML = `
                    <div style="width: 14px; height: 14px;">${item.icon}</div>
                    <span>${item.text}</span>
                `;
                menuItem.addEventListener('mouseenter', () => {
                    menuItem.style.background = 'rgba(255,255,255,0.1)';
                });
                menuItem.addEventListener('mouseleave', () => {
                    menuItem.style.background = '';
                });
                menuItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    item.action();
                    menu.remove();
                });
                menu.appendChild(menuItem);
            }
        });

        document.body.appendChild(menu);

        // Close menu when clicking outside
        setTimeout(() => {
            const closeHandler = () => {
                menu.remove();
                document.removeEventListener('click', closeHandler);
            };
            document.addEventListener('click', closeHandler);
        }, 0);
    }

    function showAddFolderModal() {
        showFolderMenu(null, 'add');
    }

    function showRenameFolderModal(folder) {
        showFolderMenu(folder, 'rename');
    }

    function showCustomizeFolderModal(folder) {
        showFolderMenu(folder, 'customize');
    }

    function showManageFolderModal(folder) {
        hideContextMenu();
        hideFolderMenu();

        const assignments = GM_getValue(ASSIGNMENTS_KEY, {});
        const conversations = getConversations();

        // Filter conversations in this folder vs others
        const folderConversations = conversations.filter(conv => assignments[conv.id] === folder.id);
        const otherConversations = conversations.filter(conv => !assignments[conv.id] || assignments[conv.id] !== folder.id);

        // Create modal with search functionality
        const modal = document.createElement('div');
        modal.className = 'ds-folder-manager-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #343541;
            border: 1px solid #565869;
            border-radius: 8px;
            padding: 24px;
            z-index: 1003;
            width: 600px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        `;

        modal.innerHTML = `
            <div style="margin-bottom: 24px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div class="ds-folder-icon-large" style="width: 24px; height: 24px; color: ${folder.color}">
                        ${folder.icon}
                    </div>
                    <h3 style="color: #ececf1; margin: 0; font-size: 16px; font-weight: 600; flex: 1;">
                        ${folder.name}
                    </h3>
                    <button class="ds-close-modal" style="background: none; border: none; color: #8e8ea0; cursor: pointer; font-size: 20px;">×</button>
                </div>
                <p style="color: #8e8ea0; font-size: 13px; margin-bottom: 4px;">
                    ${folderConversations.length} conversations in this folder
                </p>

                <!-- Search bar -->
                <div class="ds-search-container" style="margin-top: 16px;">
                    <div style="display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: #202123; border: 1px solid #565869; border-radius: 6px;">
                        <div style="width: 16px; height: 16px; color: #8e8ea0;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/>
                            </svg>
                        </div>
                        <input type="text" id="conversation-search" placeholder="Search conversations by title..."
                               style="flex: 1; background: transparent; border: none; color: #ececf1; font-size: 13px; outline: none;">
                        <button id="clear-search" style="background: none; border: none; color: #8e8ea0; cursor: pointer; padding: 2px; display: none;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 24px;">
                <h4 style="color: #ececf1; font-size: 14px; font-weight: 600; margin-bottom: 12px;">
                    Currently in this folder <span id="current-count">(${folderConversations.length})</span>
                </h4>
                <div class="ds-conversations-list current-folder" style="max-height: 300px; overflow-y: auto; background: #202123; border-radius: 6px; border: 1px solid #565869;">
                    ${folderConversations.length > 0 ? folderConversations.map(conv => `
                        <div class="ds-conversation-checkbox" style="padding: 10px 12px; border-bottom: 1px solid #565869;">
                            <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                                <input type="checkbox" class="ds-folder-checkbox" data-id="${conv.id}" checked
                                       style="width: 16px; height: 16px; accent-color: ${folder.color};">
                                <div style="flex: 1;">
                                    <div class="conversation-title" style="color: #ececf1; font-size: 13px; margin-bottom: 2px;">${conv.title}</div>
                                    <div style="color: #8e8ea0; font-size: 11px;">${conv.id.slice(0, 8)}...</div>
                                </div>
                            </label>
                        </div>
                    `).join('') : `
                        <div style="padding: 20px; text-align: center; color: #8e8ea0; font-size: 13px;">
                            No conversations in this folder
                        </div>
                    `}
                </div>
            </div>

            <div style="margin-bottom: 24px;">
                <h4 style="color: #ececf1; font-size: 14px; font-weight: 600; margin-bottom: 12px;">
                    Other conversations <span id="other-count">(${otherConversations.length})</span>
                </h4>
                <div class="ds-conversations-list other-folder" style="max-height: 200px; overflow-y: auto; background: #202123; border-radius: 6px; border: 1px solid #565869;">
                    ${otherConversations.length > 0 ? otherConversations.map(conv => `
                        <div class="ds-conversation-checkbox" style="padding: 10px 12px; border-bottom: 1px solid #565869;">
                            <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                                <input type="checkbox" class="ds-folder-checkbox" data-id="${conv.id}"
                                       style="width: 16px; height: 16px; accent-color: ${folder.color};">
                                <div style="flex: 1;">
                                    <div class="conversation-title" style="color: #ececf1; font-size: 13px; margin-bottom: 2px;">${conv.title}</div>
                                    <div style="color: #8e8ea0; font-size: 11px;">${conv.id.slice(0, 8)}...</div>
                                </div>
                            </label>
                        </div>
                    `).join('') : `
                        <div style="padding: 20px; text-align: center; color: #8e8ea0; font-size: 13px;">
                            No other conversations
                        </div>
                    `}
                </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid #565869;">
                <button class="ds-cancel-btn" style="padding: 8px 16px; background: transparent; color: #8e8ea0; border: 1px solid #565869; border-radius: 6px; cursor: pointer; font-size: 13px;">
                    Cancel
                </button>
                <button class="ds-save-btn" style="padding: 8px 16px; background: ${folder.color}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">
                    Save Changes
                </button>
            </div>
        `;

        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'ds-modal-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1002;
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        // Initialize search functionality
        setupSearchFunctionality(modal, folder);

        // Event listeners
        modal.querySelector('.ds-close-modal').addEventListener('click', closeModal);
        modal.querySelector('.ds-cancel-btn').addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        modal.querySelector('.ds-save-btn').addEventListener('click', () => {
            const assignments = GM_getValue(ASSIGNMENTS_KEY, {});
            const checkboxes = modal.querySelectorAll('.ds-folder-checkbox');

            checkboxes.forEach(checkbox => {
                const convId = checkbox.getAttribute('data-id');
                if (checkbox.checked) {
                    assignments[convId] = folder.id;
                } else if (assignments[convId] === folder.id) {
                    delete assignments[convId];
                }
            });

            GM_setValue(ASSIGNMENTS_KEY, assignments);
            applyFolderTags();
            updateFolderCounts();
            filterByFolder(folder.id);
            closeModal();
        });

        function closeModal() {
            modal.remove();
            backdrop.remove();
        }

        // Prevent clicks inside modal from closing
        modal.addEventListener('click', (e) => e.stopPropagation());
    }

    function setupSearchFunctionality(modal, folder) {
        const searchInput = modal.querySelector('#conversation-search');
        const clearSearchBtn = modal.querySelector('#clear-search');

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const conversationItems = modal.querySelectorAll('.ds-conversation-checkbox');
            let currentVisible = 0;
            let otherVisible = 0;

            if (searchTerm === '') {
                // Show all when search is empty
                conversationItems.forEach(item => {
                    item.style.display = '';
                    const isCurrent = item.querySelector('input').checked;
                    if (isCurrent) currentVisible++;
                    else otherVisible++;
                });
                clearSearchBtn.style.display = 'none';
            } else {
                // Filter by title
                conversationItems.forEach(item => {
                    const titleElement = item.querySelector('.conversation-title');
                    const title = titleElement.textContent.toLowerCase();
                    const matches = title.includes(searchTerm);
                    item.style.display = matches ? '' : 'none';

                    if (matches) {
                        const isCurrent = item.querySelector('input').checked;
                        if (isCurrent) currentVisible++;
                        else otherVisible++;

                        // Highlight matching text
                        const originalText = titleElement.textContent;
                        const regex = new RegExp(`(${searchTerm})`, 'gi');
                        titleElement.innerHTML = originalText.replace(regex, '<mark style="background: rgba(251, 188, 4, 0.3); color: #fbbc04; border-radius: 2px; padding: 0 2px;">$1</mark>');
                    }
                });
                clearSearchBtn.style.display = 'flex';
            }

            // Update counts
            modal.querySelector('#current-count').textContent = `(${currentVisible})`;
            modal.querySelector('#other-count').textContent = `(${otherVisible})`;
        });

        // Clear search
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        });

        // Remove highlights when search is cleared
        searchInput.addEventListener('blur', function() {
            if (this.value === '') {
                const titles = modal.querySelectorAll('.conversation-title');
                titles.forEach(title => {
                    if (title.innerHTML !== title.textContent) {
                        title.innerHTML = title.textContent;
                    }
                });
            }
        });
    }

    function showFolderMenu(folder, mode) {
        hideFolderMenu();

        const isAddMode = mode === 'add';
        const isRenameMode = mode === 'rename';
        const isCustomizeMode = mode === 'customize';

        const menu = document.createElement('div');
        menu.className = 'ds-folder-menu';
        menu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #343541;
            border: 1px solid #565869;
            border-radius: 8px;
            padding: 24px;
            z-index: 1003;
            width: 320px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.4);
        `;

        const title = isAddMode ? 'Create New Folder' : isRenameMode ? 'Rename Folder' : 'Customize Folder';

        menu.innerHTML = `
            <div style="margin-bottom: 24px;">
                <h3 style="color: #ececf1; margin: 0 0 16px; font-size: 16px; font-weight: 600;">
                    ${title}
                </h3>
                ${!isCustomizeMode ? `
                    <input type="text" id="folder-name-input"
                           value="${isRenameMode ? folder.name : ''}"
                           placeholder="Folder name"
                           style="width: 100%; padding: 10px; background: #202123; border: 1px solid #565869; border-radius: 6px; color: #ececf1; font-size: 14px;">
                ` : ''}
            </div>

            ${isCustomizeMode || isAddMode ? `
                <div style="margin-bottom: 24px;">
                    <h4 style="color: #ececf1; font-size: 14px; font-weight: 600; margin-bottom: 12px;">
                        Select Icon
                    </h4>
                    <div class="ds-icon-grid" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; max-height: 200px; overflow-y: auto; padding: 12px; background: #202123; border-radius: 6px; border: 1px solid #565869;">
                        ${AVAILABLE_ICONS.map((icon, index) => `
                            <div class="ds-icon-option" data-icon-index="${index}"
                                 style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; transition: all 0.2s; color: #8e8ea0;">
                                ${icon}
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-bottom: 24px;">
                    <h4 style="color: #ececf1; font-size: 14px; font-weight: 600; margin-bottom: 12px;">
                        Select Color
                    </h4>
                    <div class="ds-color-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">
                        ${AVAILABLE_COLORS.map(color => `
                            <div class="ds-color-option" data-color="${color}"
                                 style="width: 32px; height: 32px; cursor: pointer; border-radius: 6px; background: ${color}; border: 2px solid transparent; transition: all 0.2s;"></div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div style="display: flex; justify-content: flex-end; gap: 12px;">
                <button class="ds-menu-cancel" style="padding: 8px 16px; background: transparent; color: #8e8ea0; border: 1px solid #565869; border-radius: 6px; cursor: pointer; font-size: 13px;">
                    Cancel
                </button>
                <button class="ds-menu-save" style="padding: 8px 16px; background: #10a37f; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">
                    ${isAddMode ? 'Create' : 'Save'}
                </button>
            </div>
        `;

        // Set default selection for customize mode
        if (isCustomizeMode) {
            setTimeout(() => {
                const folderIconIndex = AVAILABLE_ICONS.findIndex(icon =>
                    icon === folder.icon ||
                    icon.includes(folder.icon) ||
                    folder.icon.includes(icon)
                );

                if (folderIconIndex !== -1) {
                    const selectedIcon = menu.querySelector(`.ds-icon-option[data-icon-index="${folderIconIndex}"]`);
                    if (selectedIcon) {
                        selectedIcon.style.background = 'rgba(16, 163, 127, 0.2)';
                        selectedIcon.style.border = '1px solid #10a37f';
                        selectedIcon.style.color = folder.color;
                    }
                }

                const selectedColor = menu.querySelector(`.ds-color-option[data-color="${folder.color}"]`);
                if (selectedColor) {
                    selectedColor.style.border = '2px solid white';
                    selectedColor.style.transform = 'scale(1.1)';
                }
            }, 10);
        }

        document.body.appendChild(menu);

        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'ds-menu-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 1002;
        `;
        document.body.appendChild(backdrop);

        // Initialize selection
        let selectedIconIndex = isCustomizeMode ?
            (AVAILABLE_ICONS.findIndex(icon => icon === folder.icon || icon.includes(folder.icon) || folder.icon.includes(icon)) || 0) : 0;
        let selectedColor = isCustomizeMode ? folder.color : '#10a37f';

        // Icon selection
        menu.querySelectorAll('.ds-icon-option').forEach(iconOption => {
            iconOption.addEventListener('click', () => {
                menu.querySelectorAll('.ds-icon-option').forEach(opt => {
                    opt.style.background = '';
                    opt.style.border = '';
                    opt.style.color = '#8e8ea0';
                });
                iconOption.style.background = 'rgba(16, 163, 127, 0.2)';
                iconOption.style.border = '1px solid #10a37f';
                iconOption.style.color = selectedColor;
                selectedIconIndex = parseInt(iconOption.getAttribute('data-icon-index'));
            });
        });

        // Color selection
        menu.querySelectorAll('.ds-color-option').forEach(colorOption => {
            colorOption.addEventListener('click', () => {
                menu.querySelectorAll('.ds-color-option').forEach(opt => {
                    opt.style.border = '2px solid transparent';
                    opt.style.transform = '';
                });
                colorOption.style.border = '2px solid white';
                colorOption.style.transform = 'scale(1.1)';
                selectedColor = colorOption.getAttribute('data-color');

                // Update selected icon color
                const selectedIcon = menu.querySelector(`.ds-icon-option[data-icon-index="${selectedIconIndex}"]`);
                if (selectedIcon && selectedIcon.style.background) {
                    selectedIcon.style.color = selectedColor;
                }
            });
        });

        // Event listeners
        menu.querySelector('.ds-menu-cancel').addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);

        menu.querySelector('.ds-menu-save').addEventListener('click', () => {
            if (isAddMode || isRenameMode) {
                const nameInput = menu.querySelector('#folder-name-input');
                const folderName = nameInput.value.trim();

                if (!folderName) {
                    alert('Please enter a folder name');
                    return;
                }

                const folders = GM_getValue(FOLDERS_KEY, []);

                if (isAddMode) {
                    const newFolder = {
                        id: 'folder_' + Date.now(),
                        name: folderName,
                        icon: AVAILABLE_ICONS[selectedIconIndex],
                        color: selectedColor
                    };
                    folders.push(newFolder);
                } else if (isRenameMode) {
                    const folderIndex = folders.findIndex(f => f.id === folder.id);
                    if (folderIndex !== -1) {
                        folders[folderIndex].name = folderName;
                    }
                }

                GM_setValue(FOLDERS_KEY, folders);
            } else if (isCustomizeMode) {
                const folders = GM_getValue(FOLDERS_KEY, []);
                const folderIndex = folders.findIndex(f => f.id === folder.id);
                if (folderIndex !== -1) {
                    folders[folderIndex].icon = AVAILABLE_ICONS[selectedIconIndex];
                    folders[folderIndex].color = selectedColor;
                }
                GM_setValue(FOLDERS_KEY, folders);
            }

            setupFolderSidebar();
            closeMenu();
        });

        function closeMenu() {
            menu.remove();
            backdrop.remove();
        }

        // Prevent clicks inside menu from closing
        menu.addEventListener('click', (e) => e.stopPropagation());

        // Focus input for rename mode
        if (isRenameMode || isAddMode) {
            setTimeout(() => {
                const input = menu.querySelector('#folder-name-input');
                input.focus();
                if (isRenameMode) input.select();
            }, 10);
        }
    }

    function toggleFolderSidebar() {
        isFolderSidebarVisible = !isFolderSidebarVisible;

        // Update button appearance
        const folderBtn = document.querySelector('.ds-folder-toggle-btn');
        if (folderBtn) {
            folderBtn.style.background = isFolderSidebarVisible ? '#10a37f' : 'transparent';
            folderBtn.style.color = isFolderSidebarVisible ? 'white' : '#ececf1';
            folderBtn.style.borderColor = isFolderSidebarVisible ? '#10a37f' : '#565869';
        }

        // Toggle sidebar
        const sidebar = document.querySelector('.ds-folder-sidebar');
        if (sidebar) {
            sidebar.style.transform = isFolderSidebarVisible ? 'translateX(0)' : 'translateX(100%)';
        }

        // Toggle overlay
        if (isFolderSidebarVisible) {
            addSidebarOverlay();
        } else {
            removeSidebarOverlay();
        }
    }

    function addSidebarOverlay() {
        removeSidebarOverlay();

        const overlay = document.createElement('div');
        overlay.className = 'ds-sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.3);
            z-index: 999;
        `;

        overlay.addEventListener('click', toggleFolderSidebar);
        document.body.appendChild(overlay);
    }

    function removeSidebarOverlay() {
        const overlay = document.querySelector('.ds-sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    function hideContextMenu() {
        document.querySelectorAll('.ds-context-menu').forEach(menu => menu.remove());
    }

    function hideFolderMenu() {
        document.querySelectorAll('.ds-folder-menu').forEach(menu => menu.remove());
        document.querySelectorAll('.ds-menu-backdrop').forEach(backdrop => backdrop.remove());
    }

    function deleteFolder(folder) {
        if (confirm(`Delete folder "${folder.name}"? All conversations in this folder will become unassigned.`)) {
            const folders = GM_getValue(FOLDERS_KEY, []);
            const updatedFolders = folders.filter(f => f.id !== folder.id);
            GM_setValue(FOLDERS_KEY, updatedFolders);

            // Remove assignments for deleted folder
            const assignments = GM_getValue(ASSIGNMENTS_KEY, {});
            Object.keys(assignments).forEach(id => {
                if (assignments[id] === folder.id) {
                    delete assignments[id];
                }
            });
            GM_setValue(ASSIGNMENTS_KEY, assignments);

            // Reset selection
            selectedFolderId = null;

            setupFolderSidebar();
            applyFolderTags();
            updateFolderCounts();
            filterByFolder(null);
        }
    }

    function getConversations() {
        const convLinks = document.querySelectorAll('a[class*="_546d736"]');
        const conversations = [];

        convLinks.forEach((conv, index) => {
            const titleElement = conv.querySelector('.c08e6e93');
            const title = titleElement ? titleElement.textContent.trim() : `Conversation ${index + 1}`;
            const href = conv.getAttribute('href');
            const convId = href ? href.split('/').pop() : `conv_${Date.now()}_${index}`;

            conversations.push({
                id: convId,
                title: title,
                element: conv,
                url: href
            });
        });

        return conversations;
    }

    function applyFolderTags() {
        const settings = GM_getValue(SETTINGS_KEY);
        if (!settings.showFolderTags) return;

        const folders = GM_getValue(FOLDERS_KEY, []);
        const assignments = GM_getValue(ASSIGNMENTS_KEY, {});
        const conversations = getConversations();

        conversations.forEach(conv => {
            const folderId = assignments[conv.id];
            const folder = folders.find(f => f.id === folderId);

            // Remove existing tag
            const existingTag = conv.element.querySelector('.ds-folder-tag');
            if (existingTag) existingTag.remove();

            if (folder) {
                // Create folder tag
                const tag = document.createElement('span');
                tag.className = 'ds-folder-tag';
                tag.innerHTML = `
                    <div class="ds-folder-tag-icon" style="display: inline-flex; align-items: center; margin-right: 4px; width: 12px; height: 12px;">
                        ${folder.icon}
                    </div>
                    <span>${folder.name}</span>
                `;
                tag.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    background: ${folder.color}15;
                    color: ${folder.color};
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    margin-left: 6px;
                    vertical-align: middle;
                    border: 1px solid ${folder.color}30;
                    max-width: 100px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                `;

                // Style the SVG icon inside the tag
                const tagIcon = tag.querySelector('.ds-folder-tag-icon svg');
                if (tagIcon) {
                    tagIcon.setAttribute('width', '10');
                    tagIcon.setAttribute('height', '10');
                    tagIcon.setAttribute('stroke', folder.color);
                }

                // Find title element
                const titleElement = conv.element.querySelector('.c08e6e93');
                if (titleElement) {
                    titleElement.appendChild(tag);
                }
            }
        });
    }

    function filterByFolder(folderId) {
        const folders = GM_getValue(FOLDERS_KEY, []);
        const assignments = GM_getValue(ASSIGNMENTS_KEY, {});
        const conversations = getConversations();

        conversations.forEach(conv => {
            const shouldShow = !folderId || assignments[conv.id] === folderId;
            conv.element.style.display = shouldShow ? 'flex' : 'none';

            // Highlight if filtered and has folder
            if (folderId && assignments[conv.id] === folderId) {
                const folder = folders.find(f => f.id === folderId);
                conv.element.style.background = folder ? `${folder.color}10` : '';
                conv.element.style.borderRadius = '6px';
                conv.element.style.margin = '2px 0';
            } else {
                conv.element.style.background = '';
            }
        });
    }

    console.log('✅ DeepSeek Folder Organizer v3.0 loaded successfully');
})();