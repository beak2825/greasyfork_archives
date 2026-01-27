// ==UserScript==
// @name         Claude Chat Exporter
// @namespace    https://greasyfork.org/en/users/1565322-sakari0xff
// @version      1.1.0
// @description  Export your conversations with Claude to Markdown
// @author       Sakari0xFF
// @match        https://claude.ai/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564246/Claude%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/564246/Claude%20Chat%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DOWNLOAD_BUTTON_ID = 'claude-export-btn';

    /**
     * Extract chat title from the page header
     * @returns {string}
     */
    function getChatTitle() {
        const titleButton = document.querySelector('[data-testid="chat-title-button"]');
        if (titleButton) {
            const titleDiv = titleButton.querySelector('.truncate');
            if (titleDiv) {
                return titleDiv.textContent.trim();
            }
        }
        return 'claude-chat-' + new Date().toISOString().split('T')[0];
    }

    /**
     * Sanitize filename for safe saving
     * @param {string} name
     * @returns {string}
     */
    function sanitizeFilename(name) {
        return name
            .replace(/[<>:"/\\|?*]/g, '-')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 100);
    }

    /**
     * Check if element is a UI artifact that should be skipped
     * @param {Element} node
     * @returns {boolean}
     */
    function isUIArtifact(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;

        const skipSelectors = [
            'button',
            'svg',
            'input',
            'label',
            '[data-testid="action-bar-copy"]',
            '[data-testid="chat-menu-trigger"]',
            '[role="group"]',
            '[class*="opacity-0"]',
            '[class*="group-hover"]',
            '[class*="transition"]'
        ];

        for (const selector of skipSelectors) {
            if (node.matches && node.matches(selector)) return true;
        }

        const text = node.textContent?.trim();
        if (text === 'Copy' || text === 'Retry' || text === 'Edit') return true;

        return false;
    }

    /**
     * Check if element is a tool call/result block
     * @param {Element} node
     * @returns {boolean}
     */
    function isToolBlock(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;

        const toolSelectors = [
            '[class*="border-border-300"]',
            '[class*="hover:bg-bg-200"]'
        ];

        const text = node.textContent?.trim() || '';
        if (text.includes('Relevant chats') && text.includes('results')) return true;
        if (text.startsWith('Select ') && text.includes('[') && node.querySelector('input[type="checkbox"]')) return true;

        for (const selector of toolSelectors) {
            if (node.matches && node.matches(selector)) {
                const hasToolIcon = node.querySelector('svg');
                const hasExpandArrow = node.querySelector('svg[class*="rotate"]');
                if (hasToolIcon && hasExpandArrow) return true;
            }
        }

        return false;
    }

    /**
     * Convert table to Markdown
     * @param {HTMLTableElement} table
     * @returns {string}
     */
    function tableToMarkdown(table) {
        let markdown = '\n';

        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');

        // Process header
        if (thead) {
            const headerRow = thead.querySelector('tr');
            if (headerRow) {
                const headers = [];
                for (const th of headerRow.querySelectorAll('th')) {
                    headers.push(htmlToMarkdown(th).trim());
                }
                if (headers.length > 0) {
                    markdown += '| ' + headers.join(' | ') + ' |\n';
                    markdown += '|' + headers.map(() => ' --- ').join('|') + '|\n';
                }
            }
        }

        // Process body
        if (tbody) {
            for (const tr of tbody.querySelectorAll('tr')) {
                const cells = [];
                for (const td of tr.querySelectorAll('td')) {
                    cells.push(htmlToMarkdown(td).trim());
                }
                if (cells.length > 0) {
                    markdown += '| ' + cells.join(' | ') + ' |\n';
                }
            }
        }

        return markdown + '\n';
    }

    /**
     * Convert HTML to Markdown
     * @param {Element} element
     * @returns {string}
     */
    function htmlToMarkdown(element) {
        if (!element) return '';

        let markdown = '';

        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                markdown += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (isUIArtifact(node) || isToolBlock(node)) continue;

                const tag = node.tagName.toLowerCase();

                switch (tag) {
                    case 'table':
                        markdown += tableToMarkdown(node);
                        break;
                    case 'thead':
                    case 'tbody':
                        // Skip, handled in tableToMarkdown
                        break;
                    case 'tr':
                        // Skip, handled in tableToMarkdown
                        break;
                    case 'th':
                    case 'td':
                        markdown += htmlToMarkdown(node);
                        break;
                    case 'p':
                        markdown += htmlToMarkdown(node) + '\n\n';
                        break;
                    case 'strong':
                    case 'b':
                        markdown += '**' + htmlToMarkdown(node) + '**';
                        break;
                    case 'em':
                    case 'i':
                        markdown += '*' + htmlToMarkdown(node) + '*';
                        break;
                    case 'code':
                        markdown += '`' + htmlToMarkdown(node) + '`';
                        break;
                    case 'pre':
                        markdown += '\n```\n' + htmlToMarkdown(node) + '\n```\n';
                        break;
                    case 'blockquote':
                        markdown += '> ' + htmlToMarkdown(node).replace(/\n/g, '\n> ') + '\n\n';
                        break;
                    case 'ul':
                        for (const li of node.children) {
                            if (!isUIArtifact(li)) {
                                markdown += '- ' + htmlToMarkdown(li).trim() + '\n';
                            }
                        }
                        markdown += '\n';
                        break;
                    case 'ol':
                        let num = 1;
                        for (const li of node.children) {
                            if (!isUIArtifact(li)) {
                                markdown += num + '. ' + htmlToMarkdown(li).trim() + '\n';
                                num++;
                            }
                        }
                        markdown += '\n';
                        break;
                    case 'br':
                        markdown += '\n';
                        break;
                    case 'a': {
                        const href = node.getAttribute('href');
                        if (href && href !== 'null' && !href.startsWith('javascript')) {
                            markdown += '[' + htmlToMarkdown(node) + '](' + href + ')';
                        } else {
                            markdown += htmlToMarkdown(node);
                        }
                        break;
                    }
                    case 'h1':
                        markdown += '# ' + htmlToMarkdown(node) + '\n\n';
                        break;
                    case 'h2':
                        markdown += '## ' + htmlToMarkdown(node) + '\n\n';
                        break;
                    case 'h3':
                        markdown += '### ' + htmlToMarkdown(node) + '\n\n';
                        break;
                    case 'h4':
                        markdown += '#### ' + htmlToMarkdown(node) + '\n\n';
                        break;
                    case 'h5':
                        markdown += '##### ' + htmlToMarkdown(node) + '\n\n';
                        break;
                    case 'h6':
                        markdown += '###### ' + htmlToMarkdown(node) + '\n\n';
                        break;
                    case 'div':
                    case 'span':
                        markdown += htmlToMarkdown(node);
                        break;
                    default:
                        markdown += htmlToMarkdown(node);
                }
            }
        }

        return markdown;
    }

    /**
     * Clean up extracted text from artifacts
     * @param {string} text
     * @returns {string}
     */
    function cleanText(text) {
        return text
            .replace(/\[\s*\]\(null\)/g, '')
            .replace(/Select\s+\S+\s*\[.*?\]\(null\)/gs, '')
            .replace(/Relevant chats\d+\s*results?/gi, '')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/```\n```/g, '```')
            .replace(/`{3,}/g, '```')
            .trim();
    }

    /**
     * Extract conversation messages from the page
     * @returns {Array<{role: string, content: string}>}
     */
    function extractMessages() {
        const messages = [];

        const mainContent = document.querySelector('#main-content');
        if (!mainContent) return messages;

        const messageContainers = mainContent.querySelectorAll('[data-test-render-count]');

        for (const container of messageContainers) {
            const userMsg = container.querySelector('[data-testid="user-message"]');
            if (userMsg) {
                const content = cleanText(htmlToMarkdown(userMsg)).trim();
                if (content) {
                    messages.push({ role: 'user', content });
                }
                continue;
            }

            const assistantContainer = container.querySelector('.font-claude-response');
            if (assistantContainer) {
                let content = cleanText(htmlToMarkdown(assistantContainer)).trim();

                content = content
                    .replace(/^\d+\s*step.*?(?=\n|$)/gi, '')
                    .replace(/plaintext\s*$/gi, '')
                    .replace(/Show working file/gi, '')
                    .replace(/`Output\s*`/g, '\n```\n')
                    .replace(/`\s*$/g, '\n```')
                    .replace(/```\s*```/g, '```')
                    .trim();

                if (content) {
                    messages.push({ role: 'assistant', content });
                }
            }
        }

        return messages;
    }

    /**
     * Generate Markdown content from messages
     * @param {Array<{role: string, content: string}>} messages
     * @returns {string}
     */
    function generateMarkdown(messages) {
        const title = getChatTitle();
        const date = new Date().toLocaleString();

        let markdown = `# ${title}\n\n`;
        markdown += `**Date:** ${date}\n\n`;
        markdown += `---\n\n`;

        for (const msg of messages) {
            if (msg.role === 'user') {
                markdown += `## User\n\n${msg.content}\n\n`;
            } else {
                markdown += `## Agent\n\n${msg.content}\n\n`;
            }
        }

        return markdown;
    }

    /**
     * Trigger file download
     * @param {string} content
     * @param {string} filename
     */
    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename + '.md';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Handle export button click
     */
    function handleExport() {
        const messages = extractMessages();
        if (messages.length === 0) {
            alert('No messages found to export.');
            return;
        }

        const markdown = generateMarkdown(messages);
        const filename = sanitizeFilename(getChatTitle());
        downloadFile(markdown, filename);
    }

    /**
     * Create download button element styled like native buttons
     * @returns {HTMLButtonElement}
     */
    function createDownloadButton() {
        const button = document.createElement('button');
        button.id = DOWNLOAD_BUTTON_ID;
        button.type = 'button';
        button.title = 'Export chat to Markdown';
        button.setAttribute('aria-label', 'Export chat to Markdown');

        button.className = 'inline-flex items-center justify-center relative shrink-0 can-focus select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none border-transparent transition font-base duration-300 ease-[cubic-bezier(0.165,0.85,0.45,1)] h-8 w-8 rounded-md active:scale-95 Button_ghost__BUAoh';

        button.innerHTML = `
            <div style="width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink: 0;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
            </div>
        `;

        button.addEventListener('click', handleExport);

        return button;
    }

    /**
     * Find or create container for the export button
     * @returns {HTMLElement|null}
     */
    function findOrCreateButtonContainer() {
        const existingBtn = document.getElementById(DOWNLOAD_BUTTON_ID);
        if (existingBtn) {
            return existingBtn.parentElement;
        }

        // Primary: Share button container (wiggle-controls-actions)
        let container = document.querySelector('[data-testid="wiggle-controls-actions"]');
        if (container) {
            return container;
        }

        // Fallback: header right side
        const header = document.querySelector('header[data-testid="page-header"]');
        if (header) {
            container = header.querySelector('[class*="right-3"]');
            if (container) return container;

            container = header.querySelector('[class*="flex gap-2"]');
            if (container) return container;
        }

        return null;
    }

    /**
     * Add download button to the header
     */
    function addDownloadButton() {
        if (document.getElementById(DOWNLOAD_BUTTON_ID)) {
            const btn = document.getElementById(DOWNLOAD_BUTTON_ID);
            const container = findOrCreateButtonContainer();
            if (container && btn.parentElement !== container) {
                container.appendChild(btn);
            }
            return;
        }

        const container = findOrCreateButtonContainer();
        if (!container) {
            return;
        }

        const button = createDownloadButton();
        container.appendChild(button);
    }

    /**
     * Initialize the script
     */
    function init() {
        addDownloadButton();

        const observer = new MutationObserver((mutations) => {
            let shouldAdd = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.removedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.querySelector && node.querySelector('#' + DOWNLOAD_BUTTON_ID)) {
                                shouldAdd = true;
                                break;
                            }
                        }
                    }
                    if (!shouldAdd) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches && (node.matches('header') ||
                                    node.matches('[data-testid="page-header"]') ||
                                    node.matches('[data-testid="wiggle-controls-actions"]'))) {
                                    shouldAdd = true;
                                    break;
                                }
                                if (node.querySelector && (node.querySelector('header') ||
                                    node.querySelector('[data-testid="wiggle-controls-actions"]'))) {
                                    shouldAdd = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            if (shouldAdd || !document.getElementById(DOWNLOAD_BUTTON_ID)) {
                addDownloadButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setInterval(() => {
            if (!document.getElementById(DOWNLOAD_BUTTON_ID)) {
                addDownloadButton();
            }
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
