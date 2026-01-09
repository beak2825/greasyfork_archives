// ==UserScript==
// @name         CS Show Adopted From Display
// @namespace    Bec
// @version      1.1
// @description  Show "Adopted From" text for pets using pre-indexed IDs, toggleable next to Rename Pets
// @author       straybec
// @match        https://www.chickensmoothie.com/accounts/viewgroup.php?userid=*
// @match        https://www.chickensmoothie.com/accounts/viewgroup.php?groupid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561786/CS%20Show%20Adopted%20From%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/561786/CS%20Show%20Adopted%20From%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const petData = {

    // -------------------------
    // 2025
    // -------------------------
        "8E57B1A1A8224CB3D5D941602F602688": "Store Pets 2025",
        "1BB32077DEF43AC4D0F3F64B684ADC06": "Store Pets 2025",
        "7E720234E64C04E4EDB8A0F8BC23FD4C": "Store Pets 2025",
        "9E630E86AC4F38F5AE34BE65E43AE98E": "Store Pets 2025",
        "99927D47827AFFB259CB3A8C736C860B": "Store Pets 2025",
        "A6E083E3FDFBE2DA2BA21B5C5277E0FD": "Store Pets 2025",
        "A23DBB6BF585AFB3486BD9B1E34B4C96": "Store Pets 2025",
        "93B44A9FF0661964D0B81EB10495E381": "Store Pets 2025",
        "C6F081912A409F1ED97ACAF4B00D9D1F": "Store Pets 2025",
        "0E8CAD110A8C7D216619AACCDEBD7DC1": "Store Pets 2025",
        "6B305C6A2F4017FB800A0761905C9661": "Store Pets 2025",
        "64B13DFC48D474FA5E0423E0A5BF5D6E": "Store Pets 2025",
        "C9A8B420296326909CFA0B6B536465BA": "Store Pets 2025",
        "8572451035FF96189E8801D5324D68FE": "Store Pets 2025",
        "58C2C70A82F3BE306FAAB10DD0492D6E": "Store Pets 2025",
        "FD08C7D8A344DF002E66451C44917AA6": "Store Pets 2025",
        "E30E8F91B81F700253BEBB2752836050": "Store Pets 2025",
        "7A765416CBF0753AB885667BD2C2F3A9": "Store Pets 2025",
        "EDD177BD180A8E6C3CCDC3F74A95FE93": "Store Pets 2025",
        "DA2D74D23D052FC6F2E06D8409A190DB": "Store Pets 2025",
        "06C75ABCD43A6E5FE7DEF70932BA714D": "Store Pets 2025",
        "A8DAD3919112E0830DD2FC53AB5A9ACF": "Store Pets 2025",
        "56E6EB853C41BD04CEEEA05D363D51E2": "Store Pets 2025",
        "272DE98337A68CE076E2CDEC8429E8D5": "Store Pets 2025",
        "7607F15CD41CA17124FBC288C5F9DD9B": "Store Pets 2025",
    // -------------------------
    // 2008
    // -------------------------
        "C5057EC610648C14A89E48D89EC4656A": "July 2008",
        "766529E4E82EF25D3E794E4A308FEF6E": "July 2008",
        "364E771515A90045C5A7E2880CAA94DA": "July 2008",
        "7317CA0A4BD89965992266534949BFB5": "July 2008",
        "D6D87AC0306F17DA7AE7ECF066456B0B": "July 2008",
        "59C0F41AF842FC7F4490FDD9F8C90A51": "July 2008",
        "43C6C21185F617805631D7EFBCDCE7D7": "July 2008",
        "47F2A5D68C6F0DDC170FA0B1F7160EF2": "July 2008",
        "0298A4D843E20303246FDE73DC08598B": "July 2008",
        "1D5599075513299C717496FECFE7B5D7": "July 2008",
        "EE8DDB7045A00424D986AEC3ED274C95": "July 2008",
        "899E2F480B7F7783BC977AC53176D76A": "July 2008",
        "9E775B31413163C6095225C4BBC325DC": "July 2008",
        "991230410D1AD9751F2DC9CE88F9A341": "July 2008",
        "0018FE5CE4ED4EAD378D270EC7657527": "July 2008",
        "08CEC244AAC523BD6BDC48310149553A": "July 2008",
        "B961AF0681EF11CC018C3091B333B4B1": "July 2008",
        "7C11C59EAA79E92F158A1C5E812A2BEE": "July 2008",
        "7049E938168E517EBD78C483A14EE650": "July 2008",
        "2D5DFCD5BDC6F9D019331E100DC47903": "July 2008",
        "1A9C5DDA6755F9E06C0C29A62ECE55C2": "July 2008",
        "75397BFF7310D103B71E28B68F8C2916": "July 2008",
        "E611F2988AEA0296E2820FEB5A3A8634": "July 2008",
        "EB76E23C7476377F309F7018E98D219D": "July 2008",
        "8D4E8E5B9362A704CD7752847DA14DFE": "July 2008",
        "FE3F462C3B840D91448DB5AE1A6E0B85": "July 2008",
        "7860A82084A8EB78BC1A99D3F969099D": "July 2008",
        "616AEE5D9110B88194A9E3B70EE54707": "July 2008",
        "94EB15DCE7A9B2A67FA06FA8EC3A0E53": "July 2008",
        "A9A04F73A8C0D246B5E56B0D68D7E45F": "July 2008",
        "F47075F3CD8D517C631FD1677F8AE907": "July 2008",
        "0CF7292EE6E273303FDDFDC439A1B336": "July 2008"
        // Add more as needed
    };

    let labelsVisible = false;
    const labelElements = [];
    let toggleButton = null; // Store reference to button

    // Add toggle button if missing
    function addToggleButton() {
        const renameButton = document.querySelector('.btn-rename-pets');
        if (!renameButton) return;

        // Only create the button once
        if (!toggleButton) {
            const button = document.createElement('button');
            button.textContent = 'Show Adopted From';
            button.className = 'btn-show-adopted';
            button.style.marginLeft = '8px';
            button.style.padding = '2px 6px';
            button.style.fontSize = '12px';
            button.style.cursor = 'pointer';

            button.addEventListener('click', () => {
                labelsVisible = !labelsVisible;
                if (labelsVisible) {
                    showLabels();
                    button.textContent = 'Hide Adopted From'; // Change text when showing
                } else {
                    hideLabels();
                    button.textContent = 'Show Adopted From'; // Change text when hiding
                }
            });

            renameButton.parentNode.insertBefore(button, renameButton.nextSibling);
            toggleButton = button; // Save reference
        }
    }

    function showLabels() {
        document.querySelectorAll('img').forEach(img => {
            const src = img.src;
            for (const id in petData) {
                if (src.includes(id) && !img.dataset.adoptedFrom) {
                    const label = document.createElement('div');
                    label.textContent = `Adopted from: ${petData[id]}`;
                    label.style.fontSize = '12px';
                    label.style.marginTop = '2px';
                    img.parentNode.appendChild(label);
                    img.dataset.adoptedFrom = 'true';
                    labelElements.push(label);
                }
            }
        });
    }

    function hideLabels() {
        labelElements.forEach(el => el.remove());
        labelElements.length = 0;
        document.querySelectorAll('img').forEach(img => delete img.dataset.adoptedFrom);
    }

    // Observe DOM changes to handle dynamic page navigation
    const observer = new MutationObserver(() => {
        addToggleButton();
        if (labelsVisible) showLabels();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();