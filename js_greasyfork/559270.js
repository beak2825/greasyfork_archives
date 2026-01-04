// ==UserScript==
// @name         Notion Invoices Bulk Downloader
// @name:ru      Notion Invoices Bulk Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds bulk download for Notion invoices and receipts.
// @description:ru Массовое скачивание инвойсов и квитанций в Notion.
// @author       DayDve
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhQwBRAOMHAP8AAFxGsKJPkItx1/9bWsC23P+ysf///////////////////////////////////yH5BAEKAAgALAAAAABDAFEAAAT+EMlJq7046827HODgjSQZnmKprhPqsnDnzmlsU3Re36zu7zzPbwgMZohEowbJLBqbUGcsSpWqqtgpdrvaekOl77crpmrLyVJgjUP7KmzOet52vybzQCcfb9lBFHx6coKDfmWBhXuFfQhicIyLayCCdWZ4jI0ZeQUHBZWWSImZmhicB6iffBWio6SGGqeoqIqHOZCvdIRrnbOekbYorrmlF7KzqrXBw4IEAsqxc72+A6SsuJkE2qAbx8h81asWxAHa2s+63dK+s3ye4XmYxAMG5ufF4+vsB/AB3/EIcglwFmAAqnr2YG3SlypVHl/JBgk8J8CXPW27Akzz1G4OO4D+E80Z8IXQnDpe1GbB+6hLYElt7F4SWIhSZa9kLOMwGrim4oGXIy3aM8WQnz9aa3JKLDTQmc+fF4MevJivJqpqN5P6AsnUnlSo9mJSlaeRWsGOSiXsjCpWJMmxAYuGU3m0o86uFwl8lbl3aFyrRsv+SvuXT9O8et+6FTqz8MZwBmkRXotY29cDbGdhdGxWK7/JeCtbVrx4szd4N0ELOiwaJmkCqEzPGTANXuR9XFe31rtYs2vZeSL322h3qe7WYEf7jt24sDQ+xJHePS6aeVjmzLEx2ncgt+HdUy9ix9ycmTfpxr8jt25u/Oaqgm4XVxu6MuPfsMlHE4S7ZX3Er7nnVx5R0G3lH3WVfXUdfh7E14t3ebCW4CwlCUiCgxDOIWF11ll4oTXOabibV2B5qAYwlI0oEn7ZsVBLLX6pmB+DMYjDjV8SjGgiDN5V4BcAOa5H4w2wKBTkZgAkeWReOypxwY9JAomAfeS16CQGUCo5JYBV6nclliYhEKWUVA755ZONjbnkgjMOeKaPEqi5JZNdvvdmBnKWmV89d2IgZZ5cutYnnmNqqScqgxIKKJ12JmpBoWQG6qajE0AaqXgHULqBpRNgqqkGlhoa5qegQurjpKRSwGmqJRTKqgpyvkpClLKuIGWtjkYAADs=
// @match        https://www.notion.so/*
// @connect      stripe.com
// @connect      amazonaws.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @keywords     notion, invoices, download, pdf
// @downloadURL https://update.greasyfork.org/scripts/559270/Notion%20Invoices%20Bulk%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/559270/Notion%20Invoices%20Bulk%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- STYLES ---
    GM_addStyle(`
        /* Download Selected Button */
        #nir-mass-download-btn {
            user-select: none; transition: background 20ms ease-in, opacity 200ms;
            display: flex; align-items: center; justify-content: center; height: 32px;
            padding-inline: 12px; border-radius: 6px; white-space: nowrap;
            font-size: 14px; font-weight: 500; line-height: 1.2;
            margin-inline-start: 12px;
            cursor: not-allowed;

            opacity: 0.6;
            color: #888;
            border: 1px solid #555;
            background: #333;
            flex-shrink: 0;
        }

        #nir-mass-download-btn.active {
            opacity: 1;
            cursor: pointer;
            color: #2383e2;
            border: 1px solid rgba(35, 131, 226, 0.5);
            background: rgba(35, 131, 226, 0.1);
        }
        #nir-mass-download-btn.active:hover {
            background: rgba(35, 131, 226, 0.25);
        }

        #nir-mass-download-btn.loading {
            opacity: 0.7;
            cursor: wait !important;
            pointer-events: none;
        }

        /* Invoice Header Wrapper: Makes original header and new button inline */
        .nir-invoices-header-flex {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }

        /* Original Invoices Title (hidden to use modified copy in the flex container) */
        .nir-original-hidden {
            display: none !important;
        }

        /* Checkbox Container (inserted into row) */
        .nir-checkbox-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            margin-right: 8px;
            flex-shrink: 0;
            flex-grow: 0;
        }

        /* Modified Invoice Row: Enables checkbox placement */
        .nir-invoice-row-modified {
            display: flex !important;
            align-items: center !important;
            transition: background-color 0.3s ease;
        }

        /* Status Colors */
        .nir-row-downloading {
            background-color: rgba(255, 255, 0, 0.1) !important;
        }
        .nir-row-success {
            background-color: rgba(0, 128, 0, 0.1) !important;
        }
        .nir-row-error {
            background-color: rgba(255, 0, 0, 0.1) !important;
        }
    `);

    // --- GLOBAL STATE ---
    const STATE = {
        headers: null,
        invoiceMap: {}, // "Month D, YYYY" -> "in_XXXXXX"
        rawEvents: [],
        selectedInvoices: new Set(),
        processing: false
    };

    // --- 1. INTERCEPTOR (Capture Billing Data) ---
    function injectInterceptor() {
        const script = document.createElement('script');
        script.textContent = `
            (() => {
                const originalFetch = window.fetch;
                window.fetch = function(...args) {
                    const [resource, config] = args;
                    if (typeof resource === 'string' && resource.includes('getBillingHistory')) {
                        if (config && config.body) {
                            const p = originalFetch.apply(this, args);
                            p.then(res => res.clone().json()).then(json => {
                                window.dispatchEvent(new CustomEvent('NotionInvoiceCaptured', {
                                    detail: { headers: config.headers, data: json }
                                }));
                            });
                            return p;
                        }
                    }
                    return originalFetch.apply(this, args);
                };
            })();
        `;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }
    injectInterceptor();

    // --- 2. DATA LISTENER ---
    window.addEventListener('NotionInvoiceCaptured', (e) => {
        const events = e.detail.data.events || [];
        const invoices = events.filter(x => x.type === 'invoice');

        STATE.headers = e.detail.headers;
        STATE.rawEvents = invoices;
        STATE.selectedInvoices.clear();

        // Build map for DOM injection lookup
        const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        invoices.forEach(inv => {
            const m = inv.url.match(/(in_[a-zA-Z0-9]+)/);
            if (m) {
                const id = m[1];
                const dateText = formatter.format(new Date(inv.timestamp));
                STATE.invoiceMap[dateText] = id;
            }
        });

        startObserver();
    });

    // --- 3. DOM OBSERVER (Injection Logic) ---
    let observerTimer = null;
    function startObserver() {
        if (observerTimer) clearInterval(observerTimer);

        observerTimer = setInterval(() => {
            injectMassDownloadButton();

            // Find invoice rows based on unique styling
            const invoiceRows = document.querySelectorAll('div[style*="display: flex;"][style*="gap: 40px;"][style*="border-bottom: 1px solid var(--ca-regDivCol);"][style*="padding: 11px 0px;"]');

            invoiceRows.forEach(row => {
                if (row.classList.contains('nir-invoice-row-modified')) return;

                const infoCol = row.children[0];
                if (!infoCol) return;

                // Look for date text in the info column
                const dateMatch = infoCol.innerText.match(/([A-Z][a-z]+ \d{1,2}, \d{4})/);

                if (dateMatch) {
                    const dateString = dateMatch[0];
                    const invoiceId = STATE.invoiceMap[dateString];

                    if (invoiceId) {
                        row.classList.add('nir-invoice-row-modified');
                        injectCheckbox(row, invoiceId);
                    }
                }
            });
        }, 500);
    }

    // --- 4. UI INJECTION FUNCTIONS ---

    function injectCheckbox(rowElement, invoiceId) {
        const checkContainer = document.createElement('div');
        checkContainer.className = 'nir-checkbox-container';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.cursor = 'pointer';
        checkbox.id = `nir-check-${invoiceId}`;

        checkbox.onchange = () => {
            if (checkbox.checked) {
                STATE.selectedInvoices.add(invoiceId);
            } else {
                STATE.selectedInvoices.delete(invoiceId);
            }
            updateMassDownloadButtonState();
        };
        checkContainer.appendChild(checkbox);

        rowElement.insertBefore(checkContainer, rowElement.firstChild);

        // Status indicator insertion (empty div for applying color classes)
        const actionsCol = rowElement.children[2];
        if (actionsCol) {
            const statusIndicator = document.createElement('div');
            statusIndicator.id = `nir-status-${invoiceId}`;
            // Preserve the original margin-end of Notion's default button column
            statusIndicator.style.cssText = 'width: 0px; margin-inline-end: 10px;';

            const viewButton = actionsCol.querySelector('[role="button"]');
            if (viewButton) {
                actionsCol.insertBefore(statusIndicator, viewButton);
            }
        }
    }

    function injectMassDownloadButton() {
        const xpathResult = document.evaluate(
            '//div[text()="Invoices" and @style]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        );
        const invoicesTitle = xpathResult.singleNodeValue;

        if (!invoicesTitle) return;
        if (invoicesTitle.classList.contains('nir-processed')) return;
        invoicesTitle.classList.add('nir-processed');

        const titleCopy = invoicesTitle.cloneNode(true);

        let massBtn = document.createElement('div');
        massBtn.id = 'nir-mass-download-btn';
        massBtn.innerHTML = 'Download Selected (0)';
        massBtn.onclick = runMassDownload;

        const newContainer = document.createElement('div');
        newContainer.className = 'nir-invoices-header-flex';

        // Transfer styles (border-bottom, padding-bottom, margin-bottom) to the new container
        const originalStyle = invoicesTitle.getAttribute('style');
        newContainer.setAttribute('style', originalStyle);

        // Clear conflicting styles from the title copy
        titleCopy.style.borderBottom = 'none';
        titleCopy.style.paddingBottom = '0px';
        titleCopy.style.marginBottom = '0px';
        titleCopy.style.flexShrink = '0';

        newContainer.appendChild(titleCopy);
        newContainer.appendChild(massBtn);

        // Insert the new container before the original title
        const originalParent = invoicesTitle.parentElement;
        originalParent.insertBefore(newContainer, invoicesTitle);

        // Hide the original title element
        invoicesTitle.classList.add('nir-original-hidden');

        updateMassDownloadButtonState(massBtn);
    }

    function updateMassDownloadButtonState(btn = document.getElementById('nir-mass-download-btn')) {
        if (!btn || STATE.processing) return;

        const count = STATE.selectedInvoices.size;
        btn.innerHTML = `Download Selected (${count})`;

        if (count > 0) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }

    // --- 5. DOWNLOAD LOGIC ---

    async function runMassDownload() {
        const btn = document.getElementById('nir-mass-download-btn');
        if (!btn || !btn.classList.contains('active')) return;

        STATE.processing = true;
        btn.classList.add('loading');

        const headers = { ...STATE.headers, 'Cookie': document.cookie };
        delete headers['content-length'];

        const filesCollection = [];
        const queue = Array.from(STATE.selectedInvoices);

        try {
            for (let i = 0; i < queue.length; i++) {
                const invoiceId = queue[i];
                btn.innerHTML = `⏳ ${i + 1}/${queue.length}`;

                const rowEl = getRowElement(invoiceId);
                if (rowEl) {
                    rowEl.classList.add('nir-row-downloading');
                    rowEl.classList.remove('nir-row-success', 'nir-row-error');
                }

                try {
                    const result = await processViaNotionAPI(invoiceId, headers);
                    if (result.invoice.data) filesCollection.push(result.invoice);
                    if (result.receipt.data) filesCollection.push(result.receipt);

                    if (rowEl) {
                        rowEl.classList.remove('nir-row-downloading');
                        rowEl.classList.add('nir-row-success');
                    }
                } catch(e) {
                    if (rowEl) {
                        rowEl.classList.remove('nir-row-downloading');
                        rowEl.classList.add('nir-row-error');
                    }
                    console.warn(`Error processing ${invoiceId}:`, e);
                }

                await sleep(200);
            }

            btn.innerHTML = "Packing ZIP...";
            const zipBlob = createZip(filesCollection);
            saveBlob(zipBlob, `Notion_Invoices.zip`);

            STATE.selectedInvoices.clear();

            btn.innerHTML = "✅ Done!";
        } catch (e) {
            btn.innerHTML = "❌ Error";
            console.error(e);
        } finally {
            STATE.processing = false;
            // Reset status and checkboxes
            setTimeout(() => {
                btn.classList.remove('loading');
                updateMassDownloadButtonState();
                queue.forEach(id => {
                    const rowEl = getRowElement(id);
                    if (rowEl) {
                        rowEl.classList.remove('nir-row-success', 'nir-row-error');
                    }
                    const checkbox = document.getElementById(`nir-check-${id}`);
                    if (checkbox) checkbox.checked = false;
                });
            }, 3000);
        }
    }

    // --- CORE API WORKER (Native) ---
    async function processViaNotionAPI(invoiceId, authHeaders) {
        const notionRes = await fetch('https://www.notion.so/api/v3/getInvoiceData', {
            method: 'POST', headers: authHeaders, body: JSON.stringify({ type: 'invoice', invoiceId: invoiceId })
        });
        const nJson = await notionRes.json();
        const data = nJson.invoiceData;

        const dateStr = new Date(data.date).toISOString().split('T')[0];
        const num = data.invoiceNumber || invoiceId;

        const stripeUrl = data.hostedInvoiceUrl;
        const m = stripeUrl.match(/invoice\.stripe\.com\/i\/([^\/]+)\/([^\?]+)/);
        if (!m) throw new Error("Bad Stripe URL");

        const acct = m[1];
        const id = m[2];

        const [invData, recData] = await Promise.all([
            fetchDataViaJson(`https://invoicedata.stripe.com/invoice_pdf_file_url/${acct}/${id}`),
            fetchDataViaJson(`https://invoicedata.stripe.com/invoice_receipt_file_url/${acct}/${id}`)
        ]);

        return {
            invoice: { name: `${dateStr}__Invoice-${num}.pdf`, data: invData },
            receipt: { name: `${dateStr}__Receipt-${num}.pdf`, data: recData }
        };
    }

    async function fetchDataViaJson(apiUrl) {
        try {
            const json = await gmGetJSON(apiUrl);
            if (!json.file_url) return null;
            return await gmGetBytes(json.file_url);
        } catch (e) { return null; }
    }

    // --- ZIP ENGINE (No Lib) ---
    function createZip(files) {
        const parts = [];
        let offset = 0;
        const centralDirectory = [];
        const crcTable = new Int32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
            crcTable[i] = c;
        }
        function crc32(u8arr) {
            let crc = -1;
            for (let i = 0; i < u8arr.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ u8arr[i]) & 0xFF];
            return (crc ^ -1) >>> 0;
        }
        const encoder = new TextEncoder();

        for (const file of files) {
            if(!file.data) continue;
            const nameBytes = encoder.encode(file.name);
            const data = file.data;
            const crc = crc32(data);
            const header = new Uint8Array(30 + nameBytes.length);
            const view = new DataView(header.buffer);
            view.setUint32(0, 0x04034b50, true);
            view.setUint16(4, 0x000a, true);
            view.setUint16(6, 0x0000, true);
            view.setUint16(8, 0x0000, true);
            view.setUint32(14, crc, true);
            view.setUint32(18, data.length, true);
            view.setUint32(22, data.length, true);
            view.setUint16(26, nameBytes.length, true);
            view.setUint16(28, 0, true);
            header.set(nameBytes, 30);
            parts.push(header);
            parts.push(data);
            centralDirectory.push({ nameBytes, crc, size: data.length, offset });
            offset += header.length + data.length;
        }
        const cdStartOffset = offset;
        for (const cd of centralDirectory) {
            const header = new Uint8Array(46 + cd.nameBytes.length);
            const view = new DataView(header.buffer);
            view.setUint32(0, 0x02014b50, true);
            view.setUint16(4, 0x000a, true);
            view.setUint16(6, 0x000a, true);
            view.setUint16(8, 0x0000, true);
            view.setUint16(10, 0x0000, true);
            view.setUint32(16, cd.crc, true);
            view.setUint32(20, cd.size, true);
            view.setUint32(24, cd.size, true);
            view.setUint16(28, cd.nameBytes.length, true);
            view.setUint16(30, 0, true);
            view.setUint16(32, 0, true);
            view.setUint16(34, 0, true);
            view.setUint16(36, 0, true);
            view.setUint32(38, 0, true);
            view.setUint32(42, cd.offset, true);
            header.set(cd.nameBytes, 46);
            parts.push(header);
            offset += header.length;
        }
        const eocd = new Uint8Array(22);
        const view = new DataView(eocd.buffer);
        view.setUint32(0, 0x06054b50, true);
        view.setUint16(4, 0, true);
        view.setUint16(6, 0, true);
        view.setUint16(8, centralDirectory.length, true);
        view.setUint16(10, centralDirectory.length, true);
        view.setUint32(12, offset - cdStartOffset, true);
        view.setUint32(16, cdStartOffset, true);
        parts.push(eocd);
        return new Blob(parts, { type: 'application/zip' });
    }

    // --- HELPERS ---
    function getRowElement(invoiceId) {
        const checkbox = document.getElementById(`nir-check-${invoiceId}`);
        return checkbox ? checkbox.closest('.nir-invoice-row-modified') : null;
    }
    function gmGetJSON(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url,
                onload: r => { try { resolve(JSON.parse(r.responseText)) } catch { reject() } },
                onerror: reject
            });
        });
    }
    function gmGetBytes(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url, responseType: 'arraybuffer',
                onload: r => { if(r.status===200) resolve(new Uint8Array(r.response)); else reject(); },
                onerror: reject
            });
        });
    }
    function saveBlob(blob, name) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 1000);
    }
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
    // No-op log function for clean code
    function log() {}

})();
