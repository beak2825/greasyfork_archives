// ==UserScript==
// @name         Send to X4 (Calibre-Web)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Send book to X4, works reliably when switching books
// @author       julienpierttr
// @match        http://calibre-web.local:8083/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564200/Send%20to%20X4%20%28Calibre-Web%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564200/Send%20to%20X4%20%28Calibre-Web%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const BUTTON_TEXT = "Send to X4";
    const TARGET_PATH = "/";
    const STORAGE_KEY = "x4_device_address_v2";

    // --- MAIN LOOP ---
    // 1. Check continuously every 1 second (Most robust for SPAs)
    setInterval(checkAndAddButton, 1000);

    // 2. Also check instantly when page changes
    const observer = new MutationObserver(checkAndAddButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // --- FUNCTIONS ---

    function checkAndAddButton() {
        // Find ALL download buttons on the page (hidden and visible)
        const allDownloadBtns = document.querySelectorAll('#Download');

        for (const dBtn of allDownloadBtns) {
            // FILTER: Ignore hidden buttons (width=0 means it's the "Ghost" of a previous book)
            if (dBtn.offsetWidth === 0 || dBtn.offsetHeight === 0) continue;

            // We found the VISIBLE download button.
            // Navigate up to the toolbar container
            const btnGroup = dBtn.closest('.btn-group');
            const mainToolbar = btnGroup ? btnGroup.parentElement : null;

            if (mainToolbar) {
                // CHECK: Does THIS specific toolbar have our button?
                // We use a specific class 'x4-added' to mark toolbars we have already fixed
                if (!mainToolbar.classList.contains('x4-added')) {
                    addSendButton(mainToolbar);
                    // Mark this toolbar as "Done" so we don't add 100 buttons
                    mainToolbar.classList.add('x4-added');
                }
            }
        }
    }

    function addSendButton(container) {
        const groupDiv = document.createElement('div');
        groupDiv.className = "btn-group";
        groupDiv.setAttribute("role", "group");
        groupDiv.style.marginLeft = "5px";

        const button = document.createElement('button');
        // We do NOT use a static ID anymore, to avoid conflicts
        button.type = 'button';
        button.className = 'btn btn-success x4-send-btn'; // Class for styling
        button.innerHTML = `<span class="glyphicon glyphicon-phone"></span> ${BUTTON_TEXT}`;

        // Pass the button element to the handler so we know which book we are on
        button.onclick = (e) => handleButtonClick(e.target);

        groupDiv.appendChild(button);
        container.appendChild(groupDiv);
    }

    async function handleButtonClick(clickedElement) {
        // Ensure we have the button (handle clicks on the span icon)
        const btn = clickedElement.closest('button');

        // 1. IP Check
        let x4Address = GM_getValue(STORAGE_KEY);
        if (!x4Address) {
            let rawInput = prompt("Enter X4 IP (e.g. 192.168.1.50):");
            if (!rawInput) return;
            x4Address = rawInput.replace(/^https?:\/\//, '').replace(/\/$/, '');
            GM_setValue(STORAGE_KEY, x4Address);
        }

        // 2. SCOPED DATA SEARCH
        // Find the 'row' or container that holds THIS button
        const bookContainer = btn.closest('.row') || document.body;

        // A. Find the EPUB Link (Scoped to this container)
        let downloadLink = bookContainer.querySelector('a[href$=".epub"]');
        if (!downloadLink) downloadLink = bookContainer.querySelector('a[href*=".epub"]');

        if (!downloadLink) {
            // Last ditch effort: search entire visible page
            downloadLink = document.querySelector('a[href$=".epub"]');
            if(downloadLink && downloadLink.offsetWidth === 0) downloadLink = null; // Don't use hidden links
        }

        if (!downloadLink) {
            alert("No visible .epub link found.");
            return;
        }

        // B. Generate Filename (Scoped)
        let filename = "book.epub";
        try {
            // Find Author
            let authorText = "Unknown";
            const authorEl = bookContainer.querySelector('a[href^="/author/"]');
            if (authorEl) authorText = authorEl.textContent.trim();

            // Find Title (Ignore "Books")
            let titleText = "";
            const h2 = bookContainer.querySelector('h2');
            if (h2) titleText = h2.textContent.trim();

            if (!titleText || titleText.toLowerCase() === 'books') {
                 // Try finding class .title if h2 failed
                 const tEl = bookContainer.querySelector('.title');
                 if(tEl) titleText = tEl.textContent.trim();
            }

            if (titleText && titleText.toLowerCase() !== 'books') {
                const rawName = `${authorText} - ${titleText}`;
                filename = `${rawName.replace(/[<>:"/\\|?*]/g, '')}.epub`;
                console.log(`[X4] Filename: ${filename}`);
            }
        } catch (e) {
            console.error(e);
        }

        // 3. Send
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="glyphicon glyphicon-refresh"></span> ...`;
        btn.disabled = true;

        try {
            const response = await fetch(downloadLink.href);
            const blob = await response.blob();

            btn.innerHTML = `<span class="glyphicon glyphicon-upload"></span> Sending`;

            uploadToX4(x4Address, blob, filename,
                () => {
                    btn.innerHTML = `<span class="glyphicon glyphicon-ok"></span> Sent!`;
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }, 3000);
                },
                (err) => {
                    alert("Upload Failed.");
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            );
        } catch (error) {
            alert("Error: " + error.message);
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    function uploadToX4(address, blob, filename, onSuccess, onError) {
        const formData = new FormData();
        formData.append("file", blob, filename);

        GM_xmlhttpRequest({
            method: "POST",
            url: `http://${address}/upload?path=${encodeURIComponent(TARGET_PATH)}`,
            data: formData,
            onload: (res) => (res.status >= 200 && res.status < 300) ? onSuccess(res) : onError(res),
            onerror: onError
        });
    }

})();