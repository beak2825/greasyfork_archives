// ==UserScript==
// @name          Quotation Master (Left Sidebar Big Buttons)
// @namespace     http://tampermonkey.net/
// @version       5.0
// @description   Auto Price-to-Words, Header Corrections, Inline Row Manager, and Global Edit Toggle with Large Sidebar UI.
// @author        Mufty Pro
// @match         https://salsabeelcars.site/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/562211/Quotation%20Master%20%28Left%20Sidebar%20Big%20Buttons%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562211/Quotation%20Master%20%28Left%20Sidebar%20Big%20Buttons%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isGlobalEditable = false;
    let isSignEnabled = false;

    // --- 1. SETTINGS & TEXT CORRECTIONS ---
    const textCorrections = [
        { sel: 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(1) > div > div.col-sm-3.top_left > p', txt: "<strong>OFFER/</strong><br>QUOTATION" },
        { sel: 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(1) > div > div.col-sm-3.top_right > p:nth-child(1) > strong', txt: "<strong>Tel &nbsp;:&nbsp; +880-2-222293331-5</strong>" },
        { sel: 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(2) > div > p > b', txt: "<b>QUOTATION FOR BRAND NEW/RECONDITIONED MOTOR VEHICLE</b>" },
        { sel: 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(1) > div > div.col-sm-3.top_right > p:nth-child(2) > strong', txt: "<b> </b>" }
    ];

    // --- 2. AUTOMATIC PRICE TO WORDS LOGIC ---
    function convertToWords(num) {
        const ones = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        function convertChunk(n) {
            let word = '';
            if (n < 10) word = ones[n];
            else if (n < 20) word = (n === 10) ? 'Ten' : teens[n - 11];
            else if (n < 100) {
                word = tens[Math.floor(n / 10) - 1];
                if (n % 10 !== 0) word += '-' + ones[n % 10];
            } else if (n < 1000) {
                word = ones[Math.floor(n / 100)] + ' Hundred';
                let rem = n % 100;
                if (rem !== 0) word += ' ' + convertChunk(rem);
            }
            return word;
        }

        let crore = Math.floor(num / 10000000); num %= 10000000;
        let lakh = Math.floor(num / 100000); num %= 100000;
        let thousand = Math.floor(num / 1000); num %= 1000;
        let hundred = Math.floor(num / 100); num %= 100;

        let chunks = [];
        if (crore > 0) chunks.push(convertChunk(crore) + ' Crore');
        if (lakh > 0) chunks.push(convertChunk(lakh) + ' Lakh');
        if (thousand > 0) chunks.push(convertChunk(thousand) + ' Thousand');
        if (hundred > 0) chunks.push(convertChunk(hundred) + ' Hundred');
        if (num > 0) chunks.push(convertChunk(num));
        else if (chunks.length === 0) chunks.push('Zero');

        return (chunks.join(' ').trim() + ' Only').toUpperCase();
    }

    function updatePriceAndWords(autoInput = true) {
        const sourceInput = document.querySelector('body > div.wrapper > div.content-wrapper > section > div > form:nth-child(4) > div:nth-child(14) > div > input');
        const priceInput = document.querySelector('#price');
        const inWordInput = document.querySelector('#inWord');
        const salesNoteInput = document.querySelector('#salesNote');

        if (priceInput && inWordInput) {
            if (autoInput && sourceInput && priceInput.value !== sourceInput.value) {
                priceInput.value = sourceInput.value;
            }
            const priceValue = parseInt(priceInput.value, 10);
            if (!isNaN(priceValue)) {
                const words = convertToWords(priceValue);
                if (inWordInput.value !== words) inWordInput.value = words;
                if (salesNoteInput && salesNoteInput.value !== words) salesNoteInput.value = words;
            }
        }
    }

    // --- 3. UI GENERATOR (BIG BUTTONS ON LEFT) ---
    function createSidebar() {
        if (document.getElementById('master-sidebar')) return;

        const sidebar = document.createElement('div');
        sidebar.id = 'master-sidebar';
        sidebar.className = 'no-print';
        Object.assign(sidebar.style, {
            position: 'fixed',
            left: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: '10000',
            padding: '10px'
        });

        const btnBaseStyle = {
            width: '160px',
            padding: '15px 10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#fff',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            cursor: 'pointer',
            boxShadow: '4px 2px 10px rgba(0,0,0,0.3)',
            textAlign: 'left',
            transition: '0.3s'
        };

        // Button 1: Global Edit
        const editBtn = document.createElement('button');
        editBtn.innerText = '🖉 EDIT: OFF';
        Object.assign(editBtn.style, btnBaseStyle, { backgroundColor: '#333' });
        editBtn.onclick = () => {
            isGlobalEditable = !isGlobalEditable;
            document.body.setAttribute('contenteditable', isGlobalEditable);
            document.designMode = isGlobalEditable ? 'on' : 'off';
            editBtn.innerText = isGlobalEditable ? '🖉 EDIT: ON' : '🖉 EDIT: OFF';
            editBtn.style.backgroundColor = isGlobalEditable ? '#28a745' : '#333';
        };

        // Button 2: Signature
        const signBtn = document.createElement('button');
        signBtn.innerText = '✍ SIGN: OFF';
        Object.assign(signBtn.style, btnBaseStyle, { backgroundColor: '#007bff' });
        signBtn.onclick = () => {
            isSignEnabled = !isSignEnabled;
            const targetCell = document.querySelector('div.panel-body');
            if (isSignEnabled) {
                if (targetCell) {
                    targetCell.style.backgroundImage = 'url(https://salsabeelcars.site/uploads/car_photo/car_photo_9019_4.jpg)';
                    targetCell.style.backgroundSize = '110px';
                    targetCell.style.backgroundPosition = '100px 800px';
                    targetCell.style.backgroundRepeat = 'no-repeat';
                }
                updatePrintSignature(true);
                signBtn.innerText = '✍ SIGN: ON';
                signBtn.style.backgroundColor = '#28a745';
            } else {
                if (targetCell) targetCell.style.backgroundImage = 'none';
                updatePrintSignature(false);
                signBtn.innerText = '✍ SIGN: OFF';
                signBtn.style.backgroundColor = '#007bff';
            }
        };

        sidebar.appendChild(editBtn);
        sidebar.appendChild(signBtn);
        document.body.appendChild(sidebar);
    }

    function updatePrintSignature(enable) {
        let style = document.getElementById("print-sig-style");
        if (!style) {
            style = document.createElement('style');
            style.id = "print-sig-style";
            document.head.appendChild(style);
        }
        style.innerHTML = enable ? `@media print { div.panel-body { -webkit-print-color-adjust: exact; background: url(https://salsabeelcars.site/uploads/car_photo/car_photo_9019_3.jpg) no-repeat 100px 800px !important; background-size: 90px !important; } }` : '';
    }

    // --- 4. INLINE ROW MANAGER ---
    function injectRowButtons() {
        const ths = document.querySelectorAll('th');
        let tbody = null;
        for (let th of ths) { if (th.textContent.includes("Delivery :")) { tbody = th.closest('tbody'); break; } }
        if (!tbody) return;
        const container = tbody.closest('table').parentElement;
        if (container.querySelector('.inline-row-manager')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'no-print inline-row-manager';
        wrapper.style.marginTop = '5px';
        const btnStyle = `padding: 4px 8px; font-size: 11px; cursor: pointer; border: 1px solid #999; background: #fff; border-radius: 3px; margin-right: 5px; color: #333; font-weight: bold;`;

        const addBtn = document.createElement('button');
        addBtn.innerText = '+ Row';
        addBtn.setAttribute('style', btnStyle);
        addBtn.onclick = (e) => {
            e.preventDefault();
            const row = tbody.insertRow();
            row.innerHTML = `<th style="text-align:right;border:1px solid #000000;width:25%" contenteditable="true">Label:</th>
                             <th style="text-align:left;border:1px solid #000000;" contenteditable="true">-</th>`;
        };

        const remBtn = document.createElement('button');
        remBtn.innerText = '- Row';
        remBtn.setAttribute('style', btnStyle);
        remBtn.onclick = (e) => { e.preventDefault(); if (tbody.rows.length > 1) tbody.deleteRow(-1); };

        wrapper.appendChild(addBtn);
        wrapper.appendChild(remBtn);
        container.appendChild(wrapper);
    }

    // --- 5. INITIALIZATION ---
    function applyAll() {
        textCorrections.forEach(item => {
            const el = document.querySelector(item.sel);
            if (el && el.innerHTML !== item.txt) el.innerHTML = item.txt;
        });
        document.querySelectorAll('textarea').forEach(area => area.removeAttribute('readonly'));
        injectRowButtons();
        updatePriceAndWords(true);
        createSidebar();
    }

    const observer = new MutationObserver(() => {
        observer.disconnect();
        applyAll();
        observer.observe(document.body, { childList: true, subtree: true });
    });

    const style = document.createElement('style');
    style.innerHTML = `@media print { .no-print { display: none !important; } }`;
    document.head.appendChild(style);

    document.addEventListener('input', (e) => { if (e.target.id === 'price') updatePriceAndWords(false); });
    
    observer.observe(document.body, { childList: true, subtree: true });
    applyAll();

})();