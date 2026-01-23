// ==UserScript==
// @name         JanitorAI - OpenRouter Prompt Snatcher
// @namespace    https://greasyfork.org/
// @version      7.1
// @description  Intercepts OpenRouter completions to grab the full system/persona content.
// @author       Pugsby, ChatGPT
// @match        http*://*.janitorai.com/chats/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563685/JanitorAI%20-%20OpenRouter%20Prompt%20Snatcher.user.js
// @updateURL https://update.greasyfork.org/scripts/563685/JanitorAI%20-%20OpenRouter%20Prompt%20Snatcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function downloadFile(filename, text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const button = document.createElement('button');
    button.innerText = 'Snatch OpenRouter Prompt';
    button.style.cssText = 'position:fixed; top:10px; left:50%; transform:translateX(-50%); padding:10px 15px; border-radius:8px; background-color:#f59e0b; color:black; border:none; cursor:pointer; z-index:9999; font-weight:bold; box-shadow: 0px 4px 10px rgba(0,0,0,0.3);';

    let isListening = false;
    const originalFetch = window.fetch;

    window.fetch = async function(...args) {
        const url = args[0] || "";

        // Check for OpenRouter completions or the Janitor proxy
        if (isListening && typeof url === 'string' && (url.includes('chat/completions') || url.includes('generateAlpha'))) {
            const options = args[1];
            if (options && options.body) {
                try {
                    let rawBody = options.body;

                    // Decode the body
                    if (rawBody instanceof Blob) {
                        rawBody = await rawBody.text();
                    } else if (typeof rawBody !== 'string') {
                        rawBody = new TextDecoder().decode(rawBody);
                    }

                    const data = JSON.parse(rawBody);

                    // TARGET: messages[0].content
                    if (data.messages && data.messages[0] && data.messages[0].role === 'system') {
                        const fullPrompt = data.messages[0].content;

                        // 1. LOG TO CONSOLE
                        // console.log("%c--- SNATCHED FULL PROMPT ---", "color: #f59e0b; font-weight: bold; font-size: 14px;");
                        // console.log(fullPrompt);

                        // 2. DOWNLOAD FILE
                        downloadFile('janitor_character_prompt.txt', fullPrompt);

                        alert('Success! Content logged to console and downloaded.');
                        stopListening();
                    }
                } catch (e) {
                    console.error("Snatch failed:", e);
                }
            }
        }
        return originalFetch.apply(this, args);
    };

    function stopListening() {
        isListening = false;
        button.innerText = 'Snatch OpenRouter Prompt';
        button.style.backgroundColor = '#f59e0b';
    }

    button.addEventListener('click', () => {
        isListening = true;
        button.innerText = 'Listening... Send your message now!';
        button.style.backgroundColor = '#ef4444';
    });

    document.body.appendChild(button);
})();
