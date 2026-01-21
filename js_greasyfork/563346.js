// ==UserScript==
// @name         Download Car Images - Max 6 Reliable
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Reliably downloads up to 6 images with watermark and correct button positioning.
// @match        https://salsabeelcars.site/index.php/sales_manager/car_*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563346/Download%20Car%20Images%20-%20Max%206%20Reliable.user.js
// @updateURL https://update.greasyfork.org/scripts/563346/Download%20Car%20Images%20-%20Max%206%20Reliable.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ================= 1. CHASSIS DETECTION ================= */
    function getChassisNumber() {
        const labels = document.querySelectorAll('label');
        for (let label of labels) {
            const text = label.textContent.toLowerCase();
            // Matches "Chasis" or "Chassis"
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

    /* ================= 2. WATERMARK PROCESSOR ================= */
    function processImage(url, chassis, index) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
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
                ctx.fillText(chassis, padding, canvas.height - padding);

                canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
            };
            img.onerror = () => resolve(null);
            img.src = url;
        });
    }

    /* ================= 3. RELIABLE QUEUE ================= */
    async function startDownload(btn) {
        const chassis = getChassisNumber();
        // Specifically target the <a> tags within the car picture section
        const imageLinks = Array.from(document.querySelectorAll('.form-group .col-sm-10 a[data-lightbox]')).slice(0, 6);

        if (imageLinks.length === 0) {
            alert("No images found. Please ensure images are loaded.");
            return;
        }

        btn.disabled = true;
        btn.style.backgroundColor = "#8e44ad"; // Purple during process

        for (let i = 0; i < imageLinks.length; i++) {
            btn.textContent = `Saving Image ${i + 1} of ${imageLinks.length}...`;
            
            const blob = await processImage(imageLinks[i].href, chassis, i);
            
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${chassis}_${i + 1}.jpg`;
                document.body.appendChild(a);
                a.click();
                
                // Small delay to ensure browser registers the click
                await new Promise(r => setTimeout(r, 200)); 
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            // Longer wait between images (1.2 seconds) to bypass browser flood filters
            await new Promise(r => setTimeout(r, 1200));
        }

        btn.textContent = "Download Successful!";
        btn.style.backgroundColor = "#27ae60";
        setTimeout(() => {
            btn.textContent = "Download All Images";
            btn.style.backgroundColor = "#28a745";
            btn.disabled = false;
        }, 3000);
    }

    /* ================= 4. UI & PREFERENCES ================= */
    function applyUI() {
        // Find the image container
        const target = document.querySelector('.form-group .col-sm-10');
        if (target && !document.getElementById('dlBtn')) {
            const wrap = document.createElement('div');
            wrap.style = "width:100%; margin-top:20px; clear:both; display:block; padding-top:10px;";
            
            const btn = document.createElement('button');
            btn.id = 'dlBtn';
            btn.type = 'button';
            btn.textContent = "Download All Images";
            btn.style = "padding:12px 24px; background:#28a745; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
            
            btn.onclick = (e) => { e.preventDefault(); startDownload(btn); };
            wrap.appendChild(btn);
            target.appendChild(wrap);
        }

        // POSITION PREFERENCE: Edit button to the left of Print button
        const printBtn = document.querySelector('button[onclick*="print"], .fa-print')?.closest('a, button, .col-sm-2');
        const editBtn = document.querySelector('a[href*="edit"], .fa-edit')?.closest('a, button, .col-sm-2');

        if (printBtn && editBtn && editBtn.nextElementSibling !== printBtn) {
            printBtn.parentNode.insertBefore(editBtn, printBtn);
            editBtn.style.marginRight = "8px"; 
        }
    }

    // Run immediately and keep checking for dynamic changes
    window.addEventListener('load', applyUI);
    setInterval(applyUI, 1500);

})();