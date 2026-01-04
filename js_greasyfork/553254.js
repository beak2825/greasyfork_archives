// ==UserScript==
// @name         5-Star Admin Pass Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quick hall pass management for 5-Star Students
// @author       You
// @match        https://5starstudents.com/*/dashboard/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553254/5-Star%20Admin%20Pass%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/553254/5-Star%20Admin%20Pass%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hall Pass data
    const HALL_PASSES = [
        { name: "Blue Bathroom Pass", id: "0849bba36d744d8e9ae628dd622a170a" },
        { name: "Cafeteria Pass", id: "312f52fa949e428ea2a47f06a4cd7658" },
        { name: "Deans Office Pass", id: "6326da5dffab443282aaa7d2f7e052e1" },
        { name: "Guidance Pass", id: "62c555c9bc344acbad9503cb9ebba361" },
        { name: "IT Office Pass", id: "bd73b7e81ab2469da8461ef08bf592d2" },
        { name: "Late Pass", id: "3ecb5a93cf2046f58305c0c41f56891b" },
        { name: "LRC Pass", id: "e573dd94f11c4c2a85e30762dd9b48d6" },
        { name: "Main Office Pass", id: "991db2e141c644f29ede096aba5f1e23" },
        { name: "Nurse's Office Pass", id: "d364cf51734a43c6adb74e0759bb8ebe" },
        { name: "Orange Bathroom Pass", id: "c0697d3c5a5f47f3be0055ea2d5489a8" },
        { name: "Pink Bathroom Pass", id: "cebff2effd00457b9fcd0f17c68d605b" },
        { name: "Purple Bathroom Pass", id: "077c060ac8304c3c8d29d4ce62e3200e" },
        { name: "Yellow Bathroom Pass", id: "9ab100720518454e8936fa912ed18555" }
    ];

    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .admin-pass-card {
            border-color: #28a745 !important;
        }

        .admin-pass-card .card-header {
            background-color: #d4edda;
            border-color: #28a745 !important;
        }

        #AdminPassSelect {
            width: 100%;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
        }

        .alert-success {
            color: #155724;
            background-color: #d4edda;
            border-color: #c3e6cb;
            padding: 0.75rem 1.25rem;
            margin-bottom: 1rem;
            border: 1px solid transparent;
            border-radius: 0.25rem;
        }
    `;
    document.head.appendChild(style);

    // Wait for page to load
    function init() {
        // Find the original Hall Pass card
        const originalCard = document.querySelector('.card.border.h-100');

        if (!originalCard) {
            console.log('Hall Pass card not found, retrying...');
            setTimeout(init, 500);
            return;
        }

        // Clone the card
        const adminCard = originalCard.cloneNode(true);

        // Modify the cloned card
        modifyAdminCard(adminCard);

        // Insert after the original card
        const parentCol = originalCard.closest('.col-md-6');
        if (parentCol && parentCol.parentElement) {
            // Create a new column for our admin card
            const newCol = document.createElement('div');
            newCol.className = 'col-md-6';
            newCol.appendChild(adminCard);

            // Insert after the original hall pass column
            parentCol.parentElement.insertBefore(newCol, parentCol.nextSibling);
        }
    }

    function modifyAdminCard(card) {
        // Add a class to identify this as admin card
        card.classList.add('admin-pass-card');

        // Change header title
        const headerTitle = card.querySelector('.card-header-title');
        if (headerTitle) {
            headerTitle.innerHTML = '<i class="bi bi-lightning-fill me-2"></i>Admin Pass';
        }

        // Change description text
        const description = card.querySelector('p em');
        if (description) {
            description.textContent = 'What pass ya need ?';
        }

        // Find the dropdown container and replace it completely
        const oldDropdown = card.querySelector('#SelectedHallPassCode');
        if (oldDropdown) {
            // Create a brand new select element
            const newSelect = document.createElement('select');
            newSelect.id = 'AdminPassSelect';
            newSelect.className = 'form-select';
            newSelect.style.width = '100%';

            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Choose pass';
            newSelect.appendChild(defaultOption);

            // Add our hall passes
            HALL_PASSES.forEach(pass => {
                const option = document.createElement('option');
                option.value = pass.id;
                option.textContent = pass.name;
                newSelect.appendChild(option);
            });

            // Replace the old dropdown completely
            // First, find any Kendo wrapper
            const kendoWrapper = oldDropdown.closest('.k-widget, span[role="listbox"]');
            if (kendoWrapper) {
                kendoWrapper.replaceWith(newSelect);
            } else {
                oldDropdown.replaceWith(newSelect);
            }
        }

        // Remove Scan QR Code button
        const qrButton = card.querySelector('#btnQrCodeHallPassModal');
        if (qrButton) {
            qrButton.remove();
        }

        // Modify Get Pass button
        const getPassBtn = card.querySelector('#addHallPassButton');
        if (getPassBtn) {
            getPassBtn.id = 'adminGetPassButton';
            getPassBtn.removeAttribute('data-bs-toggle');
            getPassBtn.removeAttribute('data-bs-target');

            // Add click handler
            getPassBtn.addEventListener('click', handleGetPass);
        }

        // Remove loading button
        const loadingBtn = card.querySelector('#addHallPassLoadingButton');
        if (loadingBtn) {
            loadingBtn.id = 'adminLoadingButton';
        }

        // Clear result divs
        const resultDiv = card.querySelector('#hallPassResultDiv');
        if (resultDiv) {
            resultDiv.id = 'adminPassResultDiv';
            resultDiv.innerHTML = '';
        }

        const errorDiv = card.querySelector('#hallPassErrorDiv');
        if (errorDiv) {
            errorDiv.id = 'adminPassErrorDiv';
            errorDiv.innerHTML = '';
        }

        // Remove the form's data-ajax attributes and action
        const form = card.querySelector('form');
        if (form) {
            form.removeAttribute('data-ajax');
            form.removeAttribute('data-ajax-method');
            form.removeAttribute('data-ajax-update');
            form.removeAttribute('data-ajax-complete');
            form.removeAttribute('action');
            form.id = 'adminPassForm';
            // Prevent form submission
            form.addEventListener('submit', (e) => e.preventDefault());
        }
    }

    function handleGetPass(e) {
        e.preventDefault();
        e.stopPropagation();

        const dropdown = document.getElementById('AdminPassSelect');

        if (!dropdown) {
            console.error('AdminPassSelect not found');
            return;
        }

        const selectedPassCode = dropdown.value;

        if (!selectedPassCode) {
            showError('Please select a pass type');
            return;
        }

        // Get school code and token from hidden inputs (from the original form)
        const schoolCode = document.querySelector('input[name="SchoolCode"]').value;
        const token = document.querySelector('input[name="Token"]').value;
        const csrfToken = document.querySelector('input[name="__RequestVerificationToken"]').value;

        // Show loading
        const btn = document.getElementById('adminGetPassButton');
        const loadingBtn = document.getElementById('adminLoadingButton');
        btn.classList.add('d-none');
        loadingBtn.classList.remove('d-none');

        // Make the request
        fetch("https://5starstudents.com/AddHallPass", {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-requested-with": "XMLHttpRequest"
            },
            body: `SchoolCode=${schoolCode}&Token=${token}&SelectedHallPassCode=${selectedPassCode}&__RequestVerificationToken=${csrfToken}&X-Requested-With=XMLHttpRequest`,
            credentials: "include"
        })
        .then(r => r.text())
        .then(response => {
            if (response && response.trim() !== '') {
                // Success - refresh the page
                showSuccess('Pass created! Refreshing...');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showError('Unexpected response from server');
                resetButtons();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Failed to create pass. Please try again.');
            resetButtons();
        });
    }

    function showError(message) {
        const errorDiv = document.getElementById('adminPassErrorDiv');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('d-none');
        }
    }

    function showSuccess(message) {
        const resultDiv = document.getElementById('adminPassResultDiv');
        if (resultDiv) {
            resultDiv.innerHTML = `<div class="alert alert-success mt-3">${message}</div>`;
        }
    }

    function resetButtons() {
        const btn = document.getElementById('adminGetPassButton');
        const loadingBtn = document.getElementById('adminLoadingButton');
        if (btn) btn.classList.remove('d-none');
        if (loadingBtn) loadingBtn.classList.add('d-none');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();