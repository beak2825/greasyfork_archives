// ==UserScript==
// @name         Sales Download Car Images - Individual Buttons
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Adds a download button under every image for 100% reliability.
// @match        https://salsabeelcars.site/index.php/sales_manager/car_*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563346/Sales%20Download%20Car%20Images%20-%20Individual%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/563346/Sales%20Download%20Car%20Images%20-%20Individual%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ================= 1. ACCURATE CHASSIS DETECTION ================= */
    function getChassisNumber() {
        const labels = document.querySelectorAll('label');
        for (let label of labels) {
            const text = label.textContent.toLowerCase();
            if (text.includes('chasis') || text.includes('chassis')) {
                const container = label.closest('.form-group');
                if (container) {
                    const input = container.querySelector('input');
                    if (input && input.value.trim()) return input.value.trim();
                }
            }
        }
        return "Unknown_Chassis";
    }

    /* ================= 2. WATERMARK & DOWNLOAD ================= */
    async function downloadWithWatermark(imageUrl, chassisNumber, index, btn) {
        btn.disabled = true;
        btn.textContent = "Processing...";

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;

        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const fontSize = Math.max(Math.floor(img.width / 40), 15);
            const padding = 20;

            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.shadowColor = 'black'; ctx.shadowBlur = 6;
            ctx.textBaseline = 'bottom';

            // Right: Branding
            ctx.textAlign = 'right';
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillText('Sal-Sabeel', canvas.width - padding, canvas.height - padding - 25);
            ctx.font = `${fontSize * 0.6}px Arial`;
            ctx.fillText('Gulshan-1, Road 8, House 7', canvas.width - padding, canvas.height - padding);

            // Left: Chassis
            ctx.textAlign = 'left';
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillText(chassisNumber, padding, canvas.height - padding);

            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${chassisNumber}_${index}.jpg`;
                a.click();
                URL.revokeObjectURL(url);

                btn.disabled = false;
                btn.textContent = "Download";
                btn.style.backgroundColor = "#6c757d"; // Change color to show it's done
            }, 'image/jpeg', 0.95);
        };
    }

    /* ================= 3. UI INJECTION ================= */
    function setupUI() {
        // Find all car image containers (max 6)
        const imageWrappers = document.querySelectorAll('.form-group .col-sm-10 .col-sm-2');

        imageWrappers.forEach((wrapper, index) => {
            if (wrapper.querySelector('.custom-dl-btn')) return;

            const link = wrapper.querySelector('a');
            if (!link) return;

            const dlBtn = document.createElement('button');
            dlBtn.className = 'custom-dl-btn';
            dlBtn.textContent = "Download";
            dlBtn.type = "button";

            // Style the individual button
            Object.assign(dlBtn.style, {
                width: "100%",
                marginTop: "5px",
                padding: "5px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "3px",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: "bold"
            });

            dlBtn.onclick = (e) => {
                e.preventDefault();
                const chassis = getChassisNumber();
                downloadWithWatermark(link.href, chassis, index + 1, dlBtn);
            };

            wrapper.appendChild(dlBtn);
        });

        // Preference: Edit button to the left of Print button
        const printBtn = document.querySelector('button[onclick*="print"], .fa-print')?.closest('a, button, .col-sm-2');
        const editBtn = document.querySelector('a[href*="edit"], .fa-edit')?.closest('a, button, .col-sm-2');

        if (printBtn && editBtn && editBtn.nextElementSibling !== printBtn) {
            printBtn.parentNode.insertBefore(editBtn, printBtn);
            editBtn.style.marginRight = "8px";
        }
    }

    // Run and maintain
    setInterval(setupUI, 1500);
})();