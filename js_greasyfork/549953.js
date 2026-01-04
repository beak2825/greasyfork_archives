// ==UserScript==
// @name         Native Notepad for c.ai
// @namespace    http://fakesite.net/minimalnotepad
// @version      0.1
// @description  Adds a minimal autosaving notepad to the right side panel, below the character name/PFP. One persistent note per character.
// @author       Mr005K
// @match        https://character.ai/chat/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/549953/Native%20Notepad%20for%20cai.user.js
// @updateURL https://update.greasyfork.org/scripts/549953/Native%20Notepad%20for%20cai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentCharId = getCharId();

    function getCharId() {
        const path = window.location.pathname;
        if (path.startsWith('/chat/')) {
            return path.split('/chat/')[1].split('/')[0];
        }
        return '';
    }

    const observer = new MutationObserver(() => {
        const panel = document.querySelector('div[role="dialog"][data-state="open"]');
        if (!panel) return;

        const header = panel.querySelector('div.flex.gap-3');
        if (!header) return;

        const newCharId = getCharId();
        if (!newCharId) return;

        let noteDiv = panel.querySelector('#cai-notepad');
        if (!noteDiv) {
            noteDiv = document.createElement('div');
            noteDiv.id = 'cai-notepad';
            noteDiv.className = 'mt-4';

            const textarea = document.createElement('textarea');
            textarea.className = 'w-full h-32 p-2 bg-background border border-border-outline rounded-md text-foreground resize-vertical';
            textarea.value = GM_getValue('cai_note_' + newCharId, '');

            let saveTimeout;
            textarea.addEventListener('input', () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    GM_setValue('cai_note_' + newCharId, textarea.value);
                }, 1000);
            });

            noteDiv.appendChild(textarea);
            header.after(noteDiv);
        } else if (newCharId !== currentCharId) {
            const textarea = noteDiv.querySelector('textarea');
            if (textarea) {
                textarea.value = GM_getValue('cai_note_' + newCharId, '');
            }
        }

        currentCharId = newCharId;
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // To handle SPA navigation without mutations
    let lastPath = window.location.pathname;
    setInterval(() => {
        if (window.location.pathname !== lastPath) {
            lastPath = window.location.pathname;
            // Trigger a manual check
            observer.takeRecords(); // Clear queue
            observer.disconnect();
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }, 500);

})();