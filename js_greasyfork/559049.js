// ==UserScript==
// @name         Syosetu Floating Chapter Copy Button
// @namespace    https://ncode.syosetu.com/
// @version      0.2
// @description  Adds a floating button on ncode.syosetu.com chapter pages that copies the current chapter text (including the part title and chapter title) to the clipboard.
// @match        https://ncode.syosetu.com/*
// @grant        GM_setClipboard
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559049/Syosetu%20Floating%20Chapter%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/559049/Syosetu%20Floating%20Chapter%20Copy%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createCopyButton() {
        // Avoid adding multiple buttons
        if (document.getElementById('tm-copy-chapter-button')) {
            return;
        }
        const button = document.createElement('button');
        button.id = 'tm-copy-chapter-button';
        button.type = 'button';
        button.textContent = 'Copy chapter';
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 16px',
            fontSize: '14px',
            backgroundColor: '#007bff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: '2147483647',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            opacity: '0.9'
        });
        button.addEventListener('mouseenter', () => {
            button.style.opacity = '1.0';
        });
        button.addEventListener('mouseleave', () => {
            button.style.opacity = '0.9';
        });
        button.addEventListener('click', copyChapterText);
        document.body.appendChild(button);
    }

    function copyChapterText() {
        let outputText = '';

        // Gather the part line and heading line.
        let collectedTitle = '';

        // 1) Part title, e.g. 外伝7：帝国の銀月姫
        const partElem =
            document.querySelector('.c-announce span') ||
            document.querySelector('.p-novel__subtitle-chapter');
        if (partElem && partElem.textContent) {
            const partTitle = partElem.textContent.trim();
            if (partTitle.length > 0) {
                collectedTitle += partTitle;
                collectedTitle += '\n';
            }
        }

        // 2) Chapter title, e.g. 【7】至急の用件
        const headingElem =
            document.querySelector("h1.p-novel__title.p-novel__title--rensai") ||
            document.querySelector('.p-novel__subtitle-episode');
        if (headingElem && headingElem.textContent) {
            const chapterHeading = headingElem.textContent.trim();
            if (chapterHeading.length > 0) {
               collectedTitle += chapterHeading;
               collectedTitle += '\n';
            }
        }

        if (collectedTitle) {
            outputText += collectedTitle + '\n';
        }

        // Extract the body text.
        const bodyContainer = document.querySelector('.p-novel__body') ||
                              document.querySelector('.js-novel-text.p-novel__text') ||
                              document.querySelector('.js-novel-text p-novel__text');
        if (bodyContainer) {
            const paragraphs = bodyContainer.querySelectorAll('p');
            if (paragraphs && paragraphs.length > 0) {
                paragraphs.forEach((p) => {
                    let text = p.textContent || '';
                    text = text.replace(/\r?\n/g, '').trim();
                    if (text === '') {
                        outputText += '\n';
                    } else {
                        outputText += text + '\n';
                    }
                });
            } else {
                const rawText = bodyContainer.textContent || '';
                outputText += rawText.trim() + '\n';
            }
        }

        // Trim trailing newlines.
        outputText = outputText.replace(/\n+$/g, '');

        // Copy to clipboard and show toast.
        try {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(outputText);
                showToast('Chapter has been copied to the clipboard.');
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(outputText).then(() => {
                    showToast('Chapter has been copied to the clipboard.');
                }).catch(() => {
                    fallbackCopy(outputText, () => showToast('Chapter has been copied to the clipboard.'));
                });
            } else {
                fallbackCopy(outputText, () => showToast('Chapter has been copied to the clipboard.'));
            }
        } catch (e) {
            fallbackCopy(outputText, () => showToast('Chapter has been copied to the clipboard.'));
        }
    }

    function fallbackCopy(text, callback) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.width = '1px';
        textarea.style.height = '1px';
        textarea.style.padding = '0';
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';
        textarea.style.background = 'transparent';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            // ignore failures
        }
        document.body.removeChild(textarea);
        if (typeof callback === 'function') {
            callback();
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: '#fff',
            padding: '10px 15px',
            borderRadius: '4px',
            fontSize: '14px',
            zIndex: '2147483647',
            opacity: '1',
            transition: 'opacity 0.5s ease',
            maxWidth: '80%',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        });
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 500);
        }, 5000);
    }

    // Create button after DOM is ready.
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        createCopyButton();
    } else {
        window.addEventListener('DOMContentLoaded', createCopyButton);
    }
})();
