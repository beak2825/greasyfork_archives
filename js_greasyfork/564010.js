// ==UserScript==
// @name         Sales: Unbooked View Button for Booked Cars
// @namespace    https://salsabeelcars.site/
// @version      1.0
// @description  Adds a "Normal View" button for booked cars that links to car_view/{id}
// @author       muftypro
// @match        https://salsabeelcars.site/index.php/sales_manager/car_list*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564010/Sales%3A%20Unbooked%20View%20Button%20for%20Booked%20Cars.user.js
// @updateURL https://update.greasyfork.org/scripts/564010/Sales%3A%20Unbooked%20View%20Button%20for%20Booked%20Cars.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addNormalViewButtons() {
        const rows = document.querySelectorAll("table tbody tr");

        rows.forEach(row => {
            // Check if status is "Booked"
            const bookedLabel = row.querySelector("span.label-success");
            if (!bookedLabel || bookedLabel.textContent.trim() !== "Booked") return;

            const viewLink = row.querySelector("td:last-child a");
            if (!viewLink) return;

            const bookedUrl = viewLink.getAttribute("href");

            // Avoid duplicate buttons
            if (row.querySelector(".tm-normal-view-btn")) return;

            // Extract ID from booked URL
            // Example: car_booked_view/9860
            const match = bookedUrl.match(/car_booked_view\/(\d+)/);
            if (!match) return;

            const carId = match[1];
            const normalViewUrl = `https://salsabeelcars.site/index.php/sales_manager/car_view/${carId}`;

            // Create new button
            const normalBtn = document.createElement("a");
            normalBtn.href = normalViewUrl;
            normalBtn.target = "_blank";
            normalBtn.textContent = "View-Unbooked";
            normalBtn.className = "tm-normal-view-btn btn btn-xs btn-info";
            normalBtn.style.display = "block";
            normalBtn.style.marginTop = "6px";
            normalBtn.style.textAlign = "center";

            // Append under existing button
            viewLink.parentElement.appendChild(normalBtn);
        });
    }

    // Run on load
    window.addEventListener("load", () => {
        setTimeout(addNormalViewButtons, 500);
    });

    // For dynamic tables / AJAX reloads (DataTables safe)
    const observer = new MutationObserver(() => {
        addNormalViewButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
