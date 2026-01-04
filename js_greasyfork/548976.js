// ==UserScript==
// @name         Roblox Button Recolor
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Changes Roblox primary buttons to the old green color
// @author       GooglyBlox
// @match        https://www.roblox.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548976/Roblox%20Button%20Recolor.user.js
// @updateURL https://update.greasyfork.org/scripts/548976/Roblox%20Button%20Recolor.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const targetColor = '#00b06f';
    const targetColorRgb = 'rgb(0, 176, 111)';
    const originalColor = '#335fff';
    const originalColorRgb = 'rgb(51, 95, 255)';
    const hoverColor = '#009c63';
    const activeColor = '#008557';
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.setAttribute('data-userscript', 'roblox-button-recolor');
        style.textContent = `
            :root {
                --color-action-emphasis-background: ${targetColor} !important;
                --dark-mode-action-emphasis-background: ${targetColor} !important;
                --light-mode-action-emphasis-background: ${targetColor} !important;
                --color-extended-blue-700: ${targetColor} !important;
                --dark-mode-system-emphasis: ${targetColor} !important;
                --light-mode-system-emphasis: ${targetColor} !important;
            }
        `;
        document.head.appendChild(style);
    }
    function shouldRecolorButton(button) {
        const computedStyle = window.getComputedStyle(button);
        const currentBgColor = computedStyle.backgroundColor;
        if (currentBgColor === targetColorRgb) {
            return false;
        }
        if (currentBgColor === originalColorRgb) {
            return true;
        }
        const inlineStyle = button.style.backgroundColor;
        if (inlineStyle === targetColorRgb || inlineStyle === targetColor) {
            return false;
        }
        return false;
    }
    function forceRecolorButtons() {
        const allButtons = document.querySelectorAll('button, div[class*="btn"], a[class*="btn"]');
        allButtons.forEach(button => {
            if (shouldRecolorButton(button)) {
                button.style.setProperty('background-color', targetColor, 'important');
                button.style.setProperty('border-color', targetColor, 'important');
            }
        });
    }
    addGlobalStyles();
    forceRecolorButtons();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceRecolorButtons);
    } else {
        setTimeout(forceRecolorButtons, 0);
    }
    window.addEventListener('load', forceRecolorButtons);
    const observer = new MutationObserver(function(mutations) {
        let shouldRecolor = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'BUTTON' || node.tagName === 'A' || node.querySelector('button, a[class*="btn"]') || node.classList.contains('btn')) {
                            shouldRecolor = true;
                            break;
                        }
                    }
                }
            }
        });
        if (shouldRecolor) {
            forceRecolorButtons();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    let rafId;
    function scheduleRecolor() {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            forceRecolorButtons();
            rafId = null;
        });
    }
    setInterval(scheduleRecolor, 500);
})();