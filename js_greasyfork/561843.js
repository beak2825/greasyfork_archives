// ==UserScript==
// @name         DeepSeek Quick Navigation Tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add scroll-to-conversation buttons for DeepSeek chat interface
// @author       Emailtoxjk
// @match        https://chat.deepseek.com/*
// @icon         https://cdn.deepseek.com/chat/icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561843/DeepSeek%20Quick%20Navigation%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/561843/DeepSeek%20Quick%20Navigation%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonMap = new Map();
    let updateTimeout = null;

    function initObserver() {
        const observer = new MutationObserver(function(mutations) {
            let hasChanges = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                    hasChanges = true;
                    break;
                }
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    hasChanges = true;
                    break;
                }
            }
            if (hasChanges) scheduleUpdate();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
        return observer;
    }

    function scheduleUpdate() {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(updateAllButtons, 500);
    }

    function updateAllButtons() {
        const allMessageDivs = document.querySelectorAll('div[class*="ds-message"]');
        const containerDivs = [];
        const messageDivs = [];

        allMessageDivs.forEach(div => {
            const className = div.className || '';
            if (!className.includes('ds-message')) return;

            const spaceCount = (className.match(/ /g) || []).length;
            if (spaceCount === 2) containerDivs.push(div);
            else if (spaceCount === 1) messageDivs.push(div);
        });

        const minLength = Math.min(containerDivs.length, messageDivs.length);

        containerDivs.forEach((container, containerIndex) => {
            if (containerIndex < minLength) {
                addOrUpdateButton(container, messageDivs[containerIndex], containerIndex, containerIndex);
            } else {
                removeButton(container);
            }
        });

        for (const [container] of buttonMap.entries()) {
            if (!document.body.contains(container)) buttonMap.delete(container);
        }
    }

    function addOrUpdateButton(container, targetMessage, containerIndex, messageIndex) {
        let buttonContainer = buttonMap.get(container);

        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.className = 'ds-scroll-btn-container';
            buttonContainer.style.cssText = 'position: absolute; top: -35px; left: 50%; transform: translateX(-50%); z-index: 1000; opacity: 0.9; transition: opacity 0.2s;';

            const button = document.createElement('button');
            button.textContent = `Chat ${messageIndex + 1}`;
            button.style.cssText = 'padding: 4px 12px; background: linear-gradient(135deg, #10a37f, #0d8c6d); color: white; border: none; border-radius: 16px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(16, 163, 127, 0.3); white-space: nowrap; backdrop-filter: blur(4px); min-width: 60px;';

            button.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, #0d8c6d, #0b755a)';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 12px rgba(16, 163, 127, 0.4)';
                this.style.opacity = '1';
            });

            button.addEventListener('mouseleave', function() {
                this.style.background = 'linear-gradient(135deg, #10a37f, #0d8c6d)';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 8px rgba(16, 163, 127, 0.3)';
            });

            button.addEventListener('click', function(e) {
                e.stopPropagation();
                if (targetMessage) {
                    const messageRect = targetMessage.getBoundingClientRect();
                    const isInViewport = messageRect.top >= 0 && messageRect.bottom <= (window.innerHeight || document.documentElement.clientHeight);

                    if (!isInViewport) {
                        targetMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }

                    highlightMessage(targetMessage);
                }
            });

            buttonContainer.appendChild(button);
            if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
            container.prepend(buttonContainer);
            buttonMap.set(container, buttonContainer);
        } else {
            const button = buttonContainer.querySelector('button');
            if (button) button.textContent = `Chat ${messageIndex + 1}`;
        }
    }

    function removeButton(container) {
        const buttonContainer = buttonMap.get(container);
        if (buttonContainer && buttonContainer.parentNode) {
            buttonContainer.parentNode.removeChild(buttonContainer);
            buttonMap.delete(container);
        }
    }

    function highlightMessage(messageDiv) {
        const originalBoxShadow = messageDiv.style.boxShadow;
        const originalBorderRadius = messageDiv.style.borderRadius;
        const originalTransition = messageDiv.style.transition;

        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.boxShadow = '0 0 0 3px rgba(16, 163, 127, 0.4)';
        messageDiv.style.borderRadius = '8px';

        setTimeout(() => {
            messageDiv.style.boxShadow = originalBoxShadow;
            messageDiv.style.borderRadius = originalBorderRadius;
            messageDiv.style.transition = originalTransition;
        }, 1500);
    }

    function init() {
        const style = document.createElement('style');
        style.textContent = `
            .ds-scroll-btn:active { transform: scale(0.95) !important; }
            @keyframes dsButtonAppear { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 0.9; transform: translateX(-50%) translateY(0); } }
            .ds-scroll-btn-container { animation: dsButtonAppear 0.3s ease-out; }
            @keyframes dsButtonPulse { 0% { box-shadow: 0 2px 8px rgba(16, 163, 127, 0.3); } 50% { box-shadow: 0 2px 16px rgba(16, 163, 127, 0.5); } 100% { box-shadow: 0 2px 8px rgba(16, 163, 127, 0.3); } }
            .ds-scroll-btn:hover { animation: dsButtonPulse 1.5s infinite; }
        `;
        document.head.appendChild(style);

        initObserver();
        setTimeout(updateAllButtons, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }
})();