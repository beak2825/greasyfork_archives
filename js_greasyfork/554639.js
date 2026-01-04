// ==UserScript==
// @name         LinkedIn Reposted & Apply Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.35
// @description  Highlights "Reposted" and applicant counts; highlights "driving licence/license" in blue reliably, with CPU‑safe observer.
// @author       You
// @match        https://*.linkedin.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554639/LinkedIn%20Reposted%20%20Apply%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/554639/LinkedIn%20Reposted%20%20Apply%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Highlighting Style Functions (Applicant Counts) ---
    function applyRedStyles(element) {
        element.style.backgroundColor = 'darkred';
        element.style.color = 'white';
        element.style.fontWeight = 'bold';
        element.classList.add('tampermonkey-highlighted-red');
    }
    function applyBurgundyStyles(element) {
        element.style.backgroundColor = '#613008';
        element.style.color = 'white';
        element.style.fontWeight = 'bold';
        element.classList.add('tampermonkey-highlighted-burgundy');
    }
    function applyGreenStyles(element) {
        element.style.backgroundColor = '#264F38';
        element.style.color = 'white';
        element.style.fontWeight = 'bold';
        element.classList.add('tampermonkey-highlighted-green');
    }
    function getApplicantCount(text) {
        const match = text.match(/\b(\d+)\s*(?:applicants|people clicked apply)/i);
        return match ? parseInt(match[1], 10) : null;
    }

    // --- DRIVING LICENCE CLEANUP AND HIGHLIGHT LOGIC ---
    function cleanHighlights(descEl) {
        descEl.querySelectorAll('.tampermonkey-highlight-blue').forEach(span => {
            const parent = span.parentNode;
            if (parent) {
                while (span.firstChild) parent.insertBefore(span.firstChild, span);
                parent.removeChild(span);
                parent.normalize();
            }
        });
    }

    function applyJobDescriptionHighlight(descEl) {
        const regex = /\bdriving\s+licen[cs]e\b/gi;
        const treeWalker = document.createTreeWalker(descEl, NodeFilter.SHOW_TEXT, null, false);
        let node, nodesToProcess = [];
        while ((node = treeWalker.nextNode())) {
            if (regex.test(node.textContent)) nodesToProcess.push(node);
        }
        nodesToProcess.forEach(textNode => {
            let text = textNode.textContent;
            let parent = textNode.parentNode;
            let lastIndex = 0;
            regex.lastIndex = 0;
            const frag = document.createDocumentFragment();
            let match;
            while ((match = regex.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                }
                const span = document.createElement('span');
                span.className = 'tampermonkey-highlight-blue';
                span.textContent = match[0];
                frag.appendChild(span);
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < text.length) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex)));
            }
            parent.replaceChild(frag, textNode);
        });
    }

    function highlightText() {
        const repostedRegex = /(?:Reposted).*?(?:ago)/i;

        // --- APPLICANT COUNT HIGHLIGHTING ---
        const feedElements = document.querySelectorAll('[class*="tvm__text--"]');
        feedElements.forEach(el => {
            const textContent = el.textContent;
            const applicantCount = getApplicantCount(textContent);
            if (el.classList.contains('tampermonkey-highlighted-red') ||
                el.classList.contains('tampermonkey-highlighted-burgundy') ||
                el.classList.contains('tampermonkey-highlighted-green')) return;

            if (repostedRegex.test(textContent) || (applicantCount !== null && applicantCount > 40)) {
                applyRedStyles(el); return;
            }
            if (applicantCount !== null && applicantCount >= 20 && applicantCount <= 40) {
                applyBurgundyStyles(el); return;
            }
            if (applicantCount !== null && applicantCount >= 0 && applicantCount <= 19) {
                applyGreenStyles(el); return;
            }
        });

        // --- DRIVING LICENCE/DRIVING LICENSE HIGHLIGHT ---
        if (!document.querySelector('#tm-blue-style')) {
            const blueStyle = document.createElement('style');
            blueStyle.id = 'tm-blue-style';
            blueStyle.innerHTML = `
                .tampermonkey-highlight-blue {
                    background-color: darkblue !important;
                    color: white !important;
                    font-weight: bold !important;
                }
            `;
            document.head.appendChild(blueStyle);
        }
        const descriptionContainers = document.querySelectorAll('.jobs-description-content__text--stretch');
        descriptionContainers.forEach(descEl => {
            cleanHighlights(descEl);
            applyJobDescriptionHighlight(descEl);
        });
    }

    // --- Main Page MutationObserver Setup (CPU‑safe) ---
    let debounceTimer;
    const mainObserver = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            highlightText();
        }, 300);
    });

    // Only observe relevant containers
    function observeTargets() {
        const targets = [
            ...document.querySelectorAll('.jobs-description-content__text--stretch'),
            ...document.querySelectorAll('[class*="tvm__text--"]')
        ];
        targets.forEach(node => {
            mainObserver.observe(node, { childList: true, subtree: true });
        });
    }

    observeTargets();
    highlightText();
})();
