// ==UserScript==
// @name         Pollination AI Page Summarizer
// @version      1.1
// @description  Summarize webpage or selected text via Pollinations API (Free, Anonymous, Keyless)
// @author       SH3LL
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/563683/Pollination%20AI%20Page%20Summarizer.user.js
// @updateURL https://update.greasyfork.org/scripts/563683/Pollination%20AI%20Page%20Summarizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === State ===
    let loading = false;
    let isSidebarVisible = false;
    const browserLanguage = navigator.language;
    const selectedLanguage = new Intl.DisplayNames([browserLanguage], { type: 'language' }).of(browserLanguage) || browserLanguage;

    // === Models ===
    const models = [
        { label: 'Gemini', model: 'gemini' },
        { label: 'OpenAI', model: 'openai' },
        { label: 'Mistral', model: 'mistral' }
    ];
    let selectedModel = models[0].model;

    // === Init UI ===
    const { shadowRoot, sidebar, toggleButton, summarizeButton, statusDisplay, summaryContainer, modelSelect } = createSidebarUI();
    document.body.appendChild(shadowRoot.host);

    // === Fade timeout ===
    let hoverTimeout;
    setTimeout(() => toggleButton.style.opacity = '0.3', 2000);

    toggleButton.addEventListener('mouseover', () => {
        clearTimeout(hoverTimeout);
        toggleButton.style.opacity = '1';
    });

    toggleButton.addEventListener('mouseout', () => {
        hoverTimeout = setTimeout(() => {
            if (!isSidebarVisible) toggleButton.style.opacity = '0.3';
        }, 3000);
    });

    // === Event Listeners ===
    document.addEventListener('mouseup', updateButtonText);
    toggleButton.addEventListener('click', toggleSidebar);
    summarizeButton.addEventListener('click', handleSummarizeClick);
    modelSelect.addEventListener('change', e => {
        selectedModel = models[e.target.value].model;
        updateStatus('Idle', '#555');
    });

    updateButtonText();
    updateStatus('Idle', '#555');

    // === Markdown Parser ===
    function parseMarkdown(text) {
        return text
            // Code blocks ```lang\ncode```
            .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
            // Inline code `code`
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Bold **text** or __text__
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.+?)__/g, '<strong>$1</strong>')
            // Italic *text* or _text_
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/_(.+?)_/g, '<em>$1</em>')
            // Strikethrough ~~text~~
            .replace(/~~(.+?)~~/g, '<del>$1</del>')
            // Headers
            .replace(/^### (.+)$/gm, '<h4>$1</h4>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/^# (.+)$/gm, '<h2>$1</h2>')
            // Unordered lists
            .replace(/^\s*[-*+] (.+)$/gm, '<li>$1</li>')
            // Ordered lists
            .replace(/^\s*\d+\. (.+)$/gm, '<li>$1</li>')
            // Links [text](url)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            // Line breaks
            .replace(/\n/g, '<br>');
    }

    // === API Call ===
    function summarizePage(text, lang) {
        const prompt = `Summarize the following text in ${lang}. The summary is organised in blocks of topics.
                        Return the result in a json list composed of dictionaries with fields "title" (the title starts with a contextual modern/colored emoji) and "text".
                        Don't add any other sentence like "Here is the summary".
                        Don't add any coding formatting/header like \"\`\`\`json\".
                        Don't add any formatting to title or text, no formatting at all".
                        Exclude from the summary any advertisement, collaboration, promotion or sponsorization.
                        Here is the text: ${text}`;
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'POST',
                url: 'https://text.pollinations.ai/',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ messages: [{ role: 'user', content: prompt }], model: selectedModel, temperature: 0.7 }),
                onload: r => resolve({ status: r.status, text: r.responseText.replace(/```json\n?|```\n?/g, '').trim(), ok: r.status >= 200 && r.status < 300 }),
                onerror: () => reject({ message: 'Network error' })
            });
        });
    }

    // === Handlers ===
    function toggleSidebar() {
        isSidebarVisible = !isSidebarVisible;
        sidebar.style.transform = isSidebarVisible ? 'translateX(0)' : 'translateX(100%)';
        toggleButton.style.right = isSidebarVisible ? '300px' : '0';
        toggleButton.innerHTML = isSidebarVisible ? '›' : '‹';
        toggleButton.style.opacity = isSidebarVisible ? '1' : '0.3';
    }
    function updateButtonText() {
        if (loading) return summarizeButton.textContent = '⏳';
        const sel = window.getSelection().toString().trim();
        summarizeButton.textContent = sel ? `✨ "${sel.slice(0, 6)}..."` : '✨ Summarize';
    }

    function updateStatus(text, color) {
        statusDisplay.innerHTML = `<span style="color:${color}">● ${text}</span> <span style="color:#0af;margin-left:4px">${selectedLanguage}</span>`;
    }

    // Render summary con supporto markdown
    function renderSummary(jsonText) {
        const c = document.createElement('div');
        JSON.parse(jsonText).forEach(b => {
            const card = document.createElement('div');
            card.className = 'card';
            const title = document.createElement('div');
            title.className = 'card-title';
            title.innerHTML = parseMarkdown(b.title);
            const text = document.createElement('div');
            text.className = 'card-text';
            text.innerHTML = parseMarkdown(b.text);
            card.append(title, text);
            c.appendChild(card);
        });
        return c;
    }

    function handleSummarizeClick() {
        if (loading) return;
        const content = window.getSelection().toString().trim() || document.body.innerText;
        loading = true;
        summarizeButton.disabled = true;
        updateStatus('Loading...', '#f90');
        summaryContainer.style.display = 'none';

        summarizePage(content, selectedLanguage)
            .then(({ status, text, ok }) => {
                try {
                    summaryContainer.textContent = '';
                    summaryContainer.append(renderSummary(text));
                    updateStatus(`OK`, ok ? '#0c6' : '#fc0');
                } catch (e) {
                    summaryContainer.innerHTML = `<div style="color:#f55;font-size:11px">⚠️ ${e.message}</div>`;
                    updateStatus('Error', '#f55');
                }
            })
            .catch(e => {
                summaryContainer.innerHTML = `<div style="color:#f55;font-size:11px">⚠️ ${e.message}</div>`;
                updateStatus('Error', '#f55');
            })
            .finally(() => {
                loading = false;
                summarizeButton.disabled = false;
                updateButtonText();
                summaryContainer.style.display = 'block';
            });
    }

    // === UI Builder ===
    function createSidebarUI() {
        const host = document.createElement('div');
        const root = host.attachShadow({ mode: 'open' });

        const css = `
            *{box-sizing:border-box;margin:0;padding:0}
            .sidebar{position:fixed;right:0;top:0;width:300px;height:100vh;background:#0a0a0a;color:#fff;padding:10px;z-index:999999;font-family:system-ui,sans-serif;display:flex;flex-direction:column;gap:8px;transform:translateX(100%);transition:transform .2s ease;border-left:1px solid #222}
            .toggle{position:fixed;right:0;top:50%;transform:translateY(-50%);width:18px;height:48px;background:#151515;border:1px solid #2a2a2a;border-right:none;border-radius:6px 0 0 6px;cursor:pointer;z-index:1000000;display:flex;align-items:center;justify-content:center;color:#555;font-size:14px;transition:right .2s,background .15s,opacity .3s;opacity:0.3}
            .toggle:hover{background:#1a1a1a;color:#888;opacity:1}
            .row{display:flex;gap:6px}
            select{flex:1;padding:6px 8px;font-size:13px;border-radius:5px;border:1px solid #2a2a2a;background:#111;color:#aaa;cursor:pointer;outline:none}
            select:focus{border-color:#0af}
            button.sum{padding:6px 10px;font-size:13px;font-weight:600;border-radius:5px;border:none;background:#0af;color:#000;cursor:pointer;white-space:nowrap;transition:opacity .15s}
            button.sum:hover{opacity:.85}
            button.sum:disabled{opacity:.4;cursor:not-allowed}
            .status{font-size:12px;color:#444;padding:4px 0;border-bottom:1px solid #1a1a1a}
            .status{font-size:10px;color:#444;padding:4px 0;border-bottom:1px solid #1a1a1a}
            .summary{flex:1;overflow-y:auto;display:none;scrollbar-width:thin;scrollbar-color:#222 transparent}
            .summary::-webkit-scrollbar{width:3px}
            .summary::-webkit-scrollbar-thumb{background:#222;border-radius:3px}

            /* Card styles */
            .card{padding:4px 0;margin-bottom:6px;border-bottom:1px solid #1a1a1a}
            .card-title{font-weight:600;font-size:14px;color:#eee;margin-bottom:3px}
            .card-text{color:#888;font-size:13px;line-height:1.4}

            /* Markdown styles */
            code{background:#1e1e1e;color:#e06c75;padding:1px 4px;border-radius:3px;font-family:'SF Mono',Consolas,monospace;font-size:12px}
            pre{background:#1e1e1e;border-radius:4px;padding:8px;margin:4px 0;overflow-x:auto}
            pre code{background:none;padding:0;color:#abb2bf;display:block;white-space:pre}
            strong{color:#fff;font-weight:600}
            em{color:#aaa;font-style:italic}
            del{color:#666;text-decoration:line-through}
            h2,h3,h4{color:#fff;margin:6px 0 4px}
            h2{font-size:16px}
            h3{font-size:15px}
            h4{font-size:14px}
            li{margin-left:12px;list-style:disc;color:#888}
            a{color:#0af;text-decoration:none}
            a:hover{text-decoration:underline}
        `;

        const style = document.createElement('style');
        style.textContent = css;

        const sidebar = document.createElement('div');
        sidebar.className = 'sidebar';

        const toggleButton = document.createElement('div');
        toggleButton.className = 'toggle';
        toggleButton.innerHTML = '‹';

        const row = document.createElement('div');
        row.className = 'row';

        const modelSelect = document.createElement('select');
        models.forEach((m, i) => {
            const o = document.createElement('option');
            o.value = i;
            o.textContent = m.label;
            modelSelect.appendChild(o);
        });

        const summarizeButton = document.createElement('button');
        summarizeButton.className = 'sum';
        summarizeButton.textContent = '✨ Summarize';

        row.append(modelSelect, summarizeButton);

        const statusDisplay = document.createElement('div');
        statusDisplay.className = 'status';

        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'summary';

        sidebar.append(row, statusDisplay, summaryContainer);
        root.append(style, sidebar, toggleButton);

        return { shadowRoot: root, sidebar, toggleButton, summarizeButton, statusDisplay, summaryContainer, modelSelect };
    }
})();