// ==UserScript==
// @name         Vercel Env Vars Export
// @namespace    https://github.com/GooglyBlox
// @version      1.0
// @description  Export Vercel environment variables to .env format
// @author       GooglyBlox
// @match        https://vercel.com/*/*/settings/environment-variables
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551210/Vercel%20Env%20Vars%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/551210/Vercel%20Env%20Vars%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createExportButton() {
        const buttons = Array.from(document.querySelectorAll('button'));
        const importButton = buttons.find(btn => btn.textContent.includes('Import .env'));

        if (!importButton) return;

        const container = importButton.closest('.stack-module__UbbKhW__stack');
        if (!container || container.querySelector('[data-export-button]')) return;

        const exportButton = importButton.cloneNode(true);
        exportButton.setAttribute('data-export-button', 'true');
        exportButton.innerHTML = `
            <span class="button-module__QyrFCa__prefix">
                <svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 1.75V1H7.25V1.75V8.43934L4.28033 5.46967L3.75 4.93934L2.68934 6L3.21967 6.53033L7.29289 10.6036C7.68342 10.9941 8.31658 10.9941 8.70711 10.6036L12.7803 6.53033L13.3107 6L12.25 4.93934L11.7197 5.46967L8.75 8.43934V1.75ZM2.5 10H1V11.5V13.5C1 14.8807 2.11929 16 3.5 16H12.5C13.8807 16 15 14.8807 15 13.5V11.5V10H13.5V11.5V13.5C13.5 14.0523 13.0523 14.5 12.5 14.5H3.5C2.94772 14.5 2.5 14.0523 2.5 13.5V11.5V10Z" fill="currentColor"></path>
                </svg>
            </span>
            <span class="button-module__QyrFCa__content">Export .env</span>
        `;

        exportButton.addEventListener('click', exportEnvVars);
        container.insertBefore(exportButton, importButton.parentElement);
    }

    async function waitForValue(row) {
        for (let i = 0; i < 60; i++) {
            const codeElement = row.querySelector('code.env-var-value');
            if (codeElement) return codeElement.textContent.trim();
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        return null;
    }

    async function exportEnvVars() {
        const rows = document.querySelectorAll('.env-variables-table-module__L-jLVG__resultRow');
        const envVars = [];

        for (const row of rows) {
            const nameElement = row.querySelector('.env-variables-table-module__L-jLVG__varName');
            const revealButton = row.querySelector('.env-variables-table-module__L-jLVG__reveal');
            if (!nameElement || !revealButton) continue;

            const name = nameElement.textContent.trim();
            const isRevealed = row.querySelector('code.env-var-value');

            const value = isRevealed ? isRevealed.textContent.trim() : (revealButton.click(), await waitForValue(row));

            if (value) envVars.push(`${name}=${value}`);
        }

        const envContent = envVars.join('\n');

        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(envContent);
        } else {
            await navigator.clipboard.writeText(envContent);
        }

        alert(`Copied ${envVars.length} environment variables to clipboard!`);
    }

    setTimeout(createExportButton, 1000);
})();