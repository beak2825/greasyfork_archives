// ==UserScript==
// @name         Claude Code Block Collapser v27
// @namespace    claude-code-block-manager
// @version      27
// @description  Collapse code blocks with copy, download, expand/collapse. Clean single-button layout.
// @match        https://claude.ai/*
// @match        https://*.claude.ai/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555216/Claude%20Code%20Block%20Collapser%20v27.user.js
// @updateURL https://update.greasyfork.org/scripts/555216/Claude%20Code%20Block%20Collapser%20v27.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        minCodeLength: 20,
        typingCheckInterval: 300,
        feedbackDuration: 1500
    };

    const processedBlocks = new WeakSet();
    let isTyping = false;

    GM_addStyle(`
        .ccb-wrapper {
            position: relative;
            margin: 4px 0;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
        }
        .dark .ccb-wrapper {
            background: #1f2937;
            border-color: #374151;
        }

        /* Header */
        .ccb-header {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3px 8px;
            background: #f3f4f6;
            cursor: pointer;
            user-select: none;
            gap: 6px;
        }
        .dark .ccb-header {
            background: #374151;
        }

        /* Info - only show when expanded */
        .ccb-info {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0 20px;
        }
        .ccb-wrapper.collapsed .ccb-info { display: none; }

        .ccb-title {
            font-size: 13px;
            font-weight: 600;
            color: #111827;
            padding: 4px 10px;
            border-radius: 5px;
        }
        .dark .ccb-title { color: #f9fafb; }
        
        /* Typing animation */
        @keyframes ccb-pulse {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .ccb-wrapper:not(.done) .ccb-title {
            background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);
            background-size: 200% 100%;
            animation: ccb-pulse 2s ease-in-out infinite;
            color: white;
            font-weight: 700;
        }

        .ccb-lang {
            font-size: 10px;
            color: #6b7280;
            font-weight: 500;
            padding: 2px 8px;
            background: rgba(99,102,241,0.15);
            border-radius: 4px;
            border: 1px solid rgba(99,102,241,0.3);
        }
        .dark .ccb-lang {
            color: #9ca3af;
            background: rgba(99,102,241,0.2);
        }

        /* Buttons */
        .ccb-btn {
            padding: 2px 8px;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 3px;
        }
        .ccb-btn:hover { opacity: 0.9; }
        .ccb-btn.copy { background: #6366f1; }
        .ccb-btn.copy:hover { background: #4f46e5; }
        .ccb-btn.download { background: #10b981; }
        .ccb-btn.download:hover { background: #059669; }
        .ccb-btn.toggle { background: #f59e0b; }
        .ccb-btn.toggle:hover { background: #d97706; }
        .ccb-btn.success { background: #10b981 !important; }

        /* Content */
        .ccb-content {
            max-height: 600px;
            overflow: auto;
        }
        .ccb-wrapper.collapsed .ccb-content {
            display: none;
        }
        .ccb-content pre { margin: 0; border-radius: 0; }
    `);

    const ICONS = {
        copy: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
        download: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        expand: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
        collapse: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
        check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
    };

    function getCode(wrapper) {
        const code = wrapper.querySelector('code') || wrapper.querySelector('pre');
        return code?.textContent || '';
    }

    function showFeedback(btn, success = true) {
        const original = btn.innerHTML;
        btn.classList.add('success');
        btn.innerHTML = `${ICONS.check} Done!`;
        setTimeout(() => {
            btn.classList.remove('success');
            btn.innerHTML = original;
        }, CONFIG.feedbackDuration);
    }

    function copyCode(wrapper, btn) {
        navigator.clipboard.writeText(getCode(wrapper))
            .then(() => showFeedback(btn))
            .catch(() => {});
    }

    function downloadCode(wrapper, btn) {
        try {
            const code = getCode(wrapper);
            const lang = wrapper.dataset.lang || 'txt';
            const ext = { javascript: 'js', python: 'py', typescript: 'ts', markdown: 'md' }[lang] || lang;
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `code.${ext}`;
            a.click();
            URL.revokeObjectURL(url);
            showFeedback(btn);
        } catch {}
    }

    function toggleCollapse(wrapper, toggleBtn) {
        const isCollapsed = wrapper.classList.toggle('collapsed');
        toggleBtn.innerHTML = isCollapsed 
            ? `${ICONS.expand} Expand` 
            : `${ICONS.collapse} Collapse`;
    }

    function detectLanguage(pre) {
        const code = pre.querySelector('code');
        if (!code) return { lang: 'code', title: null };
        const langClass = Array.from(code.classList).find(c => c.startsWith('language-'));
        const lang = langClass ? langClass.replace('language-', '') : 'code';
        return { lang, title: null };
    }

    function wrapCodeBlock(pre) {
        if (processedBlocks.has(pre)) return;
        const code = pre.querySelector('code');
        if (!code || code.textContent.length < CONFIG.minCodeLength) return;

        processedBlocks.add(pre);
        const { lang } = detectLanguage(pre);

        // Create wrapper - starts COLLAPSED
        const wrapper = document.createElement('div');
        wrapper.className = 'ccb-wrapper collapsed';
        wrapper.dataset.lang = lang;

        // Create header
        const header = document.createElement('div');
        header.className = 'ccb-header';

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'ccb-btn copy';
        copyBtn.innerHTML = `${ICONS.copy} Copy`;
        copyBtn.onclick = (e) => { e.stopPropagation(); copyCode(wrapper, copyBtn); };

        // Download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'ccb-btn download';
        downloadBtn.innerHTML = `${ICONS.download} Download`;
        downloadBtn.onclick = (e) => { e.stopPropagation(); downloadCode(wrapper, downloadBtn); };

        // Toggle button - starts as Expand since collapsed
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'ccb-btn toggle';
        toggleBtn.innerHTML = `${ICONS.expand} Expand`;
        toggleBtn.onclick = (e) => { e.stopPropagation(); toggleCollapse(wrapper, toggleBtn); };

        // Info section
        const info = document.createElement('div');
        info.className = 'ccb-info';
        info.innerHTML = `
            <div class="ccb-title">${lang}</div>
            <span class="ccb-lang">${lang.toUpperCase()}</span>
        `;

        // Assemble header: [Copy] [Download] [Info] [Expand/Collapse]
        header.appendChild(copyBtn);
        header.appendChild(downloadBtn);
        header.appendChild(info);
        header.appendChild(toggleBtn);

        // Double-click header to toggle
        header.addEventListener('dblclick', () => toggleCollapse(wrapper, toggleBtn));

        // Content
        const content = document.createElement('div');
        content.className = 'ccb-content';

        // Insert wrapper
        pre.parentNode.insertBefore(wrapper, pre);
        content.appendChild(pre);
        wrapper.appendChild(header);
        wrapper.appendChild(content);
    }

    function checkTyping() {
        const selectors = [
            '[data-is-streaming="true"]',
            '.animate-pulse',
            '[data-testid="stop-button"]'
        ];
        const nowTyping = selectors.some(s => document.querySelector(s));

        if (nowTyping !== isTyping) {
            isTyping = nowTyping;
            if (!isTyping) {
                document.querySelectorAll('.ccb-wrapper:not(.done)').forEach(w => {
                    w.classList.add('done');
                });
            }
        }
    }

    function processBlocks() {
        document.querySelectorAll('pre:not(.ccb-processed)').forEach(pre => {
            if (!pre.closest('.ccb-wrapper')) {
                wrapCodeBlock(pre);
            }
        });
    }

    function init() {
        processBlocks();

        const observer = new MutationObserver((mutations) => {
            let shouldProcess = mutations.some(m => m.addedNodes.length > 0);
            if (shouldProcess) processBlocks();
            checkTyping();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-is-streaming']
        });

        setInterval(checkTyping, CONFIG.typingCheckInterval);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();