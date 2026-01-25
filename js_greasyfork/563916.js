// ==UserScript==
// @name         WME AD to BS Converter
// @namespace    https://greasyfork.org/users/1087400
// @version      0.1.7
// @description  Converts AD dates to BS dates in WME closure panel
// @author       https://greasyfork.org/en/users/1087400-kid4rm90s
// @include 	   /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      GNU GPL(v3)
// @connect      greasyfork.org
// @connect      githubusercontent.com
// @connect      kid4rm90s.github.io
// @require      https://greasyfork.org/scripts/560385/code/WazeToastr.js
// @downloadURL https://update.greasyfork.org/scripts/563916/WME%20AD%20to%20BS%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/563916/WME%20AD%20to%20BS%20Converter.meta.js
// ==/UserScript==

(function main() {
    'use strict';

    const scriptName = GM_info.script.name;
    const scriptVersion = GM_info.script.version;
    const updateMessage = `<strong>Version ${scriptVersion} - 2026-01-25:</strong><br>
    - Added support for various WME Locales<br>
    - Added Nepali calendar display support<br>
    - Added an option to choose between Nepali and English calendar display in the script tab<br>
    - Fixed date conversion issues due to timezone discrepancies<br>
    - Fixed various minor bugs and improved stability`;
    const downloadUrl = 'https://greasyfork.org/en/scripts/563916-wme-ad-to-bs-converter/code/WME-AD-to-BS-Converter.user.js';
    const forumURL = 'https://greasyfork.org/en/scripts/563916-wme-ad-to-bs-converter/feedback';
    let wmeSDK;
    // Calendar language state: 'ne' (Nepali) or 'en' (English)
    let calendarLang = 'ne';

    const log = (message) => console.log('WME_ADtoBS: ' + message);

    /**
     * Load and inject NepaliDate library
     */
    function loadNepaliDate() {
        return new Promise((resolve) => {
            if (unsafeWindow.NepaliDate && typeof unsafeWindow.NepaliDate.AD_TO_BS === 'function') {
                log('✓ NepaliDate library already available');
                resolve();
                return;
            }

            log('Fetching NepaliDate library from GitHub...');
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://kid4rm90s.github.io/NepaliBStoAD/NepaliBStoAD.js',
                timeout: 10000,
                onload: function(response) {
                    try {
                        log('Library fetched, injecting into page...');
                        // Create a script element to inject into the page
                        const script = document.createElement('script');
                        script.textContent = response.responseText;
                        script.type = 'text/javascript';
                        
                        // Use a callback function to track when script is done
                        script.onload = function() {
                            log('✓ NepaliDate script loaded');
                        };
                        
                        document.head.appendChild(script);
                        
                        // Wait for the script to execute
                        setTimeout(() => {
                            if (unsafeWindow.NepaliDate && typeof unsafeWindow.NepaliDate.AD_TO_BS === 'function') {
                                log('✓ NepaliDate library loaded and ready');
                                resolve();
                            } else {
                                log('⚠ NepaliDate not found after injection, retrying...');
                                // If still not available, try again after longer delay
                                setTimeout(() => {
                                    if (unsafeWindow.NepaliDate && typeof unsafeWindow.NepaliDate.AD_TO_BS === 'function') {
                                        log('✓ NepaliDate library available on retry');
                                        resolve();
                                    } else {
                                        log('✗ Failed to load NepaliDate library');
                                        resolve();
                                    }
                                }, 1000);
                            }
                        }, 300);
                    } catch (e) {
                        log('✗ Error loading NepaliDate: ' + e.message);
                        resolve();
                    }
                },
                onerror: function(error) {
                    log('✗ Failed to fetch NepaliDate: ' + error);
                    resolve();
                },
                ontimeout: function() {
                    log('✗ Timeout fetching NepaliDate');
                    resolve();
                }
            });
        });
    }

    unsafeWindow.SDK_INITIALIZED.then(initScript);

    function initScript() {
        wmeSDK = getWmeSdk({
            scriptId: 'WME_ADtoBS',
            scriptName: 'WME AD to BS Converter',
        });
        
        // Load NepaliDate library before starting
        loadNepaliDate().then(() => {
            WME_ADtoBS_bootstrap();
        });
    }

    // Add a script tab to the WME UI for language selection
    async function addScriptTab() {
        if (!wmeSDK || !wmeSDK.Sidebar || typeof wmeSDK.Sidebar.registerScriptTab !== 'function') return;
        // Only add once
        if (document.getElementById('wme-ad-bs-tab')) return;

        const { tabLabel, tabPane } = await wmeSDK.Sidebar.registerScriptTab();

        tabLabel.textContent = "AD↔BS";

        const tabContent = document.createElement('div');
        tabContent.style.padding = '12px';
        tabContent.innerHTML = `
            <h3 style="margin-top:0">WME AD↔BS Converter</h3>
            <h7> Version ${scriptVersion}</h7><br><br>
            <label style="font-weight:bold;">Nepali Calendar Display:</label><br>
            <label><input type="radio" name="wme-ad-bs-lang" value="ne" checked> नेपाली (Devanagari)</label><br>
            <label><input type="radio" name="wme-ad-bs-lang" value="en"> English</label>
        `;
        tabContent.id = 'wme-ad-bs-tab';
        tabContent.addEventListener('change', (e) => {
            if (e.target && e.target.name === 'wme-ad-bs-lang') {
                calendarLang = e.target.value;
            }
        });
        tabPane.appendChild(tabContent);
    }

    const WME_ADtoBS_bootstrap = () => {
        if (!document.getElementById('edit-panel') || !wmeSDK.DataModel.Countries.getTopCountry()) {
            setTimeout(WME_ADtoBS_bootstrap, 250);
            return;
        }
        if (wmeSDK.State.isReady) {
            addScriptTab();
            WME_ADtoBS_init();
        } else {
            wmeSDK.Events.once({ eventName: 'wme-ready' }).then(() => {
                addScriptTab();
                WME_ADtoBS_init();
            });
        }
    };

    const WME_ADtoBS_init = () => {
        log('Initing Observer');
        
        // Log library version for debugging
        if (unsafeWindow.NepaliDate && unsafeWindow.NepaliDate.version) {
            log('NepaliDate library version: ' + unsafeWindow.NepaliDate.version);
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Look for Closure Date Inputs
                        const startInput = node.querySelector('#closure_startDate');
                        const endInput = node.querySelector('#closure_endDate');

                        if (startInput) setupDateDisplay(startInput);
                        if (endInput) setupDateDisplay(endInput);
                    }
                });
            });
        });

        observer.observe(document.getElementById('edit-panel'), {
            childList: true,
            subtree: true,
        });

        log('Observer started on edit-panel');
    };

    /**
     * Injects the BS date display below the AD input field
     */
    function setupDateDisplay(inputElem) {
        const containerId = inputElem.id + '-bs-val';
        if (document.getElementById(containerId)) return;


        // Create display element
        const bsDisplay = document.createElement('div');
        bsDisplay.id = containerId;
        bsDisplay.style = 'color: #1e88e5; font-size: 13px; margin-top: 4px; font-weight: bold; padding-left: 5px; cursor: pointer; user-select: text;';
        bsDisplay.innerText = 'BS Date: --';

        // Add hover effect
        bsDisplay.addEventListener('mouseenter', () => {
            bsDisplay.style.textDecoration = 'underline';
        });
        bsDisplay.addEventListener('mouseleave', () => {
            bsDisplay.style.textDecoration = '';
        });

        // Show BS calendar popup on click
        bsDisplay.addEventListener('click', (e) => {
            if (!unsafeWindow.NepaliDate || typeof unsafeWindow.NepaliDate.BS_TO_AD !== 'function') {
                log('NepaliDate library not ready for BS_TO_AD');
                return;
            }
            // Remove any existing calendar
            document.querySelectorAll('.bs-calendar-popup').forEach(el => el.remove());

            // Get current BS value or today
            let currentBS = bsDisplay.innerText.replace(/^🇳🇵 BS:\s*/, '').trim();
            if (!/^\d{4}-\d{2}-\d{2}$/.test(currentBS)) {
                // fallback: use today's AD and convert to BS
                const today = new Date();
                const adStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
                currentBS = unsafeWindow.NepaliDate.AD_TO_BS(adStr);
            }
            let [bsYear, bsMonth, bsDay] = currentBS.split('-').map(Number);
            if (!bsYear || !bsMonth || !bsDay) {
                bsYear = 2080; bsMonth = 1; bsDay = 1;
            }

            // Create calendar popup
            const popup = document.createElement('div');
            popup.className = 'bs-calendar-popup';
            popup.style = 'position: absolute; z-index: 9999; background: #fff; border: 1px solid #aaa; border-radius: 6px; box-shadow: 0 2px 8px #0002; padding: 10px; font-size: 13px;';

            // Position popup below the bsDisplay
            const rect = bsDisplay.getBoundingClientRect();
            popup.style.left = `${rect.left + window.scrollX}px`;
            popup.style.top = `${rect.bottom + window.scrollY + 2}px`;

            // Calendar header
            const header = document.createElement('div');
            header.style = 'display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;';
            const prevMonth = document.createElement('button');
            prevMonth.textContent = '<';
            prevMonth.style = 'padding:2px 6px; margin-right:4px;';
            const nextMonth = document.createElement('button');
            nextMonth.textContent = '>';
            nextMonth.style = 'padding:2px 6px; margin-left:4px;';
            const ymLabel = document.createElement('span');
            ymLabel.style = 'font-weight:bold;';
            header.appendChild(prevMonth);
            header.appendChild(ymLabel);
            header.appendChild(nextMonth);
            popup.appendChild(header);

            // Calendar grid
            const grid = document.createElement('table');
            grid.style = 'border-collapse: collapse; width: 100%;';
            popup.appendChild(grid);

            // Helper: get days in BS month (robust)
            function getDaysInBSMonth(year, month) {
                let d = 1;
                while (d <= 35) {
                    const bsStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                    const ad = unsafeWindow.NepaliDate.BS_TO_AD(bsStr);
                    if (!ad || ad.includes('Error') || ad.includes('Invalid')) break;
                    // Convert back to BS to verify month
                    const bsBack = unsafeWindow.NepaliDate.AD_TO_BS(ad);
                    if (!bsBack || bsBack.includes('Error') || bsBack.includes('Invalid')) break;
                    const [bsy, bsm, bsd] = bsBack.split('-').map(Number);
                    if (bsy !== year || bsm !== month) break;
                    d++;
                }
                return d-1;
            }

            // Helper: convert number to Devanagari
            function toDevanagari(num) {
                return String(num).replace(/\d/g, d => '०१२३४५६७८९'[d]);
            }
            // Nepali month names
            const nepaliMonths = ['बैशाख','जेठ','असार','श्रावण','भदौ','आश्विन','कार्तिक','मंसिर','पुष','माघ','फाल्गुण','चैत्र'];
            const englishMonths = ['Baisakh','Jestha','Ashar','Shrawan','Bhadau','Ashwin','Kartik','Mangsir','Poush','Magh','Falgun','Chaitra'];
            // Helper: render calendar
            function renderCalendar(year, month, selectedDay) {
                // Use selected language for month and numerals
                let monthName, weekdayLabels, numFn;
                if (calendarLang === 'ne') {
                    monthName = nepaliMonths[month-1] || '';
                    weekdayLabels = ['आ','सो','मं','बु','बि','शु','श'];
                    numFn = toDevanagari;
                } else {
                    monthName = englishMonths[month-1] || '';
                    weekdayLabels = ['Su','Mo','Tu','We','Th','Fr','Sa'];
                    numFn = n => n;
                }
                ymLabel.textContent = `${numFn(year)} ${monthName}`;
                // Clear grid
                grid.innerHTML = '';
                const thead = document.createElement('thead');
                const trh = document.createElement('tr');
                weekdayLabels.forEach(wd => {
                    const th = document.createElement('th');
                    th.textContent = wd;
                    th.style = 'padding:2px 4px; color: #000000;';
                    trh.appendChild(th);
                });
                thead.appendChild(trh);
                grid.appendChild(thead);
                // Days
                const days = getDaysInBSMonth(year, month);
                // Find first day of week (convert 1st of month to AD, then JS day)
                const adFirst = unsafeWindow.NepaliDate.BS_TO_AD(`${year}-${String(month).padStart(2,'0')}-01`);
                let firstDay = 0;
                if (adFirst && !adFirst.includes('Error')) {
                    const [y,m,d] = adFirst.split('-').map(Number);
                    firstDay = new Date(y, m-1, d).getDay();
                }
                let tr = document.createElement('tr');
                for (let i=0; i<firstDay; i++) {
                    const td = document.createElement('td');
                    td.textContent = '';
                    tr.appendChild(td);
                }
                for (let day=1; day<=days; day++) {
                    if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
                        grid.appendChild(tr);
                        tr = document.createElement('tr');
                    }
                    const td = document.createElement('td');
                    td.textContent = numFn(day);
                    td.style = 'padding:3px 5px; text-align:center; cursor:pointer; border-radius:3px;';
                    if (day === selectedDay) {
                        td.style.background = '#1e88e5';
                        td.style.color = '#fff';
                    } else {
                        td.addEventListener('mouseenter',()=>{td.style.background='#e3f2fd';});
                        td.addEventListener('mouseleave',()=>{td.style.background='';});
                    }
                    td.addEventListener('click', () => {
                        // On day select: convert to AD, update input, close popup
                        const bsStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                        const adDateStr = unsafeWindow.NepaliDate.BS_TO_AD(bsStr);
                        log('BS_TO_AD conversion: ' + bsStr + ' -> ' + adDateStr);
                        if (!adDateStr || adDateStr.includes('Error') || adDateStr.includes('Invalid')) {
                            alert('Conversion failed: ' + adDateStr);
                            return;
                        }
                        const adParts = adDateStr.split('-');
                        if (adParts.length === 3) {
                            const mm = adParts[1].padStart(2, '0');
                            const dd = adParts[2].padStart(2, '0');
                            const yyyy = adParts[0];
                            const adInputVal = `${mm}/${dd}/${yyyy}`;
                            inputElem.value = adInputVal;
                            inputElem.dispatchEvent(new Event('input', { bubbles: true }));
                            // Remove popup
                            popup.remove();
                        } else {
                            alert('Unexpected AD date format: ' + adDateStr);
                        }
                    });
                    tr.appendChild(td);
                }
                // Fill trailing empty cells
                while (tr.children.length < 7) {
                    const td = document.createElement('td');
                    td.textContent = '';
                    tr.appendChild(td);
                }
                grid.appendChild(tr);
            }

            // Navigation
            prevMonth.onclick = () => {
                if (bsMonth === 1) { bsYear--; bsMonth = 12; } else { bsMonth--; }
                renderCalendar(bsYear, bsMonth, null);
            };
            nextMonth.onclick = () => {
                if (bsMonth === 12) { bsYear++; bsMonth = 1; } else { bsMonth++; }
                renderCalendar(bsYear, bsMonth, null);
            };

            // Dismiss on outside click
            function onDocClick(ev) {
                if (!popup.contains(ev.target) && ev.target !== bsDisplay) {
                    popup.remove();
                    document.removeEventListener('mousedown', onDocClick);
                }
            }
            setTimeout(()=>{
                document.addEventListener('mousedown', onDocClick);
            }, 0);

            // Add to body
            document.body.appendChild(popup);
            renderCalendar(bsYear, bsMonth, bsDay);
        });

        // Insert after the .date-time-picker container
        let dateTimePicker = inputElem.closest('.date-time-picker');
        if (dateTimePicker && dateTimePicker.parentNode) {
            dateTimePicker.parentNode.insertBefore(bsDisplay, dateTimePicker.nextSibling);
        } else {
            // fallback: insert after the wz-text-input
            let wzTextInput = inputElem.closest('wz-text-input');
            if (wzTextInput && wzTextInput.parentNode) {
                wzTextInput.parentNode.insertBefore(bsDisplay, wzTextInput.nextSibling);
            } else {
                // fallback: insert after the inputElem
                inputElem.parentNode.insertBefore(bsDisplay, inputElem.nextSibling);
            }
        }

        // Update initially
        updateBSValue(inputElem, bsDisplay);

        // Listen for changes (WME updates values dynamically)
        inputElem.addEventListener('input', () => updateBSValue(inputElem, bsDisplay));

        // Waze custom elements sometimes don't fire standard input events on programmatic change
        // We use a small interval or observer if necessary, but 'input' usually catches manual changes
        const valObserver = new MutationObserver(() => updateBSValue(inputElem, bsDisplay));
        valObserver.observe(inputElem, { attributes: true, attributeFilter: ['value'] });
    }

        /**
     * Logic to convert AD value from input to BS and update the label
     */

    // --- Locale-aware AD to BS update logic ---
    let _wmeLocale = null;
    let _wmeRegion = null;
    // Get locale and region from WME SDK
    function getWmeLocaleAndRegion() {
        try {
            if (wmeSDK && wmeSDK.Settings) {
                const localeInfo = wmeSDK.Settings.getLocale && wmeSDK.Settings.getLocale();
                if (localeInfo && localeInfo.localeCode) _wmeLocale = localeInfo.localeCode;
                if (localeInfo && localeInfo.localeName) _wmeRegion = localeInfo.localeName;
                // Try region code as well
                if (wmeSDK.Settings.getRegionCode) {
                    const regionInfo = wmeSDK.Settings.getRegionCode();
                    if (regionInfo && regionInfo.regionCode) _wmeRegion = regionInfo.regionCode;
                }
            }
        } catch (e) {
            log('Error getting WME locale/region: ' + e.message);
        }
    }

    // Call once at script init
    getWmeLocaleAndRegion();

    // Helper: get date format for locale
    function getDateFormatForLocale(locale, region) {
        // en-US, en-CA, etc: MM/DD/YYYY
        // en-GB, en-AU, hi, ne, etc: DD/MM/YYYY
        // Default: MM/DD/YYYY
        if (!locale) return 'MM/DD/YYYY';
        const l = locale.toLowerCase();
        // Add Hindi and Nepali (hi, ne) to DD/MM/YYYY
        if (
            l === 'en-gb' || l === 'en-au' || l === 'en-nz' || l === 'en-ie' || l === 'en-za' ||
            l.startsWith('hi') || l.startsWith('ne')
        ) return 'DD/MM/YYYY';
        if (l === 'en-us' || l === 'en-ca') return 'MM/DD/YYYY';
        // Try region code fallback
        if (region && typeof region === 'string') {
            const r = region.toUpperCase();
            if (r === 'GB' || r === 'AU' || r === 'NZ' || r === 'IE' || r === 'ZA') return 'DD/MM/YYYY';
            if (r === 'US' || r === 'CA') return 'MM/DD/YYYY';
        }
        return 'MM/DD/YYYY';
    }

    // Helper: convert Devanagari numerals to standard digits
    function normalizeDevanagariNumerals(str) {
        // ०१२३४५६७८९ (U+0966 - U+096F)
        return str.replace(/[\u0966-\u096F]/g, c => String(c.charCodeAt(0) - 0x0966));
    }

    function updateBSValue(inputElem, displayElem) {
        let adValue = inputElem.value; // Could be in Devanagari
        adValue = normalizeDevanagariNumerals(adValue);
        log(`Input value: ${adValue}`);
        if (!adValue || adValue.length < 8) {
            displayElem.innerText = 'BS Date: --';
            return;
        }

        try {
            // Check if NepaliDate library is available
            if (!unsafeWindow.NepaliDate || typeof unsafeWindow.NepaliDate.AD_TO_BS !== 'function') {
                displayElem.innerText = 'BS Date: ⏳ Loading...';
                log('NepaliDate not ready, retrying in 500ms...');
                // Retry after a short delay
                setTimeout(() => updateBSValue(inputElem, displayElem), 500);
                return;
            }

            // Get locale/region and date format
            getWmeLocaleAndRegion();
            const dateFormat = getDateFormatForLocale(_wmeLocale, _wmeRegion);
            let mm, dd, yyyy;
            const dateParts = adValue.split('/');
            if (dateParts.length === 3) {
                if (dateFormat === 'DD/MM/YYYY') {
                    dd = parseInt(dateParts[0], 10);
                    mm = parseInt(dateParts[1], 10);
                    yyyy = parseInt(dateParts[2], 10);
                } else {
                    mm = parseInt(dateParts[0], 10);
                    dd = parseInt(dateParts[1], 10);
                    yyyy = parseInt(dateParts[2], 10);
                }
                if (isNaN(mm) || isNaN(dd) || isNaN(yyyy)) {
                    displayElem.innerText = 'BS Date: Invalid date';
                    log('Invalid date parts: mm=' + mm + ', dd=' + dd + ', yyyy=' + yyyy);
                    return;
                }

                // Construct a UTC date string to avoid timezone issues
                // Use Date.UTC to ensure the date is not shifted by local timezone
                const utcDate = new Date(Date.UTC(yyyy, mm - 1, dd));
                const adDateStr = `${utcDate.getUTCFullYear()}-${String(utcDate.getUTCMonth() + 1).padStart(2, '0')}-${String(utcDate.getUTCDate()).padStart(2, '0')}`;
                log(`Converting (UTC): ${adDateStr}`);

                // Using NepaliDate.AD_TO_BS() to convert AD to BS
                const bsDateStr = unsafeWindow.NepaliDate.AD_TO_BS(adDateStr);
                log(`Result: ${bsDateStr}`);
                if (bsDateStr && !bsDateStr.includes('Error') && !bsDateStr.includes('Invalid')) {
                    if (calendarLang === 'ne') {
                        // Convert all numbers to Devanagari and label to Nepali
                        const devanagari = (str) => str.replace(/\d/g, d => '०१२३४५६७८९'[d]);
                        displayElem.innerText = `🇳🇵 बि.सं.: ${devanagari(bsDateStr)}`;
                    } else {
                        displayElem.innerText = `🇳🇵 BS: ${bsDateStr}`;
                    }
                } else {
                    displayElem.innerText = `BS Date: ${bsDateStr}`;
                    log('Conversion returned error: ' + bsDateStr);
                }
            } else {
                displayElem.innerText = 'BS Date: Invalid format';
                log('Invalid date format: ' + adValue);
            }
        } catch (e) {
            displayElem.innerText = 'BS Date: Error';
            log('Error: ' + e.message);
        }
    }

  function scriptupdatemonitor() {
    if (WazeToastr?.Ready) {
      // Create and start the ScriptUpdateMonitor
      const updateMonitor = new WazeToastr.Alerts.ScriptUpdateMonitor(scriptName, scriptVersion, downloadUrl, GM_xmlhttpRequest);
      updateMonitor.start(2, true); // Check every 2 hours, check immediately
 
      // Show the update dialog for the current version
      WazeToastr.Interface.ShowScriptUpdate(scriptName, scriptVersion, updateMessage, downloadUrl, forumURL);
    } else {
      setTimeout(scriptupdatemonitor, 250);
    }
  }
  scriptupdatemonitor();
  console.log(`${scriptName} initialized.`);
})();

/******** Version changelog  ********
Version 0.1.6-7 - 2026-01-25:
    - Added support for various WME Locales
    - Added Nepali calendar display support
    - Added an option to choose between Nepali and English calendar display in the script tab
    - Fixed date conversion issues due to timezone discrepancies
    - Fixed various minor bugs and improved stability
Version 0.1.5 - 2026-01-24
    - Fixed issue where calender was showing wrong dates for BS
    - Will add support for more date inputs in future updates
Version 0.1.4 - 2026-01-24
    - Currently supports for native UI for closure segment
    - Will add support for more date inputs in future updates
    
*********************/