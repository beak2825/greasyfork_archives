// ==UserScript==
// @name         Gemini2Markdown
// @namespace    https://greasyfork.org/en/users/1552401-chipfin
// @version      1.6.5
// @description  Exports Google Gemini chats to Markdown. Captures "Show Thinking", auto-detects model names, and loads full history.
// @match        https://gemini.google.com/*
// @grant        none
// @license      MIT
// @author       Gemini 3 Pro, ChatGPT-5.2
// @downloadURL https://update.greasyfork.org/scripts/562161/Gemini2Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/562161/Gemini2Markdown.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ---------------- Utilities ---------------- */

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const trim = s => (s || '').toString().replace(/\r/g, '').trim();

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
        if (!text) return '';
        text = text.replace(/https:\/\/[^ \n]+filename=([^& \n]+)[^ \n]*/g, (match, filename) => {
            try { return `[Uploaded File: ${decodeURIComponent(filename.replace(/\+/g, ' '))}]`; } catch (e) { return '[Uploaded File]'; }
        });
        text = text
            .replace(/https:\/\/drive\.google\.com\/viewerng\/thumb[^ \n]*/g, '')
            .replace(/https:\/\/contribution\.usercontent\.google\.com\/download[^ \n]*/g, '')
            .replace(/https:\/\/lh3\.googleusercontent\.com\/[^ \n]+/g, '[Image]')
            .replace(/\\(?![\\*_`])/g, '\\\\')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
        return text.replace(/\n\s*\n/g, '\n\n').trim();
    }

    /* ---------------- Actions ---------------- */

    function getChatScroller() {
        return document.querySelector('#chat-history.chat-history-scroll-container infinite-scroller.chat-history') ||
               document.querySelector('infinite-scroller.chat-history');
    }

    async function scrollChatToTop(statusCallback) {
        const scroller = getChatScroller();
        if (!scroller) return;
        let stableCount = 0;
        for (let i = 0; i < 55; i++) {
            scroller.scrollTop = 0;
            if (statusCallback) statusCallback(`⬆️ ${i}`);
            await sleep(1300);
            if (scroller.scrollTop !== 0) stableCount = 0;
            else stableCount++;
            if (stableCount >= 4) break;
        }
    }

    async function expandAllThoughts(statusCallback) {
        if (statusCallback) statusCallback("🧠");
        const buttons = document.querySelectorAll('model-thoughts .thoughts-header-button');
        for (const btn of buttons) {
            const container = btn.closest('model-thoughts');
            if (!container?.querySelector('.thoughts-content') || (btn.textContent && btn.textContent.includes('Show thinking'))) {
                btn.click();
                await sleep(100);
            }
        }
        await sleep(1000);
    }

    async function detectModelForContainer(container) {
        const menuBtn = container.querySelector('.more-menu-button, button[data-test-id="more-actions-button"]');
        if (!menuBtn) return 'Gemini';
        menuBtn.click();
        await sleep(300);
        const overlayItems = [...document.querySelectorAll('.cdk-overlay-pane .mat-mdc-menu-item-text')];
        const modelItem = overlayItems.find(el => el.textContent && el.textContent.trim().startsWith('Model:'));
        let model = 'Gemini';
        if (modelItem) model = modelItem.textContent.trim();
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true, cancelable: true }));
        await sleep(100);
        return model;
    }

    /* ---------------- Extraction ---------------- */

    function processElement(el) {
        if (!el) return '';
        const clone = el.cloneNode(true);
        clone.querySelectorAll('button, mat-icon, .action-bar, .feedback_buttons, .thoughts-header').forEach(e => e.remove());
        clone.querySelectorAll('b, strong').forEach(b => b.textContent = `**${b.textContent}**`);
        clone.querySelectorAll('i, em').forEach(i => i.textContent = `*${i.textContent}*`);
        clone.querySelectorAll('a').forEach(a => {
            const href = a.href;
            const text = a.innerText;
            if (href && text) a.textContent = `[${text}](${href})`;
        });
        clone.querySelectorAll('pre').forEach(pre => {
            const code = pre.innerText;
            const lang = pre.getAttribute('data-language') || '';
            pre.textContent = `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
        });
        const blockTags = ['p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'tr'];
        blockTags.forEach(tag => { clone.querySelectorAll(tag).forEach(block => block.after('\n')); });
        clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
        return cleanMarkdown(clone.textContent);
    }

    /* ---------------- Main Logic ---------------- */

    async function exportToMarkdown() {
        const btn = document.querySelector('#gemini-export-md-icon');
        const originalIcon = btn.innerHTML;
        const setStatus = (text) => { btn.innerHTML = `<span style="font-size:11px; font-weight:bold; color:#444;">${text}</span>`; };
        try {
            await scrollChatToTop(setStatus);
            await expandAllThoughts(setStatus);
            const containers = document.querySelectorAll('.conversation-container');
            if (containers.length === 0) throw new Error("No chat found.");
            const titleEl = document.querySelector('.conversation-title');
            let cleanTitle = trim(titleEl ? titleEl.innerText : document.title).replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, ' ');
            let displayTitle = cleanTitle.substring(0, 64).trim();
            const timestamp = getFormattedTimestamp();
            const toc = [];
            const turnBuffer = [];
            let globalModel = 'Gemini';
            let chatIndex = 1;
            for (let i = 0; i < containers.length; i++) {
                const container = containers[i];
                const userQuery = container.querySelector('user-query .query-content, .user-query');
                const modelResponse = container.querySelector('model-response .message-content, model-response');
                if (!userQuery && !modelResponse) continue;
                setStatus(`🔍 ${i+1}/${containers.length}`);
                const currentModel = modelResponse ? await detectModelForContainer(container) : 'User';
                if (i === 0 && currentModel !== 'User') globalModel = currentModel;
                let turnText = `### chat-${chatIndex}\n\n`;
                if (userQuery) {
                    const text = processElement(userQuery);
                    toc.push(`- [${chatIndex}: ${text.substring(0, 50).replace(/\n/g, ' ')}...](#chat-${chatIndex})`);
                    turnText += `####### User writes:\n\n${text}\n\n`;
                }
                if (modelResponse) {
                    turnText += `####### Gemini (${currentModel}) writes:\n\n`;
                    let hasThoughts = false;
                    const thoughtNode = container.querySelector('model-thoughts');
                    if (thoughtNode) {
                        const thoughtText = processElement(thoughtNode.querySelector('.thoughts-content'));
                        if (thoughtText) {
                            hasThoughts = true;
                            turnText += `**Shown Thinking (Gemini):**\n---\n\n${thoughtText}\n\n`;
                        }
                    }
                    const responseClone = modelResponse.cloneNode(true);
                    responseClone.querySelectorAll('model-thoughts, .thoughts-container').forEach(e => e.remove());
                    if (hasThoughts) turnText += `**Response (Gemini):**\n---\n\n`;
                    turnText += `${processElement(responseClone)}\n\n`;
                }
                turnText += `___\n###### [top](#table-of-contents)\n\n`;
                turnBuffer.push(turnText);
                chatIndex++;
            }
            const header = `---\ntitle: ${cleanTitle}\ndate: ${timestamp}\nurl: ${location.href}\nmodel: ${globalModel}\n---\n\n# ${cleanTitle}\n\n`;
            const finalContent = [header, `## Table of Contents\n${toc.join('\n')}\n\n---\n\n`, ...turnBuffer].join('');
            const blob = new Blob([finalContent], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `GEMINI_${displayTitle}_${timestamp}.md`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Export failed: " + e.message);
        } finally {
            btn.innerHTML = originalIcon;
        }
    }

    /* ---------------- UI Integration ---------------- */

    function addExportButton() {
        if (document.querySelector('#gemini-export-md-icon')) return;
        const anchor = document.querySelector('studio-sidebar-button, [data-test-id="studio-sidebar-button"], new-chat-button, [data-test-id="new-chat-button-container"]');
        if (!anchor) return;

        const exportBtn = document.createElement('button');
        exportBtn.id = 'gemini-export-md-icon';
        exportBtn.setAttribute('title', 'Export chat as Markdown');

        // CSS optimization for v1.6.5:
        // Changed margin to 3px 4px 0 0 to nudge the 15px icon down.
        // align-self: center ensures the 40px container is centered, then the 3px margin shifts the icon.
        exportBtn.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            align-self: center;
            width: 40px;
            height: 40px;
            background: transparent;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            transition: background 0.2s;
            margin: 3px 4px 0 0;
            padding: 0;
            vertical-align: middle;
        `;

        exportBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="15" viewBox="0 0 208 128" style="opacity:0.75;"><rect width="198" height="118" x="5" y="5" ry="10" stroke="#000" stroke-width="10" fill="none"/><path d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z"/></svg>`;
        exportBtn.addEventListener('mouseenter', () => exportBtn.style.background = 'rgba(154, 160, 166, 0.1)');
        exportBtn.addEventListener('mouseleave', () => exportBtn.style.background = 'transparent');
        exportBtn.addEventListener('click', exportToMarkdown);

        anchor.parentNode.insertBefore(exportBtn, anchor);
    }

    setTimeout(addExportButton, 2000);
    new MutationObserver(addExportButton).observe(document.body, { childList: true, subtree: true });

})();