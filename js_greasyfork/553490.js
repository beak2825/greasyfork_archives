// ==UserScript==
// @name         Auto Card Recon
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Uploads card recon receipts, sets descriptions, and uses Mass Allocate for Accounting.
// @author       Gemini & Elder Benjamin Finch
// @match        https://card.churchofjesuschrist.org/psc/card/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553490/Auto%20Card%20Recon.user.js
// @updateURL https://update.greasyfork.org/scripts/553490/Auto%20Card%20Recon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;

    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    const log = (msg) => console.log(`[Recon v3.0] ${msg}`);
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const waitForElement = (selector, context = document, timeout = 30000) => {
        return new Promise((resolve, reject) => {
            log(`Waiting for: "${selector}"`);
            const intervalTime = 100;
            let elapsedTime = 0;
            const interval = setInterval(() => {
                const element = context.querySelector(selector);
                if (element) {
                    // log(`Found: "${selector}"`); // Reduce noise
                    clearInterval(interval);
                    resolve(element);
                } else {
                    elapsedTime += intervalTime;
                    if (elapsedTime >= timeout) {
                        clearInterval(interval);
                        log(`FATAL ERROR: Timeout waiting for "${selector}"`);
                        reject(new Error(`Timeout waiting for: "${selector}"`));
                    }
                }
            }, intervalTime);
        });
    };

    const findNewestIframe = async (currentCount, timeout = 30000) => {
        log(`Looking for iframe > ${currentCount}...`);
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const frames = document.querySelectorAll('iframe[id^="ptModFrame_"]');
            if (frames.length > currentCount) {
                const newFrame = frames[frames.length - 1];
                try {
                    if (newFrame.contentDocument && newFrame.contentDocument.body.innerHTML.length > 50) {
                        return newFrame;
                    }
                } catch (e) { /* cross-origin wait */ }
            }
            await sleep(500);
        }
        throw new Error("Timeout waiting for new iframe to load.");
    };

    // --- METADATA ---
    async function extractKeywordsFromPDF(file) {
        try {
            const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
            const meta = await pdf.getMetadata();
            if (meta?.info?.Keywords) {
                const kw = meta.info.Keywords.trim();
                try { return JSON.parse(kw); } catch (e) { return kw.split(/[,; \t]+/).filter(k => k.trim()); }
            }
        } catch (e) { log(`Metadata error for ${file.name}: ${e.message}`); }
        return null;
    }

    // --- GUI ---
    function addStyles() {
        GM_addStyle(`
            #recon-float-btn { position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 12px 20px; background: #007bff; color: white; border: none; border-radius: 50px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 16px; }
            #recon-float-btn:hover { background: #0056b3; }
            #recon-float-btn:disabled { background: #999; cursor: wait; }
        `);
    }

    function createUI() {
        const btn = document.createElement('button');
        btn.id = 'recon-float-btn';
        btn.textContent = 'Start Recon';
        document.body.appendChild(btn);
        const fileIn = document.createElement('input');
        fileIn.type = 'file'; fileIn.multiple = true; fileIn.accept = '.pdf'; fileIn.style.display = 'none';
        document.body.appendChild(fileIn);
        btn.onclick = () => fileIn.click();
        fileIn.onchange = handleFiles;
    }

    // --- MAIN LOOP ---
    async function handleFiles(e) {
        const btn = document.getElementById('recon-float-btn');
        btn.disabled = true; btn.textContent = 'Processing...';

        try {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            log(`Reading ${files.length} files...`);
            const receipts = [];
            for (const file of files) {
                const name = file.name.replace(/\.pdf$/i, '');
                const parts = name.split('-');
                if (parts.length >= 2) {
                    const [valStr, cur] = parts[0].trim().split(' ');
                    const val = parseFloat(valStr.replace(/,/g, ''));
                    if (!isNaN(val)) {
                        receipts.push({
                            file,
                            value: val,
                            currency: (cur || 'USD').toUpperCase(),
                            lineItem: parts[parts.length - 1].trim(),
                            keywords: await extractKeywordsFromPDF(file)
                        });
                    }
                }
            }

            if (!receipts.length) { alert("No valid filenames found."); return; }

            // 1. Process Uploads & Descriptions
            for (const r of receipts) {
                await processReceipt(r);
            }

            // 2. Perform Mass Allocation
            await runMassAllocation(receipts);

            alert("Processing Complete!");

        } catch (err) {
            log("FATAL ERROR: " + err.message);
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            btn.disabled = false; btn.textContent = 'Start Recon';
            e.target.value = '';
        }
    }

    async function processReceipt(r) {
        log(`>>> Processing: ${r.lineItem} (${r.value})`);

        // Find row by Amount on main page
        const rows = document.querySelectorAll('li.ps_grid-row');
        let row = null;
        for (const rCandidate of rows) {
            const amt = rCandidate.querySelector("[id^='MONETARY_AMT_DTL\\$']")?.textContent.replace(/,/g, '');
            if (amt && Math.abs(parseFloat(amt) - r.value) < 0.01) {
                row = rCandidate;
                break;
            }
        }

        if (!row) { log(`No match for ${r.value}`); return; }

        // 1. Set Description
        row.click();
        log("Waiting for row details...");
        await sleep(4000);

        const desc = await waitForElement('#DESCR\\$0');
        desc.focus(); desc.value = r.lineItem;
        desc.dispatchEvent(new Event('change', { bubbles: true }));
        desc.blur();

        log("Waiting for description change...");
        await sleep(4000);

        // 2. Attach File
        let iframes = document.querySelectorAll('iframe').length;
        (await waitForElement("a[id^='EX_LINE_WRK_ATTACH_PB']")).click();
        const f1 = await findNewestIframe(iframes);
        const d1 = f1.contentDocument;

        iframes = document.querySelectorAll('iframe').length;
        (await waitForElement("a[id^='C_EX_ATT_WRK_ATTACHADD']", d1)).click();
        const f2 = await findNewestIframe(iframes);

        log("Waiting for upload modal...");
        await sleep(3500);
        const d2 = f2.contentDocument;

        const fileIn = await waitForElement('input[type="file"]#\\#ICOrigFileName', d2);
        const dt = new DataTransfer(); dt.items.add(r.file);
        fileIn.files = dt.files;
        fileIn.dispatchEvent(new Event('input', { bubbles: true }));
        fileIn.dispatchEvent(new Event('change', { bubbles: true }));
        fileIn.blur();
        await sleep(1500);

        (await waitForElement('a#\\#ICUpload', d2)).click();

        try {
            await waitForElement('.ps_attach-completetext', d2, 45000);
            log("Upload success.");
        } catch (e) {
            // Check if file exists in list
            if (!d2.body.textContent.includes(r.file.name)) throw new Error("Upload failed.");
        }

        (await waitForElement('a#\\#ICOK', d2)).click();
        await sleep(3000);

        // Save Attachment Modal
        const attDesc = await waitForElement("input[id^='ATTACH_DESCR\\$']", d1);
        attDesc.value = r.lineItem; attDesc.dispatchEvent(new Event('change', { bubbles: true }));
        (await waitForElement("a#\\#ICSave", d1)).click();
        await sleep(5000);

        // Removed Individual Accounting Logic from here
        log(`<<< Done with upload: ${r.lineItem}`);
    }

    // --- MASS ALLOCATION LOGIC ---

    async function runMassAllocation(receipts) {
        log(">>> STARTING MASS ALLOCATION PHASE <<<");

        // 1. Group receipts by Account Key (DeptSuffix + AccountCode)
        const groups = {};
        for (const r of receipts) {
            if (r.keywords && r.keywords.length >= 2) {
                // Key format: "400-5170" (DeptSuffix-Account)
                const key = `${r.keywords[0]}-${r.keywords[1]}`;
                if (!groups[key]) groups[key] = [];
                groups[key].push(r);
            } else {
                log(`Skipping allocation for ${r.lineItem} - Missing keywords`);
            }
        }

        const keys = Object.keys(groups);
        if (keys.length === 0) { log("No accounting keywords found."); return; }

        for (const key of keys) {
            const groupReceipts = groups[key];
            const deptSuffix = groupReceipts[0].keywords[0];
            const accountCode = groupReceipts[0].keywords[1];

            log(`Allocating Group: Dept 1863${deptSuffix} | Acct ${accountCode} | Count: ${groupReceipts.length}`);

            await performSingleMassAllocation(groupReceipts, deptSuffix, accountCode);

            // Wait for main page refresh before next group
            await sleep(4000);
        }
    }

    async function performSingleMassAllocation(groupReceipts, deptSuffix, accountCode) {
        // 1. Open Mass Allocate Modal
        const iframes = document.querySelectorAll('iframe').length;

        // Try finding the button on the main document or active iframe
        let massBtn = document.querySelector("a#EX_SHEET_FL_WRK_MASS_CHANGE_PB");
        if (!massBtn) {
            // Check existing iframes if button not on top
            const frames = document.querySelectorAll('iframe');
            for(let f of frames) {
                 massBtn = f.contentDocument?.querySelector("a#EX_SHEET_FL_WRK_MASS_CHANGE_PB");
                 if(massBtn) break;
            }
        }

        if (!massBtn) {
             log("Cannot find Mass Allocate button!");
             return;
        }

        massBtn.click();

        // 2. Wait for Modal
        const frame = await findNewestIframe(iframes);
        const doc = frame.contentDocument;
        await sleep(3000); // Wait for grid to render

        // 3. Find Rows & Select Matches
        const rows = doc.querySelectorAll("tr[id^='C_EX_DIST_DVW$0_row']");
        let matchesFound = 0;

        for (const row of rows) {
            // Extract Data from Row
            const amountEl = row.querySelector("span[id^='C_EX_DIST_DVW_TXN_AMOUNT']");
            const descEl = row.querySelector("p[id^='C_EX_DIST_DVW_DESCR254']");

            if (!amountEl || !descEl) continue;

            const rowAmount = parseFloat(amountEl.textContent.replace(/,/g, ''));
            const rowDesc = descEl.textContent.trim();

            // Check if this row matches ANY receipt in our current group
            // We match by Description (which we set earlier) AND Amount
            const isMatch = groupReceipts.some(r =>
                Math.abs(r.value - rowAmount) < 0.01 &&
                rowDesc === r.lineItem
            );

            if (isMatch) {
                const checkbox = row.querySelector("input[type='checkbox']");
                if (checkbox && !checkbox.checked) {
                    checkbox.click();
                    matchesFound++;
                    log(`Selected row: ${rowDesc} (${rowAmount})`);
                }
            }
        }

        // 4. Fill Data OR Cancel
        if (matchesFound > 0) {
            log(`Matches selected: ${matchesFound}. Filling data...`);

            // Helper for inputs
            const setVal = async (sel, val) => {
                const el = await waitForElement(sel, doc);
                el.focus();
                el.value = val;
                el.dispatchEvent(new Event('change', { bubbles: true }));
                // Simulate Enter for validation
                el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
                await sleep(1500);
                el.blur();
                await sleep(1000);
            };

            await setVal('input#C_EX_MASSUPD_VW_DEPTID\\$0', "1863" + deptSuffix);
            await setVal('input#C_EX_MASSUPD_VW_ACCOUNT\\$0', accountCode);

            log("Clicking Apply...");
            const applyBtn = await waitForElement('a#C_EX_MASSUPD_WK_PB_APPLY', doc);
            applyBtn.click();

            // Wait for processing loop to finish
            await sleep(5000);

        } else {
            log("No matching rows found for this group in Mass Allocate window. Cancelling...");

            // Click Cancel to close modal without errors
            const cancelBtn = doc.querySelector('a#C_EX_MASSUPD_WK_PB_CANCEL');
            if (cancelBtn) cancelBtn.click();
            else {
                // If Cancel isn't standard, try closing via OK (fallback)
                const okBtn = doc.querySelector('a#\\#ICOK'); // Note: escaped ID
                if (okBtn) okBtn.click();
            }
        }
    }

    createUI();
    addStyles();
})();