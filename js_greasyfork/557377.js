// ==UserScript==
// @name         Soundgasm-DL
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Efficient audio extractor with filename sanitization and hotkeys.
// @author       arthiccc
// @match        https://soundgasm.net/u/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557377/Soundgasm-DL.user.js
// @updateURL https://update.greasyfork.org/scripts/557377/Soundgasm-DL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. DATA EXTRACTION (Reliable DOM Selection)
    const getMetadata = () => {
        const titleEl = document.querySelector('.jp-title');
        const authorEl = document.querySelector('a[href*="soundgasm.net/u/"]');
        
        // Sanitize filenames: remove forbidden characters
        const clean = (str) => str ? str.trim().replace(/[\\/:*?"<>|]/g, '') : 'unknown';
        
        return {
            title: clean(titleEl ? titleEl.textContent : 'audio'),
            author: clean(authorEl ? authorEl.textContent : 'unknown')
        };
    };

    // 2. FIND AUDIO SOURCE
    // Look directly into the jPlayer script source for the m4a link
    const findAudioUrl = () => {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            const match = script.innerHTML.match(/m4a:\s*"(https:\/\/media\.soundgasm\.net\/sounds\/[a-zA-Z0-9]+\.m4a)"/);
            if (match) return match[1];
        }
        return null;
    };

    const audioUrl = findAudioUrl();
    const { title, author } = getMetadata();
    const filename = `${author}_${title}.m4a`.toLowerCase().replace(/\s+/g, '_');

    if (audioUrl) {
        // 3. UI INJECTION (Minimalist Style)
        const btn = document.createElement('a');
        btn.id = 'ghost-dl-btn';
        btn.href = audioUrl;
        btn.download = filename;
        btn.innerHTML = `[ DOWNLOAD: ${author} ]`;
        
        // Senior Dev UI: Simple, monospace, corner-fixed
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#000',
            color: '#0f0', // Matrix green
            padding: '10px',
            fontFamily: 'monospace',
            fontSize: '12px',
            border: '1px solid #0f0',
            zIndex: '10000',
            textDecoration: 'none'
        });

        document.body.appendChild(btn);

        // 4. KEYBOARD SHORTCUT (Senior Utility)
        // Press 'D' to trigger download
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'd' && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
                btn.click();
            }
        });

        console.log(`[Ghost] Audio detected: ${filename}`);
    }
})();