// ==UserScript==
// @name         HTML Panel Renderer for Google AI Studio
// @namespace    https://greasyfork.org/ja/scripts/553022
// @license      MIT
// @version      6.0.2
// @description  AI StudioでHTMLパネル（TrustedHTML完全対応）を表示します (Annie's Fixed Version ❤️)
// @author       ForeverPWA & Annie
// @match        *://aistudio.google.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/556718/HTML%20Panel%20Renderer%20for%20Google%20AI%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/556718/HTML%20Panel%20Renderer%20for%20Google%20AI%20Studio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_PREFIX = "🌸 Annie's Renderer (v6.0.2):";
    console.log(LOG_PREFIX, "Script started!");

    const CUSTOM_CSS = `
        .thought-panel-rendered {
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            margin: 16px 0;
            font-family: Roboto, "Helvetica Neue", sans-serif;
            background: #fff;
            box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
            overflow: hidden;
            display: block !important;
        }
        .thought-panel-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0 24px;
            height: 48px;
            cursor: pointer;
            background-color: #f5f5f5;
            transition: background-color 0.2s;
            user-select: none;
        }
        .thought-panel-header:hover {
            background-color: #eeeeee;
        }
        .thought-panel-title {
            display: flex;
            flex-grow: 1;
            margin-right: 16px;
            align-items: center;
            font-weight: 500;
            color: rgba(0,0,0,.87);
        }
        .thinking-icon {
            height: 20px;
            width: 20px;
            margin-right: 8px;
            object-fit: contain;
        }
        .thought-panel-content {
            padding: 16px 24px;
            color: rgba(0,0,0,.87);
            background-color: #fafafa;
            border-top: 1px solid #e0e0e0;
            display: block;
        }
        .thought-panel-rendered.collapsed .thought-panel-content {
            display: none;
        }
    `;

    const style = document.createElement('style');
    style.textContent = CUSTOM_CSS;
    document.head.appendChild(style);

    function togglePanel(headerElement) {
        const panel = headerElement.closest('.thought-panel-rendered');
        if (panel) {
            panel.classList.toggle('collapsed');
        }
    }

    function extractPanelInfo(htmlString) {
        const expandedMatch = htmlString.match(/expanded="(true|false)"/);
        const isExpanded = expandedMatch ? expandedMatch[1] === 'true' : true;

        const titleMatch = htmlString.match(/<mat-panel-title>([\s\S]*?)<\/mat-panel-title>/);
        let titleHtml = titleMatch ? titleMatch[1].trim() : 'Thoughts';

        const contentMatch = htmlString.match(/<div class="thinking-content">([\s\S]*?)<\/div>\s*<\/mat-expansion-panel>/);
        const contentHtml = contentMatch ? contentMatch[1].trim() : '';

        return { isExpanded, titleHtml, contentHtml };
    }

    function parseTextToElements(htmlText) {
        const container = document.createElement('div');
        htmlText = htmlText.trim();

        const parts = htmlText.split(/(<p>|<\/p>|<strong>|<\/strong>|<br>|<code>|<\/code>)/);

        let currentP = null;
        let isStrong = false;
        let isCode = false;

        for (const part of parts) {
            if (part === '<p>') {
                currentP = document.createElement('p');
            } else if (part === '</p>') {
                if (currentP && currentP.childNodes.length > 0) {
                    container.appendChild(currentP);
                }
                currentP = null;
            } else if (part === '<strong>') {
                isStrong = true;
            } else if (part === '</strong>') {
                isStrong = false;
            } else if (part === '<code>') {
                isCode = true;
            } else if (part === '</code>') {
                isCode = false;
            } else if (part === '<br>') {
                if (currentP) {
                    currentP.appendChild(document.createElement('br'));
                }
            } else if (part.trim()) {
                if (!currentP) currentP = document.createElement('p');
                const textNode = document.createTextNode(part.trim());
                if (isStrong) {
                    const strong = document.createElement('strong');
                    strong.appendChild(textNode);
                    currentP.appendChild(strong);
                    isStrong = false;
                } else if (isCode) {
                    const code = document.createElement('code');
                    code.appendChild(textNode);
                    currentP.appendChild(code);
                    isCode = false;
                } else {
                    currentP.appendChild(textNode);
                }
            }
        }

        if (currentP && currentP.childNodes.length > 0) {
            container.appendChild(currentP);
        }

        return container;
    }

    function createPanelFromHtml(htmlString) {
        const { isExpanded, titleHtml, contentHtml } = extractPanelInfo(htmlString);

        const container = document.createElement('div');
        container.className = 'thought-panel-rendered';
        if (!isExpanded) {
            container.classList.add('collapsed');
        }

        const header = document.createElement('div');
        header.className = 'thought-panel-header';

        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'thought-panel-title';

        const imgMatch = titleHtml.match(/<img\s+src="([^"]+)"\s+alt="([^"]*)"\s+class="([^"]+)"\s*\/?>/);
        if (imgMatch) {
            const img = document.createElement('img');
            img.src = imgMatch[1];
            img.alt = imgMatch[2];
            img.className = imgMatch[3];
            titleWrapper.appendChild(img);

            const remainingText = titleHtml.replace(/<img[^>]*>/, '').trim();
            if (remainingText) {
                titleWrapper.appendChild(document.createTextNode(remainingText));
            }
        } else {
            const cleanTitle = titleHtml.replace(/<[^>]*>/g, '');
            titleWrapper.appendChild(document.createTextNode(cleanTitle));
        }

        header.appendChild(titleWrapper);
        header.addEventListener('click', () => togglePanel(header));
        container.appendChild(header);

        const content = document.createElement('div');
        content.className = 'thought-panel-content';

        const contentElements = parseTextToElements(contentHtml);
        Array.from(contentElements.childNodes).forEach(child => {
            content.appendChild(child);
        });

        container.appendChild(content);
        return container;
    }

    function processDivElement(divElement) {
        if (divElement.dataset.processed) return;

        let text = divElement.textContent || '';
        if (!text.trim()) return;

        const hasMatExpansion = text.includes('<mat-expansion-panel');
        const hasThoughtPanel = text.includes('thought-panel');

        if (hasMatExpansion && hasThoughtPanel) {
            console.log(LOG_PREFIX, "✅ Match found!");

            // Extract panel HTML and remaining text
            const panelMatch = text.match(/(<mat-expansion-panel[\s\S]*?<\/mat-expansion-panel>)/);
            if (panelMatch) {
                const panelHtml = panelMatch[1];
                const remainingText = text.replace(panelHtml, '').trim();

                const newPanel = createPanelFromHtml(panelHtml);
                if (newPanel) {
                    const parent = divElement.parentNode;
                    if (parent) {
                        parent.insertBefore(newPanel, divElement);

                        // Keep remaining text visible
                        if (remainingText) {
                            divElement.textContent = remainingText;
                        } else {
                            divElement.style.display = 'none';
                        }

                        divElement.dataset.processed = "true";
                        console.log(LOG_PREFIX, "🎉 SUCCESS!");
                    }
                }
            }
        }
    }

    function scanForContent() {
        const divElements = document.querySelectorAll('ms-text-chunk .very-large-text-container:not([data-processed])');
        divElements.forEach(processDivElement);
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    const debouncedScan = debounce(scanForContent, 300);
    const observer = new MutationObserver(debouncedScan);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => setTimeout(scanForContent, 1000));

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(scanForContent, 500);
    }

})();
