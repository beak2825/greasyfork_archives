// ==UserScript==
// @name         BQPanel: Wait-for-Save -> Copy IPTV Link + Optional Redirect/Click
// @description  After pressing Save on /lines/create, wait for username/password to appear, build the get.php link, copy to clipboard, optionally redirect and auto-click newest-row icon.
// @match        https://bqpanel.com/lines/create*
// @match        https://bqpanel.com/lines?sortAsc=true*
// @run-at       document-idle
// @version 0.0.1.20250918142101
// @namespace https://greasyfork.org/users/1516350
// @downloadURL https://update.greasyfork.org/scripts/549970/BQPanel%3A%20Wait-for-Save%20-%3E%20Copy%20IPTV%20Link%20%2B%20Optional%20RedirectClick.user.js
// @updateURL https://update.greasyfork.org/scripts/549970/BQPanel%3A%20Wait-for-Save%20-%3E%20Copy%20IPTV%20Link%20%2B%20Optional%20RedirectClick.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*  ========== CONFIG ==========  */
    const TARGET_HOST = 'http://line.kanale-shqip.com';
    const GET_PATH = '/get.php';
    const EXTRA_QUERY = 'type=m3u_plus&output=ts';

    const AUTO_REDIRECT_AFTER_COPY = true;    // go to /lines?sortAsc=true after copying
    const AUTO_CLICK_ON_LIST = true;          // once on list page, auto-click newest-row icon

    const POLL_INTERVAL_MS = 300;
    const POLL_TIMEOUT_MS = 12000; // how long to wait after Save for credentials to appear

    /* ========== UTILITIES ========== */
    function buildLink(user, pass) {
        return `${TARGET_HOST}${GET_PATH}?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&${EXTRA_QUERY}`;
    }

    async function copyToClipboard(text) {
        if (!text) return false;
        // Try navigator.clipboard first (works if in user gesture or extension allows)
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (e) {
            // continue to fallback
        }
        // Fallback using temporary textarea + execCommand
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            // off-screen styles
            ta.style.position = 'fixed';
            ta.style.left = '-99999px';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(ta);
            return !!ok;
        } catch (e) {
            console.error('copy fallback failed', e);
            return false;
        }
    }

    function toast(msg, time = 3000) {
        try {
            let el = document.getElementById('bp-toast');
            if (!el) {
                el = document.createElement('div');
                el.id = 'bp-toast';
                el.style.position = 'fixed';
                el.style.right = '12px';
                el.style.bottom = '12px';
                el.style.background = 'rgba(0,0,0,0.8)';
                el.style.color = '#fff';
                el.style.padding = '8px 12px';
                el.style.borderRadius = '8px';
                el.style.zIndex = 9999999;
                el.style.fontSize = '13px';
                document.body.appendChild(el);
            }
            el.textContent = msg;
            el.style.opacity = '1';
            clearTimeout(el._to);
            el._to = setTimeout(() => { el.style.transition = 'opacity .4s'; el.style.opacity = '0'; }, time);
        } catch (e) {}
    }

    /* ========== CREDENTIAL EXTRACTION ========== */
    function extractFromInputs(root = document) {
        // Look for inputs whose name/id/class mentions user/pass
        const inputs = Array.from(root.querySelectorAll('input, textarea, span, div'));
        let username = null, password = null;

        // 1) direct inputs
        for (const sel of ['input', 'textarea']) {
            const els = Array.from(root.querySelectorAll(sel));
            for (const el of els) {
                const nameIdClass = ((el.name || '') + ' ' + (el.id || '') + ' ' + (el.className || '')).toLowerCase();
                if (!username && /user|username|usr|u_name|login/.test(nameIdClass)) {
                    const v = el.value || el.textContent || el.getAttribute('value') || '';
                    if (v && v.trim()) username = v.trim();
                }
                if (!password && /pass|password|pwd/.test(nameIdClass)) {
                    const v = el.value || el.textContent || el.getAttribute('value') || '';
                    if (v && v.trim()) password = v.trim();
                }
                if (username && password) return { username, password };
            }
        }

        // 2) look for labeled pairs (e.g., label[text*="Username"] + next element)
        try {
            const labels = Array.from(root.querySelectorAll('label'));
            for (const label of labels) {
                const txt = (label.textContent || '').toLowerCase();
                if (/user|username/.test(txt)) {
                    // candidate target via for= or nextElementSibling
                    const forId = label.getAttribute('for');
                    let el = forId ? root.querySelector('#' + CSS.escape(forId)) : label.nextElementSibling;
                    if (el) {
                        const v = el.value || el.textContent || el.getAttribute('value') || '';
                        if (v && v.trim()) username = v.trim();
                    }
                }
                if (/pass|password/.test(txt)) {
                    const forId = label.getAttribute('for');
                    let el = forId ? root.querySelector('#' + CSS.escape(forId)) : label.nextElementSibling;
                    if (el) {
                        const v = el.value || el.textContent || el.getAttribute('value') || '';
                        if (v && v.trim()) password = v.trim();
                    }
                }
                if (username && password) return { username, password };
            }
        } catch (e) {}

        // 3) regex find in visible page text: "Username: abc" "Password: def"
        try {
            const text = (document.body && document.body.innerText) || '';
            const u = text.match(/username\s*[:\-]\s*([A-Za-z0-9_\-\.@]+)/i);
            const p = text.match(/password\s*[:\-]\s*([A-Za-z0-9_\-\.@]+)/i);
            if (u && p) return { username: u[1], password: p[1] };
            // combined single-line patterns
            const duo = text.match(/user(?:name)?\s*[:\-]?\s*([A-Za-z0-9_\-\.@]+)\s+pass(?:word)?\s*[:\-]?\s*([A-Za-z0-9_\-\.@]+)/i);
            if (duo) return { username: duo[1], password: duo[2] };
        } catch (e) {}

        return null;
    }

    /* ========== WAIT FOR CREDENTIALS AFTER USER ACTION ========== */
    function waitForCredentials(timeoutMs = POLL_TIMEOUT_MS) {
        return new Promise((resolve) => {
            const start = Date.now();

            // immediate check
            const first = extractFromInputs(document);
            if (first) return resolve(first);

            // poll loop
            const interval = setInterval(() => {
                const found = extractFromInputs(document);
                if (found) {
                    clearInterval(interval);
                    return resolve(found);
                }
                if (Date.now() - start > timeoutMs) {
                    clearInterval(interval);
                    return resolve(null);
                }
            }, POLL_INTERVAL_MS);

            // also a MutationObserver to speed up detection
            const mo = new MutationObserver(() => {
                const found = extractFromInputs(document);
                if (found) {
                    mo.disconnect();
                    clearInterval(interval);
                    resolve(found);
                }
            });
            mo.observe(document.body, { childList: true, subtree: true });
        });
    }

    /* ========== HOOKS: capture Save action (submit/click) ========== */
    function onSaveTriggered(handler) {
        // Attach to all forms submit events
        document.querySelectorAll('form').forEach(f => {
            if (!f._bp_hooked) {
                f._bp_hooked = true;
                f.addEventListener('submit', (ev) => {
                    // allow normal submit to proceed, but run the handler asynchronously
                    try { handler(ev); } catch (e) {}
                }, true);
            }
        });

        // Attach to obvious Save/Create buttons (by text or type)
        const tryHookButtons = () => {
            const btns = Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"], a'));
            btns.forEach(btn => {
                if (btn._bp_hooked) return;
                const text = ((btn.textContent || '') + ' ' + (btn.value || '')).toLowerCase();
                if (/save|create|submit|add|confirm|save subscription|create line/i.test(text)) {
                    btn._bp_hooked = true;
                    btn.addEventListener('click', (ev) => {
                        try { handler(ev); } catch (e) {}
                    }, true);
                }
            });
        };
        tryHookButtons();

        // watch for dynamically added buttons
        const moB = new MutationObserver(tryHookButtons);
        moB.observe(document.body, { childList: true, subtree: true });
    }

    /* ========== MAIN: Create-page behavior ========== */
    if (location.pathname.startsWith('/lines/create')) {
        // Only run once
        if (window._bp_create_hooked) return;
        window._bp_create_hooked = true;

        onSaveTriggered(async () => {
            console.log('BP: Save triggered — waiting for credentials...');
            toast('Save detected — waiting for credentials...');

            const creds = await waitForCredentials();
            if (!creds) {
                console.warn('BP: Credentials not found within timeout');
                toast('Credentials not detected (timeout)');
                return;
            }

            const link = buildLink(creds.username, creds.password);
            const copied = await copyToClipboard(link);
            console.log('BP: Link built:', link, 'copied?', copied);
            toast(copied ? 'IPTV link copied to clipboard' : 'IPTV link ready (copy failed)');

            // optional redirect
            if (AUTO_REDIRECT_AFTER_COPY) {
                setTimeout(() => { location.href = '/lines?sortAsc=true'; }, 600);
            }
        });
    }

    /* ========== ON LIST PAGE: auto-click newest icon ========== */
    if (location.pathname === '/lines' && location.search.indexOf('sortAsc=true') !== -1 && AUTO_CLICK_ON_LIST) {
        // try several times in case rows load dynamically
        let tries = 0;
        const maxTries = 10;
        const listInterval = setInterval(() => {
            tries++;
            try {
                // Try to find first table row
                let firstRow = document.querySelector('table tbody tr:first-child');
                if (!firstRow) {
                    // fallback: find the first cell with class that matches user's markup
                    firstRow = document.querySelector('tr');
                }
                if (!firstRow) {
                    if (tries >= maxTries) { clearInterval(listInterval); console.warn('BP: list first row not found'); }
                    return;
                }

                // find svg inside the row
                const svgs = Array.from(firstRow.querySelectorAll('svg'));
                if (svgs.length === 0) {
                    // might be that icon is outside row; skip
                    clearInterval(listInterval);
                    return;
                }

                // choose the svg with matching viewBox or path as best candidate
                let chosen = svgs.find(s => (s.getAttribute('viewBox') || '').trim() === '0 0 20 20') || svgs[0];

                // prefer clickable ancestor (a/button) up to 3 levels
                let clickable = chosen;
                for (let i = 0; i < 4 && clickable; i++) {
                    if (clickable.tagName === 'A' || clickable.tagName === 'BUTTON' || (clickable.getAttribute && clickable.getAttribute('role') === 'button')) {
                        break;
                    }
                    clickable = clickable.parentElement;
                }
                // if we found ancestor that's clickable, click it; else click svg
                const toClick = (clickable && (clickable.tagName === 'A' || clickable.tagName === 'BUTTON' || clickable.getAttribute('role') === 'button')) ? clickable : chosen;
                if (toClick) {
                    try { toClick.click(); toast('Clicked newest line icon'); } catch (e) { try { chosen.click(); toast('Clicked newest line svg'); } catch(e){} }
                }
            } catch (e) {
                console.error('BP: click error', e);
            } finally {
                clearInterval(listInterval);
            }
        }, 700);
    }

})();
