// ==UserScript==
// @name         ChatGPT Chat Cloner
// @namespace    https://WildPinkRice.github.io/
// @version      1.0
// @description  Converts ChatGPT chat into copyable text.
// @author       WildPinkRice
// @match        *://chatgpt.com/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553238/ChatGPT%20Chat%20Cloner.user.js
// @updateURL https://update.greasyfork.org/scripts/553238/ChatGPT%20Chat%20Cloner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Helper ===
    function el(tag, attrs = {}, children = []) {
        const e = document.createElement(tag);
        for (const k in attrs) {
            if (k === 'style') Object.assign(e.style, attrs[k]);
            else if (k.startsWith('on') && typeof attrs[k] === 'function') e.addEventListener(k.slice(2), attrs[k]);
            else e.setAttribute(k, attrs[k]);
        }
        children.forEach(c => typeof c === 'string' ? e.appendChild(document.createTextNode(c)) : e.appendChild(c));
        return e;
    }

    // === Main floating button ===
    const btn = el('button', {
        style: {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: '#10a37f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 14px',
            cursor: 'pointer',
            zIndex: '999999',
            fontSize: '14px',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        }
    }, ['Chat Cloner']);
    document.body.appendChild(btn);

    // === Popup container ===
    const popup = el('div', {
        style: {
            display: 'none',
            position: 'fixed',
            bottom: '60px',
            right: '10px',
            background: '#1e1e1e',
            color: 'white',
            padding: '12px',
            borderRadius: '10px',
            width: '380px',
            zIndex: '1000000',
            boxShadow: '0 0 20px rgba(0,0,0,0.6)',
            fontFamily: 'sans-serif',
            positionRelative: 'true'
        }
    });

    // === Title bar with HELP button ===
    const titleBar = el('div', {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
        }
    }, [
        el('h3', { style: { margin: 0, fontSize: '16px' } }, ['ChatGPT Chat Cloner']),
        el('button', {
            id: 'helpInside',
            style: {
                background: '#444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '12px'
            }
        }, ['HELP'])
    ]);

    popup.appendChild(titleBar);

    // === Input & controls ===
    const chatUrlInput = el('input', {
        id: 'chatUrl',
        type: 'text',
        placeholder: 'Paste ChatGPT share link (optional)',
        style: {
            width: '100%',
            padding: '8px',
            border: '1px solid #333',
            borderRadius: '6px',
            marginBottom: '8px',
            background: '#fff',
            color: '#000'
        }
    });

    const buttonRow = el('div', { style: { display: 'flex', gap: '8px', marginBottom: '8px' } });
    const loadAutoBtn = el('button', {
        id: 'loadAuto',
        style: {
            flex: '1',
            padding: '8px',
            background: '#10a37f',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer'
        }
    }, ['Load']);
    const loadManualBtn = el('button', {
        id: 'loadManual',
        style: {
            flex: '1',
            padding: '8px',
            background: '#0e8064',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer'
        }
    }, ['Load with URL']);
    buttonRow.appendChild(loadAutoBtn);
    buttonRow.appendChild(loadManualBtn);

    const chatOutput = el('textarea', {
        id: 'chatOutput',
        style: {
            width: '100%',
            height: '260px',
            marginTop: '8px',
            padding: '8px',
            background: '#222',
            color: '#ddd',
            border: '1px solid #333',
            borderRadius: '6px',
            boxSizing: 'border-box',
            whiteSpace: 'pre-wrap'
        }
    });
    const copyBtn = el('button', {
        id: 'copyChat',
        style: {
            width: '100%',
            padding: '8px',
            marginTop: '8px',
            background: '#10a37f',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer'
        }
    }, ['Copy to clipboard']);

    popup.appendChild(chatUrlInput);
    popup.appendChild(buttonRow);
    popup.appendChild(chatOutput);
    popup.appendChild(copyBtn);
    document.body.appendChild(popup);

    // === HELP Panel ===
    const helpPanel = el('div', {
        style: {
            display: 'none',
            position: 'fixed',
            bottom: '60px',
            right: '410px',
            background: '#111',
            color: '#eee',
            padding: '12px',
            borderRadius: '10px',
            width: '360px',
            zIndex: '1000000',
            boxShadow: '0 0 20px rgba(0,0,0,0.6)',
            fontFamily: 'sans-serif',
            fontSize: '13px'
        }
    });
    helpPanel.innerHTML = `
        <h3 style="margin:0 0 8px 0;font-size:16px;">Help — How to use</h3>
        <div style="line-height:1.4;">
            <strong>Autoloader note</strong>
            <p>The autoloader works best with short conversations and pages that are fully loaded. If you have a long conversation, scroll to the top and let the page finish loading all messages before using.</p>

            <strong>How to get a share URL</strong>
            <ol>
                <li>Open your ChatGPT conversation.</li>
                <li>Click the Share icon → Copy link.</li>
                <li>URL should look like this: <pre style="background:#222;padding:6px;border-radius:4px;">https://chatgpt.com/share/xxxxxxxxxxxxxxxx</pre></li>
            </ol>

            <strong>Manual Load</strong>
            <p>If auto-detection fails, paste the share link and click “Load with URL”.</p>

            <strong>Notes</strong>
            <ul>
                </strong><strong style="color: #ff5555;">URL loader does not work and if someone knows how to fix it please contact me.</strong>

            </ul>
        </div>
    `;
    document.body.appendChild(helpPanel);

    // === Event handlers ===
    btn.addEventListener('click', () => {
        popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
        helpPanel.style.display = 'none';
    });

    document.getElementById('helpInside').addEventListener('click', () => {
        helpPanel.style.display = helpPanel.style.display === 'none' ? 'block' : 'none';
    });

    chatUrlInput.addEventListener('focus', () => chatUrlInput.select());

    // === Clipboard ===
    document.getElementById('copyChat').addEventListener('click', () => {
        const text = chatOutput.value.trim();
        if (!text) return alert('Nothing to copy.');
        GM_setClipboard(text);
        alert('Chat copied to clipboard.');
    });

    // === Text cleaning ===
    function cleanText(t) {
        if (!t) return '';
        return t
            .replace(/window\.__oai[^\n]*/gi, '')
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<\/?[^>]+>/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    // === Extractors ===
    async function extractChatFromHTML(html) {
        const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]+?)<\/script>/);
        if (match) {
            const data = JSON.parse(match[1]);
            const messages = data.props?.pageProps?.sharedConversation?.messages;
            if (messages?.length)
                return messages.map(m =>
                    `${m.author?.role === 'assistant' ? 'ChatGPT' : 'User'}:\n${cleanText(m.content?.[0]?.text?.value || '')}`
                ).join('\n\n');
        }
        return null;
    }

    function extractFromDOM() {
        const msgs = document.querySelectorAll('[data-message-author-role]');
        if (!msgs.length) return null;
        return Array.from(msgs).map(el => {
            const role = el.getAttribute('data-message-author-role') === 'assistant' ? 'ChatGPT' : 'You';
            return `${role}:\n${cleanText(el.innerText)}`;
        }).join('\n\n');
    }

    async function loadFromURL(url) {
        chatOutput.value = 'Loading...';
        try {
            const html = await (await fetch(url)).text();
            const text = await extractChatFromHTML(html);
            chatOutput.value = text || 'Could not find chat data.';
        } catch (e) {
            chatOutput.value = 'Error: ' + e.message;
        }
    }

    async function loadAuto() {
        chatOutput.value = 'Detecting...';
        const url = window.location.href;
        if (url.includes('/share/')) return loadFromURL(url);
        const text = extractFromDOM();
        chatOutput.value = text || 'No chat found or not fully loaded.';
    }

    document.getElementById('loadManual').addEventListener('click', () => {
        const url = chatUrlInput.value.trim();
        if (!url) return alert('Please paste a ChatGPT share link first.');
        loadFromURL(url);
    });
    document.getElementById('loadAuto').addEventListener('click', loadAuto);
})();
