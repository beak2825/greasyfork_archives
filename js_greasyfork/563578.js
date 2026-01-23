// ==UserScript==
// @name         NutritionFacts | Markdown Transcript/Comments Export
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      2.5
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Export video transcripts and Disqus comments as Markdown. Click to copy, Shift+Click to download, Hold+Drag to drag text.
// @match        *://nutritionfacts.org/video/*
// @match        *://disqus.com/embed/comments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nutritionfacts.org
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563578/NutritionFacts%20%7C%20Markdown%20TranscriptComments%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/563578/NutritionFacts%20%7C%20Markdown%20TranscriptComments%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //================================================================================
    // CONFIGURATION
    //================================================================================
    const TRANSCRIPT_SELECTOR = '#transcript[role="tabpanel"]';

    // UI Styling
    const CONFIG_NF = {
        PANEL_WIDTH: 240,
        PANEL_MIN_SIZE: 48,
        STORAGE_KEY: 'nf_panel_pos_v1',
        MINIMIZED_KEY: 'nf_panel_minimized_v1'
    };

    const BUTTON_STYLE = `
        background: linear-gradient(135deg, #00b1b3 0%, #008f91 100%);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 177, 179, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        position: relative;
        overflow: hidden;
    `;

    // Hold duration threshold for drag mode (milliseconds)
    const HOLD_THRESHOLD = 300;

    const DRAG_STYLES = `
        #nf-tools-panel {
            user-select: none;
        }
        .nf-btn {
            -webkit-user-drag: element;
            -webkit-user-select: none;
            user-select: none;
            -moz-user-select: none;
            touch-action: none;
        }
        .nf-btn * {
            pointer-events: none !important;
            -webkit-user-drag: none !important;
        }
        .nf-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
            opacity: 0;
            transition: opacity 0.25s ease;
        }
        .nf-btn:hover::before {
            opacity: 1;
        }
        .nf-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(0, 177, 179, 0.35), 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        .nf-btn.holding {
            transform: scale(0.95);
            box-shadow: 0 1px 4px rgba(0, 177, 179, 0.2);
        }
        .nf-btn.dragging {
            opacity: 0.6 !important;
            cursor: grabbing;
        }
        .nf-btn-icon {
            width: 16px;
            height: 16px;
            flex-shrink: 0;
        }
        .nf-btn-text {
            flex: 1;
            text-align: center;
            letter-spacing: 0.02em;
        }
        .nf-tooltip {
            position: absolute;
            left: 50%;
            bottom: calc(100% + 8px);
            transform: translateX(-50%);
            background: rgba(30, 30, 30, 0.95);
            color: #fff;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
        .nf-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: rgba(30, 30, 30, 0.95);
        }
        .nf-btn:hover .nf-tooltip {
            opacity: 1;
            visibility: visible;
            bottom: calc(100% + 12px);
        }
        .nf-btn.copied {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        }
        .nf-btn.failed {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
        .nf-minimize-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            cursor: pointer;
            font-size: 16px;
            color: #666;
            line-height: 1;
            font-weight: bold;
            padding: 2px 6px;
            transition: color 0.2s;
            z-index: 1;
        }
        .nf-minimize-btn:hover {
            color: #00b1b3;
        }
        .nf-minimized-icon {
            font-size: 24px;
            pointer-events: none;
        }
        .nf-help-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #2d2d44;
            color: #888;
            font-size: 10px;
            font-weight: 600;
            cursor: help;
            margin-left: 6px;
            transition: all 0.2s;
            position: relative;
        }
        .nf-help-icon:hover {
            background: #00b1b3;
            color: #fff;
        }
        .nf-help-tooltip {
            position: fixed;
            background: rgba(20, 20, 20, 0.98);
            color: #fff;
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 400;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, visibility 0.2s ease;
            pointer-events: none;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
            z-index: 100000;
            border: 1px solid #333;
        }
        .nf-help-tooltip.visible {
            opacity: 1;
            visibility: visible;
        }
        .nf-drag-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 99998;
            cursor: grabbing;
            background: transparent;
        }
        .nf-help-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 3px 0;
        }
        .nf-help-row:not(:last-child) {
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
            margin-bottom: 2px;
        }
        .nf-help-action {
            color: #00b1b3;
            font-weight: 600;
            min-width: 80px;
        }
        .nf-help-desc {
            color: #ccc;
        }
    `;

    //================================================================================
    // HELPER FUNCTIONS: TEXT PROCESSING
    //================================================================================

    /**
     * Sanitizes a string for use as a filename
     * @param {string} name - The raw filename
     * @returns {string} - Safe filename
     */
    function sanitizeFilename(name) {
        let sanitized = name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
        sanitized = sanitized.replace(/_+/g, '_');
        sanitized = sanitized.replace(/^_+|_+$/g, '').trim();
        sanitized = sanitized.substring(0, 180);
        return sanitized || 'nutritionfacts_export';
    }

    /**
     * Downloads content as a Markdown file
     * @param {string} content - The text content to download
     * @param {string} filenameHint - Hint for the filename (e.g., 'transcript', 'comments', 'both')
     */
    function downloadAsMarkdown(content, filenameHint) {
        if (!content) return false;

        const pageTitle = document.title.replace('| NutritionFacts.org', '').trim();
        const filename = sanitizeFilename(`${pageTitle}_${filenameHint}`) + '.md';

        try {
            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error('Download failed:', error);
            return false;
        }
    }

    /**
     * Converts HTML string to clean text, preserving line breaks.
     * @param {string} html - The HTML string
     * @returns {string} - Clean plain text
     */
    function cleanHtmlToText(html) {
        if (!html) return "";

        // Replace block tags with newlines
        let text = html.replace(/<br\s*\/?>/gi, '\n');
        text = text.replace(/<\/p>/gi, '\n\n');
        text = text.replace(/<\/div>/gi, '\n');

        // Strip remaining tags
        const tempEl = document.createElement("div");
        tempEl.innerHTML = text;

        let cleanText = tempEl.textContent || tempEl.innerText || "";

        // Normalize newlines (max 2 consecutive)
        return cleanText.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
    }

    /**
     * Recursive function to format replies as nested Markdown lists
     * @param {Array} posts - Full list of posts
     * @param {string} parentId - The ID of the parent post
     * @param {number} depth - Current nesting depth
     * @returns {string} - Formatted markdown string
     */
    function formatReplies(posts, parentId, depth) {
        const children = posts.filter(p => p.parent == parentId);
        children.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        let output = "";

        children.forEach(post => {
            // Markdown indentation: 4 spaces per level for standard nesting
            const indent = "    ".repeat(depth);
            const author = post.author.name;
            const date = new Date(post.createdAt).toLocaleDateString();
            const body = cleanHtmlToText(post.message);

            // To keep body text inside the bullet list in Markdown,
            // it needs to be indented to align with the text start, not the bullet.
            // Bullet is "- " (2 chars), so add 2 spaces to the base indent.
            const bodyIndent = indent + "  ";
            const indentedBody = body.split('\n').map(line => bodyIndent + line).join('\n');

            output += `\n${indent}- **${author}** [${date}]\n`;
            output += `${indentedBody}\n`;

            output += formatReplies(posts, post.id, depth + 1);
        });

        return output;
    }

    /**
     * Main function to structure the output in Markdown
     * @param {Object} data - Disqus JSON data
     * @returns {string} - Markdown string
     */
    function generateFormattedOutput(data) {
        const posts = data.response.posts;
        const threadTitle = data.response.thread.title || "Unknown Title";
        const threadLink = data.response.thread.link || data.response.thread.url || "";
        const count = posts.length;
        const now = new Date().toLocaleString();

        // Markdown Header
        let output = `# ${threadTitle}\n`;
        output += `- **Link:** [View Video](${threadLink})\n`;
        output += `- **Date:** ${now}\n`;
        output += `- **Comments:** ${count}\n\n`;
        output += `---\n\n`; // Horizontal Rule

        if (count === 0) return output + "_No comments found._";

        // Process Root Comments
        const roots = posts.filter(p => p.parent === null);

        // Sort roots by Oldest First
        roots.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        roots.forEach((root, index) => {
            const author = root.author.name;
            const date = new Date(root.createdAt).toLocaleDateString();
            const body = cleanHtmlToText(root.message);

            // Indent body for the numbered list (3 spaces aligns with "1. ")
            const bodyIndent = "   ";
            const indentedBody = body.split('\n').map(line => bodyIndent + line).join('\n');

            // Numbered List for roots
            output += `${index + 1}. **${author}** [${date}]\n`;
            output += `${indentedBody}\n`;

            // Process Replies (Depth 1)
            output += formatReplies(posts, root.id, 1);

            // Spacing between root threads
            output += `\n`;
        });

        return output;
    }

    //================================================================================
    // HELPER FUNCTIONS: CLIPBOARD & UI
    //================================================================================

    async function copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const result = document.execCommand('copy');
            textArea.remove();
            return result;
        } catch (error) {
            console.error('Copy failed', error);
            return false;
        }
    }

    /**
     * Updates button appearance to show success/failure feedback
     * @param {HTMLElement} button - The button element
     * @param {boolean} success - Whether the action succeeded
     * @param {string} originalIcon - Original icon HTML to restore
     * @param {string} originalText - Original button text to restore
     * @param {string} successMsg - Message to show on success (default: 'Copied!')
     * @param {string} failMsg - Message to show on failure (default: 'Failed')
     */
    function updateButtonFeedback(button, success, originalIcon, originalText, successMsg = 'Copied!', failMsg = 'Failed') {
        const iconEl = button.querySelector('.nf-btn-icon');
        const textEl = button.querySelector('.nf-btn-text');

        button.classList.add(success ? 'copied' : 'failed');
        button.style.pointerEvents = 'none';

        if (iconEl) {
            iconEl.innerHTML = success
                ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        }

        if (textEl) {
            textEl.textContent = success ? successMsg : failMsg;
        }

        setTimeout(() => {
            button.classList.remove('copied', 'failed');
            button.style.pointerEvents = 'auto';
            if (iconEl) iconEl.innerHTML = originalIcon;
            if (textEl) textEl.textContent = originalText;
        }, 2000);
    }

    /**
     * Extracts transcript content synchronously for drag operations
     * @returns {string|null} - Formatted transcript text or null
     */
    function getTranscriptContent() {
        const transcriptEl = document.querySelector(TRANSCRIPT_SELECTOR);
        if (!transcriptEl) return null;

        const cloned = transcriptEl.cloneNode(true);
        const firstPara = cloned.querySelector('p i');
        if (firstPara && firstPara.textContent.includes('approximation')) {
            firstPara.parentElement.remove();
        }

        const pageTitle = document.title.replace('| NutritionFacts.org', '').trim();
        const url = window.location.href;

        let text = `# ${pageTitle}\n- **Link:** ${url}\n\n---\n\n`;

        cloned.querySelectorAll('p').forEach(p => {
            if (p.innerHTML.includes('volunteering') || p.innerHTML.includes('help out')) return;
            let paraText = p.textContent.trim().replace(/\s+/g, ' ');
            if (paraText) text += paraText + '\n\n';
        });

        return text.trim();
    }

    /**
     * Injects CSS styles for drag functionality
     */
    function injectDragStyles() {
        if (document.getElementById('nf-drag-styles')) return;
        const style = document.createElement('style');
        style.id = 'nf-drag-styles';
        style.textContent = DRAG_STYLES;
        document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // UI MANAGER - Panel positioning & minimize
    // ═══════════════════════════════════════════════════════════════════════
    const UIManager = {
        panel: null,
        isDragging: false,
        isMinimized: false,
        anchorBottom: false,

        loadPosition(el) {
            try {
                const saved = GM_getValue(CONFIG_NF.STORAGE_KEY, null);
                if (saved) {
                    const { ratioX, ratioY, anchorBottom } = saved;
                    this.anchorBottom = anchorBottom || false;
                    this.setPositionFromRatio(el, ratioX, ratioY);
                    return;
                }
            } catch {}
            // Default position: top-left
            this.anchorBottom = false;
            this.setPositionFromRatio(el, 0.02, 0.02);
        },

        setPositionFromRatio(el, ratioX, ratioY) {
            const width = this.isMinimized ? CONFIG_NF.PANEL_MIN_SIZE : CONFIG_NF.PANEL_WIDTH;
            const maxX = window.innerWidth - width - 10;
            const x = Math.max(10, Math.min(maxX, ratioX * window.innerWidth));

            el.style.left = `${x}px`;
            el.style.right = 'auto';

            if (this.anchorBottom) {
                const bottomOffset = Math.max(10, ratioY * window.innerHeight);
                el.style.bottom = `${bottomOffset}px`;
                el.style.top = 'auto';
            } else {
                const topOffset = Math.max(10, ratioY * window.innerHeight);
                el.style.top = `${topOffset}px`;
                el.style.bottom = 'auto';
            }
        },

        applyRatioPosition() {
            if (!this.panel) return;
            try {
                const data = GM_getValue(CONFIG_NF.STORAGE_KEY, null);
                if (data) {
                    this.anchorBottom = data.anchorBottom === true;

                    const width = this.isMinimized ? CONFIG_NF.PANEL_MIN_SIZE : CONFIG_NF.PANEL_WIDTH;
                    const height = this.panel.offsetHeight || CONFIG_NF.PANEL_MIN_SIZE;

                    const maxX = window.innerWidth - width - 10;
                    const x = Math.max(10, Math.min(maxX, data.ratioX * window.innerWidth));

                    this.panel.style.left = `${x}px`;
                    this.panel.style.right = 'auto';

                    if (this.anchorBottom) {
                        const maxBottom = Math.max(10, window.innerHeight - height - 10);
                        const bottomOffset = Math.max(10, Math.min(maxBottom, data.ratioY * window.innerHeight));
                        this.panel.style.bottom = `${bottomOffset}px`;
                        this.panel.style.top = 'auto';
                    } else {
                        const maxTop = Math.max(10, window.innerHeight - height - 10);
                        const topOffset = Math.max(10, Math.min(maxTop, data.ratioY * window.innerHeight));
                        this.panel.style.top = `${topOffset}px`;
                        this.panel.style.bottom = 'auto';
                    }
                }
            } catch {}
        },

        savePositionAsRatio(x, y) {
            const rect = this.panel.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            this.anchorBottom = centerY > window.innerHeight / 2;

            const ratioX = x / window.innerWidth;
            const ratioY = this.anchorBottom
                ? (window.innerHeight - rect.bottom) / window.innerHeight
                : y / window.innerHeight;

            try {
                GM_setValue(CONFIG_NF.STORAGE_KEY, {
                    ratioX: Math.max(0, Math.min(1, ratioX)),
                    ratioY: Math.max(0, Math.min(1, ratioY)),
                    anchorBottom: this.anchorBottom
                });
            } catch {}
        },

        startDrag(e, el) {
            if (e.button !== 2) return;
            e.preventDefault();

            this.isDragging = true;
            const rect = el.getBoundingClientRect();
            const offX = e.clientX - rect.left;
            const offY = e.clientY - rect.top;

            // Create full-screen overlay to capture all pointer events during drag
            const overlay = document.createElement('div');
            overlay.className = 'nf-drag-overlay';
            document.body.appendChild(overlay);

            const onMove = (ev) => {
                ev.preventDefault();
                ev.stopPropagation();

                const width = this.isMinimized ? CONFIG_NF.PANEL_MIN_SIZE : CONFIG_NF.PANEL_WIDTH;
                const height = this.isMinimized ? CONFIG_NF.PANEL_MIN_SIZE : el.offsetHeight;
                const maxX = window.innerWidth - width - 10;
                const maxY = window.innerHeight - height - 10;

                const x = Math.max(10, Math.min(maxX, ev.clientX - offX));
                const y = Math.max(10, Math.min(maxY, ev.clientY - offY));

                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
                el.style.bottom = 'auto';
                el.style.right = 'auto';
            };

            const onUp = (ev) => {
                ev.preventDefault();
                ev.stopPropagation();

                // Remove overlay
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }

                document.removeEventListener('mousemove', onMove, true);
                document.removeEventListener('mouseup', onUp, true);

                const finalRect = el.getBoundingClientRect();
                this.savePositionAsRatio(finalRect.left, finalRect.top);
                this.applyRatioPosition();

                setTimeout(() => { this.isDragging = false; }, 50);
            };

            document.addEventListener('mousemove', onMove, true);
            document.addEventListener('mouseup', onUp, true);
        },

        loadMinimizedState() {
            try {
                return GM_getValue(CONFIG_NF.MINIMIZED_KEY, false);
            } catch { return false; }
        },

        saveMinimizedState(minimized) {
            try {
                GM_setValue(CONFIG_NF.MINIMIZED_KEY, minimized);
            } catch {}
        },

        toggleMinimize() {
            this.isMinimized = !this.isMinimized;
            this.saveMinimizedState(this.isMinimized);
            this.updateMinimizedUI();
        },

        updateMinimizedUI() {
            if (!this.panel) return;

            const header = this.panel.querySelector('.nf-panel-header');
            const content = this.panel.querySelector('.nf-panel-content');
            const minimizeBtn = this.panel.querySelector('.nf-minimize-btn');

            if (this.isMinimized) {
                this.panel.style.width = `${CONFIG_NF.PANEL_MIN_SIZE}px`;
                this.panel.style.height = `${CONFIG_NF.PANEL_MIN_SIZE}px`;
                this.panel.style.padding = '0';
                this.panel.style.borderRadius = '50%';
                this.panel.style.cursor = 'pointer';
                this.panel.title = 'Click to expand • Right-click drag to move';

                if (header) header.style.display = 'none';
                if (content) content.style.display = 'none';
                if (minimizeBtn) minimizeBtn.style.display = 'none';

                let icon = this.panel.querySelector('.nf-minimized-icon');
                if (!icon) {
                    icon = document.createElement('div');
                    icon.className = 'nf-minimized-icon';
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
                    icon.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                        color: #00b1b3;
                    `;
                    this.panel.appendChild(icon);
                }
                icon.style.display = 'flex';

            } else {
                this.panel.style.width = `${CONFIG_NF.PANEL_WIDTH}px`;
                this.panel.style.height = 'auto';
                this.panel.style.padding = '12px';
                this.panel.style.borderRadius = '8px';
                this.panel.style.cursor = '';
                this.panel.title = '';

                if (header) header.style.display = 'block';
                if (content) content.style.display = 'flex';
                if (minimizeBtn) minimizeBtn.style.display = 'block';

                const icon = this.panel.querySelector('.nf-minimized-icon');
                if (icon) icon.style.display = 'none';
            }

            this.applyRatioPosition();
        }
    };

    /**
     * Sets up drag & click behavior on a button
     * Hold + drag to drag text, quick click to copy, Shift+click to download
     * @param {HTMLElement} btn - The button element
     * @param {Function} getData - Function that returns content for drag/copy/download
     * @param {Function} onCopy - Async function to handle copy action
     * @param {string} buttonLabel - Original button text (also used as download filename hint)
     */
    function setupDragAndClick(btn, getData, onCopy, buttonLabel) {
        let mouseDownTime = 0;
        let dragDidStart = false;
        let holdTimer = null;

        const cleanup = () => {
            clearTimeout(holdTimer);
            holdTimer = null;
            btn.classList.remove('holding');
        };

        btn.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;

            mouseDownTime = Date.now();
            dragDidStart = false;

            holdTimer = setTimeout(() => {
                btn.classList.add('holding');
            }, HOLD_THRESHOLD * 0.6);
        });

        btn.addEventListener('dragstart', (e) => {
            const holdDuration = Date.now() - mouseDownTime;

            if (holdDuration < HOLD_THRESHOLD) {
                e.preventDefault();
                cleanup();
                return;
            }

            const content = getData();

            if (!content) {
                e.preventDefault();
                cleanup();
                return;
            }

            e.dataTransfer.setData('text/plain', content);
            e.dataTransfer.effectAllowed = 'copyMove';

            // Create drag image
            const dragImage = document.createElement('div');
            const preview = content.length > 50 ? content.substring(0, 47) + '...' : content;
            dragImage.textContent = `📄 ${preview}`;
            dragImage.style.cssText = `
                position: absolute;
                left: -9999px;
                top: -9999px;
                padding: 8px 12px;
                background: rgba(0, 177, 179, 0.95);
                color: #fff;
                border-radius: 6px;
                font-size: 12px;
                font-family: system-ui, sans-serif;
                max-width: 300px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 99999;
            `;
            document.body.appendChild(dragImage);

            try {
                e.dataTransfer.setDragImage(dragImage, 10, 10);
            } catch (err) {
                // Fallback - some browsers don't support setDragImage
            }

            requestAnimationFrame(() => dragImage.remove());

            dragDidStart = true;
            cleanup();
            btn.classList.add('dragging');
        });

        btn.addEventListener('dragend', () => {
            btn.classList.remove('dragging');
            setTimeout(() => {
                dragDidStart = false;
            }, 50);
        });

        btn.addEventListener('mouseup', () => {
            cleanup();
        });

        btn.addEventListener('mouseleave', () => {
            cleanup();
        });

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            cleanup();

            const holdDuration = Date.now() - mouseDownTime;

            if (dragDidStart) return;
            if (holdDuration >= HOLD_THRESHOLD) return;

            // Shift+Click: Download as Markdown file
            if (e.shiftKey) {
                const content = getData();
                if (!content || content.includes('loading') || content.includes('not available')) {
                    const iconEl = btn.querySelector('.nf-btn-icon');
                    const originalIcon = iconEl ? iconEl.innerHTML : '';
                    updateButtonFeedback(btn, false, originalIcon, buttonLabel, 'Downloaded!', 'Failed');
                    return;
                }
                const success = downloadAsMarkdown(content, buttonLabel.toLowerCase());
                const iconEl = btn.querySelector('.nf-btn-icon');
                const originalIcon = iconEl ? iconEl.innerHTML : '';
                updateButtonFeedback(btn, success, originalIcon, buttonLabel, 'Downloaded!', 'Failed');
                return;
            }

            await onCopy();
        });
    }

    //================================================================================
    // CONTEXT 1: DISQUS IFRAME
    //================================================================================
    function initDisqusContext() {
        window.addEventListener('message', function(event) {
            if (event.data !== 'NF_REQUEST_COMMENTS') return;

            try {
                const jsonScript = document.getElementById('disqus-threadData');
                let resultText = "";

                if (jsonScript) {
                    const data = JSON.parse(jsonScript.textContent);
                    resultText = generateFormattedOutput(data);
                } else {
                    resultText = "Error: Could not access comment data.";
                }

                window.parent.postMessage({
                    type: 'NF_RETURN_COMMENTS',
                    payload: resultText
                }, '*');

            } catch (e) {
                console.error("Extraction error", e);
                window.parent.postMessage({
                    type: 'NF_RETURN_COMMENTS',
                    payload: "Error extracting comments: " + e.message
                }, '*');
            }
        });
    }

    //================================================================================
    // CONTEXT 2: MAIN PAGE
    //================================================================================
    function initMainPageContext() {
        if (document.querySelector('#nf-tools-panel')) return;

        injectDragStyles();

        let cachedCommentsData = null;
        let pendingRequestSource = null;

        // Create panel container
        const panel = document.createElement('div');
        panel.id = 'nf-tools-panel';
        panel.style.cssText = `
            position: fixed;
            z-index: 99999;
            background: #1a1a2e;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            width: ${CONFIG_NF.PANEL_WIDTH}px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            border: 1px solid #2d2d44;
        `;

        UIManager.panel = panel;
        UIManager.isMinimized = UIManager.loadMinimizedState();
        UIManager.loadPosition(panel);

        // Header
        const header = document.createElement('div');
        header.className = 'nf-panel-header';
        header.style.cssText = `
            position: relative;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #2d2d44;
        `;

        // Title row with help icon
        const titleRow = document.createElement('div');
        titleRow.style.cssText = `
            display: flex;
            align-items: center;
            padding-right: 24px;
        `;

        const title = document.createElement('div');
        title.textContent = 'Markdown Export';
        title.style.cssText = `
            font-weight: 600;
            color: #00b1b3;
            font-size: 13px;
        `;

        // Help icon with tooltip
        const helpIcon = document.createElement('span');
        helpIcon.className = 'nf-help-icon';
        helpIcon.textContent = '?';

        const helpTooltip = document.createElement('div');
        helpTooltip.className = 'nf-help-tooltip';

        const helpRows = [
            ['Click', 'Copy to clipboard'],
            ['Shift+Click', 'Download as .md file'],
            ['Hold+Drag', 'Drag text to another app'],
            ['Right-Drag', 'Reposition panel']
        ];

        helpRows.forEach(([action, desc]) => {
            const row = document.createElement('div');
            row.className = 'nf-help-row';

            const actionSpan = document.createElement('span');
            actionSpan.className = 'nf-help-action';
            actionSpan.textContent = action;

            const descSpan = document.createElement('span');
            descSpan.className = 'nf-help-desc';
            descSpan.textContent = desc;

            row.appendChild(actionSpan);
            row.appendChild(descSpan);
            helpTooltip.appendChild(row);
        });

        // Append tooltip to body for proper fixed positioning
        document.body.appendChild(helpTooltip);

        /**
         * Positions tooltip dynamically to stay within viewport
         * Avoids mouse pointer with configurable margin
         */
        function positionHelpTooltip() {
            const iconRect = helpIcon.getBoundingClientRect();
            const tooltipRect = helpTooltip.getBoundingClientRect();
            const margin = 12; // Distance from icon
            const edgePadding = 8; // Minimum distance from viewport edge
            const pointerMargin = 20; // Extra space to avoid cursor

            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const tw = tooltipRect.width || 200; // Fallback width estimate
            const th = tooltipRect.height || 100; // Fallback height estimate

            let left, top;

            // Horizontal positioning: prefer right, fall back to left
            const spaceRight = vw - iconRect.right - margin - edgePadding;
            const spaceLeft = iconRect.left - margin - edgePadding;

            if (spaceRight >= tw) {
                // Position to the right
                left = iconRect.right + margin;
            } else if (spaceLeft >= tw) {
                // Position to the left
                left = iconRect.left - margin - tw;
            } else {
                // Center horizontally, position above/below
                left = Math.max(edgePadding, Math.min(vw - tw - edgePadding, iconRect.left + iconRect.width / 2 - tw / 2));
            }

            // Vertical positioning: try to center on icon, adjust if needed
            const iconCenterY = iconRect.top + iconRect.height / 2;

            if (spaceRight >= tw || spaceLeft >= tw) {
                // Horizontal placement: center vertically on icon
                top = iconCenterY - th / 2;

                // Clamp to viewport
                if (top < edgePadding) {
                    top = edgePadding;
                } else if (top + th > vh - edgePadding) {
                    top = vh - th - edgePadding;
                }
            } else {
                // Vertical placement: above or below icon
                const spaceAbove = iconRect.top - margin - edgePadding;
                const spaceBelow = vh - iconRect.bottom - margin - edgePadding;

                if (spaceBelow >= th) {
                    top = iconRect.bottom + margin + pointerMargin;
                } else if (spaceAbove >= th) {
                    top = iconRect.top - margin - th;
                } else {
                    top = Math.max(edgePadding, vh - th - edgePadding);
                }
            }

            helpTooltip.style.left = `${Math.round(left)}px`;
            helpTooltip.style.top = `${Math.round(top)}px`;
        }

        let tooltipVisible = false;

        helpIcon.addEventListener('mouseenter', () => {
            tooltipVisible = true;
            positionHelpTooltip();
            helpTooltip.classList.add('visible');
        });

        helpIcon.addEventListener('mouseleave', () => {
            tooltipVisible = false;
            helpTooltip.classList.remove('visible');
        });

        // Reposition on scroll/resize while visible
        window.addEventListener('scroll', () => {
            if (tooltipVisible) positionHelpTooltip();
        }, { passive: true });

        window.addEventListener('resize', () => {
            if (tooltipVisible) positionHelpTooltip();
        }, { passive: true });
        titleRow.appendChild(title);
        titleRow.appendChild(helpIcon);

        const minimizeBtn = document.createElement('span');
        minimizeBtn.className = 'nf-minimize-btn';
        minimizeBtn.textContent = '─';
        minimizeBtn.title = 'Minimize';
        minimizeBtn.onclick = (e) => {
            e.stopPropagation();
            UIManager.toggleMinimize();
        };

        const subtitle = document.createElement('div');
        subtitle.textContent = 'Hover (?) for controls';
        subtitle.style.cssText = `
            font-size: 10px;
            color: #666;
            margin-top: 4px;
        `;

        header.appendChild(titleRow);
        header.appendChild(minimizeBtn);
        header.appendChild(subtitle);

        // Content container
        const content = document.createElement('div');
        content.className = 'nf-panel-content';
        content.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        // --- TRANSCRIPT BUTTON ---
        const transcriptIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>';

        const btnTranscript = document.createElement('div');
        btnTranscript.className = 'nf-btn';
        btnTranscript.setAttribute('role', 'button');
        btnTranscript.setAttribute('tabindex', '0');
        btnTranscript.setAttribute('draggable', 'true');
        btnTranscript.style.cssText = BUTTON_STYLE;
        btnTranscript.innerHTML = `
            <div class="nf-btn-icon">${transcriptIcon}</div>
            <span class="nf-btn-text">Transcript</span>
            <div class="nf-tooltip">Video transcript text</div>
        `;

        setupDragAndClick(
            btnTranscript,
            getTranscriptContent,
            async () => {
                const text = getTranscriptContent();
                if (!text) {
                    updateButtonFeedback(btnTranscript, false, transcriptIcon, 'Transcript');
                    return;
                }
                const success = await copyToClipboard(text);
                updateButtonFeedback(btnTranscript, success, transcriptIcon, 'Transcript');
            },
            'Transcript'
        );

        // --- COMMENTS BUTTON ---
        const commentsIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';

        const btnComments = document.createElement('div');
        btnComments.className = 'nf-btn';
        btnComments.setAttribute('role', 'button');
        btnComments.setAttribute('tabindex', '0');
        btnComments.setAttribute('draggable', 'true');
        btnComments.style.cssText = BUTTON_STYLE;
        btnComments.innerHTML = `
            <div class="nf-btn-icon">${commentsIcon}</div>
            <span class="nf-btn-text">Comments</span>
            <div class="nf-tooltip">Disqus comments with threads</div>
        `;

        // --- BOTH BUTTON ---
        const bothIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 12h4"></path><path d="M10 16h4"></path><circle cx="17" cy="17" r="3"></circle></svg>';

        const btnBoth = document.createElement('div');
        btnBoth.className = 'nf-btn';
        btnBoth.setAttribute('role', 'button');
        btnBoth.setAttribute('tabindex', '0');
        btnBoth.setAttribute('draggable', 'true');
        btnBoth.style.cssText = BUTTON_STYLE;
        btnBoth.innerHTML = `
            <div class="nf-btn-icon">${bothIcon}</div>
            <span class="nf-btn-text">Both</span>
            <div class="nf-tooltip">Transcript + Comments combined</div>
        `;

        // Message handler for comments — caches data immediately for instant drag & drop
        window.addEventListener('message', async (event) => {
            if (event.data && event.data.type === 'NF_RETURN_COMMENTS') {
                const commentsText = event.data.payload;
                const source = pendingRequestSource;
                pendingRequestSource = null;

                if (!commentsText || commentsText.includes("Error")) {
                    console.error(commentsText);
                    const activeBtn = source === 'both' ? btnBoth : btnComments;
                    const activeIcon = source === 'both' ? bothIcon : commentsIcon;
                    const activeName = source === 'both' ? 'Both' : 'Comments';
                    updateButtonFeedback(activeBtn, false, activeIcon, activeName);
                    alert("Could not extract comments. Ensure comments are loaded.");
                    return;
                }

                // Cache data for instant drag & drop
                cachedCommentsData = commentsText;

                // Only perform copy if a click triggered this request
                if (source) {
                    if (source === 'both') {
                        const transcript = getTranscriptContent();
                        if (!transcript) {
                            updateButtonFeedback(btnBoth, false, bothIcon, 'Both');
                            alert("Transcript not available.");
                            return;
                        }
                        const combined = `${transcript}\n\n${'='.repeat(80)}\n\n${commentsText}`;
                        const success = await copyToClipboard(combined);
                        updateButtonFeedback(btnBoth, success, bothIcon, 'Both');
                    } else {
                        const success = await copyToClipboard(commentsText);
                        updateButtonFeedback(btnComments, success, commentsIcon, 'Comments');
                    }
                }
            }
        });

        const requestComments = async (sourceBtn, sourceIcon, sourceName, source) => {
            const disqusFrame = document.querySelector('iframe[src*="disqus.com"]');

            if (!disqusFrame) {
                alert("Please scroll down until the comment section is loaded.");
                updateButtonFeedback(sourceBtn, false, sourceIcon, sourceName);
                return;
            }

            const textEl = sourceBtn.querySelector('.nf-btn-text');
            const iconEl = sourceBtn.querySelector('.nf-btn-icon');
            const spinnerIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><style>@keyframes spin { to { transform: rotate(360deg); } }</style><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>';

            if (textEl) textEl.textContent = 'Loading...';
            if (iconEl) iconEl.innerHTML = spinnerIcon;

            // Track which button triggered this request
            pendingRequestSource = source;
            disqusFrame.contentWindow.postMessage('NF_REQUEST_COMMENTS', '*');

            setTimeout(() => {
                if (textEl && textEl.textContent === 'Loading...') {
                    textEl.textContent = sourceName;
                    if (iconEl) iconEl.innerHTML = sourceIcon;
                }
            }, 3000);
        };

        // Comments button — drag works instantly after first load
        setupDragAndClick(
            btnComments,
            () => cachedCommentsData || "Loading comments… please wait",
            () => requestComments(btnComments, commentsIcon, 'Comments', 'comments'),
            'Comments'
        );

        // Both button — drag works instantly after comments are cached
        setupDragAndClick(
            btnBoth,
            () => {
                const transcript = getTranscriptContent();
                const comments = cachedCommentsData;
                if (!transcript) return "Transcript not available";
                if (!comments) return `${transcript}\n\n⋯ Comments loading ⋯`;
                return `${transcript}\n\n${'='.repeat(80)}\n\n${comments}`;
            },
            async () => {
                const transcript = getTranscriptContent();
                if (!transcript) {
                    updateButtonFeedback(btnBoth, false, bothIcon, 'Both');
                    alert("Could not load transcript.");
                    return;
                }

                if (cachedCommentsData) {
                    const combined = `${transcript}\n\n${'='.repeat(80)}\n\n${cachedCommentsData}`;
                    const success = await copyToClipboard(combined);
                    updateButtonFeedback(btnBoth, success, bothIcon, 'Both');
                } else {
                    await requestComments(btnBoth, bothIcon, 'Both', 'both');
                }
            },
            'Both'
        );

        // Append buttons to content
        content.appendChild(btnTranscript);
        content.appendChild(btnComments);
        content.appendChild(btnBoth);

        // Append header and content to panel
        panel.appendChild(header);
        panel.appendChild(content);

        // Right-click drag handler
        panel.addEventListener('contextmenu', (e) => e.preventDefault());
        panel.addEventListener('mousedown', (e) => {
            if (e.button === 2) {
                UIManager.startDrag(e, panel);
            }
        });

        // Left-click on minimized icon expands
        panel.addEventListener('click', (e) => {
            if (UIManager.isMinimized && e.button === 0 && !UIManager.isDragging) {
                UIManager.toggleMinimize();
            }
        });

        document.body.appendChild(panel);

        if (UIManager.isMinimized) {
            UIManager.updateMinimizedUI();
        }

        window.addEventListener('resize', () => UIManager.applyRatioPosition());
    }

    //================================================================================
    // EXECUTION ROUTER
    //================================================================================
    if (window.location.hostname.includes('disqus.com')) {
        initDisqusContext();
    } else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMainPageContext);
        } else {
            initMainPageContext();
        }
    }

})();