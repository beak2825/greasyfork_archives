// ==UserScript==
// @name         Gemini Prompt Renderer
// @namespace    https://github.com/samsilveira/gemini-prompt-renderer
// @version      1.1.0
// @description  Render Markdown in messages sent by users on Gemini Web
// @author       samsilveira
// @match        https://gemini.google.com/*
// @grant        none
// @require      https://update.greasyfork.org/scripts/506699/1684845/marked.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @downloadURL https://update.greasyfork.org/scripts/562919/Gemini%20Prompt%20Renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/562919/Gemini%20Prompt%20Renderer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Trusted Types Configuration
    let trustedTypesPolicy;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            trustedTypesPolicy = window.trustedTypes.createPolicy('gemini-user-md-policy', {
                createHTML: (string) => string
            });
        } catch (e) {}
    }
    // Load libraries (Fallback)
    function loadLibrary(url, callback) {
        if (typeof marked !== 'undefined') {
            callback();
            return;
        }
        var script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }
    // CSS Styles
    const customStyles = `
        /* Light Mode */
        :root {
            --gpr-bg-color: #ffffff;
            --gpr-text-color: #1f1f1f;
            --gpr-border-color: #e0e0e0;
            --gpr-code-bg: #f5f7f9;
            --gpr-code-border: #d0d7de;
            --gpr-table-bg: #ffffff;
            --gpr-table-header: #f6f8fa;
            --gpr-btn-color: #5f6368;
            --gpr-btn-border: rgba(0, 0, 0, 0.1);
            --gpr-btn-hover-bg: rgba(0, 0, 0, 0.05);
            --gpr-btn-hover-text: #202124;
        }

        /* Dark Mode */
        body.gpr-dark-mode {
            --gpr-bg-color: transparent;
            --gpr-text-color: #e3e3e3; 
            --gpr-border-color: #444;
            --gpr-code-bg: #1e1e1e;
            --gpr-code-border: #333;
            --gpr-table-bg: rgba(255, 255, 255, 0.03);
            --gpr-table-header: rgba(255, 255, 255, 0.1);
            --gpr-btn-color: #aaa;
            --gpr-btn-border: rgba(128, 128, 128, 0.3);
            --gpr-btn-hover-bg: rgba(255, 255, 255, 0.1);
            --gpr-btn-hover-text: #fff;
        }

        user-query .query-text {
            position: relative;
            padding-right: 30px;
        }

        /* Toggle Button Style */
        .md-toggle-btn {
            position: absolute;
            top: 6px;
            right: 0px;
            background: transparent;
            border: 1px solid var(--gpr-btn-border);
            border-radius: 4px;
            cursor: pointer;
            padding: 4px;
            color: var(--gpr-btn-color);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            z-index: 10;
            opacity: 0.7;
        }
        .md-toggle-btn:hover {
            opacity: 1;
            background-color: var(--gpr-btn-hover-bg);
            color: var(--gpr-btn-hover-text);
        }
        .md-toggle-btn svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        /* Markdown rendering */
        .custom-markdown-render {
            font-family: 'Google Sans', 'Roboto', sans-serif;
            font-size: 1rem;
            line-height: 1.6;
            color: var(--gpr-text-color);
            width: 100%;
            margin-top: 0;
        }

        body:not(.gpr-dark-mode) .custom-markdown-render { 
            color: #37352f;
        }
        .custom-markdown-render p { 
            margin-bottom: 0.5em; 
        }

        /* Tables */
        .custom-markdown-render table {
            border-collapse: collapse;
            width: 100%;
            margin: 10px 0;
            background-color: var(--gpr-table-bg);
            border-radius: 8px;
            border: 1px solid var(--gpr-border-color);
            overflow: hidden;
        }
        .custom-markdown-render th, .custom-markdown-render td {
            padding: 8px 12px;
            border: 1px solid var(--gpr-border-color);
        }
        .custom-markdown-render th { 
            font-weight: 700; 
            background-color: var(--gpr-table-header); 
        }

        /* Code Blocks */
        .custom-markdown-render pre {
            background-color: var(--gpr-code-bg);
            color: var(--gpr-text-color);
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
            border: 1px solid var(--gpr-code-border);
            margin: 8px 0;
        }

        /* Ensure dark color for code in light mode */
        body:not(.gpr-dark-mode) .custom-markdown-render pre { 
            color: #24292e;
        }

        .custom-markdown-render :not(pre) > code {
            font-family: 'Roboto Mono', monospace;
            background-color: var(--gpr-code-bg);
            padding: 2px 5px;
            border-radius: 4px;
            font-size: 0.9em;
            border: 1px solid var(--gpr-code-border);
            color: var(--gpr-text-color);
        }
    `;
    function injectStyles() {
        if (document.getElementById('gemini-md-styles')) return;
        const style = document.createElement('style');
        style.id = 'gemini-md-styles';
        style.textContent = customStyles;
        document.head.appendChild(style);
    }
    // Secure HTML Functions
    function setHTML(element, htmlString) {
        if (trustedTypesPolicy) {
            element.innerHTML = trustedTypesPolicy.createHTML(htmlString);
        } else {
            element.innerHTML = htmlString;
        }
    }
    function updateTheme() {
        // Optimization: Only run heavy style calculation
        const bgColor = window.getComputedStyle(document.body).backgroundColor;
        const rgb = bgColor.match(/\d+/g);
        let isDark = false;
        if (rgb) {
            const luminance = (0.299 * parseInt(rgb[0]) + 0.587 * parseInt(rgb[1]) + 0.114 * parseInt(rgb[2])) / 255;
            isDark = luminance < 0.5;
        }
        if (isDark && !document.body.classList.contains('gpr-dark-mode')) {
            document.body.classList.add('gpr-dark-mode');
        } else if (!isDark && document.body.classList.contains('gpr-dark-mode')) {
            document.body.classList.remove('gpr-dark-mode');
        }
    }
    const ICON_EYE = `<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
    const ICON_CODE = `<svg viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`;
    // Main Rendering
    function renderUserMessages() {
        const textContainers = document.querySelectorAll('user-query .query-text');
        textContainers.forEach(container => {
            if (container.querySelector('.md-toggle-btn')) return;
            const paragraphs = container.querySelectorAll('.query-text-line');
            let fullRawText = "";
            if (paragraphs.length > 0) {
                fullRawText = Array.from(paragraphs).map(p => p.innerText).join('\n');
            } else {
                fullRawText = container.innerText;
            }
            if (!fullRawText || fullRawText.trim().length === 0) return;
            const renderDiv = document.createElement('div');
            renderDiv.className = 'custom-markdown-render';
            let mdContent = "";
            try {
                const rawHTML = marked.parse(fullRawText, { breaks: true, gfm: true });
                mdContent = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(rawHTML) : rawHTML;
            } catch (e) {
                mdContent = marked.parse(fullRawText, { breaks: true, gfm: true });
            }
            setHTML(renderDiv, mdContent);
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'md-toggle-btn';
            toggleBtn.title = "View Raw Text";
            setHTML(toggleBtn, ICON_CODE);
            let isMarkdownMode = true;
            if (paragraphs.length > 0) paragraphs.forEach(p => p.style.display = 'none');
            if (paragraphs.length === 0) {
                const originalContent = container.innerHTML;
                container.innerHTML = '';
                const rawSpan = document.createElement('span');
                rawSpan.className = 'raw-text-content';
                rawSpan.style.display = 'none';
                rawSpan.innerHTML = originalContent;
                container.appendChild(rawSpan);
            }
            renderDiv.style.display = 'block';
            toggleBtn.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                isMarkdownMode = !isMarkdownMode;
                const rawSpan = container.querySelector('.raw-text-content');
                if (isMarkdownMode) {
                    renderDiv.style.display = 'block';
                    if (paragraphs.length > 0) paragraphs.forEach(p => p.style.display = 'none');
                    if (rawSpan) rawSpan.style.display = 'none';
                    setHTML(toggleBtn, ICON_CODE);
                    toggleBtn.title = "View Raw Text";
                } else {
                    renderDiv.style.display = 'none';
                    if (paragraphs.length > 0) paragraphs.forEach(p => p.style.display = 'block');
                    if (rawSpan) rawSpan.style.display = 'block';
                    setHTML(toggleBtn, ICON_EYE);
                    toggleBtn.title = "View Rendered Markdown";
                }
            };
            container.appendChild(toggleBtn);
            container.appendChild(renderDiv);
        });
    }
    function init() {
        injectStyles();
        if (typeof marked === 'undefined') {
            loadLibrary('https://cdn.jsdelivr.net/npm/marked/marked.min.js', init);
            return;
        }
        renderUserMessages();
        updateTheme(); // Initial theme check
        let timeout = null;
        const observer = new MutationObserver((mutations) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                let shouldRender = false;
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        shouldRender = true;
                        break;
                    }
                }
                // Safe check inside debounce
                updateTheme();
                if (shouldRender) renderUserMessages();
            }, 300);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();