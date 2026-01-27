// ==UserScript==
// @name                My Prompt (v35)
// @namespace           http://tampermonkey.net/
// @version             35
// @description         Save and use custom prompts with FOLDER organization, emoji icons, usage tracking, tags, auto-backup. Works on ChatGPT, Claude, Gemini, Copilot, Perplexity, Poe, and more!
// @author              OHAS (Original) / Solomon (Optimized)
// @license             CC-BY-NC-ND-4.0
// @match               *://chatgpt.com/*
// @match               *://claude.ai/*
// @match               *://gemini.google.com/*
// @match               *://copilot.microsoft.com/*
// @match               *://www.perplexity.ai/*
// @match               *://perplexity.ai/*
// @match               *://poe.com/*
// @match               *://huggingface.co/chat*
// @match               *://chat.deepseek.com/*
// @match               *://you.com/*
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_registerMenuCommand
// @run-at              document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/564090/My%20Prompt%20%28v35%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564090/My%20Prompt%20%28v35%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =====================================
    // #region TRUSTED TYPES POLICY (for Gemini CSP)
    // =====================================

    // Create a Trusted Types policy if supported (needed for Gemini)
    let trustedTypesPolicy = null;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            trustedTypesPolicy = window.trustedTypes.createPolicy('myPromptPolicy', {
                createHTML: (string) => string,
                createScript: (string) => string,
                createScriptURL: (string) => string
            });
        } catch (e) {
            // Policy might already exist or not be allowed
            console.log('[My Prompt] Trusted Types policy creation failed:', e.message);
        }
    }

    // Safe innerHTML setter that works with Trusted Types
    function safeSetInnerHTML(element, html) {
        if (trustedTypesPolicy) {
            element.innerHTML = trustedTypesPolicy.createHTML(html);
        } else {
            element.innerHTML = html;
        }
    }

    // =====================================
    // #region CONSTANTS & GLOBALS
    // =====================================

    const STORAGE_KEYS = {
        PROMPTS: 'Prompts',
        FOLDERS: 'PromptFolders',
        FOLDER_NAMES: 'FolderCustomNames',
        FOLDER_EMOJIS: 'FolderEmojis',
        THEME: 'Theme',
        ACCENT_COLOR: 'AccentColor',
        SHORTCUTS: 'ShortcutsConfig',
        PREDICTION: 'Prediction',
        GLOBAL_FILES: 'GlobalFiles',
        MENU_SIZE: 'MenuSize',
        USAGE_STATS: 'UsageStats',
        RECENT_PROMPTS: 'RecentPrompts',
        AUTO_BACKUP: 'AutoBackupSettings',
        LAST_BACKUP: 'LastBackupDate'
    };

    // 🔧 DEBUG MODE - Set to true to see what's happening on Gemini
    const DEBUG_MODE = true;

    // Default accent color
    const DEFAULT_ACCENT = '#7c3aed';

    // Common emojis for folder picker
    const FOLDER_EMOJI_OPTIONS = [
        '📁', '📂', '🏢', '🏠', '💼', '💻', '🎨', '📝', '📚', '🔧',
        '⚡', '🎯', '🚀', '💡', '🔥', '⭐', '❤️', '💚', '💙', '💜',
        '📊', '📈', '🎬', '🎵', '🎮', '🛒', '✈️', '🍕', '☕', '🌟'
    ];

    // Default menu size
    const DEFAULT_MENU_SIZE = { width: 500, height: 450, folderWidth: 140 };

    const DEFAULT_SHORTCUTS = {
        newPrompt: { keys: 'Alt+N', desc: 'New Prompt' },
        listPrompts: { keys: 'Alt+P', desc: 'Open Prompt List' },
        saveSend: { keys: 'Ctrl+Enter', desc: 'Save and Send' },
        lineBreak: { keys: 'Shift+Enter', desc: 'Line Break' }
    };

    const DEFAULT_THEME = { mode: 'auto' };
    const DEFAULT_PREDICTION = { enabled: true };

    // Platform-specific selectors (ChatGPT, Claude, Gemini only)
    const PLATFORM_CONFIG = {
        chatgpt: {
            selector: '#prompt-textarea',
            sendButton: () => document.querySelector('[data-testid="send-button"]') || document.querySelector('#composer-submit-button'),
            buttonContainer: () => document.querySelector('[data-testid="composer-button-group"]') ||
                                   document.querySelector('form div[class*="flex"]')
        },
        claude: {
            // Claude's editor - try multiple selectors
            selector: 'div.ProseMirror[contenteditable="true"], div[contenteditable="true"].ProseMirror, fieldset div[contenteditable="true"]',
            sendButton: () => {
                // Find send button by SVG path or aria-label
                const btns = document.querySelectorAll('button');
                for (const btn of btns) {
                    const svg = btn.querySelector('svg');
                    if (svg) {
                        const path = svg.querySelector('path');
                        if (path) {
                            const d = path.getAttribute('d');
                            // Send arrow icon path
                            if (d && (d.includes('M208.49') || d.includes('M4 12') || d.includes('m3 3'))) {
                                return btn;
                            }
                        }
                    }
                    // Check aria-label
                    if (btn.getAttribute('aria-label')?.toLowerCase().includes('send')) {
                        return btn;
                    }
                }
                return null;
            },
            // Button container - the row with +, ≡, clock, bucket icons
            buttonContainer: () => {
                // Try to find the button row near the editor
                const fieldset = document.querySelector('fieldset');
                if (fieldset) {
                    // Look for the div containing the action buttons
                    const buttonRows = fieldset.querySelectorAll('div[class*="flex"]');
                    for (const row of buttonRows) {
                        const buttons = row.querySelectorAll('button');
                        if (buttons.length >= 2 && buttons.length <= 6) {
                            // Check if this looks like the toolbar (has icons)
                            const hasSvg = row.querySelector('svg');
                            if (hasSvg) return row;
                        }
                    }
                }
                // Fallback: find by the + button
                const plusBtn = document.querySelector('button[aria-label*="Attach"], button[aria-label*="Add"], button[aria-label*="attach"]');
                if (plusBtn) return plusBtn.parentElement;

                // Another fallback: look for the editor and find nearby button container
                const editor = document.querySelector('div.ProseMirror[contenteditable="true"]');
                if (editor) {
                    const parent = editor.closest('fieldset') || editor.closest('form') || editor.parentElement;
                    if (parent) {
                        const divs = parent.querySelectorAll('div');
                        for (const div of divs) {
                            const btns = div.querySelectorAll(':scope > button');
                            if (btns.length >= 2) return div;
                        }
                    }
                }
                return null;
            }
        },
        gemini: {
            // Updated selectors for Gemini's input-area-v2 UI (January 2026)
            selector: 'div.ql-editor[contenteditable="true"], rich-textarea .ql-editor, div[contenteditable="true"][data-placeholder], .text-input-field_textarea',
            sendButton: () => document.querySelector('button.send-button, .send-button-container button, button[aria-label*="Send"]'),
            buttonContainer: () => {
                if (DEBUG_MODE) {
                    console.log('[My Prompt DEBUG] Gemini buttonContainer called');
                    // Log all potential containers we can find
                    console.log('[My Prompt DEBUG] .leading-actions-wrapper:', document.querySelector('.leading-actions-wrapper'));
                    console.log('[My Prompt DEBUG] toolbox-drawer:', document.querySelector('toolbox-drawer'));
                    console.log('[My Prompt DEBUG] .input-area:', document.querySelector('.input-area'));
                    console.log('[My Prompt DEBUG] input-area-v2:', document.querySelector('input-area-v2'));
                    console.log('[My Prompt DEBUG] rich-textarea:', document.querySelector('rich-textarea'));
                    console.log('[My Prompt DEBUG] .ql-editor:', document.querySelector('.ql-editor'));

                    // Log buttons that might be the + or Tools buttons
                    const allButtons = document.querySelectorAll('button');
                    console.log('[My Prompt DEBUG] Total buttons on page:', allButtons.length);
                    allButtons.forEach((btn, i) => {
                        const text = btn.textContent?.trim().substring(0, 30);
                        const ariaLabel = btn.getAttribute('aria-label');
                        const classes = btn.className?.substring(0, 50);
                        if (text || ariaLabel) {
                            console.log(`[My Prompt DEBUG] Button ${i}:`, { text, ariaLabel, classes, parent: btn.parentElement?.tagName });
                        }
                    });
                }

                // Target the leading-actions-wrapper where + and Tools buttons are
                const leadingActions = document.querySelector('.leading-actions-wrapper');
                if (leadingActions) return leadingActions;
                // Or the toolbox-drawer container
                const toolbox = document.querySelector('toolbox-drawer');
                if (toolbox) return toolbox.parentElement;
                // Fallback to input-area
                return document.querySelector('.input-area, input-area-v2');
            }
        },
        copilot: {
            selector: '#userInput, textarea[name="q"], #searchbox',
            sendButton: () => document.querySelector('button[type="submit"], button[aria-label*="Submit"], button[aria-label*="Send"]'),
            buttonContainer: () => {
                const input = document.querySelector('#userInput, textarea[name="q"]');
                return input?.closest('form') || input?.parentElement;
            }
        },
        perplexity: {
            selector: 'textarea[placeholder*="Ask"], textarea[placeholder*="ask"], div[contenteditable="true"]',
            sendButton: () => document.querySelector('button[aria-label*="Submit"], button[aria-label*="Send"], button svg[data-icon="arrow-right"]')?.closest('button'),
            buttonContainer: () => {
                const textarea = document.querySelector('textarea[placeholder*="Ask"], textarea[placeholder*="ask"]');
                return textarea?.closest('div[class*="relative"]') || textarea?.parentElement;
            }
        },
        poe: {
            selector: 'textarea[class*="TextArea"], textarea[placeholder*="Talk"]',
            sendButton: () => document.querySelector('button[class*="SendButton"], button[aria-label*="Send"]'),
            buttonContainer: () => {
                const textarea = document.querySelector('textarea[class*="TextArea"]');
                return textarea?.closest('form') || textarea?.parentElement?.parentElement;
            }
        },
        huggingchat: {
            selector: 'textarea[placeholder*="Ask"], textarea[enterkeyhint="send"]',
            sendButton: () => document.querySelector('button[type="submit"], form button:last-of-type'),
            buttonContainer: () => {
                const textarea = document.querySelector('textarea[placeholder*="Ask"]');
                return textarea?.closest('form') || textarea?.parentElement;
            }
        },
        deepseek: {
            selector: 'textarea#chat-input, textarea[placeholder*="Send a message"]',
            sendButton: () => document.querySelector('button[aria-label*="Send"], div[role="button"][aria-label*="Send"]'),
            buttonContainer: () => {
                const textarea = document.querySelector('textarea#chat-input');
                return textarea?.closest('div[class*="input"]') || textarea?.parentElement;
            }
        },
        you: {
            selector: 'textarea[placeholder*="Ask"], input[placeholder*="Ask"]',
            sendButton: () => document.querySelector('button[type="submit"], button[aria-label*="Search"]'),
            buttonContainer: () => {
                const input = document.querySelector('textarea[placeholder*="Ask"], input[placeholder*="Ask"]');
                return input?.closest('form') || input?.parentElement;
            }
        }
    };

    // State
    let currentPlatform = null;
    let currentButton = null;
    let currentMenu = null;
    let currentModal = null;
    let currentPlaceholderModal = null;
    let settingsModal = null;
    let currentShortcuts = { ...DEFAULT_SHORTCUTS };
    let currentTheme = { ...DEFAULT_THEME };
    let currentPrediction = { ...DEFAULT_PREDICTION };
    let currentActiveFileIds = new Set();
    let isInitialized = false;
    let isInitializing = false;
    let pageObserver = null;
    let selectedFolder = null; // null = "All Prompts"

    // =====================================
    // #region TRANSLATIONS (English Only)
    // =====================================

    const T = {
        // General
        prompts: 'Prompts',
        prompt: 'Prompt',
        newPrompt: 'New Prompt',
        editPrompt: 'Edit Prompt',
        save: 'Save',
        close: 'Close',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        confirm: 'Confirm',
        settings: 'Settings',

        // Folders (NEW)
        folders: 'Folders',
        newFolder: 'New Folder',
        editFolder: 'Edit Folder',
        renameFolder: 'Rename Folder',
        deleteFolder: 'Delete Folder',
        allPrompts: 'All Prompts',
        uncategorized: 'Uncategorized',
        folderName: 'Folder Name',
        selectFolder: 'Select Folder',
        moveToFolder: 'Move to Folder',
        noFolders: 'No folders yet',
        confirmDeleteFolder: 'Delete folder "{name}"? Prompts will be moved to Uncategorized.',
        folderEmoji: 'Folder Icon',
        chooseEmoji: 'Choose Icon',

        // Prompts
        title: 'Title',
        search: 'Search prompts...',
        noSavedPrompts: 'No saved prompts.',
        noSearchResults: 'No prompts match the search.',
        confirmDelete: 'Delete prompt "{title}"?',
        requiredFields: 'Title and prompt are required.',
        editorNotFound: 'Could not find text area.',

        // Features
        dynamicPrompt: 'Dynamic Prompt',
        autoSend: 'Auto Send',
        fillInfo: 'Fill in Information',
        pin: 'Pin',
        unpin: 'Unpin',

        // New Features (v15)
        recentlyUsed: 'Recently Used',
        usedCount: 'Used {count}x',
        neverUsed: 'Never used',
        tags: 'Tags',
        addTags: 'Add tags (comma separated)',
        filterByTag: 'Filter by tag',
        allTags: 'All Tags',
        move: 'Move',
        duplicate: 'Duplicate',
        duplicated: 'Prompt duplicated!',
        accentColor: 'Accent Color',
        resetColor: 'Reset to Default',

        // Import/Export
        import: 'Import',
        export: 'Export',
        selectAll: 'Select All',
        promptsImported: '{count} prompts imported!',
        noPromptsToExport: 'No prompts to export.',

        // Files
        files: 'Files',
        addFiles: 'Add Files',
        deleteFile: 'Delete file from memory?',

        // Theme
        theme: 'Theme',
        auto: 'Auto',
        light: 'Light',
        dark: 'Dark',

        // Shortcuts
        shortcuts: 'Keyboard Shortcuts',
        restoreDefaults: 'Restore Defaults',
        pressKey: 'Press a key...',

        // Smart Editor
        smartPredict: 'Smart Text Prediction',
        smartPredictDesc: 'Auto-close brackets, expand macros, suggest variables',

        // Auto Backup
        autoBackup: 'Auto Backup',
        backupFrequency: 'Backup Frequency',
        backupOff: 'Off',
        backupDaily: 'Daily',
        backupWeekly: 'Weekly',
        backupMonthly: 'Monthly',
        backupNow: 'Backup Now',
        lastBackup: 'Last backup',
        never: 'Never',
        backupSuccess: 'Backup downloaded!'
    };

    // =====================================
    // #region UTILITY FUNCTIONS
    // =====================================

    function debounce(fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }

    function detectPlatform() {
        const host = window.location.hostname;
        if (host.includes('chatgpt.com')) return 'chatgpt';
        if (host.includes('claude.ai')) return 'claude';
        if (host.includes('gemini.google.com')) return 'gemini';
        if (host.includes('copilot.microsoft.com')) return 'copilot';
        if (host.includes('perplexity.ai')) return 'perplexity';
        if (host.includes('poe.com')) return 'poe';
        if (host.includes('huggingface.co')) return 'huggingchat';
        if (host.includes('chat.deepseek.com') || host.includes('deepseek.com')) return 'deepseek';
        if (host.includes('you.com')) return 'you';
        return null;
    }

    function getEditor() {
        if (!currentPlatform || !PLATFORM_CONFIG[currentPlatform]) return null;
        return document.querySelector(PLATFORM_CONFIG[currentPlatform].selector);
    }

    function getSendButton() {
        if (!currentPlatform || !PLATFORM_CONFIG[currentPlatform]) return null;
        return PLATFORM_CONFIG[currentPlatform].sendButton();
    }

    // =====================================
    // #region STORAGE FUNCTIONS
    // =====================================

    async function getAll() {
        return await GM_getValue(STORAGE_KEYS.PROMPTS, []);
    }

    async function saveAll(prompts) {
        await GM_setValue(STORAGE_KEYS.PROMPTS, prompts);
    }

    async function addPrompt(item) {
        const prompts = await getAll();
        prompts.unshift(item);
        await saveAll(prompts);
    }

    async function updatePrompt(index, item) {
        const prompts = await getAll();
        if (index >= 0 && index < prompts.length) {
            prompts[index] = item;
            await saveAll(prompts);
        }
    }

    async function deletePrompt(index) {
        const prompts = await getAll();
        if (index >= 0 && index < prompts.length) {
            prompts.splice(index, 1);
            await saveAll(prompts);
        }
    }

    async function movePromptToTop(index) {
        const prompts = await getAll();
        if (index > 0 && index < prompts.length) {
            const [item] = prompts.splice(index, 1);
            prompts.unshift(item);
            await saveAll(prompts);
        }
    }

    // =====================================
    // #region FOLDER FUNCTIONS (NEW!)
    // =====================================

    async function getFolders() {
        return await GM_getValue(STORAGE_KEYS.FOLDERS, []);
    }

    async function saveFolders(folders) {
        await GM_setValue(STORAGE_KEYS.FOLDERS, folders);
    }

    async function addFolder(name, emoji = '📁') {
        const folders = await getFolders();
        const id = 'folder_' + Date.now();
        folders.push({ id, name, emoji, createdAt: Date.now() });
        await saveFolders(folders);
        return id;
    }

    async function addFolderWithEmoji(name, emoji) {
        return await addFolder(name, emoji || '📁');
    }

    async function updateFolder(id, updates) {
        const folders = await getFolders();
        const folder = folders.find(f => f.id === id);
        if (folder) {
            if (typeof updates === 'string') {
                // Legacy: just name
                folder.name = updates;
            } else {
                // New: object with name and emoji
                if (updates.name) folder.name = updates.name;
                if (updates.emoji) folder.emoji = updates.emoji;
            }
            await saveFolders(folders);
        }
    }

    async function deleteFolder(id) {
        const folders = await getFolders();
        const index = folders.findIndex(f => f.id === id);
        if (index > -1) {
            folders.splice(index, 1);
            await saveFolders(folders);

            // Move prompts in this folder to uncategorized
            const prompts = await getAll();
            prompts.forEach(p => {
                if (p.folderId === id) {
                    p.folderId = null;
                }
            });
            await saveAll(prompts);
        }
    }

    async function getPromptsInFolder(folderId) {
        const prompts = await getAll();
        if (folderId === null) {
            return prompts; // All prompts
        }
        if (folderId === 'uncategorized') {
            return prompts.filter(p => !p.folderId);
        }
        return prompts.filter(p => p.folderId === folderId);
    }

    // =====================================
    // #region FILE STORAGE
    // =====================================

    async function getGlobalFiles() {
        return await GM_getValue(STORAGE_KEYS.GLOBAL_FILES, []);
    }

    async function saveGlobalFile(file) {
        const files = await getGlobalFiles();
        files.push(file);
        await GM_setValue(STORAGE_KEYS.GLOBAL_FILES, files);
    }

    async function deleteGlobalFile(id) {
        const files = await getGlobalFiles();
        const index = files.findIndex(f => f.id === id);
        if (index > -1) {
            files.splice(index, 1);
            await GM_setValue(STORAGE_KEYS.GLOBAL_FILES, files);
        }
    }

    // =====================================
    // #region USAGE STATS & RECENT
    // =====================================

    async function getUsageStats() {
        return await GM_getValue(STORAGE_KEYS.USAGE_STATS, {});
    }

    async function incrementUsage(promptTitle) {
        const stats = await getUsageStats();
        stats[promptTitle] = (stats[promptTitle] || 0) + 1;
        await GM_setValue(STORAGE_KEYS.USAGE_STATS, stats);
        return stats[promptTitle];
    }

    async function getRecentPrompts() {
        return await GM_getValue(STORAGE_KEYS.RECENT_PROMPTS, []);
    }

    async function addToRecent(promptTitle) {
        let recent = await getRecentPrompts();
        // Remove if already exists
        recent = recent.filter(t => t !== promptTitle);
        // Add to front
        recent.unshift(promptTitle);
        // Keep only last 5
        recent = recent.slice(0, 5);
        await GM_setValue(STORAGE_KEYS.RECENT_PROMPTS, recent);
    }

    // =====================================
    // #region ACCENT COLOR
    // =====================================

    async function getAccentColor() {
        return await GM_getValue(STORAGE_KEYS.ACCENT_COLOR, DEFAULT_ACCENT);
    }

    async function setAccentColor(color) {
        await GM_setValue(STORAGE_KEYS.ACCENT_COLOR, color);
        applyAccentColor(color);
    }

    function applyAccentColor(color) {
        document.documentElement.style.setProperty('--mp-accent', color);
        // Calculate lighter/darker variants
        const hsl = hexToHSL(color);
        document.documentElement.style.setProperty('--mp-accent-hover', `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(0, hsl.l - 10)}%)`);
        document.documentElement.style.setProperty('--mp-accent-light', `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(100, hsl.l + 35)}%)`);
    }

    function hexToHSL(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; }
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    // =====================================
    // #region AUTO BACKUP
    // =====================================

    // Backup frequencies in HOURS
    const BACKUP_FREQUENCIES = {
        off: 0,
        daily: 24,      // 24 hours
        weekly: 168,    // 7 days * 24 hours
        monthly: 720    // 30 days * 24 hours
    };

    async function getBackupSettings() {
        return await GM_getValue(STORAGE_KEYS.AUTO_BACKUP, { frequency: 'off' });
    }

    async function setBackupSettings(settings) {
        await GM_setValue(STORAGE_KEYS.AUTO_BACKUP, settings);
    }

    async function getLastBackupDate() {
        return await GM_getValue(STORAGE_KEYS.LAST_BACKUP, null);
    }

    async function setLastBackupDate(date) {
        await GM_setValue(STORAGE_KEYS.LAST_BACKUP, date);
    }

    async function performBackup() {
        const prompts = await getAll();
        const folders = await getFolders();
        const usageStats = await getUsageStats();
        const folderNames = await GM_getValue(STORAGE_KEYS.FOLDER_NAMES, {});
        const folderEmojis = await GM_getValue(STORAGE_KEYS.FOLDER_EMOJIS, {});

        const data = {
            prompts,
            folders,
            usageStats,
            folderNames,
            folderEmojis,
            version: 6,
            exportDate: new Date().toISOString()
        };

        const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const filename = `my-prompt-backup-${dateStr}.json`;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        await setLastBackupDate(new Date().toISOString());
        return filename;
    }

    async function checkAutoBackup() {
        const settings = await getBackupSettings();
        if (settings.frequency === 'off') return;

        const lastBackup = await getLastBackupDate();
        const hoursSinceBackup = lastBackup
            ? Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60))
            : Infinity;

        const requiredHours = BACKUP_FREQUENCIES[settings.frequency];

        if (hoursSinceBackup >= requiredHours) {
            // Wait a few seconds after page load before auto-backup
            setTimeout(async () => {
                await performBackup();
                console.log('[My Prompt] Auto-backup completed');
            }, 5000);
        }
    }

    function formatLastBackup(dateStr) {
        if (!dateStr) return T.never;
        const date = new Date(dateStr);
        const now = new Date();
        const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    }

    // =====================================
    // #region PROMPT HELPERS
    // =====================================

    async function duplicatePrompt(prompt) {
        const newPrompt = {
            ...prompt,
            title: prompt.title + ' (Copy)',
            id: Date.now().toString()
        };
        const prompts = await getAll();
        prompts.push(newPrompt);
        await saveAll(prompts);
        return newPrompt;
    }

    async function movePromptToFolder(promptTitle, folderId) {
        const prompts = await getAll();
        const prompt = prompts.find(p => p.title === promptTitle);
        if (prompt) {
            prompt.folderId = folderId === 'uncategorized' ? null : folderId;
            await saveAll(prompts);
        }
    }

    // =====================================
    // #region ICONS
    // =====================================

    const ICONS = {
        menu: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 5h12M4 10h12M4 15h12" stroke="currentColor" stroke-width="2"/></svg>`,
        close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
        edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
        delete: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`,
        folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`,
        folderPlus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`,
        pin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>`,
        chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`,
        chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`,
        plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
        settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
        import: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
        export: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
        sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
        moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
        move: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>`,
        copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
        clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
        star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>`,
        monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
    };

    // =====================================
    // #region STYLES
    // =====================================

    function injectStyles() {
        if (document.getElementById('mp-styles')) return;

        const css = `
            :root {
                --mp-bg-primary: #ffffff;
                --mp-bg-secondary: #f8f9fa;
                --mp-bg-tertiary: #e9ecef;
                --mp-bg-overlay: rgba(0, 0, 0, 0.5);
                --mp-text-primary: #212529;
                --mp-text-secondary: #495057;
                --mp-text-tertiary: #868e96;
                --mp-border-primary: #dee2e6;
                --mp-accent: #7c7dfc;
                --mp-accent-hover: #6366f1;
                --mp-danger: #ef4444;
                --mp-success: #22c55e;
                --mp-warning: #f59e0b;
                --mp-radius-sm: 4px;
                --mp-radius-md: 8px;
                --mp-radius-lg: 12px;
                --mp-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                --mp-transition: 0.2s ease;
            }

            @media (prefers-color-scheme: dark) {
                :root {
                    --mp-bg-primary: #1a1a1a;
                    --mp-bg-secondary: #2d2d2d;
                    --mp-bg-tertiary: #404040;
                    --mp-text-primary: #f5f5f5;
                    --mp-text-secondary: #d4d4d4;
                    --mp-text-tertiary: #a3a3a3;
                    --mp-border-primary: #404040;
                }
            }

            [data-mp-theme="light"] {
                --mp-bg-primary: #ffffff;
                --mp-bg-secondary: #f8f9fa;
                --mp-bg-tertiary: #e9ecef;
                --mp-text-primary: #212529;
                --mp-text-secondary: #495057;
                --mp-text-tertiary: #868e96;
                --mp-border-primary: #dee2e6;
            }

            [data-mp-theme="dark"] {
                --mp-bg-primary: #1a1a1a;
                --mp-bg-secondary: #2d2d2d;
                --mp-bg-tertiary: #404040;
                --mp-text-primary: #f5f5f5;
                --mp-text-secondary: #d4d4d4;
                --mp-text-tertiary: #a3a3a3;
                --mp-border-primary: #404040;
            }

            .mp-hidden { display: none !important; }

            /* Overlay */
            .mp-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: var(--mp-bg-overlay);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity var(--mp-transition), visibility var(--mp-transition);
                backdrop-filter: blur(4px);
            }
            .mp-overlay.visible { opacity: 1; visibility: visible; }

            /* Modal */
            .mp-modal {
                background: var(--mp-bg-primary);
                border-radius: var(--mp-radius-lg);
                box-shadow: var(--mp-shadow);
                width: min(90vw, 500px);
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                transform: scale(0.95);
                transition: transform var(--mp-transition);
                border: 1px solid var(--mp-border-primary);
            }
            .mp-modal-small {
                width: min(90vw, 380px);
            }
            .mp-overlay.visible .mp-modal { transform: scale(1); }

            .mp-modal-header {
                padding: 16px 20px;
                border-bottom: 1px solid var(--mp-border-primary);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .mp-modal-title {
                font-size: 18px;
                font-weight: 600;
                color: var(--mp-text-primary);
                margin: 0;
            }
            .mp-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }
            .mp-modal-footer {
                padding: 16px 20px;
                border-top: 1px solid var(--mp-border-primary);
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }

            /* Menu */
            .mp-menu {
                position: fixed;
                width: 500px;
                height: 450px;
                min-width: 350px;
                min-height: 300px;
                max-width: 90vw;
                max-height: 80vh;
                background: var(--mp-bg-primary);
                border: 1px solid var(--mp-border-primary);
                border-radius: var(--mp-radius-lg);
                box-shadow: var(--mp-shadow);
                z-index: 999998;
                display: flex;
                flex-direction: column;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
                overflow: hidden;
            }
            .mp-menu.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            /* Resize handles */
            .mp-resize-handle {
                position: absolute;
                z-index: 10;
            }
            .mp-resize-top {
                top: -4px;
                left: 0;
                width: 100%;
                height: 8px;
                cursor: ns-resize;
            }
            .mp-resize-right {
                top: 0;
                right: -4px;
                width: 8px;
                height: 100%;
                cursor: ew-resize;
            }
            .mp-resize-bottom {
                bottom: -4px;
                left: 0;
                width: 100%;
                height: 8px;
                cursor: ns-resize;
            }
            .mp-resize-corner {
                bottom: -4px;
                right: -4px;
                width: 16px;
                height: 16px;
                cursor: nwse-resize;
            }
            .mp-resize-corner-top {
                top: -4px;
                right: -4px;
                width: 16px;
                height: 16px;
                cursor: nesw-resize;
            }
            .mp-resize-handle:hover {
                background: rgba(124, 58, 237, 0.3);
            }

            /* Folder divider (draggable) */
            .mp-folder-divider {
                width: 5px;
                cursor: col-resize;
                background: transparent;
                transition: background 0.2s;
                flex-shrink: 0;
            }
            .mp-folder-divider:hover {
                background: var(--mp-accent);
            }

            .mp-menu-header {
                padding: 12px;
                border-bottom: 1px solid var(--mp-border-primary);
                display: flex;
                gap: 8px;
                align-items: center;
                flex-shrink: 0;
            }

            .mp-search {
                flex: 1;
                padding: 10px 14px;
                border: 1px solid var(--mp-border-primary);
                border-radius: var(--mp-radius-md);
                background: var(--mp-bg-secondary);
                color: var(--mp-text-primary);
                font-size: 14px;
                outline: none;
            }
            .mp-search:focus { border-color: var(--mp-accent); }
            .mp-search::placeholder { color: var(--mp-text-tertiary); }

            /* Menu Content - Horizontal Split */
            .mp-menu-content {
                display: flex;
                flex: 1;
                overflow: hidden;
            }

            /* Folder Sidebar */
            .mp-folder-sidebar {
                width: 140px;
                min-width: 80px;
                max-width: 250px;
                display: flex;
                flex-direction: column;
                background: var(--mp-bg-secondary);
                flex-shrink: 0;
            }

            /* Folder Header with Categories + Pencil */
            .mp-folder-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 12px;
                border-bottom: 1px solid var(--mp-border-primary);
            }
            .mp-folder-header-title {
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--mp-text-tertiary);
            }
            .mp-folder-header-add {
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                background: transparent;
                border: none;
                cursor: pointer;
                color: var(--mp-text-tertiary);
                padding: 0;
                transition: all 0.15s ease;
            }
            .mp-folder-header-add:hover {
                background: var(--mp-bg-tertiary);
                color: var(--mp-accent);
            }
            .mp-folder-header-add svg {
                width: 14px;
                height: 14px;
            }

            .mp-folder-list {
                flex: 1;
                overflow-y: auto;
                padding: 8px;
            }

            .mp-folder-item {
                padding: 8px 10px;
                border-radius: var(--mp-radius-sm);
                cursor: pointer;
                font-size: 11px;
                font-weight: 500;
                color: var(--mp-text-secondary);
                display: flex;
                align-items: center;
                gap: 5px;
                transition: all var(--mp-transition);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: 2px;
                position: relative;
            }
            .mp-folder-item:hover {
                background: var(--mp-bg-tertiary);
                color: var(--mp-text-primary);
            }
            .mp-folder-item.active {
                background: var(--mp-accent);
                color: white;
            }
            .mp-folder-item svg {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
            }

            .mp-folder-emoji {
                font-size: 14px;
                line-height: 1;
                flex-shrink: 0;
                width: 16px;
                text-align: center;
            }

            .mp-folder-name {
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
                min-width: 0;
            }

            /* Folder edit pencil button */
            .mp-folder-edit {
                opacity: 0.5;
                width: 22px;
                height: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                background: transparent;
                border: none;
                cursor: pointer;
                color: inherit;
                padding: 0;
                flex-shrink: 0;
                transition: all 0.15s ease;
            }
            .mp-folder-edit:hover {
                opacity: 1;
                background: rgba(0,0,0,0.1);
            }
            .mp-folder-item.active .mp-folder-edit {
                opacity: 0.7;
            }
            .mp-folder-item.active .mp-folder-edit:hover {
                opacity: 1;
                background: rgba(255,255,255,0.2);
            }
            .mp-folder-edit svg {
                width: 12px;
                height: 12px;
            }

            /* Prompt List */
            .mp-prompt-list {
                flex: 1;
                overflow-y: auto;
                padding: 8px;
                min-width: 0;
            }

            .mp-prompt-item {
                padding: 8px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: flex-start;
                gap: 8px;
                border: 2px solid #e0e0e0;
                margin-bottom: 6px;
                background: #fafafa;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
                position: relative;
                z-index: 1;
            }
            .mp-prompt-item:hover {
                background: #ffffff;
                border-color: var(--mp-accent);
                box-shadow: 0 8px 24px rgba(124, 58, 237, 0.25);
                transform: scale(1.02);
                z-index: 100;
                padding: 12px 14px;
            }
            @media (prefers-color-scheme: dark) {
                .mp-prompt-item {
                    border-color: #444;
                    background: #2a2a2a;
                }
                .mp-prompt-item:hover {
                    background: #333;
                    border-color: var(--mp-accent);
                }
            }

            .mp-prompt-item-content {
                flex: 1;
                overflow: hidden;
                min-width: 0;
            }

            .mp-prompt-item-title {
                font-size: 13px;
                font-weight: 600;
                color: var(--mp-text-primary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.2;
                transition: all 0.25s ease;
            }
            .mp-prompt-item:hover .mp-prompt-item-title {
                font-size: 14px;
                white-space: normal;
                overflow: visible;
                margin-bottom: 4px;
            }

            .mp-prompt-item-preview {
                font-size: 11px;
                color: var(--mp-text-tertiary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.3;
                margin-top: 2px;
                max-height: 16px;
                transition: all 0.25s ease;
            }
            .mp-prompt-item:hover .mp-prompt-item-preview {
                white-space: normal;
                overflow: visible;
                text-overflow: unset;
                max-height: 60px;
                color: var(--mp-text-secondary);
            }

            .mp-prompt-item-meta {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-top: 2px;
                flex-wrap: wrap;
                transition: all 0.25s ease;
            }
            .mp-prompt-item:hover .mp-prompt-item-meta {
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid var(--mp-border-primary);
            }

            .mp-prompt-usage {
                font-size: 10px;
                color: var(--mp-text-tertiary);
                display: flex;
                align-items: center;
                gap: 3px;
            }
            .mp-prompt-usage svg {
                width: 10px;
                height: 10px;
            }

            .mp-prompt-folder-badge {
                font-size: 9px;
                padding: 1px 5px;
                background: var(--mp-accent-light, rgba(124, 58, 237, 0.15));
                color: var(--mp-accent);
                border-radius: 3px;
                white-space: nowrap;
                max-width: 90px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .mp-prompt-folder-badge.mp-folder-uncategorized {
                background: var(--mp-bg-tertiary);
                color: var(--mp-text-tertiary);
            }

            .mp-prompt-tags {
                display: flex;
                gap: 4px;
                flex-wrap: wrap;
            }

            .mp-tag {
                font-size: 10px;
                padding: 2px 6px;
                background: var(--mp-bg-tertiary);
                color: var(--mp-text-secondary);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            .mp-tag:hover {
                background: var(--mp-accent);
                color: white;
            }

            /* Recent Section */
            .mp-recent-section {
                padding: 5px 8px;
                border-bottom: 1px solid var(--mp-border-primary);
                background: var(--mp-bg-secondary);
            }
            .mp-recent-header {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 9px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--mp-text-tertiary);
                margin-bottom: 4px;
            }
            .mp-recent-header svg {
                width: 10px;
                height: 10px;
            }
            .mp-recent-list {
                display: flex;
                flex-wrap: wrap;
                gap: 3px;
            }
            .mp-recent-item {
                font-size: 10px;
                padding: 2px 6px;
                background: var(--mp-bg-primary);
                border: 1px solid var(--mp-border-primary);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.15s ease;
                max-width: 120px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .mp-recent-item:hover {
                border-color: var(--mp-accent);
                background: rgba(124, 58, 237, 0.05);
            }

            /* Tag Filter */
            .mp-tag-filter {
                display: flex;
                gap: 4px;
                padding: 8px;
                flex-wrap: wrap;
                border-bottom: 1px solid var(--mp-border-primary);
            }
            .mp-tag-filter-btn {
                font-size: 11px;
                padding: 4px 8px;
                background: var(--mp-bg-secondary);
                border: 1px solid var(--mp-border-primary);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            .mp-tag-filter-btn:hover,
            .mp-tag-filter-btn.active {
                background: var(--mp-accent);
                color: white;
                border-color: var(--mp-accent);
            }

            /* Emoji Picker */
            .mp-emoji-picker {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 4px;
                padding: 8px;
                background: var(--mp-bg-secondary);
                border-radius: 8px;
                margin-top: 8px;
            }
            .mp-emoji-btn {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                background: transparent;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            .mp-emoji-btn:hover {
                background: var(--mp-bg-tertiary);
                transform: scale(1.1);
            }
            .mp-emoji-btn.active {
                background: var(--mp-accent);
                transform: scale(1.15);
                border-radius: 8px;
            }

            /* Color Picker */
            .mp-color-picker {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .mp-color-input {
                width: 50px;
                height: 36px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                padding: 2px;
            }
            .mp-color-presets {
                display: flex;
                gap: 6px;
            }
            .mp-color-preset {
                width: 28px;
                height: 28px;
                border-radius: 6px;
                border: 2px solid transparent;
                cursor: pointer;
                transition: all 0.15s ease;
            }
            .mp-color-preset:hover {
                transform: scale(1.1);
            }
            .mp-color-preset.active {
                border-color: var(--mp-text-primary);
            }

            /* Backup row */
            .mp-backup-row {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            /* Move to Folder Dropdown */
            .mp-move-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--mp-bg-primary);
                border: 1px solid var(--mp-border-primary);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 100;
                min-width: 150px;
                max-height: 200px;
                overflow-y: auto;
            }
            .mp-move-dropdown-item {
                padding: 8px 12px;
                cursor: pointer;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background 0.15s ease;
            }
            .mp-move-dropdown-item:hover {
                background: var(--mp-bg-secondary);
            }

            .mp-prompt-item-actions {
                display: none;
                gap: 2px;
                flex-shrink: 0;
                margin-left: auto;
            }
            .mp-prompt-item:hover .mp-prompt-item-actions {
                display: flex;
            }
            .mp-prompt-item-actions .mp-btn-icon {
                width: 22px;
                height: 22px;
                padding: 0;
                background: var(--mp-bg-primary);
                border: 1px solid var(--mp-border-primary);
                border-radius: 4px;
            }
            .mp-prompt-item-actions .mp-btn-icon:hover {
                background: var(--mp-accent);
                border-color: var(--mp-accent);
                color: white;
            }
            .mp-prompt-item-actions .mp-btn-icon svg {
                width: 11px;
                height: 11px;
            }

            .mp-prompt-pinned {
                border-left: 3px solid var(--mp-accent);
                background: rgba(124, 58, 237, 0.05);
            }

            /* Buttons */
            .mp-btn {
                padding: 8px 16px;
                border-radius: var(--mp-radius-md);
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all var(--mp-transition);
                border: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            .mp-btn svg { width: 16px; height: 16px; }

            .mp-btn-primary {
                background: var(--mp-accent);
                color: white;
            }
            .mp-btn-primary:hover { background: var(--mp-accent-hover); }

            .mp-btn-secondary {
                background: var(--mp-bg-secondary);
                color: var(--mp-text-primary);
                border: 1px solid var(--mp-border-primary);
            }
            .mp-btn-secondary:hover { background: var(--mp-bg-tertiary); }

            .mp-btn-ghost {
                background: transparent;
                color: var(--mp-text-secondary);
                padding: 6px;
            }
            .mp-btn-ghost:hover {
                background: var(--mp-bg-tertiary);
                color: var(--mp-text-primary);
            }

            .mp-btn-danger {
                background: var(--mp-danger);
                color: white;
            }
            .mp-btn-danger:hover { opacity: 0.9; }

            .mp-btn-icon {
                width: 28px;
                height: 28px;
                padding: 0;
                border-radius: var(--mp-radius-sm);
            }
            .mp-btn-icon svg { width: 14px; height: 14px; }

            /* Form Elements */
            .mp-form-group { margin-bottom: 16px; }

            .mp-label {
                display: block;
                font-size: 13px;
                font-weight: 500;
                color: var(--mp-text-primary);
                margin-bottom: 6px;
            }

            .mp-input, .mp-textarea, .mp-select {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid var(--mp-border-primary);
                border-radius: var(--mp-radius-md);
                background: var(--mp-bg-secondary);
                color: var(--mp-text-primary);
                font-size: 14px;
                outline: none;
                transition: border-color var(--mp-transition);
                box-sizing: border-box;
            }
            .mp-input:focus, .mp-textarea:focus, .mp-select:focus {
                border-color: var(--mp-accent);
            }

            .mp-textarea {
                min-height: 150px;
                resize: vertical;
                font-family: 'Monaco', 'Menlo', monospace;
            }

            /* Toggle Switch */
            .mp-toggle {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
            }
            .mp-toggle-input { display: none; }
            .mp-toggle-slider {
                width: 40px;
                height: 22px;
                background: var(--mp-bg-tertiary);
                border-radius: 11px;
                position: relative;
                transition: background var(--mp-transition);
            }
            .mp-toggle-slider::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 18px;
                height: 18px;
                background: white;
                border-radius: 50%;
                transition: transform var(--mp-transition);
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            .mp-toggle-input:checked + .mp-toggle-slider {
                background: var(--mp-accent);
            }
            .mp-toggle-input:checked + .mp-toggle-slider::after {
                transform: translateX(18px);
            }
            .mp-toggle-label {
                font-size: 14px;
                color: var(--mp-text-primary);
            }

            /* Menu Footer */
            .mp-menu-footer {
                padding: 10px 12px;
                border-top: 1px solid var(--mp-border-primary);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--mp-bg-secondary);
                flex-shrink: 0;
            }
            .mp-menu-footer-left, .mp-menu-footer-right {
                display: flex;
                gap: 6px;
            }

            /* Empty State */
            .mp-empty {
                padding: 30px 20px;
                text-align: center;
                color: var(--mp-text-tertiary);
                font-size: 14px;
            }

            /* Platform Button */
            .mp-trigger-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                border-radius: 8px;
                border: none;
                background: transparent;
                color: currentColor;
                cursor: pointer;
                transition: all var(--mp-transition);
                opacity: 0.7;
                padding: 0;
                margin: 0 2px;
            }
            .mp-trigger-btn:hover {
                background: rgba(0,0,0,0.05);
                opacity: 1;
            }
            @media (prefers-color-scheme: dark) {
                .mp-trigger-btn:hover {
                    background: rgba(255,255,255,0.1);
                }
            }
            .mp-trigger-btn svg {
                width: 18px;
                height: 18px;
            }

            /* Folder badge */
            .mp-folder-badge {
                font-size: 10px;
                padding: 2px 6px;
                background: var(--mp-bg-tertiary);
                border-radius: 10px;
                color: var(--mp-text-tertiary);
                margin-left: auto;
            }

            /* Tooltip */
            .mp-tooltip {
                position: fixed;
                background: var(--mp-text-primary);
                color: var(--mp-bg-primary);
                padding: 4px 8px;
                border-radius: var(--mp-radius-sm);
                font-size: 12px;
                z-index: 9999999;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.15s;
            }
            .mp-tooltip.visible { opacity: 1; }

            /* Segmented Control for theme */
            .mp-segmented {
                display: flex;
                background: var(--mp-bg-tertiary);
                border-radius: var(--mp-radius-md);
                padding: 3px;
            }
            .mp-segmented-btn {
                flex: 1;
                padding: 8px 12px;
                border: none;
                background: transparent;
                color: var(--mp-text-secondary);
                font-size: 13px;
                cursor: pointer;
                border-radius: var(--mp-radius-sm);
                transition: all var(--mp-transition);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            .mp-segmented-btn:hover { color: var(--mp-text-primary); }
            .mp-segmented-btn.active {
                background: var(--mp-bg-primary);
                color: var(--mp-text-primary);
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .mp-segmented-btn svg { width: 14px; height: 14px; }
        `;

        const style = document.createElement('style');
        style.id = 'mp-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // =====================================
    // #region THEME
    // =====================================

    async function loadTheme() {
        currentTheme = await GM_getValue(STORAGE_KEYS.THEME, DEFAULT_THEME);
        applyTheme();
    }

    function applyTheme() {
        const mode = currentTheme.mode;
        if (mode === 'light') {
            document.documentElement.setAttribute('data-mp-theme', 'light');
        } else if (mode === 'dark') {
            document.documentElement.setAttribute('data-mp-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-mp-theme');
        }
    }

    async function saveTheme(mode) {
        currentTheme.mode = mode;
        await GM_setValue(STORAGE_KEYS.THEME, currentTheme);
        applyTheme();
    }

    // =====================================
    // #region CREATE BUTTON (Unified)
    // =====================================

    function createTriggerButton() {
        const btn = document.createElement('button');
        btn.setAttribute('data-testid', 'mp-trigger');
        btn.setAttribute('type', 'button');
        btn.title = T.prompts;

        // Platform-specific styling
        if (currentPlatform === 'claude') {
            // Match Claude's button style
            btn.className = 'inline-flex items-center justify-center';
            btn.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                border: none;
                background: transparent;
                color: inherit;
                cursor: pointer;
                padding: 0;
                margin: 0 2px;
                opacity: 0.7;
                transition: opacity 0.2s, background 0.2s;
            `;
            btn.onmouseenter = () => { btn.style.opacity = '1'; btn.style.background = 'rgba(0,0,0,0.05)'; };
            btn.onmouseleave = () => { btn.style.opacity = '0.7'; btn.style.background = 'transparent'; };
        } else if (currentPlatform === 'gemini') {
            // Match Gemini's button style in leading-actions-wrapper
            btn.className = 'mp-trigger-btn';
            btn.style.cssText = `
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 40px !important;
                height: 40px !important;
                min-width: 40px !important;
                min-height: 40px !important;
                border-radius: 50% !important;
                border: none !important;
                background: transparent !important;
                color: #5f6368 !important;
                cursor: pointer !important;
                padding: 8px !important;
                margin: 0 4px !important;
                flex-shrink: 0 !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: relative !important;
                z-index: 1000 !important;
            `;
            btn.onmouseenter = () => { btn.style.background = 'rgba(0,0,0,0.05)'; };
            btn.onmouseleave = () => { btn.style.background = 'transparent'; };

            if (DEBUG_MODE) {
                console.log('[My Prompt DEBUG] Created Gemini-styled button');
            }
        } else {
            btn.className = 'mp-trigger-btn';
        }

        // Use a simple, recognizable icon (list/menu) - created via DOM API for CSP compliance
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '18');
        svg.setAttribute('height', '18');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', '4'); line1.setAttribute('y1', '6');
        line1.setAttribute('x2', '20'); line1.setAttribute('y2', '6');

        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', '4'); line2.setAttribute('y1', '12');
        line2.setAttribute('x2', '20'); line2.setAttribute('y2', '12');

        const line3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line3.setAttribute('x1', '4'); line3.setAttribute('y1', '18');
        line3.setAttribute('x2', '20'); line3.setAttribute('y2', '18');

        svg.appendChild(line1);
        svg.appendChild(line2);
        svg.appendChild(line3);
        btn.appendChild(svg);

        return btn;
    }

    // =====================================
    // #region MENU
    // =====================================

    function createMenu() {
        const menu = document.createElement('div');
        menu.className = 'mp-menu';
        menu.id = 'mp-menu';

        safeSetInnerHTML(menu, `
            <div class="mp-menu-header">
                <input type="text" class="mp-search" placeholder="${T.search}" id="mp-search">
                <button class="mp-btn mp-btn-primary mp-btn-icon" id="mp-new-btn" title="${T.newPrompt}">
                    ${ICONS.plus}
                </button>
            </div>
            <div class="mp-menu-content">
                <div class="mp-folder-sidebar" id="mp-folder-sidebar">
                    <div class="mp-folder-header">
                        <span class="mp-folder-header-title">${T.folders}</span>
                        <button class="mp-folder-header-add" id="mp-new-folder" title="${T.newFolder}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="mp-folder-list" id="mp-folder-list"></div>
                </div>
                <div class="mp-folder-divider" id="mp-folder-divider" title="Drag to resize"></div>
                <div class="mp-prompt-list" id="mp-prompt-list"></div>
            </div>
            <div class="mp-menu-footer">
                <div class="mp-menu-footer-left">
                    <button class="mp-btn mp-btn-ghost mp-btn-icon" id="mp-import" title="${T.import}">
                        ${ICONS.import}
                    </button>
                    <button class="mp-btn mp-btn-ghost mp-btn-icon" id="mp-export" title="${T.export}">
                        ${ICONS.export}
                    </button>
                </div>
                <div class="mp-menu-footer-right">
                    <button class="mp-btn mp-btn-ghost mp-btn-icon" id="mp-settings" title="${T.settings}">
                        ${ICONS.settings}
                    </button>
                </div>
            </div>
            <div class="mp-resize-handle mp-resize-top" data-resize="top"></div>
            <div class="mp-resize-handle mp-resize-right" data-resize="right"></div>
            <div class="mp-resize-handle mp-resize-bottom" data-resize="bottom"></div>
            <div class="mp-resize-handle mp-resize-corner" data-resize="corner"></div>
            <div class="mp-resize-handle mp-resize-handle mp-resize-corner-top" data-resize="corner-top"></div>
        `);

        // Initialize resize functionality
        initMenuResize(menu);

        return menu;
    }

    // Menu resize functionality
    async function initMenuResize(menu) {
        // Load saved size
        const savedSize = await GM_getValue(STORAGE_KEYS.MENU_SIZE, DEFAULT_MENU_SIZE);
        menu.style.width = savedSize.width + 'px';
        menu.style.height = savedSize.height + 'px';

        const folderSidebar = menu.querySelector('#mp-folder-sidebar');
        if (folderSidebar && savedSize.folderWidth) {
            folderSidebar.style.width = savedSize.folderWidth + 'px';
        }

        // Resize handles (top, right, bottom, corner, corner-top)
        const handles = menu.querySelectorAll('.mp-resize-handle');
        handles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const resizeType = handle.dataset.resize;
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = menu.offsetWidth;
                const startHeight = menu.offsetHeight;
                const startTop = menu.offsetTop;
                const rect = menu.getBoundingClientRect();

                function onMouseMove(e) {
                    // Right edge resize
                    if (resizeType === 'right' || resizeType === 'corner' || resizeType === 'corner-top') {
                        const newWidth = Math.max(350, Math.min(window.innerWidth * 0.9, startWidth + (e.clientX - startX)));
                        menu.style.width = newWidth + 'px';
                    }
                    // Bottom edge resize
                    if (resizeType === 'bottom' || resizeType === 'corner') {
                        const newHeight = Math.max(300, Math.min(window.innerHeight * 0.8, startHeight + (e.clientY - startY)));
                        menu.style.height = newHeight + 'px';
                    }
                    // Top edge resize (changes height and position)
                    if (resizeType === 'top' || resizeType === 'corner-top') {
                        const deltaY = e.clientY - startY;
                        const newHeight = Math.max(300, Math.min(window.innerHeight * 0.8, startHeight - deltaY));
                        if (newHeight !== startHeight) {
                            menu.style.height = newHeight + 'px';
                            // Adjust top position to keep bottom fixed
                            const newTop = rect.top + deltaY;
                            if (newTop > 10 && newHeight >= 300) {
                                menu.style.top = newTop + 'px';
                            }
                        }
                    }
                }

                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    // Save size
                    saveMenuSize(menu);
                }

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        });

        // Folder divider drag (horizontal resize between folders and prompts)
        const divider = menu.querySelector('#mp-folder-divider');
        if (divider && folderSidebar) {
            divider.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startWidth = folderSidebar.offsetWidth;

                function onMouseMove(e) {
                    const newWidth = Math.max(80, Math.min(250, startWidth + (e.clientX - startX)));
                    folderSidebar.style.width = newWidth + 'px';
                }

                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    // Save size
                    saveMenuSize(menu);
                }

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }
    }

    async function saveMenuSize(menu) {
        const folderSidebar = menu.querySelector('#mp-folder-sidebar');
        const size = {
            width: menu.offsetWidth,
            height: menu.offsetHeight,
            folderWidth: folderSidebar ? folderSidebar.offsetWidth : DEFAULT_MENU_SIZE.folderWidth
        };
        await GM_setValue(STORAGE_KEYS.MENU_SIZE, size);
    }

    async function refreshMenu(searchTerm = '') {
        if (!currentMenu) return;

        const folderList = currentMenu.querySelector('#mp-folder-list');
        const promptList = currentMenu.querySelector('#mp-prompt-list');

        // Render folders
        const folders = await getFolders();
        const customNames = await GM_getValue(STORAGE_KEYS.FOLDER_NAMES, {});

        // Get display names (custom or default)
        const allPromptsName = customNames['all'] || T.allPrompts;
        const uncategorizedName = customNames['uncategorized'] || T.uncategorized;

        // Get folder emojis
        const folderEmojis = await GM_getValue(STORAGE_KEYS.FOLDER_EMOJIS, {});
        const allPromptsEmoji = folderEmojis['all'] || '📁';
        const uncategorizedEmoji = folderEmojis['uncategorized'] || '📁';

        // Pencil icon SVG
        const pencilIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
        </svg>`;

        safeSetInnerHTML(folderList, `
            <div class="mp-folder-item ${selectedFolder === null ? 'active' : ''}" data-folder-id="all" data-system="true">
                <span class="mp-folder-emoji">${allPromptsEmoji}</span>
                <span class="mp-folder-name">${allPromptsName}</span>
                <button class="mp-folder-edit" data-folder-id="all" data-folder-name="${allPromptsName}" data-folder-emoji="${allPromptsEmoji}" title="${T.renameFolder}">
                    ${pencilIcon}
                </button>
            </div>
            <div class="mp-folder-item ${selectedFolder === 'uncategorized' ? 'active' : ''}" data-folder-id="uncategorized" data-system="true">
                <span class="mp-folder-emoji">${uncategorizedEmoji}</span>
                <span class="mp-folder-name">${uncategorizedName}</span>
                <button class="mp-folder-edit" data-folder-id="uncategorized" data-folder-name="${uncategorizedName}" data-folder-emoji="${uncategorizedEmoji}" title="${T.renameFolder}">
                    ${pencilIcon}
                </button>
            </div>
            ${folders.map(f => `
                <div class="mp-folder-item ${selectedFolder === f.id ? 'active' : ''}" data-folder-id="${f.id}">
                    <span class="mp-folder-emoji">${f.emoji || '📁'}</span>
                    <span class="mp-folder-name" title="${f.name}">${f.name}</span>
                    <button class="mp-folder-edit" data-folder-id="${f.id}" data-folder-name="${f.name}" data-folder-emoji="${f.emoji || '📁'}" title="${T.renameFolder}">
                        ${pencilIcon}
                    </button>
                </div>
            `).join('')}
        `);

        // Folder edit button click handlers (ALL folders now)
        folderList.querySelectorAll('.mp-folder-edit').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation(); // Don't trigger folder selection
                const folderId = btn.dataset.folderId;
                const folderName = btn.dataset.folderName;
                const folderEmoji = btn.dataset.folderEmoji;

                // For custom folders, find the full folder object
                const folder = folders.find(f => f.id === folderId);

                if (folder) {
                    // Custom folder - use existing modal
                    openFolderModal(folder);
                } else {
                    // System folder (all or uncategorized) - open rename modal with just the name
                    openFolderModal({ id: folderId, name: folderName, emoji: folderEmoji, isSystem: true });
                }
            };
        });

        // Folder click handlers
        folderList.querySelectorAll('.mp-folder-item').forEach(item => {
            const folderId = item.dataset.folderId;

            // Left click - select folder
            item.onclick = (e) => {
                e.stopPropagation(); // Prevent menu from closing
                // Don't select if clicking the edit button
                if (e.target.closest('.mp-folder-edit')) return;
                selectedFolder = folderId === 'all' ? null : folderId;
                refreshMenu(currentSearchTerm);
            };

            // Right click - context menu for custom folders (not "all" or "uncategorized")
            if (folderId !== 'all' && folderId !== 'uncategorized') {
                item.oncontextmenu = async (e) => {
                    e.preventDefault();

                    // Remove any existing context menu
                    const existingMenu = document.querySelector('.mp-context-menu');
                    if (existingMenu) existingMenu.remove();

                    // Find the folder
                    const folders = await getFolders();
                    const folder = folders.find(f => f.id === folderId);
                    if (!folder) return;

                    // Create context menu
                    const contextMenu = document.createElement('div');
                    contextMenu.className = 'mp-context-menu';
                    contextMenu.style.cssText = `
                        position: fixed;
                        left: ${e.clientX}px;
                        top: ${e.clientY}px;
                        background: var(--mp-bg-primary);
                        border: 1px solid var(--mp-border-primary);
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        z-index: 999999;
                        min-width: 120px;
                        overflow: hidden;
                    `;

                    safeSetInnerHTML(contextMenu, `
                        <div class="mp-context-item" data-action="rename" style="padding: 10px 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px; transition: background 0.15s;">
                            ${ICONS.edit} ${T.renameFolder}
                        </div>
                        <div class="mp-context-item" data-action="delete" style="padding: 10px 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #ef4444; transition: background 0.15s;">
                            ${ICONS.delete} ${T.deleteFolder}
                        </div>
                    `);

                    document.body.appendChild(contextMenu);

                    // Style hover states
                    contextMenu.querySelectorAll('.mp-context-item').forEach(menuItem => {
                        menuItem.onmouseenter = () => menuItem.style.background = 'var(--mp-bg-secondary)';
                        menuItem.onmouseleave = () => menuItem.style.background = 'transparent';

                        menuItem.onclick = async () => {
                            const action = menuItem.dataset.action;
                            contextMenu.remove();

                            if (action === 'rename') {
                                // Open proper rename modal
                                openFolderModal(folder);
                            } else if (action === 'delete') {
                                if (confirm(T.confirmDeleteFolder.replace('{name}', folder.name))) {
                                    await deleteFolder(folderId);
                                    if (selectedFolder === folderId) {
                                        selectedFolder = null;
                                    }
                                    refreshMenu(currentSearchTerm);
                                }
                            }
                        };
                    });

                    // Close context menu on click outside
                    const closeContextMenu = (e) => {
                        if (!contextMenu.contains(e.target)) {
                            contextMenu.remove();
                            document.removeEventListener('click', closeContextMenu);
                        }
                    };
                    setTimeout(() => document.addEventListener('click', closeContextMenu), 0);
                };
            }
        });

        // Get prompts
        const allPrompts = await getAll();
        let prompts;

        if (selectedFolder === null) {
            prompts = allPrompts;
        } else if (selectedFolder === 'uncategorized') {
            prompts = allPrompts.filter(p => !p.folderId);
        } else {
            prompts = allPrompts.filter(p => p.folderId === selectedFolder);
        }

        // Filter by search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            prompts = prompts.filter(p =>
                p.title.toLowerCase().includes(term) ||
                p.text.toLowerCase().includes(term)
            );
        }

        // Sort: pinned first
        prompts.sort((a, b) => {
            if (a.isFixed && !b.isFixed) return -1;
            if (!a.isFixed && b.isFixed) return 1;
            return 0;
        });

        if (prompts.length === 0) {
            safeSetInnerHTML(promptList, `<div class="mp-empty">${searchTerm ? T.noSearchResults : T.noSavedPrompts}</div>`);
            return;
        }

        // Get usage stats
        const usageStats = await getUsageStats();
        const recentPrompts = await getRecentPrompts();
        const allFolders = await getFolders();

        // Build recent section if viewing "All Prompts"
        let recentHtml = '';
        if (selectedFolder === null && !searchTerm && recentPrompts.length > 0) {
            recentHtml = `
                <div class="mp-recent-section">
                    <div class="mp-recent-header">${ICONS.clock} ${T.recentlyUsed}</div>
                    <div class="mp-recent-list">
                        ${recentPrompts.map(title => `
                            <div class="mp-recent-item" data-title="${escapeHtml(title)}" title="${escapeHtml(title)}">${escapeHtml(title)}</div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Collect all unique tags
        const allTags = [...new Set(prompts.flatMap(p => p.tags || []))].filter(Boolean);

        // Build tag filter if tags exist
        let tagFilterHtml = '';
        if (allTags.length > 0) {
            tagFilterHtml = `
                <div class="mp-tag-filter">
                    <button class="mp-tag-filter-btn ${!selectedTag ? 'active' : ''}" data-tag="">${T.allTags}</button>
                    ${allTags.map(tag => `
                        <button class="mp-tag-filter-btn ${selectedTag === tag ? 'active' : ''}" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>
                    `).join('')}
                </div>
            `;
        }

        // Filter by tag if selected
        if (selectedTag) {
            prompts = prompts.filter(p => p.tags && p.tags.includes(selectedTag));
        }

        // Create folder lookup map
        const folderMap = {};
        allFolders.forEach(f => { folderMap[f.id] = f; });

        safeSetInnerHTML(promptList, recentHtml + tagFilterHtml + prompts.map((p, idx) => {
            const realIndex = allPrompts.findIndex(ap => ap === p);
            const usage = usageStats[p.title] || 0;
            const tagsHtml = (p.tags && p.tags.length > 0)
                ? `<div class="mp-prompt-tags">${p.tags.map(t => `<span class="mp-tag" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</span>`).join('')}</div>`
                : '';

            // Get folder info for this prompt
            const promptFolder = p.folderId ? folderMap[p.folderId] : null;
            const folderHtml = promptFolder
                ? `<span class="mp-prompt-folder-badge" title="${escapeHtml(promptFolder.name)}">${promptFolder.emoji || '📁'} ${escapeHtml(promptFolder.name)}</span>`
                : (selectedFolder === null ? `<span class="mp-prompt-folder-badge mp-folder-uncategorized">📁 ${T.uncategorized}</span>` : '');

            return `
                <div class="mp-prompt-item ${p.isFixed ? 'mp-prompt-pinned' : ''}" data-index="${realIndex}" data-title="${escapeHtml(p.title)}">
                    <div class="mp-prompt-item-content">
                        <div class="mp-prompt-item-title">${escapeHtml(p.title)}</div>
                        <div class="mp-prompt-item-preview">${escapeHtml(p.text.substring(0, 60))}...</div>
                        <div class="mp-prompt-item-meta">
                            <span class="mp-prompt-usage" title="${usage > 0 ? T.usedCount.replace('{count}', usage) : T.neverUsed}">
                                ${ICONS.clock} ${usage}x
                            </span>
                            ${folderHtml}
                            ${tagsHtml}
                        </div>
                    </div>
                    <div class="mp-prompt-item-actions">
                        <button class="mp-btn mp-btn-ghost mp-btn-icon mp-move-btn" data-index="${realIndex}" data-title="${escapeHtml(p.title)}" title="${T.move}">
                            ${ICONS.move}
                        </button>
                        <button class="mp-btn mp-btn-ghost mp-btn-icon mp-duplicate-btn" data-index="${realIndex}" title="${T.duplicate}">
                            ${ICONS.copy}
                        </button>
                        <button class="mp-btn mp-btn-ghost mp-btn-icon mp-edit-btn" data-index="${realIndex}" title="${T.edit}">
                            ${ICONS.edit}
                        </button>
                        <button class="mp-btn mp-btn-ghost mp-btn-icon mp-delete-btn" data-index="${realIndex}" title="${T.delete}">
                            ${ICONS.delete}
                        </button>
                    </div>
                </div>
            `;
        }).join(''));

        // Recent item click handlers
        promptList.querySelectorAll('.mp-recent-item').forEach(item => {
            item.onclick = async () => {
                const title = item.dataset.title;
                const prompts = await getAll();
                const prompt = prompts.find(p => p.title === title);
                if (prompt) {
                    closeMenu();
                    const index = prompts.indexOf(prompt);
                    if (prompt.usePlaceholders) {
                        openPlaceholderModal(prompt, index);
                    } else {
                        insertPrompt(prompt, index);
                    }
                }
            };
        });

        // Tag filter click handlers
        promptList.querySelectorAll('.mp-tag-filter-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation(); // Prevent menu from closing
                selectedTag = btn.dataset.tag || null;
                refreshMenu(currentSearchTerm);
            };
        });

        // Tag click handlers (in prompts)
        promptList.querySelectorAll('.mp-tag').forEach(tag => {
            tag.onclick = (e) => {
                e.stopPropagation(); // Prevent menu from closing
                selectedTag = tag.dataset.tag;
                refreshMenu(currentSearchTerm);
            };
        });

        // Prompt click handlers
        promptList.querySelectorAll('.mp-prompt-item').forEach(item => {
            item.onclick = async (e) => {
                if (e.target.closest('.mp-prompt-item-actions') || e.target.closest('.mp-tag')) return;
                const index = parseInt(item.dataset.index);
                const prompts = await getAll();
                const prompt = prompts[index];
                if (prompt) {
                    // Track usage
                    await incrementUsage(prompt.title);
                    await addToRecent(prompt.title);

                    closeMenu();
                    if (prompt.usePlaceholders) {
                        openPlaceholderModal(prompt, index);
                    } else {
                        insertPrompt(prompt, index);
                    }
                }
            };
        });

        // Move button handlers
        promptList.querySelectorAll('.mp-move-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const title = btn.dataset.title;

                // Remove existing dropdown
                const existing = document.querySelector('.mp-move-dropdown');
                if (existing) existing.remove();

                // Create dropdown
                const dropdown = document.createElement('div');
                dropdown.className = 'mp-move-dropdown';
                safeSetInnerHTML(dropdown, `
                    <div class="mp-move-dropdown-item" data-folder="uncategorized">
                        ${ICONS.folder} ${T.uncategorized}
                    </div>
                    ${allFolders.map(f => `
                        <div class="mp-move-dropdown-item" data-folder="${f.id}">
                            ${f.emoji || '📁'} ${escapeHtml(f.name)}
                        </div>
                    `).join('')}
                `);

                btn.style.position = 'relative';
                btn.appendChild(dropdown);

                dropdown.querySelectorAll('.mp-move-dropdown-item').forEach(item => {
                    item.onclick = async (e) => {
                        e.stopPropagation();
                        await movePromptToFolder(title, item.dataset.folder);
                        dropdown.remove();
                        // Switch to "All Prompts" view so user can see the moved prompt
                        selectedFolder = null;
                        refreshMenu(currentSearchTerm);
                    };
                });

                // Close on click outside
                setTimeout(() => {
                    document.addEventListener('click', function closeDropdown(e) {
                        if (!dropdown.contains(e.target)) {
                            dropdown.remove();
                            document.removeEventListener('click', closeDropdown);
                        }
                    });
                }, 0);
            };
        });

        // Duplicate button handlers
        promptList.querySelectorAll('.mp-duplicate-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                const prompts = await getAll();
                await duplicatePrompt(prompts[index]);
                refreshMenu(currentSearchTerm);
            };
        });

        // Edit handlers
        promptList.querySelectorAll('.mp-edit-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                const prompts = await getAll();
                openPromptModal(prompts[index], index);
            };
        });

        // Delete handlers
        promptList.querySelectorAll('.mp-delete-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                const prompts = await getAll();
                if (confirm(T.confirmDelete.replace('{title}', prompts[index].title))) {
                    await deletePrompt(index);
                    refreshMenu(currentSearchTerm);
                }
            };
        });
    }

    // Track selected tag
    let selectedTag = null;

    // Track current search term
    let currentSearchTerm = '';

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function positionMenu(menu, button) {
        const btnRect = button.getBoundingClientRect();
        const menuHeight = menu.offsetHeight;
        const menuWidth = menu.offsetWidth;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const margin = 8;

        let top, left;

        // Vertical positioning
        if (btnRect.bottom + menuHeight + margin < viewportHeight) {
            top = btnRect.bottom + margin;
        } else if (btnRect.top - menuHeight - margin > 0) {
            top = btnRect.top - menuHeight - margin;
        } else {
            top = margin;
        }

        // Horizontal positioning
        if (btnRect.left + menuWidth < viewportWidth) {
            left = btnRect.left;
        } else {
            left = viewportWidth - menuWidth - margin;
        }

        menu.style.top = `${top}px`;
        menu.style.left = `${left}px`;
    }

    function closeMenu() {
        if (currentMenu) {
            currentMenu.classList.remove('visible');
        }
    }

    // =====================================
    // #region PROMPT MODAL
    // =====================================

    function createPromptModal() {
        const overlay = document.createElement('div');
        overlay.className = 'mp-overlay';
        overlay.id = 'mp-prompt-modal';

        safeSetInnerHTML(overlay, `
            <div class="mp-modal" onclick="event.stopPropagation()">
                <div class="mp-modal-header">
                    <h2 class="mp-modal-title" id="mp-modal-title">${T.newPrompt}</h2>
                    <button class="mp-btn mp-btn-ghost mp-btn-icon" id="mp-close-modal">
                        ${ICONS.close}
                    </button>
                </div>
                <div class="mp-modal-body">
                    <div class="mp-form-group">
                        <label class="mp-label">${T.title}</label>
                        <input type="text" class="mp-input" id="mp-prompt-title" placeholder="Enter a title...">
                    </div>
                    <div class="mp-form-group">
                        <label class="mp-label">${T.prompt}</label>
                        <textarea class="mp-textarea" id="mp-prompt-text" placeholder="Enter your prompt..."></textarea>
                    </div>
                    <div class="mp-form-group">
                        <label class="mp-label">${T.selectFolder}</label>
                        <select class="mp-select" id="mp-prompt-folder">
                            <option value="">${T.uncategorized}</option>
                        </select>
                    </div>
                    <div class="mp-form-group">
                        <label class="mp-label">${T.tags}</label>
                        <input type="text" class="mp-input" id="mp-prompt-tags" placeholder="${T.addTags}">
                    </div>
                    <div class="mp-form-group">
                        <label class="mp-toggle">
                            <input type="checkbox" class="mp-toggle-input" id="mp-dynamic-toggle">
                            <span class="mp-toggle-slider"></span>
                            <span class="mp-toggle-label">${T.dynamicPrompt}</span>
                        </label>
                    </div>
                    <div class="mp-form-group">
                        <label class="mp-toggle">
                            <input type="checkbox" class="mp-toggle-input" id="mp-autosend-toggle">
                            <span class="mp-toggle-slider"></span>
                            <span class="mp-toggle-label">${T.autoSend}</span>
                        </label>
                    </div>
                    <div class="mp-form-group">
                        <label class="mp-toggle">
                            <input type="checkbox" class="mp-toggle-input" id="mp-pin-toggle">
                            <span class="mp-toggle-slider"></span>
                            <span class="mp-toggle-label">${T.pin}</span>
                        </label>
                    </div>
                </div>
                <div class="mp-modal-footer">
                    <button class="mp-btn mp-btn-secondary" id="mp-cancel-btn">${T.cancel}</button>
                    <button class="mp-btn mp-btn-primary" id="mp-save-btn">${T.save}</button>
                </div>
            </div>
        `);

        return overlay;
    }

    async function openPromptModal(prompt = null, index = -1) {
        closeMenu();

        if (!currentModal) {
            currentModal = createPromptModal();
            document.body.appendChild(currentModal);

            // Event listeners
            currentModal.querySelector('#mp-close-modal').onclick = () => hideModal(currentModal);
            currentModal.querySelector('#mp-cancel-btn').onclick = () => hideModal(currentModal);
            currentModal.onclick = (e) => {
                if (e.target === currentModal) hideModal(currentModal);
            };

            currentModal.querySelector('#mp-save-btn').onclick = async () => {
                const title = currentModal.querySelector('#mp-prompt-title').value.trim();
                const text = currentModal.querySelector('#mp-prompt-text').value.trim();
                const folderId = currentModal.querySelector('#mp-prompt-folder').value || null;
                const tagsInput = currentModal.querySelector('#mp-prompt-tags').value.trim();
                const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];
                const usePlaceholders = currentModal.querySelector('#mp-dynamic-toggle').checked;
                const autoExecute = currentModal.querySelector('#mp-autosend-toggle').checked;
                const isFixed = currentModal.querySelector('#mp-pin-toggle').checked;

                if (!title || !text) {
                    alert(T.requiredFields);
                    return;
                }

                const item = { title, text, folderId, tags, usePlaceholders, autoExecute, isFixed };
                const editIndex = parseInt(currentModal.dataset.editIndex);

                if (editIndex >= 0) {
                    await updatePrompt(editIndex, item);
                } else {
                    await addPrompt(item);
                }

                hideModal(currentModal);
                refreshMenu();
            };
        }

        // Populate folder dropdown
        const folderSelect = currentModal.querySelector('#mp-prompt-folder');
        const folders = await getFolders();
        safeSetInnerHTML(folderSelect, `<option value="">${T.uncategorized}</option>` +
            folders.map(f => `<option value="${f.id}">${escapeHtml(f.name)}</option>`).join(''));

        // Set form values
        currentModal.querySelector('#mp-modal-title').textContent = prompt ? T.editPrompt : T.newPrompt;
        currentModal.querySelector('#mp-prompt-title').value = prompt?.title || '';
        currentModal.querySelector('#mp-prompt-text').value = prompt?.text || '';
        currentModal.querySelector('#mp-prompt-folder').value = prompt?.folderId || '';
        currentModal.querySelector('#mp-prompt-tags').value = (prompt?.tags || []).join(', ');
        currentModal.querySelector('#mp-dynamic-toggle').checked = prompt?.usePlaceholders || false;
        currentModal.querySelector('#mp-autosend-toggle').checked = prompt?.autoExecute || false;
        currentModal.querySelector('#mp-pin-toggle').checked = prompt?.isFixed || false;
        currentModal.dataset.editIndex = index;

        showModal(currentModal);
        setTimeout(() => currentModal.querySelector('#mp-prompt-title').focus(), 100);
    }

    // =====================================
    // #region FOLDER MODAL
    // =====================================

    function createFolderModal(folder = null) {
        const overlay = document.createElement('div');
        overlay.className = 'mp-overlay';
        overlay.id = 'mp-folder-modal';

        const isEdit = folder !== null;
        const title = isEdit ? T.renameFolder : T.newFolder;
        const currentEmoji = folder?.emoji || '📁';

        safeSetInnerHTML(overlay, `
            <div class="mp-modal mp-modal-small" onclick="event.stopPropagation()">
                <div class="mp-modal-header">
                    <h2 class="mp-modal-title">${ICONS.folder} ${title}</h2>
                    <button class="mp-btn mp-btn-ghost mp-btn-icon mp-modal-close" id="mp-folder-close">
                        ${ICONS.close}
                    </button>
                </div>
                <div class="mp-modal-body" style="padding: 20px;">
                    <div class="mp-form-group">
                        <label class="mp-label">${T.folderName}</label>
                        <input type="text" class="mp-input" id="mp-folder-name"
                               placeholder="Enter folder name..."
                               value="${isEdit ? folder.name : ''}"
                               style="font-size: 16px; padding: 12px 14px;">
                    </div>
                    <div class="mp-form-group">
                        <label class="mp-label">${T.folderEmoji}</label>
                        <input type="hidden" id="mp-folder-emoji" value="${currentEmoji}">
                        <div class="mp-emoji-picker" id="mp-emoji-picker">
                            ${FOLDER_EMOJI_OPTIONS.map(e => `
                                <button type="button" class="mp-emoji-btn ${e === currentEmoji ? 'active' : ''}" data-emoji="${e}">${e}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="mp-modal-footer">
                    <button class="mp-btn mp-btn-ghost" id="mp-folder-cancel">${T.cancel}</button>
                    <button class="mp-btn mp-btn-primary" id="mp-folder-save">${T.save}</button>
                </div>
            </div>
        `);

        return { overlay, folderId: folder?.id || null, isSystem: folder?.isSystem || false };
    }

    async function openFolderModal(folder = null) {
        // Remove existing modal if any
        const existingModal = document.getElementById('mp-folder-modal');
        if (existingModal) existingModal.remove();

        const { overlay, folderId, isSystem } = createFolderModal(folder);
        document.body.appendChild(overlay);

        // Show with animation
        requestAnimationFrame(() => overlay.classList.add('visible'));

        const nameInput = overlay.querySelector('#mp-folder-name');
        const emojiInput = overlay.querySelector('#mp-folder-emoji');
        const emojiPicker = overlay.querySelector('#mp-emoji-picker');
        const closeBtn = overlay.querySelector('#mp-folder-close');
        const cancelBtn = overlay.querySelector('#mp-folder-cancel');
        const saveBtn = overlay.querySelector('#mp-folder-save');

        // Emoji picker handlers
        emojiPicker.querySelectorAll('.mp-emoji-btn').forEach(btn => {
            btn.onclick = () => {
                emojiPicker.querySelectorAll('.mp-emoji-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                emojiInput.value = btn.dataset.emoji;
            };
        });

        // Focus input and select text
        setTimeout(() => {
            nameInput.focus();
            nameInput.select();
        }, 100);

        const closeModal = () => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 200);
        };

        const saveFolder = async () => {
            const name = nameInput.value.trim();
            const emoji = emojiInput.value;

            if (!name) {
                nameInput.style.borderColor = '#ef4444';
                nameInput.focus();
                return;
            }

            if (folderId) {
                // Check if it's a system folder
                if (folderId === 'all' || folderId === 'uncategorized') {
                    // Save custom name for system folder
                    const customNames = await GM_getValue(STORAGE_KEYS.FOLDER_NAMES, {});
                    customNames[folderId] = name;
                    await GM_setValue(STORAGE_KEYS.FOLDER_NAMES, customNames);

                    // Save emoji for system folder
                    const folderEmojis = await GM_getValue(STORAGE_KEYS.FOLDER_EMOJIS, {});
                    folderEmojis[folderId] = emoji;
                    await GM_setValue(STORAGE_KEYS.FOLDER_EMOJIS, folderEmojis);
                } else {
                    // Rename existing custom folder with emoji
                    await updateFolder(folderId, { name, emoji });
                }
            } else {
                // Create new folder with emoji
                await addFolderWithEmoji(name, emoji);
            }

            closeModal();
            refreshMenu();
        };

        // Event listeners
        overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
        closeBtn.onclick = closeModal;
        cancelBtn.onclick = closeModal;
        saveBtn.onclick = saveFolder;

        nameInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveFolder();
            } else if (e.key === 'Escape') {
                closeModal();
            }
        };

        // Reset border color on input
        nameInput.oninput = () => {
            nameInput.style.borderColor = '';
        };
    }

    // =====================================
    // #region PLACEHOLDER MODAL
    // =====================================

    function createPlaceholderModal() {
        const overlay = document.createElement('div');
        overlay.className = 'mp-overlay';
        overlay.id = 'mp-placeholder-modal';

        safeSetInnerHTML(overlay, `
            <div class="mp-modal" onclick="event.stopPropagation()">
                <div class="mp-modal-header">
                    <h2 class="mp-modal-title">${T.fillInfo}</h2>
                    <button class="mp-btn mp-btn-ghost mp-btn-icon" id="mp-close-placeholder">
                        ${ICONS.close}
                    </button>
                </div>
                <div class="mp-modal-body" id="mp-placeholder-body">
                </div>
                <div class="mp-modal-footer">
                    <button class="mp-btn mp-btn-secondary" id="mp-cancel-placeholder">${T.cancel}</button>
                    <button class="mp-btn mp-btn-primary" id="mp-insert-placeholder">${T.save}</button>
                </div>
            </div>
        `);

        return overlay;
    }

    function openPlaceholderModal(prompt, index) {
        if (!currentPlaceholderModal) {
            currentPlaceholderModal = createPlaceholderModal();
            document.body.appendChild(currentPlaceholderModal);

            currentPlaceholderModal.querySelector('#mp-close-placeholder').onclick = () => hideModal(currentPlaceholderModal);
            currentPlaceholderModal.querySelector('#mp-cancel-placeholder').onclick = () => hideModal(currentPlaceholderModal);
            currentPlaceholderModal.onclick = (e) => {
                if (e.target === currentPlaceholderModal) hideModal(currentPlaceholderModal);
            };
        }

        // Parse placeholders [text]
        const placeholders = [];
        const regex = /\[([^\]]+)\]/g;
        let match;
        while ((match = regex.exec(prompt.text)) !== null) {
            placeholders.push({ full: match[0], content: match[1] });
        }

        const body = currentPlaceholderModal.querySelector('#mp-placeholder-body');

        if (placeholders.length === 0) {
            // No placeholders, just insert
            insertPrompt(prompt, index);
            return;
        }

        safeSetInnerHTML(body, placeholders.map((p, i) => `
            <div class="mp-form-group">
                <label class="mp-label">${escapeHtml(p.content)}</label>
                <input type="text" class="mp-input mp-placeholder-input" data-placeholder="${escapeHtml(p.full)}">
            </div>
        `).join(''));

        currentPlaceholderModal.querySelector('#mp-insert-placeholder').onclick = () => {
            let text = prompt.text;
            body.querySelectorAll('.mp-placeholder-input').forEach(input => {
                text = text.replace(input.dataset.placeholder, input.value);
            });

            hideModal(currentPlaceholderModal);
            insertPrompt({ ...prompt, text }, index);
        };

        showModal(currentPlaceholderModal);
        setTimeout(() => body.querySelector('.mp-placeholder-input')?.focus(), 100);
    }

    // =====================================
    // #region SETTINGS MODAL
    // =====================================

    function createSettingsModal() {
        const overlay = document.createElement('div');
        overlay.className = 'mp-overlay';
        overlay.id = 'mp-settings-modal';

        const colorPresets = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

        safeSetInnerHTML(overlay, `
            <div class="mp-modal" onclick="event.stopPropagation()">
                <div class="mp-modal-header">
                    <h2 class="mp-modal-title">${T.settings}</h2>
                    <button class="mp-btn mp-btn-ghost mp-btn-icon" id="mp-close-settings">
                        ${ICONS.close}
                    </button>
                </div>
                <div class="mp-modal-body">
                    <div class="mp-form-group">
                        <label class="mp-label">${T.theme}</label>
                        <div class="mp-segmented" id="mp-theme-toggle">
                            <button class="mp-segmented-btn" data-theme="auto">
                                ${ICONS.monitor} ${T.auto}
                            </button>
                            <button class="mp-segmented-btn" data-theme="light">
                                ${ICONS.sun} ${T.light}
                            </button>
                            <button class="mp-segmented-btn" data-theme="dark">
                                ${ICONS.moon} ${T.dark}
                            </button>
                        </div>
                    </div>
                    <div class="mp-form-group">
                        <label class="mp-label">${T.accentColor}</label>
                        <div class="mp-color-picker">
                            <input type="color" class="mp-color-input" id="mp-accent-color" value="#7c3aed">
                            <div class="mp-color-presets">
                                ${colorPresets.map(c => `
                                    <button type="button" class="mp-color-preset" data-color="${c}" style="background: ${c};" title="${c}"></button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="mp-form-group">
                        <label class="mp-label">${T.autoBackup}</label>
                        <div class="mp-backup-row">
                            <select class="mp-select" id="mp-backup-frequency" style="flex: 1;">
                                <option value="off">${T.backupOff}</option>
                                <option value="daily">${T.backupDaily}</option>
                                <option value="weekly">${T.backupWeekly}</option>
                                <option value="monthly">${T.backupMonthly}</option>
                            </select>
                            <button class="mp-btn mp-btn-secondary" id="mp-backup-now" style="white-space: nowrap;">
                                💾 ${T.backupNow}
                            </button>
                        </div>
                        <div id="mp-last-backup" style="font-size: 11px; color: var(--mp-text-tertiary); margin-top: 6px;">
                            ${T.lastBackup}: ...
                        </div>
                    </div>
                    <div class="mp-form-group">
                        <label class="mp-toggle">
                            <input type="checkbox" class="mp-toggle-input" id="mp-predict-toggle">
                            <span class="mp-toggle-slider"></span>
                            <span class="mp-toggle-label">${T.smartPredict}</span>
                        </label>
                        <div style="font-size: 12px; color: var(--mp-text-tertiary); margin-top: 4px;">
                            ${T.smartPredictDesc}
                        </div>
                    </div>
                </div>
                <div class="mp-modal-footer">
                    <button class="mp-btn mp-btn-ghost" id="mp-reset-color">${T.resetColor}</button>
                    <button class="mp-btn mp-btn-primary" id="mp-save-settings">${T.save}</button>
                </div>
            </div>
        `);

        return overlay;
    }

    async function openSettingsModal() {
        if (!settingsModal) {
            settingsModal = createSettingsModal();
            document.body.appendChild(settingsModal);

            settingsModal.querySelector('#mp-close-settings').onclick = () => hideModal(settingsModal);
            settingsModal.onclick = (e) => {
                if (e.target === settingsModal) hideModal(settingsModal);
            };

            // Theme buttons
            settingsModal.querySelectorAll('[data-theme]').forEach(btn => {
                btn.onclick = () => {
                    settingsModal.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                };
            });

            // Color picker
            const colorInput = settingsModal.querySelector('#mp-accent-color');
            const colorPresets = settingsModal.querySelectorAll('.mp-color-preset');

            colorInput.oninput = () => {
                applyAccentColor(colorInput.value);
                colorPresets.forEach(p => p.classList.remove('active'));
            };

            colorPresets.forEach(preset => {
                preset.onclick = () => {
                    const color = preset.dataset.color;
                    colorInput.value = color;
                    applyAccentColor(color);
                    colorPresets.forEach(p => p.classList.remove('active'));
                    preset.classList.add('active');
                };
            });

            // Reset color button
            settingsModal.querySelector('#mp-reset-color').onclick = () => {
                colorInput.value = DEFAULT_ACCENT;
                applyAccentColor(DEFAULT_ACCENT);
                colorPresets.forEach(p => p.classList.toggle('active', p.dataset.color === DEFAULT_ACCENT));
            };

            // Backup Now button
            settingsModal.querySelector('#mp-backup-now').onclick = async () => {
                const filename = await performBackup();
                const lastBackupEl = settingsModal.querySelector('#mp-last-backup');
                lastBackupEl.textContent = `${T.lastBackup}: Today`;
                // Brief visual feedback
                const btn = settingsModal.querySelector('#mp-backup-now');
                const originalText = btn.innerHTML;
                safeSetInnerHTML(btn, '✅ ' + T.backupSuccess);
                setTimeout(() => { safeSetInnerHTML(btn, originalText); }, 2000);
            };

            settingsModal.querySelector('#mp-save-settings').onclick = async () => {
                const activeTheme = settingsModal.querySelector('[data-theme].active');
                if (activeTheme) {
                    await saveTheme(activeTheme.dataset.theme);
                }

                // Save accent color
                await setAccentColor(colorInput.value);

                // Save backup frequency
                const backupFrequency = settingsModal.querySelector('#mp-backup-frequency').value;
                await setBackupSettings({ frequency: backupFrequency });

                currentPrediction.enabled = settingsModal.querySelector('#mp-predict-toggle').checked;
                await GM_setValue(STORAGE_KEYS.PREDICTION, currentPrediction);
                hideModal(settingsModal);
            };
        }

        // Set current values
        settingsModal.querySelectorAll('[data-theme]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === currentTheme.mode);
        });
        settingsModal.querySelector('#mp-predict-toggle').checked = currentPrediction.enabled;

        // Set current accent color
        const currentAccent = await getAccentColor();
        settingsModal.querySelector('#mp-accent-color').value = currentAccent;
        settingsModal.querySelectorAll('.mp-color-preset').forEach(p => {
            p.classList.toggle('active', p.dataset.color === currentAccent);
        });

        // Set backup settings
        const backupSettings = await getBackupSettings();
        settingsModal.querySelector('#mp-backup-frequency').value = backupSettings.frequency;

        // Show last backup date
        const lastBackup = await getLastBackupDate();
        settingsModal.querySelector('#mp-last-backup').textContent = `${T.lastBackup}: ${formatLastBackup(lastBackup)}`;

        showModal(settingsModal);
    }

    // =====================================
    // #region MODAL HELPERS
    // =====================================

    function showModal(modal) {
        modal.classList.add('visible');
    }

    function hideModal(modal) {
        modal.classList.remove('visible');
    }

    // =====================================
    // #region IMPORT/EXPORT
    // =====================================

    async function exportPrompts() {
        const prompts = await getAll();
        const folders = await getFolders();

        if (prompts.length === 0) {
            alert(T.noPromptsToExport);
            return;
        }

        const data = { prompts, folders, version: 5 };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-prompts-backup.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importPrompts() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    let importedPrompts = [];
                    let importedFolders = [];

                    // Handle different formats
                    if (Array.isArray(data)) {
                        importedPrompts = data;
                    } else if (data.prompts) {
                        importedPrompts = data.prompts;
                        importedFolders = data.folders || [];
                    }

                    // Merge with existing
                    const existingPrompts = await getAll();
                    const existingFolders = await getFolders();

                    await saveAll([...importedPrompts, ...existingPrompts]);
                    await saveFolders([...importedFolders, ...existingFolders]);

                    alert(T.promptsImported.replace('{count}', importedPrompts.length));
                    refreshMenu();
                } catch (err) {
                    alert('Error importing file: ' + err.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // =====================================
    // #region INSERT PROMPT
    // =====================================

    async function insertPrompt(prompt, index) {
        const editor = getEditor();
        if (!editor) {
            alert(T.editorNotFound);
            return;
        }

        editor.focus();

        const text = prompt.text;

        // Platform-specific insertion
        if (editor.getAttribute('contenteditable') === 'true') {
            // ContentEditable editors (Claude, Gemini, Perplexity, etc.)
            if (currentPlatform === 'gemini') {
                // Quill editor needs HTML
                safeSetInnerHTML(editor, text.replace(/\n/g, '<br>'));
                editor.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                // Standard contenteditable
                editor.focus();
                document.execCommand('insertText', false, text);
            }
        } else if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
            // Standard textarea/input (ChatGPT, Copilot, Poe, etc.)
            editor.value = text;
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            editor.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            // Fallback
            editor.textContent = text;
            editor.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Move to top if not pinned
        if (index > 0 && !prompt.isFixed) {
            await movePromptToTop(index);
        }

        // Auto-send if enabled
        if (prompt.autoExecute) {
            setTimeout(() => {
                const sendBtn = getSendButton();
                if (sendBtn) sendBtn.click();
            }, 100);
        }

        closeMenu();
    }

    // =====================================
    // #region INITIALIZATION
    // =====================================

    async function init() {
        if (isInitialized || isInitializing) return;
        isInitializing = true;

        try {
            currentPlatform = detectPlatform();
            if (!currentPlatform) {
                isInitializing = false;
                return;
            }

            // Load settings
            await loadTheme();
            currentPrediction = await GM_getValue(STORAGE_KEYS.PREDICTION, DEFAULT_PREDICTION);

            // Load and apply accent color
            const accentColor = await getAccentColor();
            applyAccentColor(accentColor);

            // Inject styles
            injectStyles();

            // Wait for editor to be available
            let editor = null;
            for (let i = 0; i < 20; i++) {
                editor = getEditor();
                if (editor) break;
                await new Promise(r => setTimeout(r, 500));
            }

            if (!editor) {
                isInitializing = false;
                return;
            }

            // Find insertion point based on platform
            let insertionPoint = null;

            if (currentPlatform === 'chatgpt') {
                insertionPoint = PLATFORM_CONFIG.chatgpt.buttonContainer?.() ||
                                document.querySelector('[data-testid="composer-button-group"]') ||
                                editor.closest('form')?.querySelector('div[class*="flex"]');
            } else if (currentPlatform === 'claude') {
                // Use the new buttonContainer function for Claude
                insertionPoint = PLATFORM_CONFIG.claude.buttonContainer?.();

                // Additional fallback attempts for Claude
                if (!insertionPoint) {
                    // Try finding the fieldset and looking for button areas
                    const fieldset = document.querySelector('fieldset');
                    if (fieldset) {
                        // Look for divs that contain buttons with SVG icons
                        const allDivs = fieldset.querySelectorAll('div');
                        for (const div of allDivs) {
                            const directButtons = div.querySelectorAll(':scope > button');
                            if (directButtons.length >= 2 && directButtons.length <= 8) {
                                const hasIcons = Array.from(directButtons).some(b => b.querySelector('svg'));
                                if (hasIcons) {
                                    insertionPoint = div;
                                    break;
                                }
                            }
                        }
                    }
                }

                // Last resort: insert after the first button we find near editor
                if (!insertionPoint) {
                    const firstBtn = document.querySelector('fieldset button');
                    if (firstBtn) {
                        insertionPoint = firstBtn.parentElement;
                    }
                }
            } else if (currentPlatform === 'gemini') {
                if (DEBUG_MODE) {
                    console.log('[My Prompt DEBUG] ===== GEMINI INSERTION POINT SEARCH =====');
                }

                // Use leading-actions-wrapper (where + and Tools buttons are)
                insertionPoint = document.querySelector('.leading-actions-wrapper');
                if (DEBUG_MODE) console.log('[My Prompt DEBUG] .leading-actions-wrapper:', insertionPoint);

                if (!insertionPoint) {
                    // Try toolbox-drawer parent
                    const toolbox = document.querySelector('toolbox-drawer');
                    if (DEBUG_MODE) console.log('[My Prompt DEBUG] toolbox-drawer:', toolbox);
                    if (toolbox) insertionPoint = toolbox.parentElement;
                }
                if (!insertionPoint) {
                    // Try input-area
                    insertionPoint = document.querySelector('.input-area, input-area-v2');
                    if (DEBUG_MODE) console.log('[My Prompt DEBUG] .input-area or input-area-v2:', insertionPoint);
                }
                if (!insertionPoint) {
                    // Try rich-textarea parent
                    const richTextarea = document.querySelector('rich-textarea');
                    if (DEBUG_MODE) console.log('[My Prompt DEBUG] rich-textarea:', richTextarea);
                    if (richTextarea) {
                        insertionPoint = richTextarea.parentElement;
                        if (DEBUG_MODE) console.log('[My Prompt DEBUG] Using rich-textarea parent:', insertionPoint);
                    }
                }
                if (!insertionPoint) {
                    // Try finding any container with multiple buttons
                    const qlEditor = document.querySelector('.ql-editor');
                    if (DEBUG_MODE) console.log('[My Prompt DEBUG] .ql-editor:', qlEditor);
                    if (qlEditor) {
                        // Go up the tree looking for a container with buttons
                        let parent = qlEditor.parentElement;
                        for (let i = 0; i < 10 && parent; i++) {
                            const buttons = parent.querySelectorAll('button');
                            if (DEBUG_MODE) console.log(`[My Prompt DEBUG] Parent level ${i}:`, parent.tagName, parent.className?.substring(0, 50), 'buttons:', buttons.length);
                            if (buttons.length >= 2) {
                                insertionPoint = parent;
                                break;
                            }
                            parent = parent.parentElement;
                        }
                    }
                }
                if (!insertionPoint) {
                    insertionPoint = editor.parentElement;
                    if (DEBUG_MODE) console.log('[My Prompt DEBUG] Falling back to editor.parentElement:', insertionPoint);
                }

                if (DEBUG_MODE) {
                    console.log('[My Prompt DEBUG] ===== FINAL INSERTION POINT =====');
                    console.log('[My Prompt DEBUG] insertionPoint:', insertionPoint);
                    console.log('[My Prompt DEBUG] insertionPoint.tagName:', insertionPoint?.tagName);
                    console.log('[My Prompt DEBUG] insertionPoint.className:', insertionPoint?.className);
                    console.log('[My Prompt DEBUG] insertionPoint.innerHTML (first 500 chars):', insertionPoint?.innerHTML?.substring(0, 500));
                }
            } else {
                // Generic handling for Copilot, Perplexity, Poe, HuggingChat, DeepSeek, You
                const config = PLATFORM_CONFIG[currentPlatform];
                if (config && config.buttonContainer) {
                    insertionPoint = config.buttonContainer();
                }
                // Fallback: try to find a form or container near the editor
                if (!insertionPoint) {
                    insertionPoint = editor.closest('form') ||
                                    editor.parentElement?.querySelector('div[class*="button"]') ||
                                    editor.parentElement;
                }
            }

            if (!insertionPoint) {
                insertionPoint = editor.parentElement;
            }

            // Check if button already exists
            if (document.querySelector('[data-testid="mp-trigger"]')) {
                console.log('[My Prompt] Button already exists');
                isInitializing = false;
                isInitialized = true;
                return;
            }

            console.log('[My Prompt] Platform:', currentPlatform);
            console.log('[My Prompt] Editor found:', !!editor);
            console.log('[My Prompt] Insertion point:', insertionPoint);

            // Create and insert button
            currentButton = createTriggerButton();

            // Insert the button
            if (insertionPoint) {
                // For Claude, try to insert after the second button (after the ≡ icon)
                if (currentPlatform === 'claude') {
                    const existingButtons = insertionPoint.querySelectorAll(':scope > button');
                    console.log('[My Prompt] Found', existingButtons.length, 'existing buttons in container');

                    if (existingButtons.length >= 2) {
                        // Insert after the second button (the ≡ menu icon)
                        existingButtons[1].after(currentButton);
                        console.log('[My Prompt] Inserted after second button');
                    } else if (existingButtons.length >= 1) {
                        existingButtons[0].after(currentButton);
                        console.log('[My Prompt] Inserted after first button');
                    } else {
                        insertionPoint.appendChild(currentButton);
                        console.log('[My Prompt] Appended to container');
                    }
                } else if (currentPlatform === 'gemini') {
                    // For Gemini, insert after the + button or as first child
                    if (DEBUG_MODE) {
                        console.log('[My Prompt DEBUG] ===== GEMINI BUTTON INSERTION =====');
                        console.log('[My Prompt DEBUG] insertionPoint children:', insertionPoint.children.length);
                        Array.from(insertionPoint.children).forEach((child, i) => {
                            console.log(`[My Prompt DEBUG] Child ${i}:`, child.tagName, child.className?.substring(0, 50));
                        });
                    }

                    // Try to find the + button (uploader button)
                    const uploaderBtn = insertionPoint.querySelector('button, [role="button"]');
                    if (uploaderBtn) {
                        uploaderBtn.after(currentButton);
                        if (DEBUG_MODE) console.log('[My Prompt DEBUG] Inserted after first button in container');
                    } else {
                        // Insert at the beginning
                        insertionPoint.insertBefore(currentButton, insertionPoint.firstChild);
                        if (DEBUG_MODE) console.log('[My Prompt DEBUG] Inserted as first child');
                    }

                    // Verify button was added
                    if (DEBUG_MODE) {
                        setTimeout(() => {
                            const addedBtn = document.querySelector('[data-testid="mp-trigger"]');
                            console.log('[My Prompt DEBUG] Button in DOM after insertion:', !!addedBtn);
                            if (addedBtn) {
                                const rect = addedBtn.getBoundingClientRect();
                                console.log('[My Prompt DEBUG] Button dimensions:', rect.width, 'x', rect.height);
                                console.log('[My Prompt DEBUG] Button position:', rect.left, rect.top);
                                console.log('[My Prompt DEBUG] Button computed display:', window.getComputedStyle(addedBtn).display);
                                console.log('[My Prompt DEBUG] Button computed visibility:', window.getComputedStyle(addedBtn).visibility);
                                console.log('[My Prompt DEBUG] Button computed opacity:', window.getComputedStyle(addedBtn).opacity);
                            }
                        }, 100);
                    }
                } else {
                    insertionPoint.appendChild(currentButton);
                }
            } else {
                console.log('[My Prompt] No insertion point found, appending to body');
                document.body.appendChild(currentButton);
                // Position it fixed
                currentButton.style.cssText = 'position: fixed; bottom: 100px; right: 20px; z-index: 999999;';
            }

            // Create menu
            currentMenu = createMenu();
            document.body.appendChild(currentMenu);

            // Button click handler
            currentButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (currentMenu.classList.contains('visible')) {
                    closeMenu();
                } else {
                    refreshMenu();
                    positionMenu(currentMenu, currentButton);
                    currentMenu.classList.add('visible');
                    currentMenu.querySelector('#mp-search').focus();
                }
            };

            // Menu event handlers
            currentMenu.querySelector('#mp-search').oninput = debounce((e) => {
                currentSearchTerm = e.target.value;
                refreshMenu(currentSearchTerm);
            }, 200);

            currentMenu.querySelector('#mp-new-btn').onclick = () => openPromptModal();
            currentMenu.querySelector('#mp-new-folder').onclick = () => openFolderModal();
            currentMenu.querySelector('#mp-import').onclick = importPrompts;
            currentMenu.querySelector('#mp-export').onclick = exportPrompts;
            currentMenu.querySelector('#mp-settings').onclick = () => {
                closeMenu();
                openSettingsModal();
            };

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!currentMenu.contains(e.target) && e.target !== currentButton) {
                    closeMenu();
                }
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeMenu();
                    hideModal(currentModal);
                    hideModal(currentPlaceholderModal);
                    hideModal(settingsModal);
                }

                // Alt+P to open menu
                if (e.altKey && e.key.toLowerCase() === 'p') {
                    e.preventDefault();
                    currentButton.click();
                }

                // Alt+N for new prompt
                if (e.altKey && e.key.toLowerCase() === 'n') {
                    e.preventDefault();
                    closeMenu();
                    openPromptModal();
                }
            });

            // Setup observer for SPA navigation
            setupObserver();

            isInitialized = true;

            // Check for auto backup
            checkAutoBackup();
        } catch (err) {
            console.error('My Prompt init error:', err);
        } finally {
            isInitializing = false;
        }
    }

    function setupObserver() {
        if (pageObserver) pageObserver.disconnect();

        pageObserver = new MutationObserver(() => {
            if (currentButton && !document.body.contains(currentButton)) {
                isInitialized = false;
                setTimeout(init, 500);
            }
        });

        pageObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Register menu command
    GM_registerMenuCommand(`⚙️ ${T.settings}`, openSettingsModal);

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();