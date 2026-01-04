// ==UserScript==
// @name         EvidenceHunt: Citation to PubMed Link
// @namespace    http://greasyfork.org/
// @version      1.0
// @description  Converts AI response citations into direct PubMed links with a toggle button.
// @author       Bui Quoc Dung
// @match        https://evidencehunt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561260/EvidenceHunt%3A%20Citation%20to%20PubMed%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/561260/EvidenceHunt%3A%20Citation%20to%20PubMed%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isGlobalPubMed = false;

    const buttonStyle = {
        marginLeft: '8px',
        marginTop: '10px',
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
    };

    function toggleChip(chip, toPubMed) {
        if (toPubMed) {
            if (!chip.dataset.originalHref) chip.dataset.originalHref = chip.getAttribute('href');
            const pubmedId = chip.dataset.originalHref.replace('#', '');
            chip.href = `https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`;
            chip.target = "_blank";
            chip.style.textDecoration = "underline";
            chip.onclick = (e) => e.stopPropagation();
        } else {
            chip.href = chip.dataset.originalHref || chip.getAttribute('href');
            chip.removeAttribute('target');
            chip.style.textDecoration = "none";
            chip.onclick = null;
        }
    }

    function updateMessageState(messageContent, toPubMed) {
        const chips = messageContent.querySelectorAll('a.reference-chip');
        chips.forEach(chip => toggleChip(chip, toPubMed));

        const btn = messageContent.querySelector('.eh-convert-btn');
        if (btn) {
            btn.innerText = toPubMed ? "Revert to Original" : "Convert to PubMed";
            btn.dataset.state = toPubMed ? "pubmed" : "original";
        }
    }

    function createButton(text, className, onClick) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.className = className;
        Object.assign(btn.style, buttonStyle);
        btn.onclick = onClick;
        return btn;
    }

    function processMessages() {
        const messages = document.querySelectorAll('.chat__message:has(.message__eh-image) .message__content');
        if (messages.length === 0) return;

        messages.forEach((msg, index) => {
            if (!msg.querySelector('.eh-convert-btn')) {
                const btn = createButton("Convert to PubMed", "eh-convert-btn", function() {
                    const isPubMed = this.dataset.state !== "pubmed";
                    updateMessageState(msg, isPubMed);
                });
                msg.appendChild(btn);
            }

            const isLast = (index === messages.length - 1);
            let allBtn = msg.querySelector('.eh-convert-all-btn');

            if (isLast) {
                if (!allBtn) {
                    allBtn = createButton(isGlobalPubMed ? "Revert All" : "Convert All", "eh-convert-all-btn", function() {
                        isGlobalPubMed = !isGlobalPubMed;
                        document.querySelectorAll('.chat__message:has(.message__eh-image) .message__content').forEach(m => {
                            updateMessageState(m, isGlobalPubMed);
                        });
                        document.querySelectorAll('.eh-convert-all-btn').forEach(b => {
                            b.innerText = isGlobalPubMed ? "Revert All" : "Convert All";
                        });
                    });
                    msg.appendChild(allBtn);
                }
            } else {
                if (allBtn) allBtn.remove();
            }
        });
    }

    const observer = new MutationObserver(processMessages);
    observer.observe(document.body, { childList: true, subtree: true });
    processMessages();

})();