// ==UserScript==
// @license      GNU GPLv3
// @name         LinkedIn Active Job Viewer (Job HTML Extractor + Popup Viewer)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Keep the job description up while applying to Linkedin jobs and automatically display filtered qualifications.
// @match        https://www.linkedin.com/jobs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559048/LinkedIn%20Active%20Job%20Viewer%20%28Job%20HTML%20Extractor%20%2B%20Popup%20Viewer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559048/LinkedIn%20Active%20Job%20Viewer%20%28Job%20HTML%20Extractor%20%2B%20Popup%20Viewer%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //======================
    // Main popup box
    //======================
    function createPopup() {
        const existing = document.getElementById('jobHTMLPopup');
        if (existing) {
            return {
                job: document.getElementById('tabJob'),
                barebones: document.getElementById('tabBarebones')
            };
        }

        //Construction
        const popup = document.createElement('div');
        popup.id = 'jobHTMLPopup';
        Object.assign(popup.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '500px',
            height: '400px',
            background: 'rgba(255,255,255,0.98)',
            color: '#000',
            border: '1px solid #aaa',
            borderRadius: '8px',
            zIndex: '999999',
            fontSize: '12px',
            display: 'flex',
            flexDirection: 'column',
            resize: 'both',
        });

        // Header
        const header = document.createElement('div');
        header.textContent = 'Job Info by UVHC';
        Object.assign(header.style, {
            fontWeight: '700',
            background: '#0073b1',
            color: '#fff',
            padding: '4px 6px',
            cursor: 'move',
            borderRadius: '6px 6px 0 0',
        });
        popup.appendChild(header);

        //----------------------------------------------------------------------TABS
        // TABS
        //----------------------------------------------------------------------TABS
        const tabBar = document.createElement('div');
        Object.assign(tabBar.style, {
            display: 'flex',
            background: '#eee',
            borderBottom: '1px solid #ccc',
        });

        const jobTabBtn = document.createElement('button');
        jobTabBtn.textContent = 'Job HTML';
        const barebonesTabBtn = document.createElement('button');
        barebonesTabBtn.textContent = 'Year Mandates';

        [jobTabBtn, barebonesTabBtn].forEach(btn => {
            Object.assign(btn.style, {
                flex: 1,
                padding: '6px',
                border: 'none',
                background: '#ddd',
                cursor: 'pointer',
                fontWeight: '600'
            });
            btn.addEventListener('click', () => {
                showTab(btn === jobTabBtn ? 'job' : 'barebones');
            });
        });
        tabBar.appendChild(jobTabBtn);
        tabBar.appendChild(barebonesTabBtn);
        popup.appendChild(tabBar);

        // Individual Tab Content
        const tabContainer = document.createElement('div');
        Object.assign(tabContainer.style, {
            flex: 1,
            overflow: 'auto',
            padding: '8px',
        });

        const jobContent = document.createElement('div');
        jobContent.id = 'tabJob';

        const barebonesContent = document.createElement('div');
        barebonesContent.id = 'tabBarebones';
        barebonesContent.textContent = '(Empty)';

        tabContainer.appendChild(jobContent);
        tabContainer.appendChild(barebonesContent);
        popup.appendChild(tabContainer);

        document.body.appendChild(popup);

        // Tab switching logic
        function showTab(which) {
            jobContent.style.display = which === 'job' ? 'block' : 'none';
            barebonesContent.style.display = which === 'barebones' ? 'block' : 'none';
            jobTabBtn.style.background = which === 'job' ? '#fff' : '#ddd';
            barebonesTabBtn.style.background = which === 'barebones' ? '#fff' : '#ddd';
        }
        showTab('job');

        // Dragging logic
        let isDragging = false, offsetX = 0, offsetY = 0;
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - popup.offsetLeft;
            offsetY = e.clientY - popup.offsetTop;
        });
        document.addEventListener('mouseup', () => (isDragging = false));
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            popup.style.left = e.clientX - offsetX + 'px';
            popup.style.top = e.clientY - offsetY + 'px';
            popup.style.right = 'auto';
        });

        return { job: jobContent, barebones: barebonesContent };
    }

    //======================
    //Main Logic
    //======================
    function showJobHTML(html, tab = 'job') {
        const { job, barebones } = createPopup();
        if (tab === 'job') job.innerHTML = html;
        else if (tab === 'barebones') barebones.innerHTML = html;
    }

    //Find relevant YEARS content from the HTML container
    function extractExperienceLines(containerEl) {
        // 1) Prefer explicit list items (<li>)
        const lis = Array.from(containerEl.querySelectorAll('li'));
        const liMatches = lis
        .map(li => li.textContent.trim())
        .filter(t => /\byears?\b/i.test(t)) // must mention "years"
        .filter(t => !/\bper\b/i.test(t)); // exclude lines containing "per"
        if (liMatches.length) {
            return liMatches.map(s => s.startsWith('•') ? s : '• ' + s).join('\n');
        }

        // 2) Fallback regex search on raw text
        const text = containerEl.textContent.replace(/\s+/g, ' ').trim();
        const numPattern = /[^.?!\n]*\b\d+\+?\s*years?\b[^.?!\n]*/gi;
        const anyPattern = /[^.?!\n]*\byears?\b[^.?!\n]*/gi;
        const matches = text.match(numPattern) || text.match(anyPattern) || [];
        const cleaned = matches
        .map(s => s.trim())
        .filter(Boolean)
        .filter(s => !/\bper\b/i.test(s)) // exclude "per"
        .map(s => s.startsWith('•') ? s : (s.startsWith('-') ? '• ' + s.slice(1).trim() : '• ' + s));
        return cleaned.join('\n');
    }

    //Snag and parse HTML
    function attemptCapture() {
        const sel = '#job-details .mt4';
        const el = document.querySelector(sel);
        if (!el) {
            console.debug('[job-extractor] no element for selector', sel);
            return false;
        }

        const html = el.innerHTML.trim();
        const text = el.textContent.trim();

        if (!text) {
            console.debug('[!] Could not extract job content!');
            return false;
        }

        console.debug('Job content successfully extracted.');

        // extract only the relevant bullet lines with "year(s)"
        const linesWithYears = extractExperienceLines(el) || '(no experience-related lines found)'; //if nothing relevant is found, say so

        // update tabs
        showJobHTML(html, 'job');
        showJobHTML(
            '<pre style="white-space: pre-wrap; font-family: monospace; margin:0;">' +
            escapeHtml(linesWithYears) +
            '</pre>',
            'barebones'
        );

        console.log('Job HTML captured for', window.location.href);
        return true;
    }

    //======================
    //Helpers to accomodate data retrieval because Linkedin uses funky DOM
    //======================
    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }


    // Retry helper: poll every 300ms up to maxTime ms
    function runCaptureWithRetry() {
        const start = Date.now();
        const maxTime = 8000;
        const intervalMs = 300;
        console.debug('[job-extractor] starting capture retry loop');
        return new Promise((resolve) => {
            const iv = setInterval(() => {
                if (attemptCapture()) {
                    clearInterval(iv);
                    resolve(true);
                } else if (Date.now() - start > maxTime) {
                    clearInterval(iv);
                    console.warn('[job-extractor] timed out waiting for job content');
                    resolve(false);
                }
            }, intervalMs);
        });
    }

    let lastHref = location.href;
    let debounceTimer = null;
    const DEBOUNCE_MS = 1000; // user requested 1s
    const POLL_MS = 500; // poll interval (cheap)

    // Detect a new job has been clicked
    // Because of how Linkedin works, the URl changes every time a different job is selected but it doesnt refresh the full page. So just monitor for URL change then start checking for when the HTML is fully loaded.
    // TLDR polling + debounce
    function scheduleRefreshBecauseUrlChanged() {
        if (debounceTimer) clearTimeout(debounceTimer);
        console.debug('[job-extractor] URL change detected; debouncing', DEBOUNCE_MS, 'ms');
        debounceTimer = setTimeout(() => {
            console.info('[job-extractor] running capture after debounce (1s)');
            runCaptureWithRetry();
        }, DEBOUNCE_MS);
    }

    // Poll the URL 
    const pollInterval = setInterval(() => {
        try {
            if (location.href !== lastHref) {
                console.info('[job-extractor] location.href changed\n  from:', lastHref, '\n  to:  ', location.href);
                lastHref = location.href;
                scheduleRefreshBecauseUrlChanged();
            }
        } catch (e) {
            console.error('[job-extractor] error polling href', e);
        }
    }, POLL_MS);

    // Hook for state change detection
    (function hookHistoryEvents() {
        const push = history.pushState;
        history.pushState = function () {
            const res = push.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange')); // informational
            return res;
        };
        const replace = history.replaceState;
        history.replaceState = function () {
            const res = replace.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return res;
        };
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
        window.addEventListener('locationchange', () => {
            // history hook may fire before URL actually changes; we still poll for final effect
            console.debug('[job-extractor] locationchange event fired (history hook)');
        });
    })();

    //  MutationObserver fallback: if the job somehow changes but the URL doesn't
    let observer = null;
    function ensureObserver() {
        if (observer) return;
        const container = document.querySelector('#job-details') || document.body;
        observer = new MutationObserver((mutations) => {
            // quick heuristic: run capture when children change
            for (const m of mutations) {
                if (m.type === 'childList' || m.type === 'characterData') { //pretty much always childlist
                    console.debug('[job-extractor] DOM mutation observed, attempting quick capture (Type:',m.type,')');
                    runCaptureWithRetry();
                    break;
                }
            }
        });
        observer.observe(container, { childList: true, subtree: true, characterData: true });
        console.debug('[job-extractor] mutation observer attached to', container === document.body ? 'document.body' : '#job-details');
    }

    // Startup
    (async function boot() {
        console.info('[job-extractor] booting; initial capture attempt');
        await runCaptureWithRetry();
        ensureObserver();
    })();

    // Kill (Ignore this. debugging only)
    window.__jobExtractor = {
        stop: function () {
            clearInterval(pollInterval);
            if (observer) observer.disconnect();
            console.info('[job-extractor] stopped');
        }
    };

})();