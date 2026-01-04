// ==UserScript==
// @name         Ask Brave Chat Exporter
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Export Ask Brave conversations to Markdown and/or HTML
// @author       abdo2048
// @match        https://search.brave.com/ask*
// @require      https://update.greasyfork.org/scripts/506699/marked.js
// @grant        none
// @license      CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/561042/Ask%20Brave%20Chat%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/561042/Ask%20Brave%20Chat%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* global marked */

    // =============================================
    // CONFIGURATION
    // =============================================
    const CONFIG = {
        COPY_DELAY: 200, // ms between copy operations
        MAX_TITLE_LENGTH: 40
    };

    // =============================================
    // MAIN EXPORT BUTTON
    // =============================================
    function createExportButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '💾 Export';
        btn.id = 'brave-export-btn';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        btn.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
        });

        btn.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
        });

        btn.onclick = showExportDialog;
        document.body.appendChild(btn);
    }

    // =============================================
    // EXPORT DIALOG
    // =============================================
    function showExportDialog() {
        // Get default title from first user message
        const firstUserMsg = document.querySelector('.message.user .user-bubble');
        const defaultTitle = firstUserMsg ?
            truncateTitle(firstUserMsg.textContent.trim(), CONFIG.MAX_TITLE_LENGTH) :
            'Brave Ask Conversation';

        const dialog = document.createElement('div');
        dialog.id = 'brave-export-dialog';
        dialog.className = 'export-dialog-wrapper';
        dialog.innerHTML = `
    <div class="export-dialog-content">
        <h2>Export Conversation</h2>

        <div style="margin-bottom: 25px;">
            <label class="export-dialog-label">Title</label>
            <input type="text"
                   id="export-title"
                   class="export-dialog-input"
                   value=""
                   placeholder="${defaultTitle}">
        </div>

        <div style="margin-bottom: 25px;">
            <label class="export-dialog-label">Export formats</label>
            <div class="export-dialog-checkboxes">
                <label class="export-dialog-checkbox-label">
                    <input type="checkbox" id="export-markdown" checked>
                    <span>Markdown</span>
                </label>
                <label class="export-dialog-checkbox-label">
                    <input type="checkbox" id="export-html" checked>
                    <span>HTML</span>
                </label>
            </div>
            <div style="margin-top: 12px;">
                <span style="font-size: 13px; color: var(--text-secondary);">Need something? </span>
                <a href="https://github.com/abdo2048/Ask-Brave-Chat-Exporter"
                   target="_blank"
                   class="export-dialog-link">Visit GitHub repo</a>
            </div>
        </div>

        <div class="export-dialog-buttons">
            <button id="export-cancel-btn" class="export-dialog-btn export-dialog-btn-cancel">Cancel</button>
            <button id="export-download-btn" class="export-dialog-btn export-dialog-btn-download">Download</button>
        </div>
    </div>
`;


        document.body.appendChild(dialog);

        // Event listeners
        document.getElementById('export-cancel-btn').onclick = function() {

        // Clean up Enter key listener
        if (dialog._enterKeyHandler) {
            document.removeEventListener('keydown', dialog._enterKeyHandler);
        }
        dialog.remove();
        };

        document.getElementById('export-download-btn').onclick = function() {
            const titleInput = document.getElementById('export-title').value.trim();
            const title = titleInput || defaultTitle;
            const exportMd = document.getElementById('export-markdown').checked;
            const exportHtml = document.getElementById('export-html').checked;

            if (!exportMd && !exportHtml) {
                alert('Please select at least one export format.');
                return;
            }


        // Clean up Enter key listener
        if (dialog._enterKeyHandler) {
            document.removeEventListener('keydown', dialog._enterKeyHandler);
        }
        dialog.remove();
            startExport(title, exportMd, exportHtml);
        };

    // Add Enter key support for export dialog
    const handleEnterKey = function(e) {
        const dialog = document.getElementById('brave-export-dialog');
        if (e.key === 'Enter' && dialog) {
            e.preventDefault();
            const downloadBtn = document.getElementById('export-download-btn');
            if (downloadBtn) {
                downloadBtn.click();
            }
        }
    };

    document.addEventListener('keydown', handleEnterKey);

    // Store handler reference for cleanup
    dialog._enterKeyHandler = handleEnterKey;

        // Focus title input
        document.getElementById('export-title').focus();
    }

    // =============================================
    // EXPORT PROCESS
    // =============================================
    async function startExport(title, exportMd, exportHtml) {
        showOverlay();

        try {
            updateOverlay('Copying user messages...');
            const userMessages = await copyUserMessages();
            console.log('User messages:', userMessages.length);

            updateOverlay('Copying AI answers...');
            const aiAnswers = await copyAIAnswers();
            console.log('AI answers:', aiAnswers.length);

            updateOverlay('Building conversation...');
            const conversation = buildConversation(userMessages, aiAnswers);

            if (exportMd) {
                updateOverlay('Generating Markdown...');
                const markdown = generateMarkdown(title, conversation);
                downloadFile(markdown, sanitizeFilename(title) + '.md', 'text/markdown');
            }

            if (exportHtml) {
                updateOverlay('Generating HTML...');
                const html = generateHTML(title, conversation);
                downloadFile(html, sanitizeFilename(title) + '.html', 'text/html');
            }

            updateOverlay('Export complete! ✓');
            await sleep(1000);
            hideOverlay();

        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Check console for details.');
            hideOverlay();
        }
    }

    // =============================================
    // COPY OPERATIONS
    // =============================================
    async function copyUserMessages() {
        const messages = [];
        const userMsgContainers = document.querySelectorAll('.message.user');

        for (let i = 0; i < userMsgContainers.length; i++) {
            const container = userMsgContainers[i];
            const copyBtn = container.querySelector('.user-message-actions button[aria-label="Copy"]');

            if (copyBtn) {
                copyBtn.click();
                await sleep(CONFIG.COPY_DELAY);
                const text = await navigator.clipboard.readText();
                messages.push(text.trim());
            }
        }

        return messages;
    }

    async function copyAIAnswers() {
        const answers = [];
        const answerContainers = document.querySelectorAll('.tap-round');

        console.log('Found AI answer containers:', answerContainers.length);

        for (let i = 0; i < answerContainers.length; i++) {
            const container = answerContainers[i];
            const copyBtn = container.querySelector('.tap-round-footer-actions button.tap-round-footer-action[aria-label="Copy"]');

            if (copyBtn) {
                console.log('Clicking answer copy button', i + 1);
                copyBtn.click();
                await sleep(CONFIG.COPY_DELAY);
                const text = await navigator.clipboard.readText();
                answers.push(text.trim());
            } else {
                console.warn('No copy button found in answer container', i + 1);
            }
        }

        console.log('Total answers copied:', answers.length);
        return answers;
    }

    // =============================================
    // BUILD CONVERSATION
    // =============================================
    function buildConversation(userMessages, aiAnswers) {
        const conversation = [];

        for (let i = 0; i < Math.max(userMessages.length, aiAnswers.length); i++) {
            if (userMessages[i]) {
                conversation.push({
                    type: 'user',
                    content: userMessages[i],
                    index: i + 1
                });
            }
            if (aiAnswers[i]) {
                conversation.push({
                    type: 'assistant',
                    content: aiAnswers[i],
                    index: i + 1
                });
            }
        }

        return conversation;
    }

    // =============================================
    // MARKDOWN GENERATION
    // =============================================
    function generateMarkdown(title, conversation) {
        const now = new Date();
        const dateStr = formatDate(now);

        let md = '';

        // Header
        md += '---\n';
        md += '**Title:** ' + title + '\n';
        md += '**Exported:** ' + dateStr + '\n';
        md += '\n---\n';

        // Questions and Answers
        let currentQ = 0;

        for (let idx = 0; idx < conversation.length; idx++) {
            const msg = conversation[idx];

            if (msg.type === 'user') {
                currentQ++;

                // Top divider
                md += '◤━━━━━━ Q' + currentQ + ' ━━━━━◥\n';

                // User question (raw, no formatting)
                md += msg.content + '\n';

                // Bottom divider
                md += '◣━━━━━━ Q' + currentQ + ' ━━━━━◢\n\n';

            } else {
                // AI answer
                md += msg.content + '\n\n';

                // Add horizontal line separator after each Q&A pair (except the last one)
                if (idx < conversation.length - 1) {
                    md += '---\n\n';
                }
            }
        }

        return md;
    }

    // =============================================
    // HTML GENERATION
    // =============================================
    function generateHTML(title, conversation) {
        const now = new Date();
        const dateStr = formatDate(now);

        // Check if marked is available
        if (typeof marked === 'undefined') {
            console.error('marked.js library not loaded!');
            alert('HTML export failed: marked.js library not loaded.');
            return '';
        }

        // Configure marked to add IDs to headings
        const renderer = {
        heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        return `<h${depth} id="${escapedText}">${text}</h${depth}>`;
    }
};

marked.use({ renderer });


        // Convert markdown to HTML using marked.js
        let contentHTML = '';
        let currentQ = 0;

        for (let i = 0; i < conversation.length; i++) {
            const msg = conversation[i];

            if (msg.type === 'user') {
                currentQ++;

                if (currentQ > 1) {
                    contentHTML += '<div class="separator">───────</div>\n';
                }

                contentHTML += '<div id="Q' + currentQ + '" class="question">\n';
                contentHTML += '<blockquote><strong>Q' + currentQ + ':</strong><br>\n';
                contentHTML += '<pre class="question-text">' + escapeHtml(msg.content) + '</pre>\n';
                contentHTML += '</blockquote>\n';
                contentHTML += '</div>\n';

            } else {
                contentHTML += '<div class="answer">\n';
                // eslint-disable-next-line no-undef
                contentHTML += marked.parse(msg.content);
                contentHTML += '</div>\n';
            }
        }

        // Generate TOC HTML
        const tocHTML = generateTOCHTML(conversation);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <link rel="preconnect" href="https://rsms.me/">
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5/index.css">
    <style>
/* --- EPIC THEME SYSTEM (WCAG AA+, Dark Mode, Fluid Scaling) --- */
:root {
  /* Colors - Light Mode (Default) */
  --bg-body: #f8fafc;       /* Slate-50 */
  --bg-surface: #ffffff;    /* White */
  --bg-sidebar: #ffffff;

  /* Blockquote Colors */
  --bg-blockquote-q: #f1f5f9;  /* Slate-100 (Questions) */
  --bg-blockquote-note: #f8fafc; /* Lighter for Notes */
  --border-note: #cbd5e1;      /* Slate-300 */

  /* Code Colors */
  --bg-code-block: #1e293b;    /* Slate-800 (Dark block in light mode) */
  --bg-code-inline: #e2e8f0;   /* Slate-200 (Distinct from white surface) */
  --text-code-block: #e2e8f0;
  --text-code-inline: #0f172a; /* Slate-900 (High contrast on Slate-200) */

  --text-primary: #0f172a;  /* Slate-900 */
  --text-secondary: #475569; /* Slate-600 */

  --primary: #4f46e5;       /* Indigo-600 */
  --primary-hover: #4338ca; /* Indigo-700 */
  --accent: #0ea5e9;        /* Sky-500 */

  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-float: 0 10px 15px -3px rgba(0,0,0,0.1);

  /* Typography (Fluid Scaling - Reduced Headers by ~9%) */
  --font-base: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Base text: 16px -> 18px */
  --text-scale-base: clamp(1rem, 1vw + 0.8rem, 1.125rem);

  /* H1: Was clamp(2rem, 4vw+1rem, 3rem) -> Reduced ~10% */
  --text-scale-h1: clamp(1.8rem, 3.5vw + 0.9rem, 2.7rem);

  /* H2: Was clamp(1.5rem, 3vw+1rem, 2.25rem) -> Reduced ~10% */
  --text-scale-h2: clamp(1.35rem, 2.7vw + 0.9rem, 2rem);

  /* H3: Was clamp(1.25rem, 2vw+1rem, 1.75rem) -> Reduced ~10% */
  --text-scale-h3: clamp(1.1rem, 1.8vw + 0.9rem, 1.55rem);

  /* Layout */
  --sidebar-width: 300px;
  --container-max: 1000px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* --- DARK MODE PREFERENCE --- */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-body: #0f172a;     /* Slate-900 */
    --bg-surface: #1e293b;  /* Slate-800 */
    --bg-sidebar: #1e293b;

    /* Dark Mode Inline Code */
    --bg-code-inline: #334155;  /* Slate-700 */
    --text-code-inline: #e2e8f0; /* Light text for contrast */

    /* Code Blocks - Sunken */
    --bg-code-block: #0B111F;   /* Matching the requested dark tone */
    --text-code-block: #f8fafc;

    /* Blockquotes */
    --bg-blockquote-q: #334155;    /* Slate-700 */
    --bg-blockquote-note: #334155; /* Slate-700 */
    --border-note: #475569;        /* Slate-600 */

    --text-primary: #f1f5f9;  /* Slate-50 */
    --text-secondary: #cbd5e1; /* Slate-300 */

    --primary: #818cf8;     /* Indigo-400 */
    --primary-hover: #6366f1;
    --border-color: #334155;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5);
    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.5);
  }
}

/* --- RESET & BASE --- */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-base);
  background-color: var(--bg-body);
  color: var(--text-primary);
  line-height: 1.7;
  font-size: var(--text-scale-base);
  overflow-x: hidden;
}

/* --- ACCESSIBILITY UTILS --- */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  html, body, * {
    scroll-behavior: auto !important;
    transition: none !important;
    animation: none !important;
  }
}

/* --- GRID LAYOUT --- */
.container {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
  transition: grid-template-columns var(--transition);
}

/* --- SIDEBAR --- */
.toc-sidebar {
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  height: 100vh;
  position: sticky;
  top: 0;
  padding: 2rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--text-secondary) transparent;
}

.toc-sidebar h2 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--primary);
  letter-spacing: -0.02em;
}

.toc-sidebar ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toc-sidebar a {
  display: block;
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 0.95rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  transition: all var(--transition);
  border-left: 3px solid transparent;
}

.toc-sidebar a:hover {
  background: var(--bg-body);
  color: var(--primary);
  transform: translateX(4px);
}

.toc-sidebar a.active {
  background: var(--bg-blockquote-q);
  color: var(--primary);
  border-left-color: var(--primary);
  font-weight: 600;
}

.toc-q { font-weight: 700; margin-top: 1rem; }
.toc-h2 { padding-left: 1rem; font-size: 0.9rem; }

/* --- MAIN CONTENT --- */
.main-content {
  padding: 3rem 4rem;
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
}

.header {
  background: var(--bg-surface);
  padding: 3rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
  text-align: center;
}

.header h1 {
  font-size: var(--text-scale-h1);
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--primary);
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header .meta {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-family: var(--font-mono);
  opacity: 0.8;
}

.content {
  background: var(--bg-surface);
  padding: 4rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

/* --- TYPOGRAPHY & ELEMENTS --- */
h2 {
  font-size: var(--text-scale-h2);
  margin: 2.5rem 0 1.5rem;
  color: var(--text-primary);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

h3 {
  font-size: var(--text-scale-h3);
  margin: 2rem 0 1rem;
  color: var(--text-secondary);
}

p { margin-bottom: 1.5rem; }

/* --- CODE BLOCKS & INLINE CODE --- */
/* Wrapper for Pre blocks */
.code-wrapper {
  position: relative;
  margin: 2rem 0;
}

pre {
  background: var(--bg-code-block);
  color: var(--text-code-block);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

pre code {
  background: none;
  padding: 0;
  font-family: inherit;
}

/* Inline Code Styling (NOT inside pre) */
:not(pre) > code {
  background-color: var(--bg-code-inline);
  color: var(--text-code-inline);
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.85em; /* Slightly smaller for better flow */
  border: 1px solid transparent; /* Keeps sizing consistent */
}

/* Dark mode border for inline code to make it pop slightly */

/* --- TABLES --- */
.table-wrapper {
  position: relative;
  margin: 2rem 0;
  overflow-x: auto;
  border-radius: var(--radius-md);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
}

thead {
  background: var(--primary);
  color: white;
}

thead th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

tbody tr:nth-child(odd) {
  background: var(--bg-surface);
}

tbody tr:nth-child(even) {
  background: var(--bg-body);
}

tbody tr:hover {
  background: var(--bg-blockquote-q);
}

tbody td {
  padding: 0.75rem 1rem;
  text-align: left;
  color: var(--text-primary);
}

/* First column (usually labels) - make bold */
tbody td:first-child {
  font-weight: 600;
  color: var(--text-primary);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .table-wrapper {
    border-radius: var(--radius-sm);
  }

  table {
    font-size: 0.8rem;
  }

  thead th {
    padding: 0.625rem 0.75rem;
    font-size: 0.75rem;
  }

  tbody td {
    padding: 0.625rem 0.75rem;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  thead {
    background: var(--primary-hover);
  }

  tbody tr:hover {
    background: rgba(255,255,255,0.05);
  }
}

@media (prefers-color-scheme: dark) {
  :not(pre) > code {
    border-color: rgba(255,255,255,0.1);
  }
}

.copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: var(--text-code-block);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: var(--transition);
  opacity: 0;
}




.code-wrapper:hover .copy-btn,
.question:hover .copy-btn,
.table-wrapper:hover .copy-btn {
  opacity: 1;
}

.copy-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

/* --- TABLE THREE-DOT MENU --- */
.table-menu-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: var(--text-secondary);
  transition: var(--transition);
  z-index: 10;
  padding: 0;
}

.table-menu-btn:hover {
  background: var(--bg-blockquote-q);
  border-color: var(--primary);
  color: var(--primary);
}

.table-menu-btn:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Dropdown menu */
.table-dropdown {
  position: absolute;
  top: 2.75rem;
  right: 0.75rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  min-width: 180px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
  z-index: 100;
  overflow: hidden;
}

.table-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.table-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-primary);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  transition: background 0.15s ease;
}

.table-dropdown-item:hover {
  background: var(--bg-blockquote-q);
}

.table-dropdown-item:active {
  background: var(--bg-blockquote-note);
}

.table-dropdown-item:focus {
  outline: 2px solid var(--primary);
  outline-offset: -2px;
}

.table-dropdown-item span {
  font-size: 16px;
}

/* Separator */
.table-dropdown-separator {
  height: 1px;
  background: var(--border-color);
  margin: 0.25rem 0;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .table-menu-btn {
    background: var(--bg-body);
  }

  .table-dropdown {
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
}


/* --- BLOCKQUOTES & QUESTIONS --- */

/* 1. Generic Blockquote (Notes, Warnings) */
blockquote {
  background: var(--bg-blockquote-note);
  border-left: 4px solid var(--border-note);
  padding: 1rem 1.5rem;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--text-secondary);
}

/* 2. Question Blockquote Override */
.question {
  position: relative;
  margin: 3rem 0 1.5rem;
}

.question blockquote {
  background: var(--bg-blockquote-q);
  border-left: 6px solid var(--primary);
  padding: 1.25rem 2rem; /* Reduced padding slightly */
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  font-style: normal; /* Reset italic */
  color: var(--text-primary);
}

.question strong {
  display: block;
  color: var(--primary);
  font-size: 1.1rem;
  margin-bottom: 0.25rem; /* Reduced gap between Qn and Text */
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.question .copy-btn {
  top: 1rem;
  right: 1rem;
  background: var(--bg-surface);
  color: var(--text-secondary);
  border-color: var(--border-color);
}

/* Reset <pre> inside question */
.question pre.question-text {
  font-family: var(--font-base);
  white-space: pre-wrap;
  font-size: var(--text-scale-h3);
  font-weight: 700;
  color: var(--text-primary);
  background: none;
  padding: 0;
  border: none;
  margin: 0;
  border-radius: 0;
}

.separator { display: none; }

/* --- EXPORT DIALOG DARK MODE SUPPORT --- */
.export-dialog-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  backdrop-filter: blur(4px);
}

.export-dialog-content {
  background: var(--bg-surface);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  border: 1px solid var(--border-color);
}

.export-dialog-content h2 {
  margin: 0 0 25px 0;
  font-size: 24px;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 15px;
}

.export-dialog-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
}

.export-dialog-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--font-base);
  background: var(--bg-body);
  color: var(--text-primary);
  transition: border-color 0.2s ease;
}

.export-dialog-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.export-dialog-checkboxes {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.export-dialog-checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 14px;
}

.export-dialog-checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary);
}

.export-dialog-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  transition: color 0.2s ease;
}

.export-dialog-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.export-dialog-buttons {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.export-dialog-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: var(--font-base);
}

.export-dialog-btn-cancel {
  background: var(--bg-body);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.export-dialog-btn-cancel:hover {
  background: var(--bg-blockquote-q);
  color: var(--text-primary);
}

.export-dialog-btn-download {
  background: var(--primary);
  color: white;
}

.export-dialog-btn-download:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
  .export-dialog-wrapper {
    background: rgba(0, 0, 0, 0.85);
  }

  .export-dialog-content {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  }
}

/* --- MOBILE RESPONSIVENESS --- */
@media (max-width: 1024px) {
  .container { grid-template-columns: 1fr; }
  .toc-sidebar {
    position: fixed;
    top: 0; left: 0;
    width: 280px; z-index: 1000;
    transform: translateX(-100%);
    transition: transform var(--transition);
    box-shadow: var(--shadow-float);
  }
  .toc-sidebar.open { transform: translateX(0); }
  .main-content { padding: 1.5rem; }
  .header, .content { padding: 1.5rem; }

  .mobile-menu-btn {
    display: flex !important;
    position: fixed;
    bottom: 20px; right: 20px;
    background: var(--primary);
    color: white;
    width: 50px; height: 50px;
    border-radius: 50%;
    align-items: center; justify-content: center;
    box-shadow: var(--shadow-float);
    z-index: 1100;
    cursor: pointer;
    border: none;
    font-size: 1.5rem;
  }

  .overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 999;
    opacity: 0; pointer-events: none;
    transition: opacity var(--transition);
  }
  .overlay.active { opacity: 1; pointer-events: auto; }
}

.mobile-menu-btn { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="toc-sidebar">
            <h2>📑 Contents</h2>
            ${tocHTML}
        </div>
        <div class="main-content">
            <div class="header">
                <h1>${escapeHtml(title)}</h1>
                <div class="meta">Exported: ${dateStr}</div>
            </div>
            <div class="content">
                ${contentHTML}
            </div>
        </div>
    </div>

    <script>

document.addEventListener('DOMContentLoaded', () => {
    // 1. INJECT MOBILE MENU ELEMENTS
    const body = document.body;

    // Create Menu Button
    const btn = document.createElement('button');
    btn.className = 'mobile-menu-btn';
    btn.innerHTML = '☰';
    btn.ariaLabel = 'Toggle Table of Contents';

    // Create Overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    body.appendChild(btn);
    body.appendChild(overlay);

    // Mobile Toggle Logic
    const sidebar = document.querySelector('.toc-sidebar');

    function toggleMenu() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        btn.innerHTML = sidebar.classList.contains('open') ? '✕' : '☰';
    }

    btn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) toggleMenu();
        });
    });

    // 2. ACTIVE TOC SPY (Intersection Observer)
    const tocLinks = document.querySelectorAll('.toc-sidebar a');
    const sections = Array.from(tocLinks).map(link => {
        const id = link.getAttribute('href').replace('#', '');
        return document.getElementById(id);
    }).filter(el => el); // Filter out nulls

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all
                tocLinks.forEach(link => link.classList.remove('active'));

                // Add active class to corresponding link
                const activeLink = document.querySelector('.toc-sidebar a[href="#' + entry.target.id + '"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                    // Smooth scroll sidebar to keep active link in view
                    activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px' }); // Trigger when section is near top

    sections.forEach(section => observer.observe(section));

    // 3. COPY BUTTON LOGIC
    // Wrap code blocks
    document.querySelectorAll('pre').forEach(pre => {
        // Skip if it's the question text
        if (pre.classList.contains('question-text')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        addCopyButton(wrapper, pre.innerText);
    });

    // Add copy button to Questions
    document.querySelectorAll('.question').forEach(q => {
        const text = q.querySelector('.question-text')?.innerText || q.innerText;
        addCopyButton(q, text);
    });


    // 4. WRAP TABLES AND ADD THREE-DOT MENU
    document.querySelectorAll('table').forEach(table => {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';

        // Insert wrapper before table
        table.parentNode.insertBefore(wrapper, table);

        // Move table into wrapper
        wrapper.appendChild(table);

        // Add three-dot menu
        addTableMenu(wrapper, table);
    });

    function addTableMenu(wrapper, table) {
        // Create menu button
        const menuBtn = document.createElement('button');
        menuBtn.className = 'table-menu-btn';
        menuBtn.innerHTML = '⋮';
        menuBtn.setAttribute('aria-label', 'Table options');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-haspopup', 'true');

        // Create dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'table-dropdown';
        dropdown.setAttribute('role', 'menu');

        // Extract table data in all formats
        const plainText = extractTableAsPlainText(table);
        const csvText = extractTableAsTSV(table);
        const markdownText = extractTableAsMarkdown(table);

        // Menu items
        const items = [
            {
                icon: '📊',
                text: 'Copy for Excel',
                action: () => copyToClipboard(csvText, 'CSV')
            },
            {
                icon: '📋',
                text: 'Copy as Text',
                action: () => copyToClipboard(plainText, 'Table')
            },
            {
                separator: true
            },
            {
                icon: '📝',
                text: 'Copy Markdown',
                action: () => copyToClipboard(markdownText, 'Markdown')
            }
        ];

        // Build dropdown items
        items.forEach((item, index) => {
            if (item.separator) {
                const sep = document.createElement('div');
                sep.className = 'table-dropdown-separator';
                dropdown.appendChild(sep);
            } else {
                const menuItem = document.createElement('button');
                menuItem.className = 'table-dropdown-item';
                menuItem.setAttribute('role', 'menuitem');
                menuItem.setAttribute('tabindex', '-1');

                menuItem.innerHTML = '<span>' + item.icon + '</span>' + item.text;

                menuItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    item.action();
                    closeDropdown();
                });

                dropdown.appendChild(menuItem);
            }
        });

        // Toggle dropdown
        function toggleDropdown(e) {
            e.stopPropagation();
            const isActive = dropdown.classList.contains('active');

            // Close all other dropdowns first
            document.querySelectorAll('.table-dropdown.active').forEach(d => {
                d.classList.remove('active');
            });

            if (!isActive) {
                dropdown.classList.add('active');
                menuBtn.setAttribute('aria-expanded', 'true');
                // Focus first menu item
                const firstItem = dropdown.querySelector('.table-dropdown-item');
                if (firstItem) firstItem.setAttribute('tabindex', '0');
            } else {
                closeDropdown();
            }
        }

        function closeDropdown() {
            dropdown.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            dropdown.querySelectorAll('.table-dropdown-item').forEach(item => {
                item.setAttribute('tabindex', '-1');
            });
        }

        // Copy to clipboard helper
        function copyToClipboard(text, format) {
            navigator.clipboard.writeText(text).then(() => {
                // Visual feedback
                const originalText = menuBtn.innerHTML;
                menuBtn.innerHTML = '✓';
                menuBtn.style.color = 'var(--primary)';

                setTimeout(() => {
                    menuBtn.innerHTML = originalText;
                    menuBtn.style.color = '';
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }

        // Event listeners
        menuBtn.addEventListener('click', toggleDropdown);

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                closeDropdown();
            }
        });

        // Keyboard navigation
        dropdown.addEventListener('keydown', (e) => {
            const items = Array.from(dropdown.querySelectorAll('.table-dropdown-item'));
            const currentIndex = items.findIndex(item => item === document.activeElement);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                items[prevIndex].focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeDropdown();
                menuBtn.focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (document.activeElement.classList.contains('table-dropdown-item')) {
                    document.activeElement.click();
                }
            }
        });

        // Append to wrapper
        wrapper.appendChild(menuBtn);
        wrapper.appendChild(dropdown);
    }

    // Helper function to extract table as plain text
    function extractTableAsPlainText(table) {
        let text = '';
        const NEWLINE = String.fromCharCode(10);

        // Extract headers
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        if (headers.length > 0) {
            text += headers.join('  ') + NEWLINE;
            text += headers.map(() => '---').join('  ') + NEWLINE;
        }

        // Extract rows
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
            text += cells.join('  ') + NEWLINE;
        });

        return text;
    }

    function addCopyButton(parent, textToCopy) {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.innerText = 'Copy';

        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(textToCopy).then(() => {
                btn.innerText = 'Copied!';
                setTimeout(() => btn.innerText = 'Copy', 2000);
            });
        });

        parent.appendChild(btn);
    }
    // Helper function to convert HTML table to markdown
    function extractTableAsMarkdown(table) {
        let markdown = '';

        // Extract headers
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
        if (headers.length > 0) {
            markdown += '| ' + headers.join(' | ') + ' |' + String.fromCharCode(10);
            markdown += '|' + headers.map(() => '---').join('|') + '|' + String.fromCharCode(10);
        }

        // Extract rows
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
            markdown += '| ' + cells.join(' | ') + ' |' + String.fromCharCode(10);
        });

        return markdown;
    }

// Helper function to convert HTML table to TSV (for Excel)
function extractTableAsTSV(table) {
    let tsv = '';
    const TAB = String.fromCharCode(9);
    const NEWLINE = String.fromCharCode(10);

    // Extract headers
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    if (headers.length > 0) {
        tsv += headers.join(TAB) + NEWLINE;
    }

    // Extract rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
        tsv += cells.join(TAB) + NEWLINE;
    });

    return tsv;
}

});

    </script>
</body>
</html>`;
    }

    function generateTOCHTML(conversation) {
        let html = '<ul>\n';
        let currentQ = 0;

        const userMsgs = conversation.filter(function(msg) {
            return msg.type === 'user';
        });

        for (let i = 0; i < userMsgs.length; i++) {
            const msg = userMsgs[i];
            currentQ++;

            const truncated = truncateTitle(msg.content, 60);
            html += '<li><a href="#Q' + currentQ + '" class="toc-q">Q' + currentQ + ': ' + escapeHtml(truncated) + '</a></li>\n';

            // Find H2 headers in next answer
            const nextAnswerIdx = conversation.findIndex(function(m, idx) {
                return idx > conversation.indexOf(msg) && m.type === 'assistant';
            });

            if (nextAnswerIdx !== -1) {
                const nextAnswer = conversation[nextAnswerIdx];
                const headers = extractH2Headers(nextAnswer.content);

                for (let j = 0; j < headers.length; j++) {
                    const headerId = slugify(headers[j]);
                    html += '<li><a href="#' + headerId + '" class="toc-h2">' + escapeHtml(headers[j]) + '</a></li>\n';
                }
            }
        }

        html += '</ul>';
        return html;
    }

function extractH2Headers(markdown) {
    const headers = [];
    const lines = markdown.split('\n');
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Toggle code block state when encountering triple backticks
        if (trimmedLine.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }

        // Skip if we're inside a code block
        if (inCodeBlock) {
            continue;
        }

        // Skip if line is a blockquote (starts with >)
        if (trimmedLine.startsWith('>')) {
            continue;
        }

        // Extract H2 headers (must start with exactly "## ")
        if (trimmedLine.startsWith('## ')) {
            const headerText = trimmedLine.replace('## ', '').trim();
            headers.push(headerText);
        }
    }

    return headers;
}


    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // =============================================
    // OVERLAY
    // =============================================
    function showOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'brave-export-overlay';
        overlay.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); z-index: 999999; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; color: white;">
                    <div style="font-size: 60px; margin-bottom: 40px;">⏳</div>
                    <div id="overlay-message" style="font-size: 24px; font-weight: 600;">Processing...</div>
                    <div style="font-size: 14px; margin-top: 12px; opacity: 0.7;">Please do not interact with the page</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    function updateOverlay(message) {
        const msgEl = document.getElementById('overlay-message');
        if (msgEl) {
            msgEl.textContent = message;
        }
    }

    function hideOverlay() {
        const overlay = document.getElementById('brave-export-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // =============================================
    // UTILITIES
    // =============================================
    function sleep(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }

    function truncateTitle(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength).trim() + '...';
    }

    function sanitizeFilename(filename) {
        return filename.replace(/[?<>:*|"]/g, '').substring(0, 200);
    }

    function formatDate(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        const dayName = days[date.getDay()];
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return dayName + ' ' + day + '-' + month + '-' + year + ' , ' + String(hours).padStart(2, '0') + ':' + minutes + ' ' + ampm;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // =============================================
    // INITIALIZE
    // =============================================
    // Inject dialog CSS into page
function injectDialogCSS() {
    const style = document.createElement('style');
    style.textContent = `
/* --- EXPORT DIALOG DARK MODE SUPPORT --- */
.export-dialog-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  backdrop-filter: blur(4px);
}

.export-dialog-content {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  border: 1px solid #e2e8f0;
}

.export-dialog-content h2 {
  margin: 0 0 25px 0;
  font-size: 24px;
  color: #0f172a;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 15px;
}

.export-dialog-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #0f172a;
  font-size: 14px;
}

.export-dialog-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: Inter, system-ui, sans-serif;
  background: #f8fafc;
  color: #0f172a;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.export-dialog-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.export-dialog-checkboxes {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.export-dialog-checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #0f172a;
  font-size: 14px;
}

.export-dialog-checkbox-label input[type="checkbox"] {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #4f46e5;
}

.export-dialog-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  transition: color 0.2s ease;
}

.export-dialog-link:hover {
  color: #4338ca;
  text-decoration: underline;
}

.export-dialog-buttons {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.export-dialog-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: Inter, system-ui, sans-serif;
}

.export-dialog-btn-cancel {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.export-dialog-btn-cancel:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.export-dialog-btn-download {
  background: #4f46e5;
  color: white;
}

.export-dialog-btn-download:hover {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .export-dialog-wrapper {
    background: rgba(0, 0, 0, 0.85);
  }

  .export-dialog-content {
    background: #1e293b;
    border-color: #334155;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  }

  .export-dialog-content h2 {
    color: #f1f5f9;
    border-bottom-color: #334155;
  }

  .export-dialog-label {
    color: #f1f5f9;
  }

  .export-dialog-input {
    background: #0f172a;
    color: #f1f5f9;
    border-color: #334155;
  }

  .export-dialog-checkbox-label {
    color: #f1f5f9;
  }

  .export-dialog-link {
    color: #818cf8;
  }

  .export-dialog-link:hover {
    color: #6366f1;
  }

  .export-dialog-btn-cancel {
    background: #0f172a;
    color: #cbd5e1;
    border-color: #334155;
  }

  .export-dialog-btn-cancel:hover {
    background: #334155;
    color: #f1f5f9;
  }

  .export-dialog-btn-download {
    background: #818cf8;
  }

  .export-dialog-btn-download:hover {
    background: #6366f1;
  }
}
    `;
    document.head.appendChild(style);
}


    function init() {
        // Inject dialog CSS first
        injectDialogCSS();

        // Wait for page to fully load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createExportButton);
        } else {
            createExportButton();
        }
    }

    init();

})();
