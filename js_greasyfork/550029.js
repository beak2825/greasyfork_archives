// ==UserScript==
// @name         AWS Amplify Env Bulk Add
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Adds a button to bulk-add environment variables on the AWS Amplify page from a .env file format using a stylish dialog.
// @author       Your Name
// @match        https://*.console.aws.amazon.com/amplify/apps/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550029/AWS%20Amplify%20Env%20Bulk%20Add.user.js
// @updateURL https://update.greasyfork.org/scripts/550029/AWS%20Amplify%20Env%20Bulk%20Add.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Modal Dialog Logic ---
    let modalElements = null;

    function createModal() {
        if (document.getElementById('env-bulk-add-modal-overlay')) return;

        // Inject the CSS for the modal
        GM_addStyle(`
            #env-bulk-add-modal-overlay {
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                display: none;
                justify-content: center;
                align-items: center;
            }
            #env-bulk-add-modal-content {
                background: #232f3e;
                color: #ffffff;
                padding: 24px;
                border-radius: 8px;
                width: 90%;
                max-width: 700px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            #env-bulk-add-modal-content h3 {
                margin: 0;
                color: #ffffff;
                font-size: 18px;
                font-weight: bold;
            }
            #env-bulk-add-textarea {
                width: 100%;
                height: 350px;
                background-color: #1a2430;
                color: #f0f0f0;
                border: 1px solid #4f5d6c;
                border-radius: 4px;
                font-family: 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace;
                font-size: 14px;
                padding: 12px;
                resize: vertical;
                box-sizing: border-box;
            }
            #env-bulk-add-modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }
            .env-modal-btn {
                padding: 8px 16px;
                border-radius: 4px;
                border: none;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.2s;
            }
            .env-modal-btn-primary {
                background-color: #5d6af7;
                color: white;
            }
            .env-modal-btn-primary:hover {
                background-color: #4a58d6;
            }
            .env-modal-btn-secondary {
                background-color: #4f5d6c;
                color: white;
            }
            .env-modal-btn-secondary:hover {
                background-color: #6a7b8f;
            }
        `);

        // Create the HTML elements
        const overlay = document.createElement('div');
        overlay.id = 'env-bulk-add-modal-overlay';

        const modal = document.createElement('div');
        modal.id = 'env-bulk-add-modal-content';
        modal.innerHTML = `
            <h3>Bulk Add Environment Variables</h3>
            <p style="margin: 0; color: #d0d0d0;">Paste the contents of your .env file below.</p>
            <textarea id="env-bulk-add-textarea" spellcheck="false" placeholder="KEY=VALUE\nANOTHER_KEY=ANOTHER_VALUE"></textarea>
            <div id="env-bulk-add-modal-actions">
                <button id="env-modal-cancel" class="env-modal-btn env-modal-btn-secondary">Cancel</button>
                <button id="env-modal-import" class="env-modal-btn env-modal-btn-primary">Import</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        modalElements = {
            overlay,
            textarea: document.getElementById('env-bulk-add-textarea'),
            importBtn: document.getElementById('env-modal-import'),
            cancelBtn: document.getElementById('env-modal-cancel'),
        };

        // Add event listeners
        modalElements.cancelBtn.onclick = closeModal;
        overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
        modalElements.importBtn.onclick = handleImport;
    }

    function openModal() {
        if (!modalElements) createModal();
        modalElements.overlay.style.display = 'flex';
        modalElements.textarea.value = '';
        modalElements.textarea.focus();
    }

    function closeModal() {
        if (modalElements) modalElements.overlay.style.display = 'none';
    }

    async function handleImport() {
        const envContent = modalElements.textarea.value;
        closeModal();
        if (envContent) {
            try {
                const variables = parseEnv(envContent);
                await fillVariables(variables);
            } catch (error) {
                console.error('An error occurred during bulk add:', error);
                alert('An unexpected error occurred. Check the browser console for details.');
            }
        }
    }


    // --- Core Script Logic ---

    function parseEnv(data) {
        return data.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => {
            const i = l.indexOf('=');
            if (i === -1) return null;
            let v = l.substring(i + 1).trim();
            if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
            return { key: l.substring(0, i).trim(), value: v };
        }).filter(Boolean);
    }

    function setReactInputValue(input, value) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    async function fillVariables(parsedVars) {
        if (!parsedVars || parsedVars.length === 0) {
            alert('No valid key=value pairs found in the provided text.');
            return;
        }

        const getRowCount = () => document.querySelectorAll('input[name^="environmentVariables["][name$="].name"]').length;
        let allKeyInputs = Array.from(document.querySelectorAll('input[name^="environmentVariables["][name$="].name"]'));
        let firstEmptyIndex = allKeyInputs.findIndex(input => !input.value.trim());
        if (firstEmptyIndex === -1) firstEmptyIndex = allKeyInputs.length;

        const rowsToAdd = (firstEmptyIndex + parsedVars.length) - getRowCount();

        if (rowsToAdd > 0) {
            const addButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim().includes('Add new'));
            if (!addButton) {
                alert('Error: Could not find the "Add new" button. The script may need updating.');
                return;
            }
            for (let i = 0; i < rowsToAdd; i++) addButton.click();

            await new Promise((res, rej) => {
                const int = setInterval(() => { if (getRowCount() >= (firstEmptyIndex + parsedVars.length)) { clearInterval(int); res(); } }, 100);
                setTimeout(() => { clearInterval(int); rej(new Error('Timeout adding new rows.')); }, 5000);
            }).catch(e => { alert(e.message); });
        }

        allKeyInputs = document.querySelectorAll('input[name^="environmentVariables["][name$="].name"]');
        const allValueInputs = document.querySelectorAll('input[name^="environmentVariables["][name$="].value"]');

        parsedVars.forEach((v, i) => {
            const idx = firstEmptyIndex + i;
            if (allKeyInputs[idx] && allValueInputs[idx]) {
                setReactInputValue(allKeyInputs[idx], v.key);
                setReactInputValue(allValueInputs[idx], v.value);
            }
        });

        alert(`Successfully populated ${parsedVars.length} environment variables!\n\nPlease review and click "Save".`);
    }

    function addBulkButtonToPage() {
        if (document.getElementById('bulk-add-env-btn')) return;

        const heading = Array.from(document.querySelectorAll('h1, h2, h3, div, span'))
            .find(el => el.textContent.trim() === 'Environment Variables' && el.offsetParent !== null);
        if (!heading || !heading.parentElement) return;

        const headerContainer = heading.parentElement;
        if (headerContainer.querySelector('#bulk-add-env-btn')) return;

        headerContainer.style.display = 'flex';
        headerContainer.style.justifyContent = 'space-between';
        headerContainer.style.alignItems = 'center';
        headerContainer.style.width = '100%';

        const bulkAddButton = document.createElement('button');
        bulkAddButton.textContent = 'Bulk Add from .env';
        bulkAddButton.id = 'bulk-add-env-btn';
        bulkAddButton.type = 'button';
        bulkAddButton.style.height = 'fit-content';
        const saveButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Save');
        bulkAddButton.className = saveButton ? saveButton.className : 'amplify-button amplify-button--primary';

        bulkAddButton.onclick = openModal; // <-- This now opens our custom modal

        headerContainer.appendChild(bulkAddButton);
    }

    const observer = new MutationObserver(() => {
        const isCorrectPage = window.location.pathname.endsWith('/variables') || window.location.pathname.endsWith('/variables/EDIT') || window.location.pathname.includes('/hosting/environment-variables');
        if (isCorrectPage) {
            addBulkButtonToPage();
            createModal(); // Pre-build the modal so it's ready
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();