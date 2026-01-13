// ==UserScript==
// @name         ChatGPT-to-Markdown
// @namespace    https://greasyfork.org/users/1552401-chipfin
// @version      0.6.5
// @description  Exports ChatGPT chats to Markdown with Thinking-mode detection.
// @icon         https://chatgpt.com/favicon.ico
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://chatgpt.com/c/*
// @grant        none
// @license      MIT
// @author       Gemini 3 Pro, ChatGPT-5.2
// @downloadURL https://update.greasyfork.org/scripts/562317/ChatGPT-to-Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/562317/ChatGPT-to-Markdown.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ---------------- Utilities ---------------- */

    const trim = s => (s || '').toString().replace(/\r/g, '').trim();

    // Timestamp logic from Gemini2Markdown script
    function getFormattedTimestamp() {
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        const tzo = -now.getTimezoneOffset();
        const dif = tzo >= 0 ? '+' : '-';
        const offHour = pad(Math.floor(Math.abs(tzo) / 60));
        const offMin = pad(Math.abs(tzo) % 60);
        return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}${dif}${offHour}${offMin}`;
    }

    function cleanMarkdown(text) {
        return text
            .replace(/\\(?![\\*_`])/g, '\\\\')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    }

    // Debounce function to prevent freezing the page during load
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /* ---------------- Thinking Detection ---------------- */

    function isThinkingResponse(messageEl) {
        if (!messageEl) return false;

        // Check the element itself (if script selected the message div directly)
        if (messageEl.hasAttribute && messageEl.hasAttribute('data-message-model-slug')) {
            return true;
        }

        // Check children (if script selected the conversation-turn container)
        // Look for the assistant message that has the model-slug attribute
        const thinkingNode = messageEl.querySelector(
            '[data-message-author-role="assistant"][data-message-model-slug]'
        );

        return !!thinkingNode;
    }

    /* ---------------- Message Extraction ---------------- */

    function processMessageContent(element) {
        const clone = element.cloneNode(true);

        // Remove UI buttons
        clone.querySelectorAll('button, svg, [class*="copy"], [class*="edit"], [class*="regenerate"]').forEach(el => el.remove());

        // Process code blocks
        clone.querySelectorAll('pre').forEach(pre => {
            const code = pre.innerText.replace(/\u00A0/g, ' ').trim();
            const codeEl = pre.querySelector('code');
            let lang = '';
            if (codeEl) {
                const m = (codeEl.className || '').match(/language-([a-zA-Z0-9]+)/);
                if (m) lang = m[1];
            }
            const node = document.createTextNode(`\n\n\`\`\`${lang}\n${code}\n\`\`\`\n`);
            pre.parentNode.replaceChild(node, pre);
        });

        // Process images
        clone.querySelectorAll('img, canvas').forEach(el => {
            const alt = el.getAttribute('alt') || '';
            const ph = alt ? `[Image: ${alt}]` : '[Image or Canvas]';
            el.parentNode.replaceChild(document.createTextNode(ph), el);
        });

        // Process links
        clone.querySelectorAll('a[href]').forEach(a => {
            if (a.closest('pre, code')) return;
            const href = a.href;
            if (!href || href.startsWith('#')) return;
            const txt = a.textContent.replace(/\s+/g, ' ').trim() || href;
            const md = `[${txt.replace(/([\[\]\\])/g, '\\$1')}](${href.replace(/\)/g, '%29')})`;
            a.parentNode.replaceChild(document.createTextNode(md), a);
        });

        return cleanMarkdown(trim(clone.innerText));
    }

    function findMessages() {
        // Selectors in priority order.
        // 'div[data-message-author-role]' is often most accurate for individual messages.
        const selectors = [
            'div[data-message-author-role]',
            'article[data-testid*="conversation-turn"]',
            'div[data-testid="conversation-turn"]'
        ];
        let nodes = [];
        for (const s of selectors) {
            const n = document.querySelectorAll(s);
            if (n.length) { nodes = n; break; }
        }
        return Array.from(nodes).filter(n => trim(n.textContent).length > 20);
    }

    function identifySender(el, i) {
        const role = el.getAttribute('data-message-author-role');
        if (role) return role === 'user' ? 'You' : 'ChatGPT';
        return i % 2 === 0 ? 'You' : 'ChatGPT';
    }

    /* ---------------- Export Execution ---------------- */

    async function exportToMarkdown() {
        const msgs = findMessages();
        if (!msgs.length) {
            alert('No messages found. Please ensure the page is fully loaded.');
            return;
        }

        // Manual model input for standard messages (default GPT-5.2)
        let manualModel = prompt('Enter model name (e.g. GPT-5.2):', 'GPT-5.2');
        let baseModel = (manualModel && manualModel.trim()) ? manualModel.trim() : 'unknown';
        let modelSource = (baseModel !== 'unknown') ? 'manual' : 'none';

        const timestamp = getFormattedTimestamp();
        const out = [];
        out.push(`# ${document.title || 'ChatGPT Conversation'}\n`);
        out.push(`**Date:** ${timestamp.split('T')[0]}`);
        out.push(`**Source:** ${location.href}`);
        out.push(`**Base Model (declared):** ${baseModel}`);
        out.push(`**Model Source:** ${modelSource}\n`);
        out.push('---\n');

        msgs.forEach((el, i) => {
            const sender = identifySender(el, i);
            const content = processMessageContent(el);

            if (sender === 'ChatGPT') {
                // Check if this specific response is a "Thinking" response based on DOM attributes
                // Using improved check
                if (isThinkingResponse(el)) {
                    out.push(`####### ChatGPT (Thinking) answers:\n`);
                } else {
                    out.push(`####### ChatGPT (${baseModel}) answers:\n`);
                }
            } else {
                out.push(`####### User writes:\n`);
            }

            out.push(content);
            out.push('\n---\n');
        });

        const blob = new Blob([out.join('\n')], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Gemini-style filename: ChatGPT_Title_Timestamp.md
        const safeTitle = (document.title || 'ChatGPT_Conversation').replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, ' ').trim();
        a.download = `ChatGPT_${safeTitle}_${timestamp}.md`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /* ---------------- UI Setup ---------------- */

    function addMarkdownPill() {
        if (document.querySelector('#export-markdown-pill')) return;

        const candidates = Array.from(document.querySelectorAll('button'))
            .filter(b => {
                const t = trim(b.textContent).toLowerCase();
                return t === 'hanki plus' || t === 'upgrade plus' || t === 'get plus' || t.includes('plus');
            });

        candidates.forEach(plusBtn => {
            const container = plusBtn.closest('.inline-flex');
            if (!container) return;
            if (container.dataset.hasMarkdownExport) return;

            // Clone to preserve responsiveness (hidden lg:block etc)
            const pill = container.cloneNode(true);
            pill.id = '';
            pill.dataset.hasMarkdownExport = 'true';
            container.dataset.hasMarkdownExport = 'true';

            const btn = pill.querySelector('button');
            if (btn) {
                btn.innerHTML = '';
                btn.title = "Export chat as Markdown";

                // Inline SVG
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                svg.setAttribute("width", "18");
                svg.setAttribute("height", "18");
                svg.setAttribute("viewBox", "0 0 208 128");
                svg.setAttribute("fill", "currentColor");

                const originalSvg = plusBtn.querySelector('svg');
                if (originalSvg) {
                    svg.setAttribute("class", originalSvg.getAttribute("class"));
                } else {
                    svg.style.marginRight = "4px";
                }

                const pathBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                pathBox.setAttribute("width", "198");
                pathBox.setAttribute("height", "118");
                pathBox.setAttribute("x", "5");
                pathBox.setAttribute("y", "5");
                pathBox.setAttribute("ry", "10");
                pathBox.setAttribute("stroke", "currentColor");
                pathBox.setAttribute("stroke-width", "10");
                pathBox.setAttribute("fill", "none");

                const pathM = document.createElementNS("http://www.w3.org/2000/svg", "path");
                pathM.setAttribute("d", "M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z");

                svg.appendChild(pathBox);
                svg.appendChild(pathM);

                btn.appendChild(svg);
                btn.appendChild(document.createTextNode(" Markdown"));

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    exportToMarkdown();
                });
            }

            pill.id = 'export-markdown-pill';
            container.parentNode.insertBefore(pill, container.nextSibling);
            pill.style.marginLeft = '4px';
        });
    }

    /* ---------------- Lifecycle ---------------- */

    // Use debounced version to ensure performance
    const debouncedAddPill = debounce(addMarkdownPill, 500);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', debouncedAddPill);
    } else {
        setTimeout(debouncedAddPill, 1000);
    }

    const observer = new MutationObserver((mutations) => {
        if (!document.querySelector('#export-markdown-pill')) {
            debouncedAddPill();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();