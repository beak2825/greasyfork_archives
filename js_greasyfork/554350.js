// ==UserScript==
// @name         SpeedApp Chat Auto-Reload
// @namespace    Bad MDFK
// @version      1.0
// @description  Auto reincarcare pagina si monitorizare scriere
// @author       You
// @match        https://speedapp.io/chat
// @match        https://speedapp.io/channels/*/chat
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/554350/SpeedApp%20Chat%20Auto-Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/554350/SpeedApp%20Chat%20Auto-Reload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let reloadInterval;
    let reloadDelay = 5000;
    let typingTimeout;
    let sendTimeout;
    const autoReloadEnabled = GM_getValue('autoReloadEnabled', false);
    const savedReloadDelay = GM_getValue('reloadDelay', 5000);

    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.style.cssText = `
            position: fixed;
            bottom: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: #2d3748;
            border: 1px solid #4a5568;
            border-radius: 6px;
            padding: 8px 15px;
            z-index: 10000;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 12px;
            width: 200px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        `;

        controlPanel.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px;">
                <div style="display: flex; align-items: center;">
                    <input type="checkbox" id="autoReloadCheckbox" ${autoReloadEnabled ? 'checked' : ''}
                           style="margin-right: 6px;">
                    <label for="autoReloadCheckbox" style="cursor: pointer;">Auto-reload</label>
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <input type="number" id="reloadIntervalInput" value="${savedReloadDelay / 1000}" min="1" max="60"
                           style="width: 35px; padding: 2px; border: 1px solid #4a5568; border-radius: 3px; background: #1a202c; color: white; font-size: 11px;">
                    <span>sec</span>
                </div>
            </div>
            <div id="status" style="font-size: 10px; color: #a0aec0; text-align: center;">Gata</div>
        `;

        document.body.appendChild(controlPanel);

        const checkbox = document.getElementById('autoReloadCheckbox');
        const input = document.getElementById('reloadIntervalInput');
        const status = document.getElementById('status');

        checkbox.addEventListener('change', function() {
            GM_setValue('autoReloadEnabled', this.checked);
            if (this.checked) {
                reloadDelay = parseInt(input.value) * 1000;
                GM_setValue('reloadDelay', reloadDelay);
                startAutoReload();
                status.textContent = `Activ (${reloadDelay/1000}s)`;
            } else {
                stopAutoReload();
                status.textContent = 'Inactiv';
            }
        });

        input.addEventListener('change', function() {
            const newDelay = parseInt(this.value) * 1000;
            if (newDelay >= 1000 && newDelay <= 60000) {
                reloadDelay = newDelay;
                GM_setValue('reloadDelay', reloadDelay);
                if (checkbox.checked) {
                    restartAutoReload();
                    status.textContent = `Actualizat (${reloadDelay/1000}s)`;
                }
            }
        });

        if (autoReloadEnabled) {
            reloadDelay = savedReloadDelay;
            input.value = reloadDelay / 1000;
            startAutoReload();
            status.textContent = `Activ (${reloadDelay/1000}s)`;
        }
    }

    function startAutoReload() {
        stopAutoReload();
        reloadInterval = setInterval(() => {
            if (!isTyping()) {
                const status = document.getElementById('status');
                if (status) status.textContent = `Reîncarcă... (${reloadDelay/1000}s)`;
                location.reload();
            }
        }, reloadDelay);
    }

    function stopAutoReload() {
        if (reloadInterval) {
            clearInterval(reloadInterval);
            reloadInterval = null;
        }
    }

    function restartAutoReload() {
        if (document.getElementById('autoReloadCheckbox').checked) {
            startAutoReload();
        }
    }

    function isTyping() {
        const textarea = document.querySelector('textarea.form-control.border-0.p-0.d-flex');
        return textarea && textarea.value.length > 0;
    }

    function monitorTextarea() {
        const textarea = document.querySelector('textarea.form-control.border-0.p-0.d-flex');
        if (textarea) {
            textarea.addEventListener('input', function() {
                clearTimeout(typingTimeout);
                const status = document.getElementById('status');
                if (status) status.textContent = 'Scriu - pauză 30s';

                typingTimeout = setTimeout(() => {
                    const status = document.getElementById('status');
                    if (status && document.getElementById('autoReloadCheckbox').checked) {
                        status.textContent = `Reîncepe (${reloadDelay/1000}s)`;
                    }
                }, 30000);
            });

            textarea.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
                    e.preventDefault();
                    setTimeout(() => {
                        triggerReloadAfterSend();
                    }, 100);
                }
            });
        }
    }

    function monitorSendButton() {
        const sendButton = document.querySelector('button.btn.btn-secondary.btn-icon.ml-3');
        if (sendButton) {
            sendButton.addEventListener('click', function(e) {
                setTimeout(() => {
                    triggerReloadAfterSend();
                }, 100);
            });
        }
    }

    function triggerReloadAfterSend() {
        clearTimeout(sendTimeout);
        sendTimeout = setTimeout(() => {
            const status = document.getElementById('status');
            if (status) status.textContent = 'Mesaj trimis - reîncarcă în 1.5s';

            setTimeout(() => {
                location.reload();
            }, 1500);
        }, 100);
    }

    function init() {
        createControlPanel();
        monitorTextarea();
        monitorSendButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();