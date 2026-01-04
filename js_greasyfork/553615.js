// ==UserScript==
// @name         Hyatt Helpers - Colleague Advantage
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Automated helpers for Hyatt CA including deposit processing, total charge calculation, and modal info panels
// @author       Assistant
// @match        https://ca.hyatt.com/arrivals*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553615/Hyatt%20Helpers%20-%20Colleague%20Advantage.user.js
// @updateURL https://update.greasyfork.org/scripts/553615/Hyatt%20Helpers%20-%20Colleague%20Advantage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Hyatt Payment Modal Info Panel script loaded');

    let currentResvNameId = null;

    // Function to extract reservation information
    function extractReservationInfo(resvNameId) {
        console.log('Extracting info for reservation:', resvNameId);
        const reservationRow = document.querySelector(`tr.reservation[data-resvnameid="${resvNameId}"]`);

        if (!reservationRow) {
            console.error('Reservation row not found for ID:', resvNameId);
            return null;
        }

        const info = {};
        const cells = reservationRow.querySelectorAll('td');
        console.log('Found cells:', cells.length);

        // Extract guest information (from cell index 1)
        const guestCell = cells[1];
        if (guestCell) {
            info.guestName = guestCell.querySelector('.js-open-reservation')?.textContent?.trim() || '';
            info.membership = guestCell.querySelector('.gp-membership-default')?.textContent?.trim() || '';
            info.membershipNumber = guestCell.querySelector('.gp-membership-default')?.getAttribute('data-membershipnumber') || '';

            // Extract other guest details
            const divs = guestCell.querySelectorAll('div');
            divs.forEach(div => {
                const text = div.textContent;
                if (text.includes('Adults')) {
                    const match = text.match(/Adults\s*(\d+)\s*\/\s*Children\s*(\d+)/);
                    if (match) {
                        info.adults = match[1];
                        info.children = match[2];
                    }
                }
                if (text.includes('Booked:')) {
                    info.bookedDate = text.replace('Booked:', '').trim();
                }
                if (text.includes('Email:')) {
                    info.email = div.querySelector('a')?.textContent?.trim() || '';
                }
                if (text.includes('Company Name:')) {
                    info.companyName = text.replace('Company Name:', '').trim();
                }
                if (text.includes('Rooms:')) {
                    info.rooms = text.replace('Rooms:', '').trim();
                }
            });
        }

        // CLTV Rank (cell index 2)
        info.cltvRank = cells[2]?.textContent?.trim() || '';

        // Room Status (cell index 3)
        info.roomNumber = cells[3]?.querySelector('input')?.value || 'Not Assigned';

        // Room Type (cell index 4)
        info.roomType = cells[4]?.querySelector('.room-type-code')?.textContent?.trim() || '';

        // Market Code (cell index 5)
        info.marketCode = cells[5]?.textContent?.trim() || '';

        // Rate (cell index 6)
        const rateCell = cells[6];
        if (rateCell) {
            info.ratePlan = rateCell.querySelector('.rate-plan-code')?.textContent?.trim() || '';
            info.rateAmount = rateCell.querySelector('.base-amount')?.textContent?.trim() || '';
        }

        // ETA (cell index 7)
        info.eta = cells[7]?.querySelector('input')?.value || '';

        // Departure Date (cell index 8)
        info.departureDate = cells[8]?.textContent?.trim() || '';

        // ETD (cell index 9)
        info.etd = cells[9]?.querySelector('input')?.value || '';

        // Extract additional information from expanded sections
        const tbody = reservationRow.parentElement;

        // Previous Stays
        const previousStays = [];
        const stayRows = tbody.querySelectorAll(`section.previousStays[data-resvnameid="${resvNameId}"] .previous-stay-row:not(.label-row)`);
        stayRows.forEach(row => {
            const stay = {
                hotel: row.querySelector('.pmsPropertyName')?.textContent?.trim() || '',
                arrival: row.querySelector('.arrival-date .stay-info-data')?.textContent?.trim() || '',
                nights: row.querySelector('.nts-value .stay-info-data')?.textContent?.trim() || '',
                room: row.querySelector('.stay-info-data a')?.textContent?.trim() || '',
                roomType: row.querySelector('.rm-code .stay-info-data')?.textContent?.trim() || '',
                rate: row.querySelectorAll('.stay-info-data')[5]?.textContent?.trim() || '',
                ratePlan: row.querySelector('.rate-plan-label .stay-info-data')?.textContent?.trim() || ''
            };
            if (stay.hotel) previousStays.push(stay);
        });
        info.previousStays = previousStays;

        // NPS Scores
        const npsScores = [];
        const npsRows = tbody.querySelectorAll(`section.npsSummary[data-resvnameid="${resvNameId}"] .row:not(.title)`);
        npsRows.forEach(row => {
            const cols = row.querySelectorAll('.col-md-4, .col-md-2, .col-md-6');
            if (cols.length >= 3) {
                const score = {
                    date: cols[0]?.textContent?.trim() || '',
                    score: row.querySelector('.js-open-nps')?.textContent?.trim() || '',
                    hotel: cols[2]?.textContent?.trim() || ''
                };
                if (score.date && score.score) npsScores.push(score);
            }
        });
        info.npsScores = npsScores;

        // Specials
        const specials = [];
        const specialElements = tbody.querySelectorAll(`section.specials[data-resvnameid="${resvNameId}"] .js-special-tooltip`);
        specialElements.forEach(el => {
            const text = el.childNodes[0]?.textContent?.trim();
            if (text) specials.push(text);
        });
        info.specials = specials;

        // Comments
        const comments = [];
        const commentSections = tbody.querySelectorAll(`section.comments[data-resvnameid="${resvNameId}"] .comment-desc`);
        commentSections.forEach(el => {
            comments.push(el.textContent?.trim());
        });
        info.comments = comments;

        // Traces
        const traces = [];
        const traceSections = tbody.querySelectorAll(`section.traces[data-resvnameid="${resvNameId}"] p`);
        traceSections.forEach(el => {
            traces.push(el.textContent?.trim());
        });
        info.traces = traces;

        console.log('Extracted info:', info);
        return info;
    }

    // Function to create the info panel HTML
    function createInfoPanelElement(info) {
        const panel = document.createElement('div');
        panel.id = 'reservation-info-panel-wrapper';
        panel.className = 'modal fade in';
        panel.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: 350px;
            background: white;
            z-index: 1049;
            overflow-y: auto;
            box-shadow: 2px 0 10px rgba(0,0,0,0.5);
            display: block;
        `;

        if (!info) {
            panel.innerHTML = '<div style="padding: 20px;">No reservation information found</div>';
            return panel;
        }

        let html = `
        <div style="
            height: 100%;
            overflow-y: auto;
            padding: 20px;
            background: #f8f9fa;
            font-size: 13px;
            box-sizing: border-box;
        ">
            <button id="close-info-panel" style="
                position: absolute;
                right: 10px;
                top: 10px;
                background: #dc3545;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 3px;
                z-index: 1;
            ">✕ Close</button>

            <h4 style="margin-bottom: 20px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                Reservation Information
            </h4>

            <div class="info-section" style="margin-bottom: 15px;">
                <h5 style="color: #007bff; margin-bottom: 10px; font-size: 14px;">Guest Details</h5>
                <p><strong>Name:</strong> ${info.guestName || 'N/A'}</p>
                ${info.membership ? `<p><strong>Membership:</strong> ${info.membership} (${info.membershipNumber || ''})</p>` : ''}
                <p><strong>Adults/Children:</strong> ${info.adults || 0} / ${info.children || 0}</p>
                ${info.email ? `<p><strong>Email:</strong> ${info.email}</p>` : ''}
                ${info.companyName ? `<p><strong>Company:</strong> ${info.companyName}</p>` : ''}
                <p><strong>Rooms:</strong> ${info.rooms || '1'}</p>
                ${info.bookedDate ? `<p><strong>Booked:</strong> ${info.bookedDate}</p>` : ''}
            </div>

            <div class="info-section" style="margin-bottom: 15px;">
                <h5 style="color: #007bff; margin-bottom: 10px; font-size: 14px;">Stay Details</h5>
                <p><strong>Room:</strong> ${info.roomNumber}</p>
                <p><strong>Room Type:</strong> ${info.roomType || 'N/A'}</p>
                <p><strong>Market Code:</strong> ${info.marketCode || 'N/A'}</p>
                <p><strong>Rate Plan:</strong> ${info.ratePlan || 'N/A'}</p>
                <p><strong>Rate:</strong> ${info.rateAmount || 'N/A'}</p>
                <p><strong>Departure:</strong> ${info.departureDate || 'N/A'}</p>
                <p><strong>ETA:</strong> ${info.eta || 'Not set'}</p>
                <p><strong>ETD:</strong> ${info.etd || 'Not set'}</p>
                ${info.cltvRank ? `<p><strong>CLTV Rank:</strong> ${info.cltvRank}</p>` : ''}
            </div>`;

        // Add specials if any
        if (info.specials && info.specials.length > 0) {
            html += `
            <div class="info-section" style="margin-bottom: 15px;">
                <h5 style="color: #007bff; margin-bottom: 10px; font-size: 14px;">Special Requests</h5>`;
            info.specials.forEach(special => {
                html += `<p>• ${special}</p>`;
            });
            html += `</div>`;
        }

        // Add comments if any
        if (info.comments && info.comments.length > 0) {
            html += `
            <div class="info-section" style="margin-bottom: 15px;">
                <h5 style="color: #007bff; margin-bottom: 10px; font-size: 14px;">Comments</h5>`;
            info.comments.forEach(comment => {
                html += `<p style="background: #fff; padding: 8px; border-left: 3px solid #007bff; margin-bottom: 5px;">${comment}</p>`;
            });
            html += `</div>`;
        }

        // Add traces if any
        if (info.traces && info.traces.length > 0) {
            html += `
            <div class="info-section" style="margin-bottom: 15px;">
                <h5 style="color: #007bff; margin-bottom: 10px; font-size: 14px;">Traces</h5>`;
            info.traces.forEach(trace => {
                html += `<p style="background: #fff; padding: 8px; border-left: 3px solid #ffc107; margin-bottom: 5px;">${trace}</p>`;
            });
            html += `</div>`;
        }

        // Add previous stays if any
        if (info.previousStays && info.previousStays.length > 0) {
            html += `
            <div class="info-section" style="margin-bottom: 15px;">
                <h5 style="color: #007bff; margin-bottom: 10px; font-size: 14px;">Previous Stays</h5>`;
            info.previousStays.forEach(stay => {
                html += `
                <div style="background: #fff; padding: 10px; margin-bottom: 10px; border-left: 3px solid #28a745;">
                    <p style="margin: 2px 0;"><strong>${stay.hotel}</strong></p>
                    <p style="margin: 2px 0;">Arrival: ${stay.arrival} (${stay.nights} nights)</p>
                    <p style="margin: 2px 0;">Room: ${stay.room} - ${stay.roomType}</p>
                    <p style="margin: 2px 0;">Rate: ${stay.rate} (${stay.ratePlan})</p>
                </div>`;
            });
            html += `</div>`;
        }

        // Add NPS scores if any
        if (info.npsScores && info.npsScores.length > 0) {
            html += `
            <div class="info-section" style="margin-bottom: 15px;">
                <h5 style="color: #007bff; margin-bottom: 10px; font-size: 14px;">Survey Scores</h5>`;
            info.npsScores.forEach(nps => {
                const scoreColor = parseInt(nps.score) >= 9 ? '#28a745' : parseInt(nps.score) >= 7 ? '#ffc107' : '#dc3545';
                html += `
                <div style="background: #fff; padding: 8px; margin-bottom: 5px; border-left: 3px solid ${scoreColor};">
                    <p style="margin: 2px 0;"><strong>Score: ${nps.score}/10</strong> - ${nps.date}</p>
                    <p style="font-size: 11px; margin: 2px 0;">${nps.hotel}</p>
                </div>`;
            });
            html += `</div>`;
        }

        html += `</div>`;
        panel.innerHTML = html;

        return panel;
    }

    // Function to add the info panel beside the modal
    function addInfoPanelToModals() {
        console.log('Attempting to add info panel for reservation:', currentResvNameId);

        const modalsContainer = document.getElementById('modals');
        if (!modalsContainer) {
            console.error('Modals container not found');
            return;
        }

        const paymentModal = document.getElementById('payment-modal');
        if (!paymentModal) {
            console.error('Payment modal not found');
            return;
        }

        // Check if modal is visible
        if (!paymentModal.classList.contains('in')) {
            console.log('Payment modal not yet visible');
            return;
        }

        // Remove any existing info panel
        const existingPanel = document.getElementById('reservation-info-panel-wrapper');
        if (existingPanel) {
            existingPanel.remove();
        }

        // Extract reservation info
        const info = extractReservationInfo(currentResvNameId);
        if (!info) {
            console.error('Could not extract reservation info');
            return;
        }

        // Create and add the info panel
        const infoPanel = createInfoPanelElement(info);
        modalsContainer.insertBefore(infoPanel, paymentModal);

        // Add close button functionality (no modal adjustments)
        const closeBtn = infoPanel.querySelector('#close-info-panel');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                infoPanel.remove();
            });
        }

        // Remove panel when modal closes
        const modalCloseButtons = paymentModal.querySelectorAll('[data-dismiss="modal"], .btn-cancel');
        modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    const panel = document.getElementById('reservation-info-panel-wrapper');
                    if (panel) panel.remove();
                }, 100);
            });
        });

        console.log('Info panel added successfully');
    }

    // Intercept clicks on payment edit buttons
    document.addEventListener('click', function(e) {
        // Check if clicked element or its parent is the payment edit button
        let target = e.target;
        let isPaymentEdit = false;
        let section = null;

        // Check up to 3 levels up for the payment edit button
        for (let i = 0; i < 3; i++) {
            if (target && target.classList && target.classList.contains('js-payments-edit')) {
                isPaymentEdit = true;
                section = target.closest('section[data-resvnameid]');
                break;
            }
            target = target.parentElement;
        }

        if (isPaymentEdit && section) {
            currentResvNameId = section.getAttribute('data-resvnameid');
            console.log('Payment edit clicked for reservation:', currentResvNameId);

            // Set up observer for modal appearance
            const observer = new MutationObserver((mutations) => {
                const paymentModal = document.getElementById('payment-modal');
                if (paymentModal && paymentModal.classList.contains('in') && !document.getElementById('reservation-info-panel-wrapper')) {
                    console.log('Payment modal detected as visible');
                    // Give the modal a moment to fully render
                    setTimeout(() => {
                        addInfoPanelToModals();
                    }, 200);
                }
            });

            // Start observing
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });

            // Stop observing after 5 seconds
            setTimeout(() => {
                observer.disconnect();
            }, 5000);
        }
    }, true); // Use capture phase to catch event early

    // Clean up panel when modal is closed via ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const panel = document.getElementById('reservation-info-panel-wrapper');
            if (panel) {
                panel.remove();
            }
        }
    });

    // Function to calculate nights between two dates
    function calculateNights(arrivalDate, departureDate) {
        // Parse dates in format "DD-MMM-YYYY"
        const parseDate = (dateStr) => {
            const months = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
            };

            const parts = dateStr.trim().split('-');
            if (parts.length !== 3) return null;

            const day = parseInt(parts[0]);
            const month = months[parts[1]];
            const year = parseInt(parts[2]);

            if (isNaN(day) || month === undefined || isNaN(year)) return null;

            return new Date(year, month, day);
        };

        const arrival = parseDate(arrivalDate);
        const departure = parseDate(departureDate);

        if (!arrival || !departure) return null;

        const diffTime = Math.abs(departure - arrival);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    }

    // Function to calculate total room charge with tax
    function calculateTotalCharge(nightlyRatesHtml) {
        if (!nightlyRatesHtml) return null;

        // Parse the HTML-encoded string
        const decodedHtml = nightlyRatesHtml
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');

        // Extract rates using regex - looking for pattern: "is <b>123.45</b>"
        const ratePattern = /is\s*<b>([\d.]+)<\/b>/gi;
        const matches = [...decodedHtml.matchAll(ratePattern)];

        if (matches.length === 0) return null;

        let total = 0;
        matches.forEach(match => {
            const rate = parseFloat(match[1]);
            if (!isNaN(rate)) {
                // Calculate state tax (8%) and round to nearest cent
                const stateTax = Math.round(rate * 0.08 * 100) / 100;

                // Calculate occupancy tax (10%) and round to nearest cent
                const occupancyTax = Math.round(rate * 0.10 * 100) / 100;

                // Add base rate + both taxes
                const nightTotal = rate + stateTax + occupancyTax;
                total += nightTotal;
            }
        });

        return total.toFixed(2);
    }

    // Function to calculate first night's room charge with tax
    function calculateFirstNightCharge(nightlyRatesHtml) {
        if (!nightlyRatesHtml) return null;

        const decodedHtml = nightlyRatesHtml
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');

        const ratePattern = /is\s*<b>([\d.]+)<\/b>/i; // first occurrence only
        const match = decodedHtml.match(ratePattern);
        if (!match) return null;

        const rate = parseFloat(match[1]);
        if (isNaN(rate)) return null;

        const stateTax = Math.round(rate * 0.08 * 100) / 100;
        const occupancyTax = Math.round(rate * 0.10 * 100) / 100;
        const firstNightTotal = rate + stateTax + occupancyTax;
        return firstNightTotal.toFixed(2);
    }

    // Function to add total charges to rate plan cells
    function addTotalCharges() {
        // Find all rate plan cells
        const ratePlanCells = document.querySelectorAll('td.ratePlan');

        ratePlanCells.forEach(cell => {
            // Skip if already processed
            if (cell.querySelector('.total-charge')) return;

            // Find the indicator image with nightly rates
            const indicator = cell.querySelector('.indicator[data-original-title]');
            if (!indicator) return;

            const nightlyRatesHtml = indicator.getAttribute('data-original-title');
            const totalCharge = calculateTotalCharge(nightlyRatesHtml);
            const firstNightCharge = calculateFirstNightCharge(nightlyRatesHtml);

            if (totalCharge !== null) {
                // Create container for total and deposit button (stacked vertically)
                const container = document.createElement('div');
                container.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    margin-top: 5px;
                `;

                // Create total charge element
                const totalElement = document.createElement('div');
                totalElement.className = 'total-charge';
                totalElement.style.cssText = `
                    color: #28a745;
                    font-weight: bold;
                    font-size: 13px;
                    padding: 2px 4px;
                    background-color: #f0f8ff;
                    border-radius: 3px;
                    display: inline-block;
                    width: fit-content;
                `;
                totalElement.textContent = `Total: $${totalCharge}`;
                totalElement.title = 'Total room charge including 8% state tax and 10% occupancy tax (each rounded per night)';

                // Create deposit button
                const depositBtn = document.createElement('button');
                depositBtn.className = 'quick-deposit-btn';
                depositBtn.style.cssText = `
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 3px 10px;
                    border-radius: 3px;
                    font-size: 11px;
                    cursor: pointer;
                    font-weight: bold;
                    width: fit-content;
                `;
                depositBtn.textContent = 'Pay';
                depositBtn.setAttribute('data-total-amount', totalCharge);

                // Get the reservation row to find the deposit link
                const reservationRow = cell.closest('tr.reservation');
                if (reservationRow) {
                    depositBtn.setAttribute('data-resvnameid', reservationRow.getAttribute('data-resvnameid'));
                }

                // Add hover effect
                depositBtn.onmouseover = () => depositBtn.style.backgroundColor = '#0056b3';
                depositBtn.onmouseout = () => depositBtn.style.backgroundColor = '#007bff';

                // Add click handler for deposit button
                depositBtn.addEventListener('click', async function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    await processDeposit(this);
                });

                // Create 1 night deposit button if we have first night amount
                if (firstNightCharge !== null) {
                    const oneNightBtn = document.createElement('button');
                    oneNightBtn.className = 'quick-deposit-btn-1nt';
                    oneNightBtn.style.cssText = `
                        background-color: #17a2b8;
                        color: white;
                        border: none;
                        padding: 3px 10px;
                        border-radius: 3px;
                        font-size: 11px;
                        cursor: pointer;
                        font-weight: bold;
                        width: fit-content;
                    `;
                    oneNightBtn.textContent = '1NT';
                    oneNightBtn.title = `Deposit for first night: $${firstNightCharge}`;

                    if (reservationRow) {
                        oneNightBtn.setAttribute('data-resvnameid', reservationRow.getAttribute('data-resvnameid'));
                    }
                    oneNightBtn.setAttribute('data-total-amount', firstNightCharge);

                    oneNightBtn.onmouseover = () => oneNightBtn.style.backgroundColor = '#138496';
                    oneNightBtn.onmouseout = () => oneNightBtn.style.backgroundColor = '#17a2b8';

                    oneNightBtn.addEventListener('click', async function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        await processDeposit(this);
                    });

                    container.appendChild(oneNightBtn);
                }

                container.appendChild(totalElement);
                container.appendChild(depositBtn);

                // Insert after the flex-container div
                const flexContainer = cell.querySelector('.flex-container');
                if (flexContainer) {
                    flexContainer.parentNode.insertBefore(container, flexContainer.nextSibling);
                }
            }
        });
    }

    // Function to process deposit automatically
    async function processDeposit(button) {
        const totalAmount = button.getAttribute('data-total-amount');
        const resvNameId = button.getAttribute('data-resvnameid');

        console.log(`Processing deposit for reservation ${resvNameId}, amount: $${totalAmount}`);

        // Update button to show processing
        const originalText = button.textContent;
        button.textContent = '...';
        button.style.backgroundColor = '#ffc107';
        button.disabled = true;

        try {
            // Find and click the deposit link
            const depositLink = document.querySelector(`tr[data-resvnameid="${resvNameId}"] .deposit-amt.js-open-deposit`);
            if (!depositLink) {
                throw new Error('Deposit link not found');
            }

            depositLink.click();
            console.log('Clicked deposit link');

            // Wait for modal to appear and "Make a Payment" button to be enabled
            await waitForElement('.modal.in .btn.btn-sm.btn-black.save:not(.js-make-payment)', 5000);
            const makePaymentBtn = await waitForButtonEnabled('.modal.in .btn.btn-sm.btn-black.save:not(.js-make-payment)');

            if (makePaymentBtn && makePaymentBtn.textContent.includes('Make a Payment')) {
                await sleep(1500); // Wait extra 1.5 seconds after clicking
                makePaymentBtn.click();
                console.log('Clicked Make a Payment button');
            } else {
                throw new Error('Make a Payment button not found');
            }

            // Wait longer for the payment form to appear
            await sleep(1500); // Increased wait time for modal transition

            // Try multiple times to find and fill the payment input
            let attemptCount = 0;
            let inputFilled = false;

            while (attemptCount < 10 && !inputFilled) {
                await sleep(500);

                const amountInput = document.getElementById('makePaymentDepositDueAmount');
                if (amountInput && amountInput.offsetParent !== null) { // Check if visible
                    // Clear and set the value
                    amountInput.focus();
                    amountInput.value = '';
                    amountInput.value = totalAmount;


                    // Dispatch input and change events
                    amountInput.dispatchEvent(new Event('input', { bubbles: true }));
                    amountInput.dispatchEvent(new Event('change', { bubbles: true }));
                    // Dispatch keyboard events
                    amountInput.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true }));
                    amountInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true }));

                    console.log(`Entered amount: $${totalAmount}`);
                    inputFilled = true;
                } else {
                    console.log(`Attempt ${attemptCount + 1}: Payment input not yet visible`);
                }
                attemptCount++;
            }

            if (!inputFilled) {
                throw new Error('Payment amount input never became visible');
            }


            await sleep(1500); // Wait extra 1.5 seconds after clicking
            // Wait for Apply button to be enabled before clicking
            const applyBtn = await waitForButtonEnabled('.modal.in .btn.btn-sm.btn-black.save.js-make-payment');
            if (applyBtn && applyBtn.offsetParent !== null) {

                await sleep(1500); // Wait extra 1.5 seconds after clicking
                applyBtn.click();
                console.log('Clicked Apply button');
            } else {
                throw new Error('Apply button not found or not visible');
            }

            // Wait for processing to complete
            await sleep(2500);

            // Try to close any open modal
            const closeButtons = document.querySelectorAll('.modal.in button.close[data-dismiss="modal"]');
            if (closeButtons.length > 0) {
                closeButtons[closeButtons.length - 1].click(); // Click the last (topmost) close button
                console.log('Closed modal');
            }

            // Update button to show success
            button.textContent = '✓';
            button.style.backgroundColor = '#28a745';

            // Reset button after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '#007bff';
                button.disabled = false;
            }, 3000);

        } catch (error) {
            console.error('Error processing deposit:', error);

            // Try to close any open modals on error
            const closeButtons = document.querySelectorAll('.modal.in button.close[data-dismiss="modal"]');
            closeButtons.forEach(btn => btn.click());

            // Update button to show error
            button.textContent = '✗';
            button.style.backgroundColor = '#dc3545';

            // Reset button after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '#007bff';
                button.disabled = false;
            }, 3000);
        }
    }

    // Helper function to wait for element to appear
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(checkElement, 100);
                }
            };

            checkElement();
        });
    }

    // Helper function to sleep
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Helper function to wait for button to be enabled
    function waitForButtonEnabled(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkButton = () => {
                const button = document.querySelector(selector);
                if (button && !button.hasAttribute('disabled') && button.offsetParent !== null) {
                    resolve(button);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Button ${selector} not enabled within ${timeout}ms`));
                } else {
                    setTimeout(checkButton, 100);
                }
            };

            checkButton();
        });
    }

    // Function to add night count to reservations
    function addNightCounts() {
        // Find all reservation rows
        const reservationRows = document.querySelectorAll('tr.reservation[data-resvnameid]');

        reservationRows.forEach(row => {
            // Skip if already processed
            if (row.querySelector('.nights-count')) return;

            // Get the arrival date from the selected date input (all reservations arrive on this date)
            const selectedDateInput = document.getElementById('selectDate');
            const arrivalDate = selectedDateInput ? selectedDateInput.value : null;

            if (!arrivalDate) {
                console.log('No arrival date found');
                return;
            }

            // Find the departure date cell (9th td in the main row)
            const cells = row.querySelectorAll('td');
            if (cells.length > 8) {
                const departureDateCell = cells[8];
                const departureDate = departureDateCell.textContent.trim();

                if (departureDate) {
                    // Calculate nights
                    const nights = calculateNights(arrivalDate, departureDate);

                    if (nights !== null) {
                        // Create and add the nights element
                        const nightsElement = document.createElement('div');
                        nightsElement.className = 'nights-count';
                        nightsElement.style.color = 'red';
                        nightsElement.style.fontSize = '12px';
                        nightsElement.style.marginTop = '2px';
                        nightsElement.textContent = `(${nights} night${nights !== 1 ? 's' : ''})`;

                        // Append to the departure date cell
                        departureDateCell.appendChild(nightsElement);
                    }
                }
            }
        });

        // Also add total charges whenever we add night counts
        addTotalCharges();
    }

    // Function to initialize the script
    function init() {
        // Wait for the table to be loaded
        const observer = new MutationObserver((mutations, obs) => {
            const table = document.getElementById('dueInReservationsTable');
            const selectedDate = document.getElementById('selectDate');

            if (table && selectedDate && selectedDate.value) {
                // Table and date are ready, add night counts and total charges
                addNightCounts();

                // Continue observing for dynamic content changes
                const tableObserver = new MutationObserver(() => {
                    addNightCounts();
                });

                tableObserver.observe(table, {
                    childList: true,
                    subtree: true
                });

                // Also observe the date input for changes
                const dateObserver = new MutationObserver(() => {
                    // Remove existing night counts, total charges, and deposit buttons
                    document.querySelectorAll('.nights-count').forEach(el => el.remove());
                    document.querySelectorAll('.total-charge').forEach(el => el.parentElement.remove());
                    addNightCounts();
                });

                dateObserver.observe(selectedDate, {
                    attributes: true,
                    attributeFilter: ['value']
                });

                // Listen for value changes on the date input
                selectedDate.addEventListener('change', () => {
                    document.querySelectorAll('.nights-count').forEach(el => el.remove());
                    document.querySelectorAll('.total-charge').forEach(el => el.parentElement.remove());
                    addNightCounts();
                });
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Try to run immediately if content is already loaded
        setTimeout(addNightCounts, 1000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
/** Return the modal element if it's currently in the DOM and visible */
  function getModal() {
    const m = document.getElementById('reservationPaymentModal');
    return m && m.offsetParent !== null ? m : null;
  }

  /** Click the "Save" button inside the modal (removes disabled attr first) */
  function clickSave(modal) {
    const btnSave = document.querySelector('button.btn-save');
    if (btnSave) {
      btnSave.click();
    }
  }

  /** Click the close "X" button inside the modal */
  function clickClose(modal) {
    const btnClose = document.querySelector('button[aria-label="Close"]');
    if (btnClose) btnClose.click();
  }

  /** Key handler */
  document.addEventListener('keydown', (e) => {
    if (!e.ctrlKey || e.altKey) return;          // need Ctrl, ignore Alt combos
    if (e.key.toLowerCase() !== 's') return;     // only react to the "S" key

    const modal = getModal();
    if (!modal) return;                          // do nothing if modal isn't open
    e.preventDefault();

    if (e.shiftKey) {
      // Ctrl+Shift+S  → Save, then Close
      clickSave(modal);
      clickClose(modal);
    } else {
      // Ctrl+S → Save
      clickSave(modal);
    }
  });
    console.log('Script initialization complete');
})();