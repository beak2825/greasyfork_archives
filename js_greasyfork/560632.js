// ==UserScript==
// @name         Gemini Deep Research - Copy All Links
// @namespace    http://greasyfork.org/
// @version      1.2
// @description  Adds "Copy" buttons to Deep Research source lists to copy all URLs to the clipboard.
// @author       Bui Quoc Dung
// @match        https://gemini.google.com/app*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560632/Gemini%20Deep%20Research%20-%20Copy%20All%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/560632/Gemini%20Deep%20Research%20-%20Copy%20All%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const copyToClipboard = (text, button, originalText) => {
        navigator.clipboard.writeText(text).then(() => {
            button.innerText = "Copied!";
            setTimeout(() => {
                button.innerText = originalText;
            }, 2000);
        });
    };

    const createBtnStyle = (btn) => {
        Object.assign(btn.style, {
            marginLeft: '8px',
            padding: '2px 10px',
            fontSize: '13px',
            lineHeight: '20px',
            borderRadius: '12px',
            border: '1px solid #dadce0',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
            transition: 'all 0.1s',
            color: 'currentColor'
        });
    };

    const injectButtons = () => {
        const collapsibleContainers = document.querySelectorAll('collapsible-button');

        collapsibleContainers.forEach(container => {
            if (container.hasAttribute('data-script-handled')) return;

            const btn = container.querySelector('button[aria-expanded="true"]');
            if (btn) {
                btn.click();
            }

            container.setAttribute('data-script-handled', 'true');
        });

        const researchBlocks = document.querySelectorAll('deep-research-source-lists');
        researchBlocks.forEach(block => {
            if (block.querySelector('.btn-copy-all-master')) return;

            const allLinks = Array.from(block.querySelectorAll('a[href]'))
                                  .map(a => a.href)
                                  .filter(href => href && href.startsWith('http'));

            if (allLinks.length > 0) {
                const masterBtn = document.createElement('button');
                masterBtn.className = 'btn-copy-all-master';
                const label = `Copy All (${allLinks.length} links)`;
                masterBtn.innerText = label;
                createBtnStyle(masterBtn);

                masterBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const uniqueLinks = [...new Set(allLinks)];
                    copyToClipboard(uniqueLinks.join('\n'), masterBtn, label);
                };

                block.prepend(masterBtn);
                masterBtn.style.marginBottom = '12px';
                masterBtn.style.display = 'inline-block';
            }
        });

        const individualContainers = document.querySelectorAll('collapsible-button[data-test-id*="-sources-button"]');
        individualContainers.forEach(container => {
            if (container.querySelector('.btn-copy-research')) return;

            const baseBtn = container.querySelector('button.mdc-button.mat-mdc-button-base');
            const listContainer = container.nextElementSibling;

            if (!baseBtn || !listContainer) return;

            const links = Array.from(listContainer.querySelectorAll('a[href]'))
                               .map(a => a.href)
                               .filter(href => href && href.startsWith('http'));

            if (links.length > 0) {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'btn-copy-research';
                const label = `Copy (${links.length})`;
                copyBtn.innerText = label;
                createBtnStyle(copyBtn);

                copyBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyToClipboard(links.join('\n'), copyBtn, label);
                };

                baseBtn.after(copyBtn);
            }
        });
    };

    const observer = new MutationObserver(() => {
        injectButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    injectButtons();
})();