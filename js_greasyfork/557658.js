// ==UserScript==
// @name         IMOS POP Request Generator (Mailto)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a floating flamingo. "POP Details" copies to clipboard. "POP Email" opens your email client.
// @author       You
// @match        https://imos.churchofjesuschrist.org/vendor-management/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557658/IMOS%20POP%20Request%20Generator%20%28Mailto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557658/IMOS%20POP%20Request%20Generator%20%28Mailto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS Styles ---
    const styles = `
        #imos-flamingo-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            font-size: 40px;
            cursor: pointer;
            z-index: 99999;
            transition: transform 0.2s ease-in-out;
            user-select: none;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid #ccc;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }

        #imos-flamingo-btn:hover {
            transform: scale(1.1);
            background: #fff;
            border-color: #008CBA;
        }

        .flamingo-bouncing {
            animation: flamingo-bounce 0.6s ease;
        }

        @keyframes flamingo-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        /* Container for the buttons inside the cell */
        .pop-btn-container {
            display: flex;
            flex-direction: column;
            gap: 3px;
            margin-top: 5px;
            align-items: center;
        }

        /* Base Button Style */
        .pop-btn {
            color: white;
            border: none;
            padding: 3px 6px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 10px;
            cursor: pointer;
            border-radius: 3px;
            font-weight: bold;
            box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
            line-height: normal;
            width: 90px; /* Fixed width for uniformity */
        }

        .pop-btn:active {
            transform: translateY(1px);
        }

        /* "POP Req" - Blue */
        .pop-request-btn {
            background-color: #008CBA;
        }
        .pop-request-btn:hover {
            background-color: #005f7f;
        }

        /* "POP Details" - Orange */
        .pop-details-btn {
            background-color: #e67e22;
        }
        .pop-details-btn:hover {
            background-color: #d35400;
        }
    `;

    GM_addStyle(styles);

    // --- Create Floating Flamingo ---
    function createFlamingo() {
        if (document.getElementById('imos-flamingo-btn')) return;

        const flamingo = document.createElement('div');
        flamingo.id = 'imos-flamingo-btn';
        flamingo.innerHTML = '🦩';
        flamingo.title = 'POP Request Generator';
        document.body.appendChild(flamingo);

        flamingo.addEventListener('click', function() {
            flamingo.classList.add('flamingo-bouncing');
            setTimeout(() => { flamingo.classList.remove('flamingo-bouncing'); }, 600);
            findAndTagRows();
        });
    }

    // --- The "Seek and Destroy" Logic ---
    function findAndTagRows() {
        const printCells = document.querySelectorAll('td.col-print');

        if (printCells.length === 0) {
            alert('🦩 No rows found yet! Try scrolling or waiting a moment.');
            return;
        }

        let addedCount = 0;

        printCells.forEach(cell => {
            // Check if buttons already exist in this cell
            if (cell.querySelector('.pop-btn-container')) return;

            const row = cell.closest('tr');
            if (row) {
                // Ensure cell display is flex column
                cell.style.display = 'flex';
                cell.style.flexDirection = 'column';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';

                // Create a container div for the buttons
                const btnContainer = document.createElement('div');
                btnContainer.className = 'pop-btn-container';

                // --- Button 1: POP Request (Email) ---
                const btnReq = document.createElement('button');
                btnReq.innerText = 'POP Email';
                btnReq.className = 'pop-btn pop-request-btn';
                btnReq.type = 'button';
                btnReq.title = 'Open Email Client';
                btnReq.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    generateText(row, btnReq, 'email');
                });

                // --- Button 2: POP Details Only ---
                const btnDetails = document.createElement('button');
                btnDetails.innerText = 'POP Details';
                btnDetails.className = 'pop-btn pop-details-btn';
                btnDetails.type = 'button';
                btnDetails.title = 'Copy Details Block Only';
                btnDetails.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    generateText(row, btnDetails, 'details');
                });

                // Append buttons to container, container to cell
                btnContainer.appendChild(btnReq);
                btnContainer.appendChild(btnDetails);
                cell.appendChild(btnContainer);

                addedCount++;
            }
        });

        if (addedCount > 0) {
            console.log(`🦩 Added buttons to ${addedCount} rows.`);
        }
    }

    // --- Extract Vendor Details ---
    function getVendorDetails() {
        try {
            const wrapper = document.querySelector('.bread-crumb-no-url-wrapper');
            if (!wrapper) {
                const allCrumbs = document.querySelectorAll('.bread-crumb-label');
                if(allCrumbs.length > 0) return allCrumbs[allCrumbs.length - 1].innerText;
                return "Vendor Name Not Found";
            }
            const nameEl = wrapper.querySelector('.bread-crumb-label');
            const addendumEl = wrapper.querySelector('.bread-crumb-label-addendum');
            const name = nameEl ? nameEl.innerText.trim() : "";
            let number = "";
            if (addendumEl) {
                const text = addendumEl.innerText.trim();
                number = text.includes(')') ? text.split(')')[0] + ')' : text;
            }
            return `${name} ${number}`.trim();
        } catch (e) {
            return "Unknown Vendor";
        }
    }

    // --- Generate Text or Mailto ---
    function generateText(row, btnElement, mode) {
        // Helper to safely get text
        const getText = (selector) => {
            const el = row.querySelector(selector);
            return el ? el.innerText.trim() : 'N/A';
        };

        const refNum = getText('.col-reference-number');
        const createdDate = getText('.col-created-date');
        const approvedDate = getText('.col-approved-date');
        const paidDate = getText('.col-paid-date');
        const amountVal = getText('.amount-gross');
        const currency = getText('.currency-code-gross');
        const vendorName = getVendorDetails();

        // --- Data Block ---
        const dataBlock = `Reference Num: ${refNum}
Created Date: ${createdDate}
Approved Date: ${approvedDate}
Paid Date: ${paidDate}
Amount: ${amountVal} ${currency}`;

        if (mode === 'details') {
            // --- MODE 1: Just Copy Details ---
            GM_setClipboard(dataBlock);

            // Visual Feedback
            const originalText = btnElement.innerText;
            btnElement.innerText = 'Copied!';
            btnElement.style.backgroundColor = '#4CAF50'; // Green

            setTimeout(() => {
                btnElement.innerText = originalText;
                btnElement.style.backgroundColor = '';
            }, 1500);

        } else {
            // --- MODE 2: Open Email Client ---
            const toEmail = "AFSProofofPayment@churchofjesuschrist.org";
            const subject = `POP Request - ${vendorName}`;

            const emailBody = `To whom it may concern,

Please find attached the information needed for our POP request:

${dataBlock}

(screenshot of IMOS)

Regards,`;

            // Create Mailto Link using encoding to handle spaces and newlines
            const mailtoLink = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

            // Trigger the link
            window.location.href = mailtoLink;

             // Visual Feedback
            const originalText = btnElement.innerText;
            btnElement.innerText = 'Emailing...';
            btnElement.style.backgroundColor = '#4CAF50'; // Green

            setTimeout(() => {
                btnElement.innerText = originalText;
                btnElement.style.backgroundColor = '';
            }, 1500);
        }
    }

    // --- Initialize ---
    window.addEventListener('load', createFlamingo);
    setInterval(createFlamingo, 2000);

})();