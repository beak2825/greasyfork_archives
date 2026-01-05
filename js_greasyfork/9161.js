// ==UserScript==
// @name gist-copy
// @namespace hakurouken/tamper-scripts/gist-copy
// @version 1.0.1
// @description Copy gist code with one-click.
// @author Hakurouken
// @homepage https://github.com/hakurouken/tamper-scripts/packages/gist-copy
// @supportURL https://github.com/hakurouken/tamper-scripts/issues
// @license MIT
// @run-at document-end
// @match https://gist.github.com/*
// @grant GM_setClipboard
// @grant window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/9161/gist-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/9161/gist-copy.meta.js
// ==/UserScript==

function noop() { }
function debounce(f, delay) {
    let timeoutId = null;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            f.apply(this, args);
        }, delay);
    };
}
function createCopyButton(fileElement) {
    const fileActionElement = fileElement.querySelector('.file-actions');
    const source = fileActionElement?.querySelector('a.Button');
    const url = source?.href;
    if (!url) {
        return noop;
    }
    const dummy = document.createElement('div');
    dummy.innerHTML = `
  <a class="Button--secondary Button--small Button gist-copy-button">
    <span class="Button-content">
      <span class="Button-label">Copy</span>
    </span>
  </a>
  `;
    const button = dummy.firstElementChild.cloneNode(true);
    let lockedTimeoutId = null;
    const copyHandler = (e) => {
        if (lockedTimeoutId) {
            return;
        }
        e.preventDefault();
        const rawContent = fileElement.querySelector('.blob-code-content')
            ?.innerText || '';
        const content = rawContent
            .split('\n')
            .map((line) => line.replace(/^\t/, ''))
            .join('\n');
        GM_setClipboard(content, { type: 'text', mimetype: 'text/plain' });
        button.style.filter = 'brightness(0.8)';
        button.innerText = 'Copied!';
        lockedTimeoutId = setTimeout(() => {
            button.style.filter = '';
            button.innerText = 'Copy';
            lockedTimeoutId = null;
        }, 1500);
    };
    button.addEventListener('click', copyHandler);
    fileActionElement.prepend(button);
    return () => {
        button.removeEventListener('click', copyHandler);
        if (lockedTimeoutId) {
            clearTimeout(lockedTimeoutId);
        }
        button.remove();
    };
}
function run() {
    let removeAllListeners = noop;
    function tryCreateCopyButtons() {
        removeAllListeners();
        const fileElements = [...document.querySelectorAll('.file')];
        const removeListeners = fileElements.map(createCopyButton);
        removeAllListeners = () => {
            removeListeners.map((f) => f());
            [...document.querySelectorAll('.gist-copy-button')].forEach((el) => {
                el.remove();
            });
        };
    }
    window.addEventListener('urlchange', debounce(tryCreateCopyButtons, 16));
}
run();
