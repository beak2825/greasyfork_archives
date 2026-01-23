// ==UserScript==
// @name         Audible Search - Master Toggle
// @version      0.4
// @description  One checkbox to enable/disable your chosen filters (edit config to pick which ones)
// @author       DeepDarkSpace
// @match        https://www.audible.com/*
// @match        https://www.audible.co.uk/*
// @match        https://www.audible.ca/*
// @grant        none
// @license      GPL-3.0-or-later
// @namespace https://greasyfork.org/users/1563597
// @downloadURL https://update.greasyfork.org/scripts/563677/Audible%20Search%20-%20Master%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/563677/Audible%20Search%20-%20Master%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ────────────────────────────────────────────────
    //  USER CONFIG - EDIT THESE to choose what the checkbox controls
    // ────────────────────────────────────────────────
    const config = {
        // What happens when the checkbox is CHECKED (true = apply this filter) (false = not applied)
        removeVirtualVoice: true,
        includeUp1Hour:  false,
        include1to3Hours: false,
        include3to6Hours: false,
        include6to10Hours:  true,
        include10to20Hours: true,
        include20PlusHours: true,
        englishOnly:        true
    };
    // ────────────────────────────────────────────────
    //                 End User Config
    // ────────────────────────────────────────────────

    const CHECKBOX_ID = 'masterCustomFilterCheckbox';


    // Filter values (rarely change; Here in case Audible breaks the filters)
    const VIRTUAL_VOICE_KEYWORD = '-virtual_voice';

    const DURATION_PARAM = 'feature_seven_browse-bin';
    const durationValues = {
        'Up1':    '18685630011',   // up - 1 hour
        '1to3':   '18685631011',   // 1–3 hours
        '3to6':   '18685632011',   // 3–6 hours
        '6to10':  '18685633011',   // 6–10 hours
        '10to20': '18685634011',   // 10–20 hours
        '20plus': '18685635011'    // 20+ hours
    };

    const LANGUAGE_PARAM = 'feature_six_browse-bin';
    const ENGLISH_VALUE = '18685580011';
    // End Filter values

    function areFiltersActive() {
        const url = new URL(window.location.href);
        let activeCount = 0;
        const totalPossible = 0 +
              (config.removeVirtualVoice ? 1 : 0) +
              (config.includeUp1Hour ? 1 : 0) +
              (config.include1to2Hours ? 1 : 0) +
              (config.include3to6Hours ? 1 : 0) +
              (config.include6to10Hours ? 1 : 0) +
              (config.include10to20Hours ? 1 : 0) +
              (config.include20PlusHours ? 1 : 0) +
              (config.englishOnly ? 1 : 0);

        if (totalPossible === 0) return false;

        if (config.removeVirtualVoice) {
            const kw = (url.searchParams.get('keywords') || '').trim().toLowerCase();
            if (kw.includes('-virtual_voice')) {
                activeCount++;
            }
        }

        if (config.include6to10Hours || config.include10to20Hours || config.include20PlusHours) {
            const durations = url.searchParams.getAll(DURATION_PARAM);
            if (durations.length > 0) {
                if (config.includeUp1Hour && durations.includes(durationValues['Up1'])) activeCount++;
                if (config.include1to3Hours && durations.includes(durationValues['1to3'])) activeCount++;
                if (config.include3to6Hours && durations.includes(durationValues['3to6'])) activeCount++;
                if (config.include6to10Hours && durations.includes(durationValues['6to10'])) activeCount++;
                if (config.include10to20Hours && durations.includes(durationValues['10to20'])) activeCount++;
                if (config.include20PlusHours && durations.includes(durationValues['20plus'])) activeCount++;
            }
        }

        return activeCount > 0;
    }

    function modifyURL() {
        const checkbox = document.getElementById(CHECKBOX_ID);
        if (!checkbox) return;

        const enabled = checkbox.checked;
        const url = new URL(window.location.href);
        let modified = false;

        // Virtual Voice
        let keywords = (url.searchParams.get('keywords') || '').trim();
        if (config.removeVirtualVoice) {
            if (enabled) {
                if (!keywords.includes(VIRTUAL_VOICE_KEYWORD)) {
                    keywords = keywords ? `${keywords} ${VIRTUAL_VOICE_KEYWORD}` : VIRTUAL_VOICE_KEYWORD;
                    url.searchParams.set('keywords', keywords);
                    modified = true;
                }
            } else {
                if (keywords.includes(VIRTUAL_VOICE_KEYWORD)) {
                    keywords = keywords.replace(new RegExp(VIRTUAL_VOICE_KEYWORD, 'gi'), '').replace(/\s+/g, ' ').trim();
                    url.searchParams.set('keywords', keywords || '');
                    modified = true;
                }
            }
        }

        if (config.include6to10Hours || config.include10to20Hours || config.include20PlusHours) {
            let durations = url.searchParams.getAll(DURATION_PARAM);

            const desired = [];
            if (config.includeUp1Hour && enabled) desired.push(durationValues['Up1']);
            if (config.include1to3Hours && enabled) desired.push(durationValues['1to3']);
            if (config.include3to6Hours && enabled) desired.push(durationValues['3to6']);
            if (config.include6to10Hours && enabled) desired.push(durationValues['6to10']);
            if (config.include10to20Hours && enabled) desired.push(durationValues['10to20']);
            if (config.include20PlusHours && enabled) desired.push(durationValues['20plus']);

            desired.forEach(v => {
                if (!durations.includes(v)) {
                    url.searchParams.append(DURATION_PARAM, v);
                    modified = true;
                }
            });

            const toKeep = enabled ? desired : [];
            if (durations.some(v => !toKeep.includes(v))) {
                url.searchParams.delete(DURATION_PARAM);
                toKeep.forEach(v => url.searchParams.append(DURATION_PARAM, v));
                modified = true;
            }
        }

        // Language (English Only)
        if (config.englishOnly) {
            let langs = url.searchParams.getAll(LANGUAGE_PARAM);
            if (enabled) {
                if (!langs.includes(ENGLISH_VALUE)) {
                    url.searchParams.append(LANGUAGE_PARAM, ENGLISH_VALUE);
                    modified = true;
                }
            } else {
                if (langs.includes(ENGLISH_VALUE)) {
                    langs = langs.filter(v => v !== ENGLISH_VALUE);
                    url.searchParams.delete(LANGUAGE_PARAM);
                    langs.forEach(v => url.searchParams.append(LANGUAGE_PARAM, v));
                    modified = true;
                }
            }
        }

        if (modified) {
            window.location.href = url.toString();
        }
    }

    function addCheckbox() {
        if (document.getElementById(CHECKBOX_ID)) return;

        const parent = document.querySelector('#left-1 > form > section > div.bc-accordion.bc-color-border-base.bc-accordion-borderless.bc-accordion-icon-position-');
        if (!parent) return;

        const heading = document.createElement('h2');
        heading.id = 'custom-filter-heading';
        heading.className = 'bc-text bc-pub-relative bc-accordion-header-text bc-size-base bc-text-bold bc-box bc-box-padding-mini bc-accordion-header-inner bc-accordion-header-content';
        heading.textContent = 'Custom Filters';

        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.margin = '8px 0';
        label.style.padding = '0 12px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = CHECKBOX_ID;
        checkbox.checked = areFiltersActive()
        checkbox.style.marginRight = '8px';
        checkbox.style.width = '18px';
        checkbox.style.height = '18px';

        const text = document.createElement('span');
        text.textContent = 'Master: No Virtual Voice';
        if (config.includeUp1Hour) text.textContent += ' • +1h';
        if (config.include1to3Hours) text.textContent += ' • 1–3h';
        if (config.include3to6Hours) text.textContent += ' • 3-6h';
        if (config.include6to10Hours) text.textContent += ' • 6–10h';
        if (config.include10to20Hours) text.textContent += ' • 10–20h';
        if (config.include20PlusHours) text.textContent += ' • 20h+';
        if (config.englishOnly) text.textContent += ' • English only';

        label.appendChild(checkbox);
        label.appendChild(text);

        checkbox.addEventListener('change', modifyURL);

        // top of the filters section
        parent.insertBefore(heading, parent.firstChild);
        parent.insertBefore(label, heading.nextSibling);
    }

    addCheckbox();

})();