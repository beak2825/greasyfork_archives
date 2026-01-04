// ==UserScript==
// @name         Kick Chat Restriction Unlock
// @name:ja      Kickチャット制限解除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes rate and emote-only restrictions in KICK chat.
// @description:ja  KICKでレート、エモートのみ制限を解除します。
// @author       XBACT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @match        https://kick.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551919/Kick%20Chat%20Restriction%20Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/551919/Kick%20Chat%20Restriction%20Unlock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFetch = window.fetch;
    let chatroomId = null;
    let emotesModeEnabled = false;
    let initialTokenLogged = false;

    function hideWarningBoxes() {
        const warningSelectors = [
            'div[data-icon=""] > svg > path[d="M16 2C8.27 2 2 8.27 2 16C2 23.73 8.27 30 16 30C23.73 30 30 23.73 30 16C30 8.27 23.73 2 16 2ZM18 24.76H14V14.09H18V24.76ZM18 11.09H14V7.23H18V11.09Z"]',
            '.fill-danger-lower',
            '[class*="danger"]',
            '[class*="warning"]',
            'div[data-content=""] > div[data-title=""]',
            '[data-testid*="mod-action"]',
            '[data-testid*="warning"]',
            '.chat-notification.warning'
        ];

        warningSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.closest('div')?.remove();
            });
        });

        if (!document.getElementById('kick-enhancer-hide-warnings')) {
            const style = document.createElement('style');
            style.id = 'kick-enhancer-hide-warnings';
            style.textContent = `
                div[data-icon=""] svg.fill-danger-lower { display: none !important; }
                div[data-content=""] { display: none !important; }
                .fill-danger-lower { display: none !important; }
                [class*="mod-action"]:has(svg path[d*="M16 2C8.27 2"]) { display: none !important; }
                .chat-warning, .chat-mod-box { display: none !important; }
            `;
            document.head.appendChild(style);
        }

        if (!window.kickWarningObserver) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.matches && (node.matches('div[data-icon=""]') || node.querySelector('svg.fill-danger-lower'))) {
                                node.style.display = 'none';
                            }
                        }
                    });
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
            window.kickWarningObserver = observer;
        }
    }

    window.fetch = async function(...args) {
        let [resource, config] = args;
        let url = '';

        try {
            url = typeof resource === 'string' ? resource : resource.url;
        } catch (e) {
            return originalFetch.apply(this, args);
        }

        if (!url.startsWith('https://kick.com/api/v2/')) {
            return originalFetch.apply(this, args);
        }

        let requestHeaders = {};
        if (config && config.headers) {
            if (config.headers instanceof Headers) {
                config.headers.forEach((v, k) => { requestHeaders[k.toLowerCase()] = v; });
            } else {
                for (const k in config.headers) { requestHeaders[k.toLowerCase()] = config.headers[k]; }
            }
        } else if (resource instanceof Request && resource.headers) {
            resource.headers.forEach((v, k) => { requestHeaders[k.toLowerCase()] = v; });
        }

        const authHeaderValue = requestHeaders['authorization'];
        if (authHeaderValue && typeof authHeaderValue === 'string' && authHeaderValue.startsWith('Bearer ')) {
            const token = authHeaderValue.substring(7);
            if (token && token !== localStorage.getItem('bearerToken')) {
                localStorage.setItem('bearerToken', token);
                window.bearerTokenGlobal = token;
                initialTokenLogged = true;
            }
        }

        if (url.includes('/api/v2/channels/') && url.includes('/chatroom')) {
            const response = await originalFetch.apply(this, args);
            const clonedResponse = response.clone();
            try {
                const data = await clonedResponse.json();
                const newId = data.id;
                if (newId && newId !== chatroomId) {
                    chatroomId = newId;
                }
                const newEmotesMode = data.emotes_mode?.enabled;
                if (typeof newEmotesMode !== 'undefined' && newEmotesMode !== emotesModeEnabled) {
                    emotesModeEnabled = newEmotesMode;
                }
            } catch (e) {}
            return response;
        }

        return originalFetch.apply(this, args);
    };

    window.bearerTokenGlobal = localStorage.getItem('bearerToken') || null;

    function setupChatInterceptor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeChat);
        } else {
            initializeChat();
        }
    }

    function initializeChat() {
        const findChatElements = () => {
            const chatInputWrapper = document.getElementById('chat-input-wrapper');
            const sendButton = document.getElementById('send-message-button');
            const editorInput = document.querySelector('.editor-input[data-lexical-editor="true"]');

            if (!chatInputWrapper || !sendButton || !editorInput) {
                setTimeout(findChatElements, 1000);
                return;
            }

            function clearEditorInput(editor) {
                editor.focus();
                const range = document.createRange();
                range.selectNodeContents(editor);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                editor.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'a',
                    code: 'KeyA',
                    ctrlKey: true,
                    bubbles: true,
                    cancelable: true
                }));
                setTimeout(() => {
                    const textLength = editor.textContent.length;
                    for (let i = 0; i < textLength + 5; i++) {
                        editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', keyCode: 8, bubbles: true, cancelable: true }));
                        editor.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace', code: 'Backspace', keyCode: 8, bubbles: true, cancelable: true }));
                    }
                    setTimeout(() => {
                        const p = editor.querySelector('p.editor-paragraph');
                        if (p) {
                            p.innerHTML = '<br>';
                        }
                        editor.focus();
                    }, 100);
                }, 100);
            }

            sendButton.addEventListener('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();
                const message = editorInput.textContent.trim();
                if (message) {
                    clearEditorInput(editorInput);
                    await sendMessage(message);
                }
            });

            editorInput.addEventListener('keydown', async (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    const message = editorInput.textContent.trim();
                    if (message) {
                        clearEditorInput(editorInput);
                        await sendMessage(message);
                    }
                }
            });
        };
        findChatElements();
    }

    async function sendMessage(message) {
        if (!window.bearerTokenGlobal || !chatroomId) return;
        const finalMessage = emotesModeEnabled ? `[emote:37230:POLICE] ${message} [emote:37230:POLICE]` : message;
        const url = `https://kick.com/api/v2/messages/send/${chatroomId}`;
        const headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": `Bearer ${window.bearerTokenGlobal}`,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        };
        const data = {
            "content": finalMessage,
            "type": "message",
            "message_ref": String(Date.now())
        };
        try {
            const response = await originalFetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('bearerToken');
                    window.bearerTokenGlobal = null;
                    initialTokenLogged = false;
                }
            }
        } catch {}
    }

    setupChatInterceptor();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            hideWarningBoxes();
            setInterval(hideWarningBoxes, 2000);
        });
    } else {
        hideWarningBoxes();
        setInterval(hideWarningBoxes, 2000);
    }

})();
