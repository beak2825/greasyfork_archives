// ==UserScript==
// @name         InPlace Apply Helper
// @version      5.9
// @description  Apply-to-round helper
// @match        https://student-ca.inplacenetwork.com/*
// @run-at       document-end
// @namespace    https://greasyfork.org/users/1331386
// @downloadURL https://update.greasyfork.org/scripts/556729/InPlace%20Apply%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/556729/InPlace%20Apply%20Helper.meta.js
// ==/UserScript==

const UNI_LINKS = {
    "Alberta": "/university-of-alberta/",
    "UBC": "/university-of-british-columbia/",
    "Calgary": "/university-of-calgary/",
    "Dalhousie": "/dalhousie-university/",
    "Laval": "/universite-laval/",
    "Manitoba": "/university-of-manitoba/",
    "McGill": "/mcgill-university/",
    "McMaster": "/mcmaster-university/",
    "Memorial": "/memorial-university-of-newfoundland/",
    "Montreal": "/universite-de-montreal/",
    "NOSM": "/northern-ontario-school-of-medicine/",
    "Ottawa": "/university-of-ottawa/",
    "Queens": "/queens-university/",
    "Saskatchewan": "/university-of-saskatchewan/",
    "Sherbrooke": "/universite-de-sherbrooke/",
    "Toronto": "/university-of-toronto/",
    "TMU": "/toronto-metropolitan-university/",
    "Western": "/western-university/"
};

(function() {
    'use strict';

    const log = (...args) => console.log('[InPlaceScript]', ...args);

    /**************************************
     * Notification popup
     **************************************/
    function showNotification(message) {
        const note = document.createElement('div');
        note.textContent = message;

        Object.assign(note.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#323232',
            color: 'white',
            padding: '12px 18px',
            borderRadius: '8px',
            zIndex: '999999999',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '14px',
            opacity: '0',
            transition: 'opacity 0.4s ease'
        });

        document.body.appendChild(note);
        requestAnimationFrame(() => {
            note.style.opacity = '1';
        });

        setTimeout(() => {
            note.style.opacity = '0';
            setTimeout(() => note.remove(), 400);
        }, 2500);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**************************************
     * SPA Route Detection
     **************************************/
    let lastUrl = location.href;

    function initObserver() {
        const origPush = history.pushState;
        history.pushState = function() {
            const r = origPush.apply(this, arguments);
            routeChanged();
            return r;
        };

        const origReplace = history.replaceState;
        history.replaceState = function() {
            const r = origReplace.apply(this, arguments);
            routeChanged();
            return r;
        };

        window.addEventListener('popstate', routeChanged);

        new MutationObserver(() => {
            if (location.href !== lastUrl) routeChanged();
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function routeChanged() {
        if (location.href === lastUrl) return;
        lastUrl = location.href;
        setTimeout(runMainLogic, 200);
    }

    /**************************************
     * Wait helper
     **************************************/
    function waitFor(checkFn, timeout = 8000, interval = 200) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const res = checkFn();
                if (res) {
                    clearInterval(timer);
                    resolve(res);
                }
                if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject();
                }
            }, interval);
        });
    }

    /**************************************
     * Expand Filter Panel
     **************************************/
    function autoExpandFilterPanel() {
        waitFor(() => {
                return [...document.querySelectorAll('mat-expansion-panel-header h2')]
                    .find(el => el.textContent.trim() === 'Filter Result');
            })
            .then(h2 => {
                const header = h2.closest('mat-expansion-panel-header');
                if (!header) return;
                if (header.getAttribute('aria-expanded') !== 'true') {
                    log("Auto-expanding Filter panel");
                    header.click();
                }
            })
            .catch(() => log("Filter panel not found"));
    }

    /**************************************
     * Toggle Year Level – restored from v5.2
     **************************************/
    async function toggleYearLevel() {

        log("Running toggleYearLevel()");

        const selectEl = document.querySelector("mat-select[aria-label='Year Level']");
        if (!selectEl) return log("ERROR: Year Level select not found");

        // Let Angular finish rendering
        await sleep(1000);

        // STEP 1 — open the dropdown
        selectEl.click();

        waitFor(() => document.querySelector('.mat-mdc-select-panel'))
            .then(panel => {

                // STEP 2 — detect REAL selected option by aria-selected
                const options = [...panel.querySelectorAll('mat-option')];

                const selectedOption = options.find(o =>
                    o.getAttribute('aria-selected') === 'true'
                );

                if (!selectedOption) {
                    log("ERROR: No selected mat-option found");
                    return;
                }

                const currentValue = selectedOption.textContent.trim();
                log("Detected current Year Level:", currentValue);

                // STEP 3 — choose the opposite option
                let target, newValue;

                if (/eligible/i.test(currentValue)) {
                    target = options.find(o => /home elective/i.test(o.textContent));
                    newValue = "Home Elective";
                } else {
                    target = options.find(o => /eligible/i.test(o.textContent));
                    newValue = "Eligible";
                }

                if (!target) {
                    log("ERROR: Could not find opposite option");
                    return;
                }

                log("Switching TO:", newValue);
                target.click();

                // STEP 4 — press Save
                return waitFor(() => [...document.querySelectorAll('span.mdc-button__label')]
                    .find(el => el.textContent.trim() === 'Save')
                ).then(saveSpan => {

                    saveSpan.closest('button').click();

                    // show notification on dashboard
                    localStorage.setItem('yearLevelChangedTo', newValue);

                    // clear request flag
                    localStorage.removeItem('switchLocationRequested');

                    // go back to dashboard
                    setTimeout(() => {
                        location.href = "https://student-ca.inplacenetwork.com/dashboard";
                    }, 250);
                });

            })
            .catch(() => log("ERROR: Year Level panel never appeared"));
    }



    /**************************************
     * Auto-select second Region option
     **************************************/
    function autoSelectSecondRegion() {
        log("Attempting to auto-select Region #2…");

        waitFor(() => document.querySelector('mat-select[aria-label="Region"]'))
            .then(sel => {
                sel.click();
                return waitFor(() => document.querySelector('.mat-mdc-select-panel mat-option'));
            })
            .then(() => {
                const opts = [...document.querySelectorAll('.mat-mdc-select-panel mat-option')];
                if (opts.length >= 2) {
                    opts[1].click();
                } else {
                    log("Not enough region options");
                }
            })
            .catch(() => log("Region select failed"));
    }

    /**************************************
     * Auto-select Placement Type
     **************************************/
    function autoSelectPlacementType() {
        const pt = localStorage.getItem('placementType');
        if (!pt) return log("No placement type stored");

        log("Selecting Placement Type:", pt);

        waitFor(() => document.querySelector('mat-select[aria-label="Placement Type"]'))
            .then(sel => {
                sel.click();
                return waitFor(() => [...document.querySelectorAll('.mat-mdc-select-panel mat-option .mdc-list-item__primary-text')]
                    .find(span => span.textContent.trim() === pt)
                );
            })
            .then(span => {
                const opt = span.closest('mat-option');
                opt && opt.click();
            })
            .catch(() => log("Placement type option not found"));
    }

    /**************************************
     * NEW: Click Filter Button
     **************************************/
    function clickFilterButton() {
        log("Attempting to click Filter button…");

        waitFor(() => {
                return [...document.querySelectorAll('span.mdc-button__label')]
                    .find(el => el.textContent.trim() === 'Filter');
            })
            .then(span => {
                const btn = span.closest('button');
                if (btn) {
                    log("Clicking Filter button");
                    btn.click();
                }
            })
            .catch(() => log("Filter button not found"));
    }

    /**************************************
     * MAIN LOGIC
     **************************************/
    function runMainLogic() {
        const url = location.href;

        setTimeout(() => {

            injectApplyUI();
            injectPrefDefaultsButton();
            injectSwitchLocationButton();

            if (url.includes('/dashboard')) {
                const changed = localStorage.getItem("yearLevelChangedTo");
                if (changed) {
                    showNotification(`Year Level changed to: ${changed}`);
                    localStorage.removeItem("yearLevelChangedTo");
                }
            }

            if (url.includes('/dashboard')) {
                const pending = localStorage.getItem('pendingDashboardApply');
                const manual = localStorage.getItem("manualApplyNow");

                // If user manually clicked Apply to Rounds → STOP all automation
                if (manual === "1") {
                    console.log("Manual mode active — skipping dashboard auto-apply.");
                    localStorage.removeItem("pendingDashboardApply");
                    return;
                }

                // Auto-mode only if manual flag is NOT set
                if (pending === '1') {
                    localStorage.removeItem('pendingDashboardApply');

                    waitFor(() => [...document.querySelectorAll('span.mdc-button__label')]
                            .find(el => el.textContent.includes('Apply to Rounds'))
                           )
                        .then(span => span.closest('button').click())
                        .catch(() => log("Apply to Rounds not found"));
                }
            }

            if (url.includes('/requests/rounds')) {
                autoApplyFromStored();
            }

            // YEAR LEVEL SWITCHER TRIGGER
            const flag = localStorage.getItem('switchLocationRequested');
            if (url.includes('/my-account/profile') && flag === '1') {
                waitFor(() => document.querySelector("mat-select[aria-label='Year Level']"))
                    .then(() => toggleYearLevel());
            }

            /**************************************
             * Auto filter process on site page
             **************************************/
            if (localStorage.getItem('expandFilter') === '1') {
                localStorage.removeItem('expandFilter');

                setTimeout(async () => {
                    await sleep(1000);
                    autoExpandFilterPanel();

                    setTimeout(async () => {
                        autoSelectPlacementType();
                        await sleep(500);

                        autoSelectSecondRegion();
                        await sleep(500);

                        clickFilterButton();

                    }, 1000);

                }, 600);
            }

        }, 250);
    }

    /**************************************
     * Floating Panel UI
     **************************************/
    async function getOrCreatePanel() {
        // Try up to 40 times, 200ms apart
        for (let i = 0; i < 40; i++) {
            const aside = document.querySelector("lib-network-nav-item aside");

            if (aside) {
                let panel = aside.querySelector("#inplace-helper-panel");
                if (panel) return panel;

                panel = document.createElement("div");
                panel.id = "inplace-helper-panel";

                Object.assign(panel.style, {
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                });

                aside.appendChild(panel);
                console.log("Sidebar panel injected!");
                return panel;
            }

            await new Promise(r => setTimeout(r, 200));
        }

        console.log("ERROR: Sidebar never appeared.");
        return null;
    }


    /**************************************
     * Apply UI
     **************************************/
    async function injectApplyUI() {
        const panel = await getOrCreatePanel();
        if (!panel) return;

        if (panel.querySelector('#inplace-apply-container')) return;

        const container = document.createElement('div');
        container.id = 'inplace-apply-container';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '6px';

        const uniLabel = document.createElement('label');
        uniLabel.textContent = 'University';
        uniLabel.style.fontSize = '12px';

        const uniSelect = document.createElement('select');
        uniSelect.style.width = '100%';

        const lastUni = localStorage.getItem('selectedUni');

        [
            'Calgary', 'Dalhousie', 'McGill', 'McMaster', 'Memorial', 'Montreal',
            'Sherbrooke', 'Laval', 'Alberta', 'Manitoba', 'Saskatchewan',
            'Toronto', 'Western', 'Ottawa', 'UBC', 'Queens', 'NOSM'
        ].forEach(u => {
            const opt = document.createElement('option');
            opt.value = u;
            opt.textContent = u;
            if (lastUni === u) opt.selected = true;
            uniSelect.appendChild(opt);
        });

        const ptLabel = document.createElement('label');
        ptLabel.textContent = 'Placement Type (optional)';
        ptLabel.style.fontSize = '12px';

        const ptSelect = document.createElement('select');
        ptSelect.style.width = '100%';

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = '-- leave as-is --';
        ptSelect.appendChild(placeholder);

        const placementTypes = [
            'Anatomical Pathology', 'Anesthesiology', 'Cardiac Surgery', 'Dermatology',
            'Diagnostic Radiology', 'Emergency Medicine', 'Family Medicine', 'General Pathology',
            'General Surgery', 'Hematological Pathology', 'Internal Medicine', 'Laboratory Medicine (Undifferentiated)',
            'Medical Biochemistry', 'Medical Genetics and Genomics', 'Medical Microbiology', 'Medical Oncology',
            'Neurology', 'Neurology (Pediatrics)', 'Neuropathology', 'Neurosurgery', 'Non Clinical', 'Nuclear Medicine',
            'Obstetrics and Gynecology', 'Ophthalmology', 'Orthopedic Surgery', 'Otolaryngology - Head and Neck Surgery',
            'Pediatrics', 'Physical Medicine and Rehabilitation', 'Plastic Surgery', 'Psychiatry',
            'Public Health and Preventive Medicine', 'Radiation Oncology', 'Surgery Thoracic', 'Urology', 'Vascular Surgery'
        ];

        placementTypes.forEach(pt => {
            const opt = document.createElement('option');
            opt.value = pt;
            opt.textContent = pt;
            ptSelect.appendChild(opt);
        });

        const savedPT = localStorage.getItem('placementType');
        if (savedPT && placementTypes.includes(savedPT)) ptSelect.value = savedPT;

        ptSelect.addEventListener('change', () => {
            const v = ptSelect.value;
            if (v) localStorage.setItem('placementType', v);
            else localStorage.removeItem('placementType');
        });

        const btn = document.createElement('button');
        btn.textContent = 'Apply';
        Object.assign(btn.style, {
            background: '#007aff',
            color: 'white',
            borderRadius: '6px',
            padding: '6px 12px',
            marginTop: '6px'
        });

        // ---- NEW: Open Uni Requirements Button ----
        const reqBtn = document.createElement('button');
        reqBtn.textContent = 'Open Uni Requirements';

        Object.assign(reqBtn.style, {
            background: '#673ab7',
            color: 'white',
            borderRadius: '6px',
            padding: '6px 12px',
            marginTop: '6px'
        });

        reqBtn.addEventListener('click', () => {
            const uni = uniSelect.value;

            if (!UNI_LINKS[uni]) {
                showNotification("No link found for selected university");
                console.log("Missing mapping for:", uni);
                return;
            }

            const base = "https://afmcstudentportal.ca";
            const url = base + UNI_LINKS[uni];

            window.open(url, "_blank");
            showNotification(`Opening requirements for ${uni}`);
        });


        btn.addEventListener('click', () => {
            // mark that this apply is AUTO
            localStorage.removeItem("manualApplyNow");

            localStorage.setItem('selectedUni', uniSelect.value);
            localStorage.setItem('pendingDashboardApply', '1');
            location.href = '/dashboard';
        });

        container.appendChild(uniLabel);
        container.appendChild(uniSelect);
        container.appendChild(ptLabel);
        container.appendChild(ptSelect);
        container.appendChild(btn);
        container.appendChild(reqBtn);


        panel.appendChild(container);
    }

    /**************************************
     * Switch Year Location
     **************************************/
    async function injectSwitchLocationButton() {
        const panel = await getOrCreatePanel();
        if (!panel) return;
        if (panel.querySelector('#switch-location-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'switch-location-btn';
        btn.textContent = 'Switch Visting/Home';
        Object.assign(btn.style, {
            padding: '6px 12px',
            background: '#ff5722',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
        });

        btn.addEventListener('click', () => {
            localStorage.setItem('switchLocationRequested', '1');
            location.href = '/my-account/profile';
        });

        panel.appendChild(btn);
    }

    /**************************************
     * Auto-apply on rounds
     **************************************/
    function autoApplyFromStored() {

        // Manual mode → skip everything
        if (localStorage.getItem("manualApplyNow") === "1") {
            console.log("Manual Apply detected — skipping autoApplyFromStored()");
            return;
        }

        const uni = localStorage.getItem('selectedUni');
        if (!uni) return;

        setTimeout(() => {
            const titles = [...document.querySelectorAll('mat-card mat-card-title')];

            let match;

            if (uni === "Calgary") {
                // Special rule: ONLY pick "All Capacity" card
                match = titles.find(t => {
                    const text = t.textContent.trim();
                    return text.startsWith("Calgary") && /all capacity/i.test(text);
                });
            } else {
                // Normal rule for all other universities
                match = titles.find(t => t.textContent.trim().startsWith(uni));
            }

            if (!match) {
                console.log("No matching card found for:", uni);
                return;
            }

            const card = match.closest('mat-card');
            if (!card) return;

            const btn = [...card.querySelectorAll('button span.mdc-button__label')]
            .find(el => /apply/i.test(el.textContent));

            if (btn) {
                btn.closest('button').click();
                localStorage.setItem('expandFilter', '1');
            } else {
                console.log("Apply button not found for selected card");
            }
        }, 250);
    }

    /**************************************
     * PREF DEFAULTS BUTTON (fixed start date selector)
     **************************************/
    async function injectPrefDefaultsButton() {
        const panel = await getOrCreatePanel();
        if (!panel) return;
        if (panel.querySelector('#pref-defaults-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'pref-defaults-btn';
        btn.textContent = 'Pref Defaults';

        Object.assign(btn.style, {
            padding: '6px 12px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
        });

        btn.addEventListener('click', async () => {
            if (!location.href.includes('/requests/preferences')) {
                showNotification("Not on preferences page");
                return;
            }

            try {
                // --- 1) Find Start Date input reliably ---
                const startInput = document.querySelector(
                    'input[aria-label="Start Date"][readonly]'
                );

                if (!startInput || !startInput.value) {
                    showNotification("Start Date not found");
                    console.log("DEBUG: Start Date selector result =", startInput);
                    return;
                }

                const startDate = new Date(startInput.value);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 14);

                const yyyy = endDate.getFullYear();
                const mm = String(endDate.getMonth() + 1).padStart(2, '0');
                const dd = String(endDate.getDate()).padStart(2, '0');
                const endStr = `${yyyy}-${mm}-${dd}`;

                // --- 2) END DATE (automatically resolved) ---
                const endInput = document.querySelector(
                    'lib-network-date input.mat-datepicker-input:not([readonly])'
                );

                if (!endInput) {
                    showNotification("Could not locate End Date field");
                    console.log("DEBUG: End Date input not found");
                    return;
                }

                setDateInput(endInput, endStr);
                // --- 3) Duration = 10 ---
                const dur = document.querySelector('input[aria-label="Duration"]');
                if (dur) {
                    dur.value = 10;
                    dur.dispatchEvent(new Event('input', {
                        bubbles: true
                    }));
                    dur.dispatchEvent(new Event('change', {
                        bubbles: true
                    }));
                }

                // --- FIXED DATES = YES ---
                // chip group index 0
                clickYesChip(0);

                // --- FIXED DURATION = YES ---
                // chip group index 1
                clickYesChip(1);
                
                clickNextButton();

                showNotification("Preferences filled with defaults!");

            } catch (err) {
                console.error(err);
                showNotification("Error applying Pref Defaults");
            }
        });

        panel.appendChild(btn);
    }

    function clickYesChip(chipListIndex) {
        // Find all chip groups
        const groups = document.querySelectorAll("mat-chip-listbox");

        if (!groups || groups.length <= chipListIndex) {
            console.log("Chip group not found at index", chipListIndex);
            return;
        }

        const group = groups[chipListIndex];

        // The YES chip is always the first <mat-chip-option>
        const yesChip = group.querySelector("mat-chip-option:first-child button");

        if (!yesChip) {
            console.log("YES chip button not found");
            return;
        }

        const alreadySelected = yesChip.getAttribute("aria-selected") === "true";

        if (!alreadySelected) {
            yesChip.click();
            console.log("Clicked YES chip in group", chipListIndex);
        } else {
            console.log("YES chip already selected for group", chipListIndex);
        }
    }

    function setDateInput(target, value) {
        let el;

        // accept selector string
        if (typeof target === "string") {
            el = document.querySelector(target);
        }
        // accept DOM element
        else if (target instanceof Element) {
            el = target;
        }
        // accept a resolver function
        else if (typeof target === "function") {
            el = target();
        }

        if (!el) {
            console.log("EndDate: selector not found:", target);
            return false;
        }

        el.value = value;

        ['input', 'change', 'blur'].forEach(ev => {
            el.dispatchEvent(new Event(ev, { bubbles: true }));
        });

        el.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Enter'
        }));

        return true;
    }

    function clickNextButton() {
        waitFor(() => {
            return [...document.querySelectorAll("button .mdc-button__label")]
                .find(el => el.textContent.trim().toLowerCase() === "next");
        })
            .then(labelSpan => {
            const btn = labelSpan.closest("button");
            if (btn) {
                console.log("Clicking Next button");
                btn.click();
            } else {
                console.log("Next label found but no button?");
            }
        })
            .catch(() => console.log("Next button not found"));
    }

    /**************************************
     * INIT
     **************************************/
    initObserver();
    // Detect manual clicking of dashboard's native "Apply to Rounds" button
    document.addEventListener("click", evt => {
        const lbl = evt.target.closest("button span.mdc-button__label");
        if (!lbl) return;

        if (/apply to rounds/i.test(lbl.textContent.trim())) {
            console.log("Manual Apply to Rounds detected");
            localStorage.setItem("manualApplyNow", "1");
        }
    });
    runMainLogic();

})();