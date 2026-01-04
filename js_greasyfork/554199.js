// ==UserScript==
// @name         Sportlogiq: Frame Fixer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds buttons to fix event frames by +/- 1F.
// @author       Volodymyr Kerdiak
// @match        https://app.sportlogiq.com/EventorApp.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554199/Sportlogiq%3A%20Frame%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/554199/Sportlogiq%3A%20Frame%20Fixer.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function injectCode() {
        if (typeof window.__FRAME_FIXER_INJECTED !== 'undefined') return;
        window.__FRAME_FIXER_INJECTED = true;

        const waitFor = (conditionFn, callbackFn, timeout = 3000) => { const startTime = Date.now(); const intervalId = setInterval(() => { if (conditionFn()) { clearInterval(intervalId); callbackFn(); } else if (Date.now() - startTime > timeout) { clearInterval(intervalId); } }, 100); };
        const simulateRealClick = (element) => { if (!element) return; const clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true }); element.dispatchEvent(clickEvent); };
        const performFrameFix = (eventId, direction) => {
            const row = document.getElementById(eventId);
            if (!row) return;
            row.click();
            setTimeout(() => {
                if (typeof playerEventEditor === 'undefined' || !playerEventEditor.checkIfUserCanEnterEditMode) return;
                playerEventEditor.checkIfUserCanEnterEditMode();
                waitFor(() => document.querySelector('div#frame-edit-controls.edit-current'), () => {
                    const timecodeSpan = document.getElementById('current-frame');
                    const originalTimecode = timecodeSpan ? timecodeSpan.textContent : '';
                    setTimeout(() => {
                        const buttonId = direction === 'next' ? 'f-next-frame' : 'f-previous-frame';
                        const frameButton = document.getElementById(buttonId);
                        if (!frameButton) return;
                        simulateRealClick(frameButton);
                        waitFor(() => {
                            const currentTimecode = timecodeSpan ? timecodeSpan.textContent : '';
                            return currentTimecode && currentTimecode !== originalTimecode;
                        }, () => {
                            if (playerEventEditor.editData) { playerEventEditor.editData.frame = videoFrameTracker.get(); } else { return; }
                            setTimeout(() => {
                                if (typeof playerEventEditor.startExitEditMode === 'function') {
                                    playerEventEditor.startExitEditMode();
                                    waitFor(() => playerEventEditor && playerEventEditor.editMode === false, () => {}, 3000);
                                }
                            }, 150);
                        }, 3000);
                    }, 200);
                }, 3000);
            }, 50);
        };

        window.addEventListener('message', (event) => {
            if (event.source === window && event.data?.type === "FROM_USERSCRIPT_FRAME_FIX") {
                performFrameFix(event.data.payload.eventId, event.data.payload.direction);
            }
        });
    }

    const script = document.createElement('script');
    script.textContent = `(${injectCode.toString()})();`;
    document.documentElement.appendChild(script);
    script.remove();

    const FrameFixer = {
        _observer: null,
        _intervalId: null,
        _buttonColor: '#ffffff',
        _buttonHoverColor: '#999999',

        init: function() {
            this._buttonColor = GM_getValue('frameFixerButtonColor', '#ffffff');
            this._buttonHoverColor = GM_getValue('frameFixerButtonHoverColor', '#999999');
            this._start();
        },

        _start: function () {
            if (this._intervalId) return;
            this._intervalId = setInterval(() => {
                const targetTableBody = document.querySelector('#game-events tbody');
                if (targetTableBody) {
                    clearInterval(this._intervalId);
                    this._intervalId = null;
                    targetTableBody.querySelectorAll('tr').forEach(row => this._processTableRow(row));
                    this._observer = new MutationObserver((mutationsList) => {
                        for (const mutation of mutationsList) {
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === 1) {
                                    const rows = node.tagName === 'TR' ? [node] : node.querySelectorAll('tr');
                                    rows.forEach(row => this._processTableRow(row));
                                }
                            }
                        }
                    });
                    this._observer.observe(targetTableBody, { childList: true, subtree: true });
                }
            }, 500);
        },

        _requestFrameFix: function(eventId, direction) {
            window.postMessage({
                type: "FROM_USERSCRIPT_FRAME_FIX",
                payload: { eventId, direction }
            }, window.location.origin);
        },

        _processTableRow: function (row) {
            if (!row || !row.id || row.hasAttribute('data-helper-processed-ff')) return;
            const createButtonCell = (title, iconClass, clickHandler) => {
                const cell = document.createElement('td');
                cell.className = 'frame-fix-cell';
                cell.style.width = '30px';
                cell.style.textAlign = 'center';
                const button = document.createElement('button');
                button.title = title;
                button.innerHTML = `<span class="glyphicon ${iconClass}" aria-hidden="true"></span>`;
                button.style.cssText = `background: transparent; border: none; padding: 0; margin: 0; cursor: pointer; color: ${this._buttonColor}; font-size: 14px; vertical-align: middle; transition: color 0.2s ease-in-out;`;
                button.onmouseover = () => button.style.color = this._buttonHoverColor;
                button.onmouseout = () => button.style.color = this._buttonColor;
                button.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); clickHandler(); });
                cell.appendChild(button);
                return cell;
            };
            if (row.id.startsWith('event-player-')) {
                const backButtonCell = createButtonCell('Fix Frame (-1F)', 'glyphicon-step-backward', () => this._requestFrameFix(row.id, 'prev'));
                const forwardButtonCell = createButtonCell('Fix Frame (+1F)', 'glyphicon-step-forward', () => this._requestFrameFix(row.id, 'next'));
                row.appendChild(backButtonCell);
                row.appendChild(forwardButtonCell);
            } else if (row.id.startsWith('event-game-')) {
                const emptyCell1 = document.createElement('td'); emptyCell1.className = 'frame-fix-cell';
                const emptyCell2 = document.createElement('td'); emptyCell2.className = 'frame-fix-cell';
                row.appendChild(emptyCell1);
                row.appendChild(emptyCell2);
            }
            row.setAttribute('data-helper-processed-ff', 'true');
        }
    };

    function configureColors() {
        const newColor = prompt('Enter button color:', GM_getValue('frameFixerButtonColor', '#ffffff'));
        if (newColor) GM_setValue('frameFixerButtonColor', newColor);
        const newHover = prompt('Enter button hover color:', GM_getValue('frameFixerButtonHoverColor', '#999999'));
        if (newHover) GM_setValue('frameFixerButtonHoverColor', newHover);
        alert('Button colors updated. Page will reload.');
        window.location.reload();
    }

    GM_registerMenuCommand('Configure Fixer Colors', configureColors);

    FrameFixer.init();
})();