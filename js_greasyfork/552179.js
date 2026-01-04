// ==UserScript==
// @name         Scribd Downloader & Cleaner Pro
// @namespace    http://tampermonkey.net/
// @version      2025-10-10.5
// @description  Adds a download button, enhances the embed reader by force-loading pages, and adds a convenient print button.
// @author       lostarrows27
// @match        https://www.scribd.com/document/*
// @match        https://www.scribd.com/embeds/*/content*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scribd.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552179/Scribd%20Downloader%20%20Cleaner%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/552179/Scribd%20Downloader%20%20Cleaner%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getNumberId(url) {
        const match = url.match(/\/(\d+)\//);
        return match ? match[1] : null;
    }

    if (window.location.href.includes('/document/')) {
        const numberId = getNumberId(window.location.href);

        if (numberId) {
            const downloadButton = document.createElement('a');
            downloadButton.textContent = '👉🏻 Tải đi chờ chi ?🤨';
            downloadButton.href = `https://www.scribd.com/embeds/${numberId}/content`;
            downloadButton.target = '_blank';

            Object.assign(downloadButton.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#007bff',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '8px',
                zIndex: '9999',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            });

            document.body.appendChild(downloadButton);
        }
    }

    if (window.location.href.includes('/embeds/')) {

        function removeClutter() {
            document.querySelectorAll('.toolbar_drop, .mobile_overlay').forEach(el => el.remove());

            const commentsSection = document.querySelector('.comments_container');
            if (commentsSection) {
                commentsSection.remove();
            }
        }

        function removeDocumentScrollerClass() {
            document.querySelectorAll('.document_scroller').forEach(el => {
                el.classList.remove('document_scroller');
            });
        }

        function createPrintButton() {
            const printButton = document.createElement('button');
            printButton.textContent = 'Bấm đây để in nè 😎'
            printButton.onclick = () => window.print();

            Object.assign(printButton.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#17a2b8',
                color: 'white',
                padding: '15px 25px',
                borderRadius: '8px',
                zIndex: '9998',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            });

            document.body.appendChild(printButton);
            console.log('Print button created.');
        }

        function scrollToBottom(element) {
            return new Promise(resolve => {
                const scrollStep = 300;
                const scrollInterval = 16;
                const intervalId = setInterval(() => {
                    const lastScrollTop = element.scrollTop;
                    element.scrollTop += scrollStep;

                    if (element.scrollTop + element.clientHeight >= element.scrollHeight || element.scrollTop === lastScrollTop) {
                        element.scrollTop = element.scrollHeight;
                        clearInterval(intervalId);
                        setTimeout(resolve, 100);
                    }
                }, scrollInterval);
            });
        }

        const observer = new MutationObserver((mutations, obs) => {
            const scroller = document.querySelector('.document_scroller');
            if (scroller) {
                obs.disconnect();
                removeClutter();
                scrollToBottom(scroller)
                    .then(() => {
                        removeDocumentScrollerClass();
                        createPrintButton();
                    });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();