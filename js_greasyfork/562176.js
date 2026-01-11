// ==UserScript==
// @name         doubleD
// @namespace    discord-decode
// @version      1.2
// @author       natek
// @description  adds a decode button for invisible steganography messages on discord web
// @match        https://discord.com/*
// @grant        none
// @license      MIT
// @icon         https://avatars.githubusercontent.com/u/124471757?v=4
// @downloadURL https://update.greasyfork.org/scripts/562176/doubleD.user.js
// @updateURL https://update.greasyfork.org/scripts/562176/doubleD.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // ===== "stego constants" idfk =====
    const ZW_ZERO = '\u200b';
    const ZW_ONE  = '\u200c';
    const MARKER  = '\uFEFF';
    const OLD_MARKER = '\u200d';

    function binaryToStr(binary) {
        const bytes = [];
        for (let i = 0; i < binary.length; i += 8) {
            const byte = binary.slice(i, i + 8);
            if (byte.length === 8) bytes.push(parseInt(byte, 2));
        }
        return new TextDecoder().decode(new Uint8Array(bytes));
    }

    function extractHidden(text) {
        let binary = '';
        let recording = false;

        for (const char of text) {
            if (char === MARKER || char === OLD_MARKER) {
                recording = !recording;
                if (!recording) break;
            } else if (recording) {
                if (char === ZW_ZERO) binary += '0';
                if (char === ZW_ONE)  binary += '1';
            }
        }

        if (!binary) return null;

        try {
            return binaryToStr(binary);
        } catch {
            return null;
        }
    }

    function getMessageText(messageEl) {
        const markup = messageEl.querySelector('[class*="markup"]');
        if (!markup) return '';



        // preserves zero-width
        const html = markup.innerHTML;

        // rm tags but keep characters
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent;
    }


    function addDecodeButton(messageEl) {
        const text = getMessageText(messageEl);
        if (!text.includes(MARKER) && !text.includes(OLD_MARKER)) return;

        // declare toolbar
        const toolbar = messageEl.querySelector('[class*="buttons"]');
        if (!toolbar) return;

        if (toolbar.querySelector('.vm-decode-btn')) return;

        const btn = document.createElement('button');
        // btn.textContent = markup.dataset.decoded === 'true' ? 'restore' : 'decode';
        btn.textContent = 'decode';
        btn.className = 'vm-decode-btn';
        btn.style.cssText = `
            background: transparent;
            color: #b5bac1;
            border: none;
            font-size: 12px;
            cursor: pointer;
            padding: 0 6px;
        `;

        btn.onmouseenter = () => btn.style.color = '#ffffff';
        btn.onmouseleave = () => btn.style.color = '#b5bac1';

        btn.onclick = (e) => {
            e.stopPropagation();

            const markup = messageEl.querySelector('[class*="markup"]');
            if (!markup) return;

            // ===== RESTORE =====
            if (markup.dataset.decoded === 'true') {
                markup.innerHTML = markup.dataset.originalText;
                markup.style.color = '';
                markup.style.fontStyle = '';
                markup.dataset.decoded = 'false';
                btn.textContent = 'decode';
                return;
            }

            // ===== DECODE =====

            // use cached decoded (if exists)
            let decoded = markup.dataset.decodedText;

            if (!decoded) {
                const temp = document.createElement('div');
                temp.innerHTML = markup.innerHTML;
                const fullText = temp.textContent;

                decoded = extractHidden(fullText);
                if (!decoded) return;

                // cache results
                markup.dataset.decodedText = decoded;
                markup.dataset.hasPayload = 'true';

                if (!markup.dataset.originalText) {
                    markup.dataset.originalText = markup.innerHTML;
                }
            }

            // replace visible text
            markup.innerHTML = '';
            markup.textContent = decoded;

            // apply styling
            markup.style.color = '#2e7d32';
            markup.style.fontStyle = 'italic';

            markup.dataset.decoded = 'true';
            btn.textContent = 'restore';
        };





        const wrapper = document.createElement('div');

        // re-enable pointer events
        wrapper.style.pointerEvents = 'auto';

        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';

        wrapper.appendChild(btn);
        toolbar.appendChild(wrapper);
    }

    function scan() {
        document
            .querySelectorAll('[class*="messageListItem"]')
            .forEach(addDecodeButton);
    }

    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(scan, 2000);
})();

// ngl shoutout to the GPT for being such a big help.
// I was basically blind going into this and I despise (and don't know) JS.
// took a lot of walkthrough from the GPT and a lot of trial and error but I think it's jury rigged to work lol.
