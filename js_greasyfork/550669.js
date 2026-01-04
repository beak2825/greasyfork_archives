// ==UserScript==
// @name         Bulk ZIP Upload & Collect Images as ZIP
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Bulk upload JSONs, save images to ZIP, download all at once
// @match        https://cardconjurer.com/creator*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550669/Bulk%20ZIP%20Upload%20%20Collect%20Images%20as%20ZIP.user.js
// @updateURL https://update.greasyfork.org/scripts/550669/Bulk%20ZIP%20Upload%20%20Collect%20Images%20as%20ZIP.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForFileInput() {
        const fileInput = document.querySelector('input#file[type="file"][multiple][accept=".json"]');
        if (fileInput) {
            addBulkButton(fileInput);
        } else {
            setTimeout(waitForFileInput, 500);
        }
    }

    function addBulkButton(fileInput) {
        const container = document.createElement('div');
        container.style.marginTop = '20px';
        container.style.padding = '10px';
        container.style.borderTop = '2px dashed #ccc';
        container.style.textAlign = 'center';

        const bulkBtn = document.createElement('button');
        bulkBtn.textContent = '📦 Bulk Upload ZIP & Download All Images';
        bulkBtn.style.margin = '10px';
        bulkBtn.style.padding = '8px 16px';
        bulkBtn.style.border = '1px solid #999';
        bulkBtn.style.borderRadius = '6px';
        bulkBtn.style.background = '#f5f5f5';
        bulkBtn.style.fontSize = '14px';
        bulkBtn.style.cursor = 'pointer';

        const zipInput = document.createElement('input');
        zipInput.type = 'file';
        zipInput.accept = '.zip';
        zipInput.style.display = 'none';

        bulkBtn.addEventListener('click', () => {
            zipInput.click();
        });

        zipInput.addEventListener('change', async (e) => {
            if (!e.target.files.length) return;

            const zipFile = e.target.files[0];
            const jszip = new JSZip();
            const zip = await jszip.loadAsync(zipFile);

            const jsonFiles = Object.keys(zip.files).filter(name => name.toLowerCase().endsWith('.json'));

            const outputZip = new JSZip();

            for (const name of jsonFiles) {
                const content = await zip.files[name].async('blob');
                const jsonFile = new File([content], name, { type: "application/json" });

                // Simulate selecting this JSON file
                const dt = new DataTransfer();
                dt.items.add(jsonFile);
                fileInput.files = dt.files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                // Wait until Save Image button appears
                const saveBtn = await waitForElement(() =>
                    Array.from(document.querySelectorAll('button'))
                        .find(btn => btn.innerText.trim().includes('Save Image')),
                    10000
                );

                if (!saveBtn) {
                    console.warn(`Save Image button not found for ${name}`);
                    continue;
                }

                // Get image URL from the "Save Image" button
                saveBtn.click();
                await new Promise(res => setTimeout(res, 3500));

                // Try to detect downloaded image from <a> or canvas
                let imgData = await getImageFromCanvasOrLink();
                if (imgData) {
                    outputZip.file(name.replace(/\.json$/i, '.png'), imgData, { base64: true });
                    console.log(`Added ${name.replace(/\.json$/i, '.png')} to ZIP`);
                } else {
                    console.warn(`Could not capture image for ${name}`);
                }
            }

            // Download ZIP
            const zipBlob = await outputZip.generateAsync({ type: "blob" });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(zipBlob);
            a.download = 'all_cards.zip';
            a.click();
            console.log("All images zipped and downloaded.");
        });

        container.appendChild(bulkBtn);
        fileInput.closest('outline-card').after(container);
        document.body.appendChild(zipInput);
    }

    async function waitForElement(fn, timeout = 5000) {
        const start = Date.now();
        return new Promise(resolve => {
            (function check() {
                const el = fn();
                if (el) return resolve(el);
                if (Date.now() - start > timeout) return resolve(null);
                setTimeout(check, 200);
            })();
        });
    }

    async function getImageFromCanvasOrLink() {
        // Try <a download> approach
        const aTag = document.querySelector('a[download]');
        if (aTag && aTag.href.startsWith('data:image')) {
            return aTag.href.split(',')[1];
        }

        // Try canvas element
        const canvas = document.querySelector('canvas');
        if (canvas) {
            return canvas.toDataURL('image/png').split(',')[1];
        }

        return null;
    }

    waitForFileInput();
})();
