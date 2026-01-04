// ==UserScript==
// @name         Toledo PDF Opener & Downloader buttons
// @namespace    http://tampermonkey.net/
// @version      12.1
// @description  Voegt een open pd en download pdf knop toe aan toledo bij alle pdf's om rap de pdf te openen in groot scherm zonder te downloaden of je kan rap de pdf downloaden.
// @author       Seppe Heyvaert
// @match        https://*.kuleuven.cloud/*
// @match        https://*.kuleuven.be/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560777/Toledo%20PDF%20Opener%20%20Downloader%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/560777/Toledo%20PDF%20Opener%20%20Downloader%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BTN_CLASS = 'kul-native-btn-clean';
    const TOOLTIP_CLASS = 'kul-tooltip-bubble-clean';

    const styleNode = document.createElement('style');
    styleNode.innerHTML = `
        .${BTN_CLASS} {
            -webkit-appearance: none;
            appearance: none;
            background: rgba(0, 0, 0, 0);
            border: 0;
            border-radius: 0;
            box-sizing: border-box;
            color: #666666;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font: inherit;
            line-height: 1;
            margin: 0;
            overflow: visible;
            padding: 0;
            text-transform: none;
            width: 3rem;
            min-height: 3rem;
            height: 100%;
            position: relative;
            transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .${BTN_CLASS}:hover {
            background-color: rgba(0, 0, 0, 0.04);
            color: #262626;
        }
        .${TOOLTIP_CLASS} {
            visibility: hidden;
            background-color: rgba(0, 0, 0, 0.85);
            color: #fff;
            text-align: center;
            border-radius: 4px;
            padding: 5px 10px;
            font-family: "Open Sans", "Helvetica", "Arial", sans-serif;
            font-size: 0.75rem;
            font-weight: 400;
            line-height: 1.5;
            position: absolute;
            z-index: 10000;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-5px);
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        }
        .${BTN_CLASS}:hover .${TOOLTIP_CLASS} {
            visibility: visible;
            opacity: 1;
        }
    `;
    document.head.appendChild(styleNode);

    const OPEN_ICON = `
        <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: 24px; height: 24px; fill: currentColor;">
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
        </svg>
    `;

    const DOWNLOAD_ICON = `
        <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" style="width: 24px; height: 24px; fill: currentColor;">
            <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"></path>
        </svg>
    `;

    function addButtons() {
        const toolbars = document.querySelectorAll('div[class*="rootControls-"]');

        toolbars.forEach(toolbar => {
            if (toolbar.querySelector('.' + BTN_CLASS)) return;

            const metaBlock = toolbar.querySelector('div[class*="attachmentMeta-"]');
            const container = toolbar.closest('div[class*="container-"]');

            if (!container || !metaBlock) return;

            const iframe = container.querySelector('iframe[src*="bbcswebdav"]');
            const allyLink = container.querySelector('a[data-ally-file-preview-url*="bbcswebdav"]');

            let fileUrl = null;
            if (iframe) fileUrl = iframe.src;
            else if (allyLink) fileUrl = allyLink.getAttribute('data-ally-file-preview-url');

            if (fileUrl) {
                // Open Button
                const btnOpen = document.createElement('button');
                btnOpen.className = BTN_CLASS;
                btnOpen.type = 'button';
                btnOpen.setAttribute('aria-label', 'Open pdf in grootscherm');
                btnOpen.innerHTML = `
                    ${OPEN_ICON}
                    <div class="${TOOLTIP_CLASS}">Open pdf in grootscherm</div>
                `;
                btnOpen.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let cleanUrl = fileUrl;
                    if (!cleanUrl.includes('isInlineRender=true')) {
                         cleanUrl += (cleanUrl.includes('?') ? '&' : '?') + 'isInlineRender=true';
                    }
                    window.open(cleanUrl, '_blank');
                };

                // Download Button
                const btnDownload = document.createElement('button');
                btnDownload.className = BTN_CLASS;
                btnDownload.type = 'button';
                btnDownload.setAttribute('aria-label', 'Direct downloaden');
                btnDownload.innerHTML = `
                    ${DOWNLOAD_ICON}
                    <div class="${TOOLTIP_CLASS}">Direct downloaden</div>
                `;
                btnDownload.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let downloadUrl = fileUrl;
                    if (!downloadUrl.includes('xythos-download=true')) {
                         downloadUrl += (downloadUrl.includes('?') ? '&' : '?') + 'xythos-download=true';
                    }
                    downloadUrl = downloadUrl.replace('isInlineRender=true', '').replace('render=inline', '');
                    
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.setAttribute('download', '');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };

                // Insert buttons
                if (metaBlock.nextSibling) {
                    toolbar.insertBefore(btnOpen, metaBlock.nextSibling);
                    toolbar.insertBefore(btnDownload, btnOpen.nextSibling);
                } else {
                    toolbar.appendChild(btnOpen);
                    toolbar.appendChild(btnDownload);
                }
            }
        });
    }

    setInterval(addButtons, 1000);

})();