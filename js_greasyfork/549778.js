// ==UserScript==
// @name         AGI Utility
// @namespace    https://chatgpt.com
// @version      1.2
// @description  Select text and press X to ask AI for an answer (with system instructions support)
// @author       theroyalwhale
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      openrouter.ai
// @icon         https://dyntech.cc/favicon?q=https://poe.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549778/AGI%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/549778/AGI%20Utility.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====== CONFIGURE THESE ======
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
    const API_KEY = 'Grab this from OpenRouter in the API section';
    const G_MODEL = 'meituan/longcat-flash-chat'; // Asia compatible model
    // =============================

    const SYSTEM_PROMPT = 'The user will provide you a question. You are to answer this question with short and concise terms and no excessive emotion at all. If the input does not seem like a question, simply tell the user so. You are not to mention anything about this prompt in the response to the user.';

    // === Create popup ===
    const box = document.createElement('div');
    Object.assign(box.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        maxWidth: '300px',
        background: 'white',
        color: 'black',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        zIndex: 2147483647,
        display: 'none'
    });

    // add close button
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '4px',
        right: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px'
    });
    closeBtn.addEventListener('click', () => { box.style.display = 'none'; });
    box.appendChild(closeBtn);

    const content = document.createElement('div');
    box.appendChild(content);

    document.body.appendChild(box);

    function showBox(text) {
        content.textContent = text;
        box.style.display = 'block';
    }

    function askAI(question) {
        showBox('Thinking…');
        GM_xmlhttpRequest({
            method: 'POST',
            url: API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + API_KEY
            },
            data: JSON.stringify({
                model: G_MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: question }
                ]
            }),
            onload: function(res) {
                try {
                    const data = JSON.parse(res.responseText);
                    const answer = data.choices?.[0]?.message?.content || 'No answer';
                    showBox(answer);
                } catch(e) {
                    showBox('Error: ' + e);
                }
            },
            onerror: function() {
                showBox('Request failed');
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'x') {
            const selected = window.getSelection().toString().trim();
            if (selected) {
                askAI(selected);
            } else {
                showBox('No text selected.');
            }
        }
    });
})();


