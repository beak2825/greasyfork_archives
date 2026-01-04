// ==UserScript==
// @name         Send to AI Studio (Direct Chat)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Sends the current page URL directly to the main AI Studio chat dialog.
// @author       Gemini
// @license      MIT
// @match        *://*/*
// @match        https://aistudio.google.com/live*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551181/Send%20to%20AI%20Studio%20%28Direct%20Chat%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551181/Send%20to%20AI%20Studio%20%28Direct%20Chat%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'urlToProcessByAIStudio';

    // =================================================================================
    // PART 2: This code runs ONLY on the aistudio.google.com/live page
    // =================================================================================
    if (window.location.href.startsWith('https://aistudio.google.com/live')) {

        async function runAIStudioAutomation() {
            const urlToProcess = await GM_getValue(STORAGE_KEY, null);

            if (!urlToProcess) {
                return;
            }
            await GM_setValue(STORAGE_KEY, null);

            // --- Step 1: Wait for the chat box to appear on the page ---
            const findChatBoxInterval = setInterval(() => {
                const chatBox = document.querySelector("textarea[placeholder='Start typing a prompt']");
                if (chatBox) {
                    clearInterval(findChatBoxInterval); // Stop checking

                    // --- Step 2: Type the prompt ---
                    const promptText = `We are not talking about anything. I want to learn about: ${urlToProcess} Please summarize this page and then read the first paragraph aloud. If there is a conclusion found, read that aloud after reading the first paragraph.`;
                    chatBox.value = promptText;
                    chatBox.dispatchEvent(new Event('input', { bubbles: true }));

                    // --- Step 3: Press Enter ---
                    setTimeout(() => {
                        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true });
                        chatBox.dispatchEvent(enterEvent);
                    }, 100);
                }
            }, 500); // Check for the chat box every 500ms
        }

        window.addEventListener('load', runAIStudioAutomation);

    // =================================================================================
    // PART 1: This code runs on ALL OTHER pages
    // =================================================================================
    } else {
        const BUTTON_ID = 'gemini-aistudio-live-button';

        GM_addStyle(`
            #${BUTTON_ID} {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 99999;
                background-color: #AF5CF7;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 10px 15px;
                font-family: sans-serif;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                transition: background-color 0.3s, transform 0.2s;
            }
            #${BUTTON_ID}:hover {
                background-color: #8E35D6;
                transform: scale(1.05);
            }
        `);

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.textContent = '➤ AI Studio Direct Chat';

        button.addEventListener('click', async () => {
            await GM_setValue(STORAGE_KEY, window.location.href);
            GM_openInTab('https://aistudio.google.com/live', { active: true });
        });

        document.body.appendChild(button);
    }
})();