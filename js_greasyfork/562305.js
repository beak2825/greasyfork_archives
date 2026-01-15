// ==UserScript==
// @name     Enhanced Claude.Ai Export v2.2
// @description Export Claude conversations to clipboard with robust element detection
// @version  2.2
// @author   Original: TheAlanK & SAPIENT | Enhanced: iikoshteruu | Fixed: Claude
// @grant    none
// @match    *://claude.ai/*
// @namespace https://github.com/iikoshteruu/Enhanced-Claude.Ai-Export-v2.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562305/Enhanced%20ClaudeAi%20Export%20v22.user.js
// @updateURL https://update.greasyfork.org/scripts/562305/Enhanced%20ClaudeAi%20Export%20v22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Enhanced Claude Export v2.2 starting...');

    const CONFIG = {
        debug: true,
        autoScroll: true,
        scrollDelay: 800,
        maxScrollAttempts: 50
    };

    let isExporting = false;

    function debugLog(msg, data = null) {
        if (CONFIG.debug) console.log('[Claude Export v2.2]', msg, data || '');
    }

    async function loadFullConversation() {
        debugLog('Loading full conversation...');
        return new Promise((resolve) => {
            let attempts = 0, lastHeight = 0, unchanged = 0;
            const interval = setInterval(() => {
                window.scrollTo(0, 0);
                const h = document.body.scrollHeight;
                if (h === lastHeight) unchanged++;
                else { unchanged = 0; lastHeight = h; }
                attempts++;
                if (attempts >= CONFIG.maxScrollAttempts || unchanged >= 3) {
                    clearInterval(interval);
                    setTimeout(() => {
                        window.scrollTo(0, document.body.scrollHeight);
                        setTimeout(resolve, 500);
                    }, 500);
                }
            }, CONFIG.scrollDelay);
        });
    }

    function getConversationData() {
        debugLog('Extracting conversation...');
        const messages = [];

        // Strategy 1: Look for turn containers by data attributes
        // Claude.ai uses data-testid attributes on turn wrappers
        let turns = document.querySelectorAll('[data-testid^="user-turn"], [data-testid^="assistant-turn"]');
        
        if (turns.length > 0) {
            debugLog(`Found ${turns.length} turns via data-testid`);
            turns.forEach((turn, i) => {
                const testId = turn.getAttribute('data-testid') || '';
                const speaker = testId.includes('user') ? 'Human' : 'Claude';
                const text = extractText(turn);
                if (text.length > 5) {
                    messages.push({ speaker, content: text, index: i });
                }
            });
            if (messages.length > 0) return messages;
        }

        // Strategy 2: Look for message-like containers with role attributes
        turns = document.querySelectorAll('[data-is-streaming], [class*="message"], [class*="turn"]');
        debugLog(`Strategy 2 found ${turns.length} elements`);

        // Strategy 3: Find alternating content blocks in main
        const main = document.querySelector('main');
        if (main) {
            // Look for direct children or specific patterns
            const candidates = main.querySelectorAll(
                'div[class*="group"], div[class*="prose"], div[class*="grid"] > div'
            );
            debugLog(`Strategy 3 found ${candidates.length} candidates`);
            
            const seen = new Set();
            let idx = 0;
            candidates.forEach(el => {
                const text = extractText(el);
                if (text.length > 20 && !seen.has(text) && !isUIElement(text)) {
                    seen.add(text);
                    const speaker = detectSpeaker(el, text, idx);
                    messages.push({ speaker, content: text, index: idx++ });
                }
            });
        }

        // Strategy 4: Nuclear option - walk the DOM looking for substantial text blocks
        if (messages.length === 0) {
            debugLog('Using fallback DOM walker...');
            const walker = document.createTreeWalker(
                document.querySelector('main') || document.body,
                NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode: (node) => {
                        if (node.matches('nav, header, footer, button, input, script, style, svg')) 
                            return NodeFilter.FILTER_REJECT;
                        const text = node.textContent?.trim() || '';
                        if (text.length > 100 && text.length < 30000) 
                            return NodeFilter.FILTER_ACCEPT;
                        return NodeFilter.FILTER_SKIP;
                    }
                }
            );

            const seen = new Set();
            let idx = 0, node;
            while (node = walker.nextNode()) {
                const text = extractText(node);
                if (text.length > 50 && !seen.has(text) && !isUIElement(text)) {
                    seen.add(text);
                    messages.push({ 
                        speaker: detectSpeaker(node, text, idx), 
                        content: text, 
                        index: idx++ 
                    });
                }
            }
        }

        debugLog(`Extracted ${messages.length} messages`);
        return messages;
    }

    function extractText(el) {
        const clone = el.cloneNode(true);
        // Remove UI cruft but NOT the container itself just because it has buttons
        clone.querySelectorAll(
            'svg, button, input, select, script, style, [aria-hidden="true"], ' +
            '[class*="icon"], [class*="toolbar"], [class*="copy"], [class*="feedback"]'
        ).forEach(e => e.remove());
        return clone.textContent?.trim().replace(/\s+/g, ' ') || '';
    }

    function isUIElement(text) {
        const uiPatterns = [
            /^(Export|New chat|Settings|Copy|Edit|Retry|Share)$/i,
            /^Claude$/,
            /^\d+\s*(tokens?|characters?)$/i
        ];
        return uiPatterns.some(p => p.test(text.trim()));
    }

    function detectSpeaker(el, text, index) {
        // Check attributes first
        const attrs = (el.className + ' ' + el.getAttribute('data-testid') + ' ' + 
                      (el.parentElement?.className || '')).toLowerCase();
        if (attrs.includes('user') || attrs.includes('human')) return 'Human';
        if (attrs.includes('assistant') || attrs.includes('claude')) return 'Claude';

        // Content heuristics
        const humanSignals = [
            /^(hi|hello|hey|can you|could you|please|help|i need|i want|how|what|why|is there)/i.test(text),
            text.endsWith('?'),
            text.length < 300
        ].filter(Boolean).length;

        const claudeSignals = [
            /^(i'll|i can|i'd|here's|let me|certainly|absolutely|looking at|based on)/i.test(text),
            text.includes('```'),
            text.length > 500
        ].filter(Boolean).length;

        if (humanSignals !== claudeSignals) {
            return humanSignals > claudeSignals ? 'Human' : 'Claude';
        }
        return index % 2 === 0 ? 'Human' : 'Claude';
    }

    function formatMarkdown(messages) {
        if (!messages.length) return '# No conversation found';
        let md = `# Claude.ai Conversation Export\n\n`;
        md += `**Exported:** ${new Date().toLocaleString()}\n`;
        md += `**Messages:** ${messages.length}\n`;
        md += `**URL:** ${window.location.href}\n\n---\n\n`;
        messages.forEach(m => { md += `## ${m.speaker}\n\n${m.content}\n\n`; });
        return md;
    }

    function formatText(messages) {
        if (!messages.length) return 'No conversation found.';
        let out = `Claude.ai Conversation Export\n`;
        out += `Exported: ${new Date().toLocaleString()}\n`;
        out += `Messages: ${messages.length}\n`;
        out += `URL: ${window.location.href}\n`;
        out += '='.repeat(60) + '\n\n';
        messages.forEach((m, i) => {
            out += `${m.speaker}:\n${m.content}\n\n`;
            if (i < messages.length - 1) out += '-'.repeat(40) + '\n\n';
        });
        return out;
    }

    function formatJSON(messages) {
        return JSON.stringify({
            exportDate: new Date().toISOString(),
            url: window.location.href,
            messageCount: messages.length,
            conversation: messages,
            stats: {
                human: messages.filter(m => m.speaker === 'Human').length,
                claude: messages.filter(m => m.speaker === 'Claude').length
            }
        }, null, 2);
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;left:-9999px';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return ok;
        }
    }

    async function exportConversation(format) {
        if (isExporting) return alert('Export in progress...');
        isExporting = true;

        try {
            showNotification('🔄 Loading conversation...', 0);
            if (CONFIG.autoScroll) await loadFullConversation();
            
            showNotification('📝 Extracting...', 0);
            const messages = getConversationData();
            
            if (!messages.length) {
                alert('No conversation found. Check console for debug info.');
                return;
            }

            const content = format === 'md' ? formatMarkdown(messages) :
                           format === 'json' ? formatJSON(messages) :
                           formatText(messages);

            const ok = await copyToClipboard(content);
            hideMenu();
            showNotification(
                ok ? `✅ Copied ${messages.length} messages (${format.toUpperCase()})` 
                   : '❌ Copy failed - check console',
                4000
            );
        } catch (e) {
            console.error('Export failed:', e);
            alert(`Export failed: ${e.message}`);
        } finally {
            isExporting = false;
        }
    }

    function showNotification(msg, duration = 3000) {
        let n = document.getElementById('claude-export-notif');
        if (n) n.remove();
        n = document.createElement('div');
        n.id = 'claude-export-notif';
        n.textContent = msg;
        n.style.cssText = `
            position:fixed;top:20px;right:20px;background:#4CAF50;color:#fff;
            padding:12px 20px;border-radius:8px;z-index:10001;font-family:system-ui;
            box-shadow:0 4px 12px rgba(0,0,0,.2);max-width:300px;
        `;
        document.body.appendChild(n);
        if (duration > 0) setTimeout(() => n.remove(), duration);
    }

    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'claude-export-menu';
        menu.style.cssText = `
            position:fixed;bottom:70px;right:10px;background:#fff;border:2px solid #667eea;
            border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,.2);padding:12px;
            z-index:10000;display:none;font-family:system-ui;min-width:180px;
        `;

        const title = document.createElement('div');
        title.textContent = '📋 Copy to Clipboard';
        title.style.cssText = 'font-weight:600;color:#667eea;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #eee;';
        menu.appendChild(title);

        [{ext:'md',name:'Markdown',icon:'📝'},{ext:'txt',name:'Plain Text',icon:'📄'},{ext:'json',name:'JSON',icon:'📊'}]
        .forEach(f => {
            const btn = document.createElement('button');
            btn.innerHTML = `${f.icon} ${f.name}`;
            btn.style.cssText = `
                display:block;width:100%;padding:10px;margin:4px 0;border:none;
                background:transparent;text-align:left;cursor:pointer;border-radius:6px;
                font-size:14px;color:#333;transition:background .2s;
            `;
            btn.onmouseover = () => btn.style.background = '#f0f0ff';
            btn.onmouseout = () => btn.style.background = 'transparent';
            btn.onclick = () => exportConversation(f.ext);
            menu.appendChild(btn);
        });

        return menu;
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.innerHTML = '📋 Copy Chat';
        btn.id = 'claude-export-btn';
        btn.style.cssText = `
            position:fixed;bottom:10px;right:10px;padding:10px 16px;
            background:linear-gradient(135deg,#667eea,#764ba2);border:none;
            color:#fff;font-size:14px;font-weight:600;cursor:pointer;
            border-radius:30px;z-index:9999;box-shadow:0 4px 15px rgba(0,0,0,.2);
            transition:all .3s;font-family:system-ui;
        `;
        btn.onmouseover = () => { btn.style.transform = 'translateY(-2px) scale(1.05)'; };
        btn.onmouseout = () => { btn.style.transform = 'none'; };
        btn.onclick = toggleMenu;
        return btn;
    }

    function toggleMenu() {
        const m = document.getElementById('claude-export-menu');
        if (m) m.style.display = m.style.display === 'none' ? 'block' : 'none';
    }
    function hideMenu() {
        const m = document.getElementById('claude-export-menu');
        if (m) m.style.display = 'none';
    }

    function init() {
        debugLog('Initializing...');
        ['claude-export-btn','claude-export-menu'].forEach(id => document.getElementById(id)?.remove());
        document.body.appendChild(createButton());
        document.body.appendChild(createMenu());
        document.addEventListener('click', e => {
            if (!e.target.closest('#claude-export-menu,#claude-export-btn')) hideMenu();
        });
        console.log('%c✅ Claude Export v2.2 Ready (Clipboard)', 'color:green;font-weight:bold');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else setTimeout(init, 1000);

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) { lastUrl = location.href; setTimeout(init, 2000); }
    }).observe(document, { subtree: true, childList: true });
})();