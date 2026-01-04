// ==UserScript==
// @name         WhatsApp Web – Export Unsaved Numbers v1.7 (Auto Scroll Scanner)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Gradually scrolls the WhatsApp Web chat list to detect unsaved phone numbers and export them into a Google Contacts–compatible CSV file (prevents Excel scientific notation, with real-time progress notifications).
// @author       castipo
// @license      MIT
// @match        https://web.whatsapp.com/*
// @grant        none
// @icon         https://web.whatsapp.com/favicon.ico
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560345/WhatsApp%20Web%20%E2%80%93%20Export%20Unsaved%20Numbers%20v17%20%28Auto%20Scroll%20Scanner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560345/WhatsApp%20Web%20%E2%80%93%20Export%20Unsaved%20Numbers%20v17%20%28Auto%20Scroll%20Scanner%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== Configuration (stored in localStorage) =====
    const LS_KEYS = {
        namePrefix: 'unsaved_name_prefix',
        groupLabel: 'unsaved_group_label',
        defaultCC: 'unsaved_default_country_code',
    };

    function askConfigOrThrow() {
        const defName =
            localStorage.getItem(LS_KEYS.namePrefix) ||
            `Customer ${new Date().toLocaleString('en-US', {
                month: 'short',
                year: '2-digit',
            })}`;

        const defGroup =
            localStorage.getItem(LS_KEYS.groupLabel) || 'WhatsApp';

        const defCC =
            localStorage.getItem(LS_KEYS.defaultCC) || '62';

        const namePrefix = prompt(
            'Contact name prefix:',
            defName
        );
        if (namePrefix === null) throw new Error('Cancelled');

        const groupLabel = prompt(
            'Contact label (Google Contacts):',
            defGroup
        );
        if (groupLabel === null) throw new Error('Cancelled');

        const defaultCountryCode = prompt(
            'Default country code for local numbers (without "+"):',
            defCC
        );
        if (defaultCountryCode === null) throw new Error('Cancelled');

        const cleanCC = defaultCountryCode.replace(/[^\d]/g, '');

        localStorage.setItem(LS_KEYS.namePrefix, namePrefix);
        localStorage.setItem(LS_KEYS.groupLabel, groupLabel);
        localStorage.setItem(LS_KEYS.defaultCC, cleanCC);

        return {
            namePrefix,
            groupLabel,
            defaultCountryCode: cleanCC,
        };
    }

    // ===== Toast Notification =====
    function showToast(message) {
        let toast = document.getElementById('wa-export-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'wa-export-toast';
            Object.assign(toast.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#25D366',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                zIndex: 9999,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            });
            document.body.appendChild(toast);
        }
        toast.textContent = message;
    }

    function hideToast() {
        const toast = document.getElementById('wa-export-toast');
        if (toast) toast.remove();
    }

    // ===== CSV Generator (Google Contacts compatible) =====
    function convertToCSV(numbers, cfg) {
        const header = [
            'First Name','Middle Name','Last Name',
            'Phonetic First Name','Phonetic Middle Name','Phonetic Last Name',
            'Name Prefix','Name Suffix','Nickname','File As',
            'Organization Name','Organization Title','Organization Department',
            'Birthday','Notes','Photo','Labels',
            'Phone 1 - Label','Phone 1 - Value',
            'Event 1 - Label','Event 1 - Value'
        ];

        const rows = [header];

        numbers.forEach((num, i) => {
            const row = Array(header.length).fill('');
            row[0]  = `${cfg.namePrefix} ${String(i + 1).padStart(3, '0')}`;
            row[16] = cfg.groupLabel;
            row[17] = 'Mobile';
            row[18] = num.startsWith('+')
                ? num
                : `+${cfg.defaultCountryCode}${num.replace(/^0+/, '')}`;
            rows.push(row);
        });

        return rows
            .map(r => r.map(v => `"${v}"`).join(','))
            .join('\n');
    }

    // ===== Extract Numbers From DOM =====
    function extractNumbersFromDOM(existingSet, cfg) {
        const spans = document.querySelectorAll(
            'div[role="grid"] span._ao3e'
        );
        let found = 0;

        spans.forEach(el => {
            const raw = (el.textContent || '').trim();
            const clean = raw.replace(/[^\d+]/g, '');

            // International format (E.164)
            if (/^\+\d{7,15}$/.test(clean)) {
                if (!existingSet.has(clean)) {
                    existingSet.add(clean);
                    found++;
                }
                return;
            }

            // Local numbers → convert using default country code
            if (cfg && cfg.defaultCountryCode) {
                const local = clean.replace(/^0+/, '');
                if (/^\d{6,14}$/.test(local)) {
                    const e164 = `+${cfg.defaultCountryCode}${local}`;
                    if (/^\+\d{7,15}$/.test(e164) && !existingSet.has(e164)) {
                        existingSet.add(e164);
                        found++;
                    }
                }
            }
        });

        return found;
    }

    // ===== Scroll & Scan Logic =====
    async function scrollAndExtractAll() {
        const chatListDiv = document.querySelector(
            'div[aria-label="Chat list"]'
        );
        if (!chatListDiv) {
            alert('❌ Failed to locate the chat list.');
            return;
        }

        function findScrollParent(el) {
            while (el) {
                const style = window.getComputedStyle(el);
                if (
                    style.overflowY === 'auto' ||
                    style.overflowY === 'scroll'
                ) {
                    return el;
                }
                el = el.parentElement;
            }
            return null;
        }

        const scroller = findScrollParent(chatListDiv);
        if (!scroller) {
            alert('❌ Failed to locate the scrollable chat container.');
            return;
        }

        let cfg;
        try {
            cfg = askConfigOrThrow();
        } catch (e) {
            showToast('Operation cancelled');
            return;
        }

        const foundNumbers = new Set();
        let prevScrollTop = -1;
        let retries = 0;

        while (retries < 5) {
            extractNumbersFromDOM(foundNumbers, cfg);
            showToast(
                `Scanning… ${foundNumbers.size} numbers found`
            );

            prevScrollTop = scroller.scrollTop;
            scroller.scrollTop += 600;

            await new Promise(r => setTimeout(r, 400));

            if (scroller.scrollTop === prevScrollTop) {
                retries++;
            } else {
                retries = 0;
            }
        }

        // Final refinement pass
        for (let i = 0; i < 3; i++) {
            await new Promise(r => setTimeout(r, 300));
            extractNumbersFromDOM(foundNumbers, cfg);
            showToast(
                `Finalizing results… ${foundNumbers.size} numbers`
            );
        }

        hideToast();

        if (foundNumbers.size === 0) {
            alert('❌ No unsaved phone numbers were found.');
        } else {
            const csv = convertToCSV(
                Array.from(foundNumbers),
                cfg
            );
            downloadCSV(csv);
        }
    }

    // ===== CSV Download =====
    function downloadCSV(
        content,
        filename = 'whatsapp_unsaved_contacts.csv'
    ) {
        const blob = new Blob([content], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ===== UI Button =====
    function addExportButton() {
        if (document.getElementById('exportUnsavedBtn')) return;

        const chatContainers =
            document.querySelectorAll('div[role="grid"]');
        if (!chatContainers.length) return;

        const container = chatContainers[0].parentElement;

        const btn = document.createElement('button');
        btn.id = 'exportUnsavedBtn';
        btn.textContent = 'Export Unsaved Numbers (CSV)';
        btn.style = `
            margin: 8px;
            padding: 6px 12px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
        `;
        btn.onclick = scrollAndExtractAll;

        container.insertBefore(btn, container.firstChild);
    }

    // ===== Observe DOM Changes =====
    const observer = new MutationObserver(() => {
        const chatList = document.querySelector(
            'div[aria-label="Chat list"]'
        );
        if (chatList) addExportButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
