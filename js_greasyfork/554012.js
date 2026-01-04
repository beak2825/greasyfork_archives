// ==UserScript==
// @name         Keymailer Code Enabler
// @namespace    https://github.com/your-username
// @version      2.0
// @description  Enables vault code buttons on Keymailer for users in creator programs
// @author       Ghosty-Tongue
// @match        https://www.keymailer.co/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554012/Keymailer%20Code%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/554012/Keymailer%20Code%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let processedElements = new Set();
    let modalActive = false;
    let successModalShown = false;

    function enableVaultButtons() {
        const elements = document.querySelectorAll('[data-href*="vaults"]');
        let enabledCount = 0;
        
        elements.forEach(element => {
            if (processedElements.has(element)) return;
            
            const hasRequiredClasses = 
                element.classList.contains('button') && 
                element.classList.contains('success') && 
                element.classList.contains('tiny') && 
                element.classList.contains('collapse') && 
                element.classList.contains('pull-right') && 
                element.classList.contains('js-modal') && 
                element.classList.contains('disabled') && 
                element.classList.contains('no-code');
            
            const hasViewCodeVariant = hasRequiredClasses && element.classList.contains('view-code');
            const hasClaimCodeVariant = hasRequiredClasses;
            
            if (hasViewCodeVariant || hasClaimCodeVariant) {
                element.setAttribute('js_modal', '#vault-code-modal');
                element.classList.remove('disabled');
                element.classList.remove('no-code');
                processedElements.add(element);
                enabledCount++;
            }
        });

        if (!modalActive) {
            const applyButton = document.querySelector('a[data-href*="/g/campaign/"][data-href*="/async_join_form"][js_modal]');
            if (applyButton && !applyButton.hasAttribute('data-modal-checked')) {
                applyButton.setAttribute('data-modal-checked', 'true');
                showExploitModal();
            } else if (!applyButton && enabledCount > 0 && !successModalShown) {
                showSuccessModal(enabledCount);
            }
        }
    }

    function showExploitModal() {
        modalActive = true;
        const modalOverlay = document.createElement('div');
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: background 0.3s ease;
            pointer-events: none;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transform: translateY(-20px);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: auto;
        `;

        const message = document.createElement('p');
        message.innerHTML = `
            <strong style="color: #ff4444; font-size: 18px;">Exploit Notice</strong><br><br>
            This exploit only works if user is within an active creator program.<br>
            Works with active and discontinued creator programs only.<br><br>
            <em>Sorry, you need to be in a creator program to use this.</em>
        `;
        message.style.cssText = `
            font-size: 16px;
            line-height: 1.5;
            margin: 0 0 20px 0;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            background: #ff4444;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        const closeModal = function() {
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
            modalOverlay.style.background = 'rgba(0,0,0,0)';
            setTimeout(() => {
                if (document.body.contains(modalOverlay)) {
                    document.body.removeChild(modalOverlay);
                }
                modalActive = false;
            }, 300);
        };

        closeButton.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) closeModal();
        });

        modalContent.appendChild(message);
        modalContent.appendChild(closeButton);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        setTimeout(() => {
            modalOverlay.style.background = 'rgba(0,0,0,0.7)';
            modalContent.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
        }, 10);
    }

    function showSuccessModal(enabledCount) {
        modalActive = true;
        successModalShown = true;
        const modalOverlay = document.createElement('div');
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: background 0.3s ease;
            pointer-events: none;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transform: translateY(-20px);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: auto;
        `;

        const message = document.createElement('p');
        message.innerHTML = `
            <strong style="color: #4CAF50; font-size: 18px;">Exploit Active! ✓</strong><br><br>
            Successfully enabled <strong>${enabledCount}</strong> vault button${enabledCount > 1 ? 's' : ''}.<br><br>
            You are in a creator program and the exploit is now active.<br>
            Vault buttons have been enabled.
        `;
        message.style.cssText = `
            font-size: 16px;
            line-height: 1.5;
            margin: 0 0 20px 0;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Awesome!';
        closeButton.style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            fontSize: 14px;
            font-weight: bold;
        `;

        const closeModal = function() {
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
            modalOverlay.style.background = 'rgba(0,0,0,0)';
            setTimeout(() => {
                if (document.body.contains(modalOverlay)) {
                    document.body.removeChild(modalOverlay);
                }
                modalActive = false;
            }, 300);
        };

        closeButton.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) closeModal();
        });

        modalContent.appendChild(message);
        modalContent.appendChild(closeButton);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        setTimeout(() => {
            modalOverlay.style.background = 'rgba(0,0,0,0.7)';
            modalContent.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
        }, 10);
    }

    window.addEventListener('load', enableVaultButtons);
    
    const observer = new MutationObserver(function(mutations) {
        let shouldProcess = false;
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldProcess = true;
                break;
            }
        }
        if (shouldProcess) {
            setTimeout(enableVaultButtons, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();