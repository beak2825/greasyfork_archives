// ==UserScript==
// @name         Github Repository Removal Simplifier
// @namespace    https://github.com/quickyyy
// @version      1.4
// @description  Simplify github repository deleting
// @author       quickyyy
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/558255/Github%20Repository%20Removal%20Simplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/558255/Github%20Repository%20Removal%20Simplifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleModal(modal) {
        const inputField = modal.querySelector('input[id="verification_field"]');
        
        if (!inputField) return;

        if (inputField.dataset.processed) return;
        inputField.dataset.processed = "true";

        let expectedText = inputField.getAttribute('data-repo-nwo');

        if (!expectedText) {
            const label = modal.querySelector('label[for="verification_field"]');
            if (label) {
                const match = label.textContent.match(/type "(.*?)"/);
                if (match && match[1]) {
                    expectedText = match[1];
                }
            }
        }

        if (!expectedText) return;

        const container = document.createElement('div');
        container.style.marginTop = '10px';
        container.style.marginBottom = '10px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'flex-start'; 

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'tm-delete-confirm-checkbox';
        checkbox.style.marginRight = '8px';
        checkbox.style.cursor = 'pointer';
        checkbox.style.width = 'auto'; 

        const label = document.createElement('label');
        label.htmlFor = 'tm-delete-confirm-checkbox';
        label.textContent = `I confirm I want to delete ${expectedText}`;
        label.style.cursor = 'pointer';
        label.style.userSelect = 'none';
        label.style.fontWeight = 'bold';

        container.appendChild(checkbox);
        container.appendChild(label);

        const containerToHide = inputField.closest('primer-text-field') || inputField.closest('.FormControl') || inputField.parentNode;

        containerToHide.parentNode.insertBefore(container, containerToHide);

        containerToHide.style.opacity = '0';
        containerToHide.style.position = 'absolute';
        containerToHide.style.pointerEvents = 'none';
        containerToHide.style.height = '0';
        containerToHide.style.overflow = 'hidden';

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                inputField.value = expectedText;
                inputField.setAttribute('value', expectedText);
            } else {
                inputField.value = '';
                inputField.setAttribute('value', '');
            }
            
            const events = ['focus', 'input', 'change', 'keyup', 'blur'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                inputField.dispatchEvent(event);
            });
        });
    }

    function scanForModals() {
        const inputs = document.querySelectorAll('input[id="verification_field"]');
        inputs.forEach(input => {
             const modal = input.closest('dialog') || input.closest('details-dialog') || input.closest('div[role="dialog"]') || input.closest('form');
             if (modal) handleModal(modal);
        });
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { 
                    if (node.tagName === 'DIALOG' || node.matches('details-dialog') || node.querySelector('input[id="verification_field"]')) {
                         const target = (node.tagName === 'DIALOG' || node.matches('details-dialog')) ? node : node.querySelector('input[id="verification_field"]').closest('dialog, details-dialog, form');
                         if (target) handleModal(target);
                    }
                    
                    const input = node.querySelector('input[id="verification_field"]');
                    if (input) {
                        const modal = input.closest('dialog') || input.closest('details-dialog') || input.closest('div[role="dialog"]') || input.closest('form');
                        if (modal) handleModal(modal);
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    scanForModals();

    document.addEventListener('turbo:load', scanForModals);
    document.addEventListener('pjax:end', scanForModals);

})();