// ==UserScript==
// @name         AI Prompt Saver - Minimal
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Simple prompt saver for AI chats with fixed edit functionality
// @author       You
// @match        https://chat.openai.com/*
// @match        https://claude.ai/*
// @match        https://chat.z.ai/*
// @match        https://gemini.google.com/app/*
// @match        https://grok.com/*
// @match        https://replit.com/*
// @match        https://huggingface.co/chat/*
// @match        https://www.perplexity.ai/*
// @match        https://stansa.ai/*
// @match        https://poe.com/*
// @match        https://chatgpt.com/*
// @match        https://chat.deepseek.com/*
// @match        https://chat.qwen.ai/*
// @match        https://huggingface.co/chat/*
// @match        https://chat.z.ai/
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563314/AI%20Prompt%20Saver%20-%20Minimal.user.js
// @updateURL https://update.greasyfork.org/scripts/563314/AI%20Prompt%20Saver%20-%20Minimal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Storage
    const STORAGE_KEY = 'aiPromptSaverData';
    let prompts = [];
    let isVisible = false;
    let currentFilter = 'all';
    let searchTerm = '';
    let editingId = null;

    // Categories
    const categories = [
        { id: 'general', name: 'General', color: '#4a7fff' },
        { id: 'coding', name: 'Coding', color: '#27ae60' },
        { id: 'writing', name: 'Writing', color: '#e74c3c' },
        { id: 'research', name: 'Research', color: '#f39c12' },
        { id: 'creative', name: 'Creative', color: '#9b59b6' }
    ];

    // CSS
    GM_addStyle(`
        #prompt-saver {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 380px;
            max-height: 80vh;
            background: #1a1a1a;
            color: #fff;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
        }

        #prompt-saver.show {
            display: flex;
        }

        .saver-header {
            padding: 16px 20px;
            background: linear-gradient(135deg, #4a7fff, #3a6ce5);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .saver-title {
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .saver-close {
            width: 32px;
            height: 32px;
            border: none;
            background: rgba(255,255,255,0.2);
            color: white;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .saver-close:hover {
            background: rgba(255,255,255,0.3);
        }

        .saver-content {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }

        .saver-search {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #333;
            border-radius: 8px;
            background: #2d2d2d;
            color: #fff;
            font-size: 14px;
            margin-bottom: 16px;
        }

        .saver-search:focus {
            outline: none;
            border-color: #4a7fff;
        }

        .saver-categories {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }

        .category-btn {
            padding: 6px 12px;
            border: 1px solid #333;
            border-radius: 20px;
            background: #2d2d2d;
            color: #ccc;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .category-btn:hover {
            background: #333;
        }

        .category-btn.active {
            background: #4a7fff;
            color: white;
            border-color: #4a7fff;
        }

        .saver-prompts {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        }

        .prompt-item {
            background: #2d2d2d;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 12px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }

        .prompt-item:hover {
            background: #333;
            border-color: #4a7fff;
            transform: translateY(-2px);
        }

        .prompt-item.editing {
            border-color: #f39c12;
            background: #3a3a2d;
        }

        .prompt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .prompt-title {
            font-weight: 600;
            font-size: 14px;
            flex: 1;
            word-wrap: break-word;
        }

        .prompt-category {
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            color: white;
            margin-left: 8px;
            white-space: nowrap;
        }

        .prompt-text {
            font-size: 13px;
            color: #ccc;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
        }

        .prompt-text.editing {
            -webkit-line-clamp: unset;
            display: block;
        }

        .prompt-tags {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            margin-bottom: 8px;
        }

        .prompt-tag {
            padding: 2px 6px;
            background: #1a1a1a;
            border-radius: 4px;
            font-size: 10px;
            color: #999;
        }

        .prompt-actions {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }

        .prompt-btn {
            padding: 4px 8px;
            border: none;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            flex: 1;
            min-width: 50px;
            text-align: center;
        }

        .prompt-btn:hover {
            transform: translateY(-1px);
            filter: brightness(1.1);
        }

        .insert-btn {
            background: #27ae60;
            color: white;
        }

        .copy-btn {
            background: #f39c12;
            color: white;
        }

        .edit-btn {
            background: #3498db;
            color: white;
        }

        .save-btn {
            background: #27ae60;
            color: white;
        }

        .cancel-btn {
            background: #95a5a6;
            color: white;
        }

        .delete-btn {
            background: #e74c3c;
            color: white;
        }

        .edit-form {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid #444;
        }

        .edit-input, .edit-textarea, .edit-select {
            width: 100%;
            padding: 6px 10px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #1a1a1a;
            color: #fff;
            font-size: 12px;
            margin-bottom: 6px;
        }

        .edit-textarea {
            min-height: 60px;
            resize: vertical;
        }

        .edit-row {
            display: flex;
            gap: 6px;
            margin-bottom: 6px;
        }

        .saver-form {
            background: #2d2d2d;
            border-radius: 8px;
            padding: 16px;
            border: 1px solid #333;
        }

        .form-group {
            margin-bottom: 12px;
        }

        .form-label {
            display: block;
            margin-bottom: 4px;
            font-size: 13px;
            font-weight: 500;
        }

        .form-input, .form-textarea, .form-select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #333;
            border-radius: 6px;
            background: #1a1a1a;
            color: #fff;
            font-size: 13px;
        }

        .form-textarea {
            min-height: 80px;
            resize: vertical;
        }

        .form-row {
            display: flex;
            gap: 10px;
        }

        .form-col {
            flex: 1;
        }

        .save-btn-main {
            width: 100%;
            padding: 10px;
            background: #4a7fff;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }

        .save-btn-main:hover {
            background: #3a6ce5;
        }

        .saver-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
            background: #4a7fff;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: all 0.2s;
        }

        .saver-toggle:hover {
            background: #3a6ce5;
            transform: scale(1.05);
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }

        .empty-icon {
            font-size: 48px;
            margin-bottom: 12px;
            opacity: 0.3;
        }

        .empty-text {
            font-size: 16px;
            margin-bottom: 4px;
        }

        .empty-subtext {
            font-size: 13px;
        }

        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: #2d2d2d;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10002;
            opacity: 0;
            transition: all 0.3s;
            border-left: 4px solid #4a7fff;
            max-width: 400px;
        }

        .notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }

        .notification.error {
            border-left-color: #e74c3c;
        }

        .notification.warning {
            border-left-color: #f39c12;
        }

        .notification.success {
            border-left-color: #27ae60;
        }

        .copy-fallback {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #f39c12;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            display: none;
            align-items: center;
            gap: 10px;
            animation: slideUp 0.3s ease-out;
        }

        .copy-fallback.show {
            display: flex;
        }

        .copy-fallback-text {
            font-size: 14px;
        }

        .copy-fallback-btn {
            padding: 6px 12px;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 4px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .copy-fallback-btn:hover {
            background: rgba(255,255,255,0.3);
        }

        @keyframes slideUp {
            from {
                transform: translateY(100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `);

    // Load data
    function loadData() {
        const data = GM_getValue(STORAGE_KEY);
        if (data) {
            try {
                prompts = JSON.parse(data);
            } catch (e) {
                prompts = [];
            }
        }
    }

    // Save data
    function saveData() {
        GM_setValue(STORAGE_KEY, JSON.stringify(prompts));
    }

    // Find AI input with comprehensive detection
    function findAIInput() {
        const hostname = window.location.hostname;

        // Comprehensive selectors for each platform
        const selectors = {
            'chat.openai.com': [
                '#prompt-textarea',
                'textarea[data-id="prompt-textarea"]',
                'textarea[id*="prompt"]',
                'textarea[placeholder*="Message"]',
                'textarea:not([readonly])'
            ],
            'claude.ai': [
                'div[contenteditable="true"][data-message-author-role="user"]',
                'div.ProseMirror',
                'div[contenteditable="true"]',
                'textarea'
            ],
            'gemini.google.com': [
                'textarea[placeholder*="Enter a prompt"]',
                'textarea[aria-label*="Enter prompt"]',
                'textarea[placeholder*="prompt"]',
                'textarea'
            ],
            'www.perplexity.ai': [
                'textarea[aria-label*="Message"]',
                'textarea[placeholder*="Ask anything"]',
                'textarea[placeholder*="Ask"]',
                'textarea[placeholder*="message"]',
                'textarea',
                'div[contenteditable="true"]',
                '[data-testid="prose-mirror-editor"]',
                '.ProseMirror',
                '[class*="editor"] textarea',
                '[class*="input"] textarea',
                'div[role="textbox"]',
                '[data-test-id="prose-mirror-editor"]'
            ],
            'poe.com': [
                'div[contenteditable="true"][data-id="root"]',
                'div[contenteditable="true"]',
                'textarea'
            ],
            'chat.qwen.ai': [
                'textarea[placeholder*="请输入"]',
                'textarea[placeholder*="Enter"]',
                'textarea'
            ]
        };

        // Get selectors for current site
        const siteSelectors = selectors[hostname] || ['textarea', 'div[contenteditable="true"]', 'div[role="textbox"]'];

        // Try each selector
        for (const selector of siteSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                if (isValidInput(element)) {
                    return element;
                }
            }
        }

        // Last resort: find any visible input
        const allInputs = document.querySelectorAll('textarea, div[contenteditable="true"], div[role="textbox"]');
        for (const element of allInputs) {
            if (isValidInput(element)) {
                return element;
            }
        }

        return null;
    }

    // Check if element is a valid input
    function isValidInput(element) {
        // Skip our own elements
        if (element.closest('#prompt-saver')) return false;

        // Check visibility
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return false;
        }

        // Check size
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            return false;
        }

        // Must be reasonably sized
        if (rect.width < 100 || rect.height < 30) {
            return false;
        }

        // Additional validation for Perplexity
        if (window.location.hostname === 'www.perplexity.ai') {
            // Check if it's in the main chat area
            const chatArea = element.closest('[class*="chat"]') ||
                           element.closest('[class*="conversation"]') ||
                           element.closest('[class*="message"]') ||
                           element.closest('[class*="prose"]') ||
                           element.closest('[class*="editor"]') ||
                           element.closest('[class*="input"]');

            if (!chatArea) {
                // Check if it's visible in viewport
                const isInViewport = rect.top >= 0 && rect.left >= 0 &&
                                   rect.bottom <= window.innerHeight &&
                                   rect.right <= window.innerWidth;
                if (!isInViewport) return false;
            }
        }

        return true;
    }

    // Robust text insertion with multiple methods
    function insertText(text, promptId = null) {
        const input = findAIInput();
        if (!input) {
            showNotification('Could not find AI input. Please try again.', 'error');
            return false;
        }

        try {
            // Focus the input first
            input.focus();

            // Try multiple insertion methods
            setTimeout(() => {
                let success = false;

                // Method 1: Direct value/innerText assignment
                if (input.tagName.toLowerCase() === 'textarea') {
                    success = insertIntoTextarea(input, text);
                } else if (input.contentEditable === 'true' || input.getAttribute('role') === 'textbox') {
                    success = insertIntoContentEditable(input, text);
                }

                if (success) {
                    showNotification('Prompt inserted', 'success');
                    // Update usage stats
                    if (promptId) {
                        const prompt = prompts.find(p => p.id === promptId);
                        if (prompt) {
                            prompt.lastUsed = new Date().toISOString();
                            prompt.usageCount++;
                            saveData();
                            renderPrompts();
                        }
                    }
                } else {
                    // Show copy fallback
                    showCopyFallback(text);
                    showNotification('Failed to insert. Click "Copy" to copy manually.', 'warning');
                }
            }, 100);

            return true;
        } catch (e) {
            console.error('Error inserting text:', e);
            showCopyFallback(text);
            showNotification('Failed to insert. Click "Copy" to copy manually.', 'error');
            return false;
        }
    }

    // Insert into textarea with React support
    function insertIntoTextarea(textarea, text) {
        try {
            // Store original value
            const originalValue = textarea.value;

            // Get the native value setter descriptor
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;

            // Call the native setter
            nativeInputValueSetter.call(textarea, text);

            // Set cursor position
            textarea.setSelectionRange(text.length, text.length);

            // Create and dispatch events
            const event = new Event('input', { bubbles: true });
            textarea.dispatchEvent(event);

            // Trigger React's internal update
            const reactEvent = new Event('input', { bubbles: true });
            reactEvent.simulated = true;

            // Handle React's value tracker
            if (textarea._valueTracker) {
                textarea._valueTracker.setValue(originalValue);
                textarea._valueTracker.setValue(text);
            }

            textarea.dispatchEvent(reactEvent);
            textarea.dispatchEvent(new Event('change', { bubbles: true }));

            // Additional events for some frameworks
            setTimeout(() => {
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }, 10);

            // Verify insertion worked
            setTimeout(() => {
                if (textarea.value !== text) {
                    return false;
                }
            }, 50);

            return true;
        } catch (e) {
            console.error('Textarea insertion error:', e);
            return false;
        }
    }

    // Insert into contenteditable
    function insertIntoContentEditable(element, text) {
        try {
            // Clear existing content
            element.innerHTML = '';
            element.focus();

            // Create text node
            const textNode = document.createTextNode(text);
            element.appendChild(textNode);

            // Set cursor to end
            const range = document.createRange();
            range.selectNodeContents(element);
            range.collapse(false);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // Dispatch events
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('DOMSubtreeModified', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));

            // Verify insertion worked
            setTimeout(() => {
                if (element.textContent !== text) {
                    return false;
                }
            }, 50);

            return true;
        } catch (e) {
            console.error('ContentEditable insertion error:', e);
            return false;
        }
    }

    // Show copy fallback UI
    function showCopyFallback(text) {
        // Remove existing fallback if any
        const existing = document.querySelector('.copy-fallback');
        if (existing) {
            existing.remove();
        }

        // Create fallback UI
        const fallback = document.createElement('div');
        fallback.className = 'copy-fallback';
        fallback.innerHTML = `
            <span class="copy-fallback-text">Insertion failed - copy manually?</span>
            <button class="copy-fallback-btn">Copy</button>
        `;

        document.body.appendChild(fallback);

        // Show with animation
        setTimeout(() => fallback.classList.add('show'), 10);

        // Add copy functionality
        fallback.querySelector('.copy-fallback-btn').addEventListener('click', () => {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Copied to clipboard! Paste in chat.', 'success');
                fallback.remove();
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Copied to clipboard! Paste in chat.', 'success');
                fallback.remove();
            });
        });

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (document.body.contains(fallback)) {
                fallback.remove();
            }
        }, 10000);
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Add prompt
    function addPrompt(title, text, tags, category) {
        const prompt = {
            id: Date.now(),
            title: title || 'Untitled',
            text: text,
            tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
            category: category || 'general',
            created: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            usageCount: 0
        };

        prompts.unshift(prompt);
        saveData();
        renderPrompts();
        showNotification('Prompt saved', 'success');
    }

    // Update prompt
    function updatePrompt(id, title, text, tags, category) {
        const prompt = prompts.find(p => p.id === id);
        if (prompt) {
            prompt.title = title || 'Untitled';
            prompt.text = text;
            prompt.tags = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
            prompt.category = category || 'general';
            saveData();
            renderPrompts();
            showNotification('Prompt updated', 'success');
        }
    }

    // Delete prompt
    function deletePrompt(id) {
        prompts = prompts.filter(p => p.id !== id);
        saveData();
        renderPrompts();
        showNotification('Prompt deleted', 'info');
    }

    // Use prompt
    function usePrompt(id) {
        const prompt = prompts.find(p => p.id === id);
        if (prompt) {
            insertText(prompt.text, id);
        }
    }

    // Copy prompt text
    function copyPrompt(id) {
        const prompt = prompts.find(p => p.id === id);
        if (prompt) {
            navigator.clipboard.writeText(prompt.text).then(() => {
                showNotification('Prompt copied to clipboard', 'success');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = prompt.text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Prompt copied to clipboard', 'success');
            });
        }
    }

    // Start editing prompt
    function startEditing(id) {
        editingId = id;
        renderPrompts();
    }

    // Cancel editing
    function cancelEditing() {
        editingId = null;
        renderPrompts();
    }

    // Save edited prompt
    function saveEditedPrompt(id) {
        const titleInput = document.getElementById(`edit-title-${id}`);
        const textInput = document.getElementById(`edit-text-${id}`);
        const tagsInput = document.getElementById(`edit-tags-${id}`);
        const categoryInput = document.getElementById(`edit-category-${id}`);

        if (titleInput && textInput) {
            const title = titleInput.value.trim();
            const text = textInput.value.trim();
            const tags = tagsInput.value.trim();
            const category = categoryInput.value;

            if (!text) {
                showNotification('Prompt text cannot be empty', 'error');
                return;
            }

            updatePrompt(id, title, text, tags, category);
            editingId = null;
        }
    }

    // Render prompts
    function renderPrompts() {
        const container = document.getElementById('prompts-container');
        if (!container) return;

        let filtered = prompts;

        if (currentFilter !== 'all') {
            filtered = filtered.filter(p => p.category === currentFilter);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(term) ||
                p.text.toLowerCase().includes(term) ||
                p.tags.some(t => t.toLowerCase().includes(term))
            );
        }

        filtered.sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed));

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <div class="empty-text">No prompts found</div>
                    <div class="empty-subtext">Save your first prompt below</div>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(prompt => {
            const category = categories.find(c => c.id === prompt.category) || categories[0];
            const isEditing = editingId === prompt.id;

            if (isEditing) {
                return `
                    <div class="prompt-item editing" data-id="${prompt.id}">
                        <div class="edit-form">
                            <input type="text" class="edit-input" id="edit-title-${prompt.id}"
                                   placeholder="Title" value="${prompt.title}">
                            <textarea class="edit-textarea" id="edit-text-${prompt.id}"
                                      placeholder="Prompt">${prompt.text}</textarea>
                            <div class="edit-row">
                                <input type="text" class="edit-input" id="edit-tags-${prompt.id}"
                                       placeholder="Tags (comma-separated)" value="${prompt.tags.join(', ')}">
                                <select class="edit-select" id="edit-category-${prompt.id}">
                                    ${categories.map(cat =>
                                        `<option value="${cat.id}" ${cat.id === prompt.category ? 'selected' : ''}>${cat.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="prompt-actions">
                                <button class="prompt-btn save-btn" data-action="save" data-id="${prompt.id}">💾 Save</button>
                                <button class="prompt-btn cancel-btn" data-action="cancel">✖ Cancel</button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="prompt-item" data-id="${prompt.id}">
                        <div class="prompt-header">
                            <div class="prompt-title">${prompt.title}</div>
                            <div class="prompt-category" style="background: ${category.color}">${category.name}</div>
                        </div>
                        <div class="prompt-text">${prompt.text}</div>
                        <div class="prompt-tags">
                            ${prompt.tags.map(tag => `<span class="prompt-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="prompt-actions">
                            <button class="prompt-btn insert-btn" data-id="${prompt.id}">Insert</button>
                            <button class="prompt-btn copy-btn" data-id="${prompt.id}">📋 Copy</button>
                            <button class="prompt-btn edit-btn" data-id="${prompt.id}">✏️ Edit</button>
                            <button class="prompt-btn delete-btn" data-id="${prompt.id}">Delete</button>
                        </div>
                    </div>
                `;
            }
        }).join('');

        // Add event listeners using event delegation
        container.addEventListener('click', (e) => {
            const target = e.target;

            // Handle save button
            if (target.classList.contains('save-btn') && target.dataset.action === 'save') {
                e.stopPropagation();
                const id = parseInt(target.dataset.id);
                saveEditedPrompt(id);
            }
            // Handle cancel button
            else if (target.classList.contains('cancel-btn') && target.dataset.action === 'cancel') {
                e.stopPropagation();
                cancelEditing();
            }
            // Handle other buttons
            else if (target.classList.contains('insert-btn')) {
                e.stopPropagation();
                usePrompt(parseInt(target.dataset.id));
            }
            else if (target.classList.contains('copy-btn')) {
                e.stopPropagation();
                copyPrompt(parseInt(target.dataset.id));
            }
            else if (target.classList.contains('edit-btn')) {
                e.stopPropagation();
                startEditing(parseInt(target.dataset.id));
            }
            else if (target.classList.contains('delete-btn')) {
                e.stopPropagation();
                if (confirm('Delete this prompt?')) {
                    deletePrompt(parseInt(target.dataset.id));
                }
            }
            // Handle prompt item click (when not editing)
            else if (target.classList.contains('prompt-item') && !target.classList.contains('editing')) {
                const id = parseInt(target.dataset.id);
                usePrompt(id);
            }
        });
    }

    // Update category filters
    function updateCategories() {
        const container = document.getElementById('categories-container');
        if (!container) return;

        container.innerHTML = `
            <button class="category-btn ${currentFilter === 'all' ? 'active' : ''}" data-category="all">All</button>
            ${categories.map(cat => `
                <button class="category-btn ${currentFilter === cat.id ? 'active' : ''}"
                        data-category="${cat.id}"
                        style="border-color: ${cat.color}; color: ${currentFilter === cat.id ? 'white' : cat.color}">
                    ${cat.name}
                </button>
            `).join('')}
        `;

        container.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.dataset.category;
                renderPrompts();
                updateCategories();
            });
        });
    }

    // Create UI
    function createUI() {
        // Main container
        const saver = document.createElement('div');
        saver.id = 'prompt-saver';
        saver.innerHTML = `
            <div class="saver-header">
                <div class="saver-title">📝 Prompt Saver</div>
                <button class="saver-close">×</button>
            </div>
            <div class="saver-content">
                <input type="text" class="saver-search" placeholder="Search prompts..." id="search-input">
                <div class="saver-categories" id="categories-container"></div>
                <div class="saver-prompts" id="prompts-container"></div>
                <div class="saver-form">
                    <div class="form-group">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-input" id="prompt-title" placeholder="Enter title...">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Prompt</label>
                        <textarea class="form-textarea" id="prompt-text" placeholder="Enter your prompt..."></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">Tags</label>
                            <input type="text" class="form-input" id="prompt-tags" placeholder="coding, writing...">
                        </div>
                        <div class="form-col">
                            <label class="form-label">Category</label>
                            <select class="form-select" id="prompt-category">
                                ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <button class="save-btn-main" id="save-btn">💾 Save Prompt</button>
                </div>
            </div>
        `;
        document.body.appendChild(saver);

        // Toggle button
        const toggle = document.createElement('button');
        toggle.className = 'saver-toggle';
        toggle.innerHTML = '💬';
        toggle.title = 'Toggle Prompt Saver';
        document.body.appendChild(toggle);

        // Event listeners
        toggle.addEventListener('click', () => {
            isVisible = !isVisible;
            saver.classList.toggle('show', isVisible);
        });

        saver.querySelector('.saver-close').addEventListener('click', () => {
            isVisible = false;
            saver.classList.remove('show');
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            searchTerm = e.target.value;
            renderPrompts();
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            const title = document.getElementById('prompt-title').value.trim();
            const text = document.getElementById('prompt-text').value.trim();
            const tags = document.getElementById('prompt-tags').value.trim();
            const category = document.getElementById('prompt-category').value;

            if (!text) {
                showNotification('Please enter a prompt', 'error');
                return;
            }

            addPrompt(title, text, tags, category);

            // Reset form
            document.getElementById('prompt-title').value = '';
            document.getElementById('prompt-text').value = '';
            document.getElementById('prompt-tags').value = '';
            document.getElementById('prompt-category').value = 'general';
        });
    }

    // Initialize
    function init() {
        loadData();
        createUI();
        renderPrompts();
        updateCategories();
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();