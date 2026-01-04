// ==UserScript==
// @name         DeepSeek Tool - Chat Exporter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Export DeepSeek conversations to text files. Requires DeepSeek Toolkit Core.
// @author       okagame
// @match        https://chat.deepseek.com/*
// @grant        none
// @require https://update.greasyfork.org/scripts/555353/1692504/DeepSeek%20Toolkit%20-%20Core.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555355/DeepSeek%20Tool%20-%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/555355/DeepSeek%20Tool%20-%20Chat%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Chat Exporter] Loading...');

    // Wait for toolkit to be ready
    if (typeof window.DeepSeekToolkit === 'undefined') {
        console.error('[Chat Exporter] DeepSeek Toolkit Core not found!');
        return;
    }

    // ==================== EXPORT LOGIC ====================

    function capitalizeRole(role) {
        if (role === 'user') return 'User';
        if (role === 'assistant') return 'Assistant';
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    function extractMessages() {
        const containers = document.querySelectorAll('[data-message-id]');
        const messages = [];

        console.log(`[Chat Exporter] Found ${containers.length} message containers`);

        containers.forEach((container, index) => {
            const role = container.getAttribute('data-message-author-role');
            if (!role) {
                console.log(`[Chat Exporter] Container ${index}: no role`);
                return;
            }

            // Extract text using TreeWalker to get all text nodes
            const walker = document.createTreeWalker(
                container,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        const parent = node.parentElement;
                        if (!parent) return NodeFilter.FILTER_REJECT;

                        // Skip UI elements
                        const tagName = parent.tagName.toLowerCase();
                        if (['button', 'script', 'style', 'svg'].includes(tagName)) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        // Skip elements with role="button"
                        if (parent.getAttribute('role') === 'button') {
                            return NodeFilter.FILTER_REJECT;
                        }

                        // Skip if parent or any ancestor is a button
                        if (parent.closest('button')) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        // Skip common UI class patterns
                        const classList = parent.className || '';
                        if (typeof classList === 'string') {
                            if (classList.includes('button') ||
                                classList.includes('icon') ||
                                classList.includes('toolbar') ||
                                classList.includes('menu')) {
                                return NodeFilter.FILTER_REJECT;
                            }
                        }

                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            // Collect text nodes
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                const trimmed = node.textContent.trim();
                if (trimmed && trimmed.length > 0) {
                    // Filter out common UI strings
                    if (!['Copy', 'Edit', 'Retry', 'Regenerate', 'Continue', 'Stop'].includes(trimmed)) {
                        textNodes.push(trimmed);
                    }
                }
            }

            // Join text nodes with spaces, then clean up
            let text = textNodes.join(' ').trim();

            // Remove duplicate spaces
            text = text.replace(/\s+/g, ' ');

            if (text && text.length > 0) {
                console.log(`[Chat Exporter] Message ${index} (${role}): "${text.substring(0, 50)}..."`);
                messages.push({
                    role: capitalizeRole(role),
                    text: text
                });
            }
        });

        console.log(`[Chat Exporter] Extracted ${messages.length} messages`);
        return messages;
    }

    function generateFileName(messages) {
        // Try page title first
        const title = document.querySelector('title')?.textContent?.trim();
        if (title && !title.toLowerCase().includes('deepseek')) {
            const sanitized = title
                .slice(0, 40)
                .replace(/[^a-zA-Z0-9\s-]/g, '')
                .replace(/\s+/g, '_');
            if (sanitized) return sanitized;
        }

        // Try first message
        if (messages.length > 0) {
            const firstWords = messages[0].text.split(/\s+/).slice(0, 5).join(' ');
            const sanitized = firstWords
                .toLowerCase()
                .replace(/[^a-z0-9 ]/g, '')
                .replace(/\s+/g, '_')
                .slice(0, 30);
            if (sanitized) return sanitized;
        }

        // Fallback to timestamp
        const date = new Date();
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `deepseek_chat_${y}${m}${d}_${h}${min}`;
    }

    function exportChat() {
        console.log('[Chat Exporter] Starting export...');

        try {
            const messages = extractMessages();

            if (messages.length === 0) {
                alert('No conversation found to export. Make sure there are messages in the current chat.');
                return;
            }

            // Format content
            const date = new Date().toISOString();
            const header = `DeepSeek Chat Export\nDate: ${date}\nMessages: ${messages.length}\n\n${'='.repeat(60)}\n\n`;
            const body = messages.map(m => `${m.role}:\n${m.text}`).join('\n\n---\n\n');
            const content = header + body;

            // Create and download file
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = generateFileName(messages) + '.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup
            setTimeout(() => URL.revokeObjectURL(url), 100);

            console.log(`[Chat Exporter] Successfully exported ${messages.length} messages`);
        } catch (error) {
            console.error('[Chat Exporter] Export failed:', error);
            alert('Export failed: ' + error.message);
        }
    }

    // ==================== REGISTER WITH TOOLKIT ====================

    const EXPORT_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 1.5C7.5 1.22386 7.27614 1 7 1C6.72386 1 6.5 1.22386 6.5 1.5V7.5H6.5V1.5Z" fill="currentColor"/>
        <path d="M8.5 1.5C8.5 1.22386 8.72386 1 9 1C9.27614 1 9.5 1.22386 9.5 1.5V7.5H9.5V1.5Z" fill="currentColor"/>
        <path d="M1.5 8C1.22386 8 1 8.22386 1 8.5V12.5C1 12.7761 1.22386 13 1.5 13H14.5C14.7761 13 15 12.7761 15 12.5V8.5C15 8.22386 14.7761 8 14.5 8H1.5ZM2 12V9H14V12H2Z" fill="currentColor"/>
        <path d="M8 1L10.5 4H5.5L8 1Z" fill="currentColor"/>
    </svg>`;

    const registered = window.DeepSeekToolkit.registerTool({
        id: 'chat-exporter',
        name: 'Export Chat',
        icon: EXPORT_ICON,
        type: 'action',
        style: 'icon-button',
        onClick: exportChat
    });

    if (registered) {
        console.log('[Chat Exporter] Successfully registered with toolkit');
    } else {
        console.error('[Chat Exporter] Failed to register with toolkit');
    }

})();