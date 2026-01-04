// ==UserScript==
// @name        RAW Term Replacer WTRLAB
// @namespace   Violentmonkey Scripts
// @match       https://wtr-lab.com/en/novel/*
// @grant       none
// @version     1.0
// @author      -
// @description 11/23/2025, 4:24:20 PM
// @downloadURL https://update.greasyfork.org/scripts/556728/RAW%20Term%20Replacer%20WTRLAB.user.js
// @updateURL https://update.greasyfork.org/scripts/556728/RAW%20Term%20Replacer%20WTRLAB.meta.js
// ==/UserScript==
// === Data storage ===
(function () {
    const STORAGE_KEY = 'dataHashReplacements';

    // Load saved replacements
    let replacements = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // --- Floating Button ---
    const openModalBtn = document.createElement('button');
    openModalBtn.textContent = 'Raws';
    Object.assign(openModalBtn.style, {
        position: 'fixed',
        bottom: '60px',
        right: '20px',
        zIndex: '9999',
        padding: '8px 12px',
        background: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    });
    document.body.appendChild(openModalBtn);

    // --- Modal ---
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#fff',
        border: '1px solid #ccc',
        padding: '20px',
        zIndex: '10000',
        width: '320px',
        maxHeight: '70%',
        overflowY: 'auto',
        display: 'none',
        boxShadow: '0 0 12px rgba(0,0,0,0.3)',
        borderRadius: '6px',
    });
    document.body.appendChild(modal);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    Object.assign(closeBtn.style, { float: 'right', cursor: 'pointer' });
    closeBtn.onclick = () => (modal.style.display = 'none');
    modal.appendChild(closeBtn);

    const title = document.createElement('h3');
    title.textContent = 'Data-Hash Replacements';
    modal.appendChild(title);

    const listContainer = document.createElement('div');
    modal.appendChild(listContainer);

    const addContainer = document.createElement('div');
    addContainer.style.marginTop = '10px';
    modal.appendChild(addContainer);

    const dataHashInput = document.createElement('input');
    dataHashInput.placeholder = 'Data Hash';
    dataHashInput.style.width = 'calc(50% - 6px)';
    dataHashInput.style.marginRight = '6px';
    addContainer.appendChild(dataHashInput);

    const replacementInput = document.createElement('input');
    replacementInput.placeholder = 'Replacement';
    replacementInput.style.width = 'calc(50% - 6px)';
    addContainer.appendChild(replacementInput);

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add';
    addBtn.style.marginTop = '6px';
    addBtn.onclick = () => {
        const dh = dataHashInput.value.trim();
        const rp = replacementInput.value.trim();
        if (!dh || !rp) return;
        replacements.push({ dataHash: dh, to: rp });
        saveAndRender();
        dataHashInput.value = '';
        replacementInput.value = '';
    };
    addContainer.appendChild(addBtn);

    function saveAndRender() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(replacements));
        renderList();
        runReplacementMultiple(2, 50); // immediate update
    }

    function renderList() {
        listContainer.innerHTML = '';
        replacements.forEach((r, idx) => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.marginBottom = '4px';

            const span = document.createElement('span');
            span.textContent = `${r.dataHash} → ${r.to}`;
            div.appendChild(span);

            const del = document.createElement('button');
            del.textContent = 'Delete';
            del.onclick = () => {
                replacements.splice(idx, 1);
                saveAndRender();
            };
            div.appendChild(del);

            listContainer.appendChild(div);
        });
    }

    openModalBtn.onclick = () => {
        modal.style.display = 'block';
        renderList();
    };

    // --- Replacement Logic ---
    function applyDataHashReplacements() {
        if (!replacements.length) return;
        const spans = document.querySelectorAll('span[data-hash]');
        spans.forEach(span => {
            const dhEntry = replacements.find(r => r.dataHash === span.getAttribute('data-hash'));
            if (dhEntry) span.textContent = dhEntry.to;
        });
    }

    // Multi-pass
    function runReplacementMultiple(times = 2, delay = 50) {
        let count = 0;
        function nextPass() {
            applyDataHashReplacements();
            count++;
            if (count < times) setTimeout(nextPass, delay);
        }
        nextPass();
    }

    // --- SPA / URL changes ---
   // Run once after DOM is fully ready
window.addEventListener('DOMContentLoaded', () => {
    runReplacementMultiple(2, 50);
});
// Run replacements once, 4 seconds after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        runReplacementMultiple(3, 100); // or whatever multi-pass you want
        console.log('Replacements executed after 4 seconds.');
    }, 4000);
});
// SPA / URL changes
(function () {
    let lastUrl = location.href;

    function checkUrlChange() {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            // Delay slightly to allow new content to render
            setTimeout(() => runReplacementMultiple(2, 50), 100);
        }
    }

    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event("locationchange"));
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event("locationchange"));
    };

    window.addEventListener("popstate", () => window.dispatchEvent(new Event("locationchange")));
    window.addEventListener("locationchange", checkUrlChange);
})();
})();