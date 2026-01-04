// ==UserScript==
// @name         Craigslist – Renew All Postings
// @namespace    https://x.com/ArtemR
// @version      1.0
// @description  Adds a "renew all" button to renew all Craigslist postings that show a "renew" button.
// @author       Artem Russakovskii
// @match        https://accounts.craigslist.org/login/home*
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548173/Craigslist%20%E2%80%93%20Renew%20All%20Postings.user.js
// @updateURL https://update.greasyfork.org/scripts/548173/Craigslist%20%E2%80%93%20Renew%20All%20Postings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---- CONFIG ----
    const DELAY_MS = 100; // Increase if you hit rate limits

    const $ = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    function makeBadge(text) {
        const s = document.createElement('small');
        s.textContent = text;
        s.style.marginLeft = '0.5em';
        s.style.padding = '0.05em 0.35em';
        s.style.borderRadius = '0.5em';
        s.style.border = '1px solid #aaa';
        s.style.fontSize = '0.9em';
        s.style.background = '#ffffe0';
        return s;
    }

    // --- Icon helpers ---
    function getRenewSubmit(form) {
        // Try to find the "renew" submit button within the renew form
        return $('input[type="submit"]', form) || $('button[type="submit"]', form);
    }

    function getOrCreateIcon(form) {
        let icon = $('.tm-renew-icon', form);
        if (!icon) {
            icon = document.createElement('span');
            icon.className = 'tm-renew-icon';
            const btn = getRenewSubmit(form);
            // Place immediately after the Renew button for best visibility
            if (btn) {
                icon.style.marginLeft = '0.33em';
                icon.style.fontSize = '1.05em';
                icon.style.verticalAlign = 'middle';
                btn.insertAdjacentElement('afterend', icon);
            } else {
                // Fallback: append to form
                form.appendChild(icon);
            }
        }
        return icon;
    }

    function setIcon(form, state) {
        const icon = getOrCreateIcon(form);
        if (!icon) return;

        // Reset styles
        icon.style.opacity = '1';
        icon.style.filter = '';

        if (state === 'queued') {
            icon.textContent = '…';
            icon.title = 'Queued';
            icon.style.opacity = '0.6';
        } else if (state === 'renewing') {
            icon.textContent = '⏳';
            icon.title = 'Renewing…';
        } else if (state === 'renewed') {
            icon.textContent = '✔️';
            icon.title = 'Renewed';
        } else if (state === 'failed') {
            icon.textContent = '❌';
            icon.title = 'Failed';
        } else {
            icon.textContent = '';
            icon.title = '';
        }
    }

    function serializeForm(form) {
        const params = new URLSearchParams();
        $$('input, select, textarea', form).forEach(el => {
            if (!el.name || el.disabled) return;
            const type = (el.type || '').toLowerCase();
            if ((type === 'checkbox' || type === 'radio') && !el.checked) return;
            params.append(el.name, el.value ?? '');
        });
        return params;
    }

    async function renewForm(form, row) {
        const url = form.getAttribute('action');
        const body = serializeForm(form);
        try {
            const resp = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString(),
                redirect: 'follow',
            });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            markRow(row, 'renewed');
            setIcon(form, 'renewed');
            return true;
        } catch (e) {
            console.error('Renew failed:', e);
            markRow(row, 'failed');
            setIcon(form, 'failed');
            return false;
        }
    }

    function markRow(row, status) {
        row.style.transition = 'background-color .25s ease';
        if (status === 'queued') {
            row.style.backgroundColor = '#fffbe6';
        } else if (status === 'renewing') {
            row.style.backgroundColor = '#fff1b8';
        } else if (status === 'renewed') {
            row.style.backgroundColor = '#f6ffed';
            row.style.outline = '1px solid #b7eb8f';
        } else if (status === 'failed') {
            row.style.backgroundColor = '#fff1f0';
            row.style.outline = '1px solid #ffa39e';
        }
    }

    function getRenewTargets() {
        const rows = $$('#paginator table.accthp_postings tbody tr.posting-row');
        const targets = [];
        rows.forEach(row => {
            const form = $('form.manage.renew', row);
            if (form) {
                // Precreate a placeholder icon so you see progress immediately
                setIcon(form, 'queued');
                targets.push({ form, row });
            }
        });
        return targets;
    }

    async function renewAll({ delayMs = DELAY_MS } = {}) {
        const targets = getRenewTargets();
        if (!targets.length) {
            alert('No renew buttons found on this page.');
            return;
        }

        const prog = $('#tm-renew-all-progress') || makeBadge('');
        prog.id = 'tm-renew-all-progress';

        let ok = 0, fail = 0;
        for (let i = 0; i < targets.length; i++) {
            const { form, row } = targets[i];
            markRow(row, 'queued');
            setIcon(form, 'renewing');

            prog.textContent = `renewing ${i + 1}/${targets.length}…`;
            markRow(row, 'renewing');
            const success = await renewForm(form, row);
            if (success) ok++; else fail++;

            prog.textContent = `done ${i + 1}/${targets.length} (✔︎ ${ok} · ✖︎ ${fail})`;
            if (i < targets.length - 1) await sleep(delayMs);
        }
    }

    function insertRenewAllLink() {
        const manageHeaderInner = $$('thead th .tablesorter-header-inner')
        .find(el => (el.textContent || '').trim().toLowerCase().startsWith('manage'));
        if (!manageHeaderInner || $('#tm-renew-all')) return;

        const sep = document.createElement('span');
        sep.textContent = ' ';
        const link = document.createElement('a');
        link.href = '#';
        link.id = 'tm-renew-all';
        link.textContent = 'renew all';
        link.title = 'Submit all Renew forms on this page';
        link.style.marginLeft = '0.5em';
        link.style.fontSize = '0.9em';
        link.style.textDecoration = 'underline';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            link.style.pointerEvents = 'none';
            link.style.opacity = '0.6';
            const prog = $('#tm-renew-all-progress') || makeBadge('');
            prog.id = 'tm-renew-all-progress';
            manageHeaderInner.appendChild(prog);
            renewAll().finally(() => {
                link.style.pointerEvents = 'auto';
                link.style.opacity = '1';
            });
        });

        manageHeaderInner.appendChild(sep);
        manageHeaderInner.appendChild(link);
    }

    const tabHeader = $('.account-tab-header');
    if (tabHeader && /postings/i.test(tabHeader.textContent || '')) {
        insertRenewAllLink();
    }
})();
