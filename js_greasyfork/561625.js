// ==UserScript==
// @name         ScienceOS DOI Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert citations to hyperlinks
// @author       Bui Quoc Dung
// @match        https://app.scienceos.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561625/ScienceOS%20DOI%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/561625/ScienceOS%20DOI%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_STYLE = `
        margin-left: 8px; padding: 2px 10px; font-size: 13px; line-height: 20px;
        border-radius: 12px; border: 1px solid #dadce0; background-color: transparent;
        cursor: pointer; font-family: "Google Sans", Roboto, Arial, sans-serif;
        transition: all 0.1s; color: currentColor; margin-top: 10px; display: inline-block;
    `;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function waitForLink(timeout = 3000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector('a[data-event="paper_title_link"]');
            if (el && el.href) return el.href;
            await sleep(150);
        }
        return null;
    }

    async function getLink(btn) {
        if (!btn.isConnected) return null;
        btn.click();
        const link = await waitForLink();
        const closeBtn = document.querySelector('button[aria-label="Close"]');
        if (closeBtn) closeBtn.click();
        await sleep(400);
        return link;
    }

    async function convertContainer(container) {
        let allButtons = Array.from(container.querySelectorAll('button.mantine-focus-auto._root_gucjd_1.not-prose'));
        if (allButtons.length === 0) return;

        const uniqueNames = [...new Set(allButtons.map(b => b.innerText.trim()))];
        const linkCache = {};

        for (const name of uniqueNames) {
            const currentBtn = Array.from(container.querySelectorAll('button.mantine-focus-auto._root_gucjd_1.not-prose'))
                                   .find(b => b.innerText.trim() === name);

            if (currentBtn) {
                const link = await getLink(currentBtn);
                if (link) {
                    linkCache[name] = link;
                }
            }
        }

        const clone = container.cloneNode(true);
        const buttonsInClone = clone.querySelectorAll('button.mantine-focus-auto._root_gucjd_1.not-prose');

        buttonsInClone.forEach(btn => {
            const name = btn.innerText.trim();
            const cachedLink = linkCache[name];

            if (cachedLink) {
                const wrapper = btn.closest('span[style*="display: inline-block"]')?.parentElement || btn.parentElement;

                if (wrapper) {
                    const newA = document.createElement('a');
                    newA.href = cachedLink;
                    newA.target = "_blank";
                    newA.innerText = name;
                    newA.className = "sci-os-link";
                    newA.setAttribute('style', "color: #1a73e8; text-decoration: none; font-weight: 600; padding: 0 2px;");

                    wrapper.replaceWith(newA);
                }
            }
        });

        const convertBtn = clone.querySelector('.sci-os-deep-converter');
        if (convertBtn) convertBtn.remove();

        container.replaceWith(clone);
    }

    function createTriggerBtn(container) {
        const btn = document.createElement('button');
        btn.innerText = 'Convert DOI';
        btn.setAttribute('style', BUTTON_STYLE);
        btn.className = 'sci-os-deep-converter';
        btn.onclick = async function() {
            this.innerText = 'Processing...';
            this.disabled = true;
            await convertContainer(container);
            this.innerText = 'Finished ✓';
        };
        return btn;
    }

    const observer = new MutationObserver(() => {
        document.querySelectorAll('.tailwind').forEach(div => {
            if (!div.querySelector('.sci-os-deep-converter')) {
                div.appendChild(createTriggerBtn(div));
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const style = document.createElement('style');
    style.innerHTML = `
        .sci-os-link:hover {
            text-decoration: underline !important;
            background-color: rgba(26, 115, 232, 0.1);
            border-radius: 2px;
        }
    `;
    document.head.appendChild(style);
})();