// ==UserScript==
// @name         Torn Crimes 2.0 Declutter
// @namespace    Torn Crimes 2.0 Declutter
// @version      1.0
// @description  Hide/lock specific crimes on Torn.com for decluttering
// @author       tasozz
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562656/Torn%20Crimes%2020%20Declutter.user.js
// @updateURL https://update.greasyfork.org/scripts/562656/Torn%20Crimes%2020%20Declutter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles
    GM_addStyle(`
        .crime-settings-btn {
            display: inline-block;
            background: linear-gradient(to bottom, #4a4a4a, #2a2a2a);
            color: #fff;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            margin-right: 10px;
            border: 1px solid #555;
            transition: all 0.3s ease;
        }

        .crime-settings-btn:hover {
            background: linear-gradient(to bottom, #5a5a5a, #3a3a3a);
            border-color: #777;
        }

        .crime-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a1a1a;
            border: 2px solid #444;
            border-radius: 10px;
            padding: 25px;
            z-index: 10000;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8);
        }

        .crime-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9999;
        }

        .crime-modal h2 {
            margin: 0 0 20px 0;
            color: #fff;
            font-size: 20px;
            border-bottom: 2px solid #444;
            padding-bottom: 10px;
        }

        .crime-checkbox-item {
            display: flex;
            align-items: center;
            padding: 10px;
            margin: 5px 0;
            background: #2a2a2a;
            border-radius: 5px;
            transition: background 0.2s;
        }

        .crime-checkbox-item:hover {
            background: #353535;
        }

        .crime-checkbox-item input[type="checkbox"] {
            width: 18px;
            height: 18px;
            margin-right: 12px;
            cursor: pointer;
        }

        .crime-checkbox-item label {
            color: #ddd;
            cursor: pointer;
            flex: 1;
            font-size: 14px;
        }

        .crime-modal-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            justify-content: flex-end;
        }

        .crime-modal-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s;
        }

        .crime-modal-btn.save {
            background: #4a9d4e;
            color: white;
        }

        .crime-modal-btn.save:hover {
            background: #5aad5e;
        }

        .crime-modal-btn.cancel {
            background: #666;
            color: white;
        }

        .crime-modal-btn.cancel:hover {
            background: #777;
        }

        .crime-modal-btn.reset {
            background: #d14545;
            color: white;
        }

        .crime-modal-btn.reset:hover {
            background: #e15555;
        }

        .crime___jvtsM.hidden-crime {
            display: none !important;
        }

        .crime___jvtsM.locked-crime {
            pointer-events: none !important;
            opacity: 0.5;
            filter: grayscale(80%);
            cursor: not-allowed !important;
        }

        /* Make sure all child elements are also unclickable */
        .crime___jvtsM.locked-crime * {
            pointer-events: none !important;
            cursor: not-allowed !important;
        }

        /* Specifically target the status circles */
        .crime___jvtsM.locked-crime .statusCirclePosition___oTv4R,
        .crime___jvtsM.locked-crime .statusCircle___FYWOO {
            pointer-events: none !important;
            cursor: not-allowed !important;
        }
    `);

    // Available crimes list
    const allCrimes = [
        'Search for Cash',
        'Bootlegging',
        'Graffiti',
        'Shoplifting',
        'Pickpocketing',
        'Card Skimming',
        'Burglary',
        'Hustling',
        'Disposal',
        'Cracking',
        'Forgery',
        'Scamming',
        'Arson'
    ];

    // Load saved settings
    function loadSettings() {
        const saved = localStorage.getItem('tornCrimesHidden');
        return saved ? JSON.parse(saved) : [];
    }

    // Save settings
    function saveSettings(hiddenCrimes) {
        localStorage.setItem('tornCrimesHidden', JSON.stringify(hiddenCrimes));
    }

    // Apply hiding to crimes
    function applyCrimeFilters() {
        const hiddenCrimes = loadSettings();

        // Remove all previous filters
        document.querySelectorAll('.crime___jvtsM').forEach(crime => {
            crime.classList.remove('hidden-crime', 'locked-crime');
        });

        // Apply filters
        hiddenCrimes.forEach(crimeName => {
            const crimeElement = Array.from(document.querySelectorAll('.crimeTitle___Q9cpR'))
                .find(el => el.textContent.trim() === crimeName);

            if (crimeElement) {
                const crimeContainer = crimeElement.closest('.crime___jvtsM');
                if (crimeContainer) {
                    // You can change 'locked-crime' to 'hidden-crime' if you want to completely hide them
                    crimeContainer.classList.add('locked-crime');
                }
            }
        });
    }

    // Create settings modal
    function createSettingsModal() {
        const overlay = document.createElement('div');
        overlay.className = 'crime-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'crime-modal';

        const title = document.createElement('h2');
        title.textContent = 'Select Crimes to Hide/Lock';
        modal.appendChild(title);

        const hiddenCrimes = loadSettings();

        // Create checkboxes for each crime
        allCrimes.forEach(crime => {
            const item = document.createElement('div');
            item.className = 'crime-checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `crime-${crime.replace(/\s+/g, '-')}`;
            checkbox.checked = hiddenCrimes.includes(crime);

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = crime;

            item.appendChild(checkbox);
            item.appendChild(label);
            modal.appendChild(item);
        });

        // Buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'crime-modal-buttons';

        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'crime-modal-btn reset';
        resetBtn.textContent = 'Reset All';
        resetBtn.onclick = () => {
            modal.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        };

        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'crime-modal-btn cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        };

        // Save button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'crime-modal-btn save';
        saveBtn.textContent = 'Save';
        saveBtn.onclick = () => {
            const selected = [];
            modal.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                const label = modal.querySelector(`label[for="${cb.id}"]`);
                selected.push(label.textContent);
            });

            saveSettings(selected);
            applyCrimeFilters();

            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        };

        buttonsDiv.appendChild(resetBtn);
        buttonsDiv.appendChild(cancelBtn);
        buttonsDiv.appendChild(saveBtn);
        modal.appendChild(buttonsDiv);

        overlay.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        };

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    // Add settings button
    function addSettingsButton() {
        // Wait for the page to load
        const checkForElement = setInterval(() => {
            // Look for "Criminal Record" text or the crimes container
            const crimesContainer = document.querySelector('.crimeTypes___SPiiy');

            if (crimesContainer && crimesContainer.parentElement) {
                clearInterval(checkForElement);

                // Check if button already exists
                if (document.querySelector('.crime-settings-btn')) return;

                const settingsBtn = document.createElement('div');
                settingsBtn.className = 'crime-settings-btn';
                settingsBtn.textContent = '⚙️ Crime Filters';
                settingsBtn.onclick = createSettingsModal;

                // Insert before the crimes container
                crimesContainer.parentElement.insertBefore(settingsBtn, crimesContainer);

                // Apply saved filters
                applyCrimeFilters();
            }
        }, 500);

        // Stop checking after 10 seconds
        setTimeout(() => clearInterval(checkForElement), 10000);
    }

    // Initialize
    addSettingsButton();

    // Re-apply filters when navigating within the SPA
    const observer = new MutationObserver(() => {
        if (window.location.href.includes('page.php?sid=crimes')) {
            applyCrimeFilters();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();