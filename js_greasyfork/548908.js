// ==UserScript==
// @tampermonkey-safari-promotion-code-request c9263fb7-83eb-4bf0-9703-778d05b1b33e
// @license      MIT
// @name         IRCC Security Checker
// @namespace    http://tampermonkey.net/
// @version      1.7.0
// @description  Check IRCC application security status from tracker data, show all history with explanations
// @author       WeChat ID: RoaldAmundsen (https://security-checker.raindrop.eu.org for updates)
// @match        https://ircc-tracker-suivi.apps.cic.gc.ca/en/login*
// @match        https://ircc-tracker-suivi.apps.cic.gc.ca/en/overview*
// @match        https://ircc-tracker-suivi.apps.cic.gc.ca/en/applications/details*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @inject-into  auto
// @downloadURL https://update.greasyfork.org/scripts/548908/IRCC%20Security%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/548908/IRCC%20Security%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Key meanings based on information collected from web research
    const KEY_CODE_MEANINGS = {
        'security':           { meaning: 'Background/Security process', sign: 'unknown' },
        'medical':            { meaning: 'Medical-related item', sign: 'neutral' },
        'imm1017':            { meaning: 'Medical Instructions (IMM 1017)', sign: 'neutral' },
        'word ltr 02':        { meaning: 'Letter generated/uploaded', sign: 'neutral' },
        'initial':            { meaning: 'Tracker initialized', sign: 'neutral' },
        '57':  { meaning: 'Internal IRCC code', sign: 'unknown' },
        '93':  { meaning: 'Internal IRCC code', sign: 'unknown' },
        '871': { meaning: 'Internal IRCC code', sign: 'unknown' },
        '86':  { meaning: 'Internal IRCC code', sign: 'unknown' },
        '626': { meaning: 'Internal IRCC code', sign: 'unknown' },
        '648': { meaning: 'Internal IRCC code', sign: 'unknown' },
        '953': { meaning: 'Internal IRCC code', sign: 'unknown' },
        '408': { meaning: 'Internal IRCC code', sign: 'unknown' },
        '67':  { meaning: 'Internal IRCC code', sign: 'unknown' },
        '9':   { meaning: 'Internal IRCC code', sign: 'unknown' },
        '41':  { meaning: 'Internal IRCC code', sign: 'unknown' },
        '622': { meaning: 'Internal IRCC code', sign: 'unknown' },
        '633': { meaning: 'Internal IRCC code', sign: 'unknown' },
        '42':  { meaning: 'Internal IRCC code', sign: 'unknown' },
        '729': { meaning: 'Internal IRCC code', sign: 'unknown' },
        '8':   { meaning: 'Internal IRCC code', sign: 'unknown' },
        '637': { meaning: 'Internal IRCC code', sign: 'unknown' }
    };

    const SIGN_COLOR = {
        positive: '#28a745',
        neutral:  '#6c757d',
        unknown:  '#0d6efd',
        negative: '#dc3545'
    };

    // Capture tracker JSON from network
    (function captureFromNetwork(){
        if (window.__IRCC_NET_CAPTURED__) return;
        window.__IRCC_NET_CAPTURED__ = true;

        const saveIfTracker = (obj) => {
            if (hasHistoryArray(obj)) {
                window.__IRCC_TRACKER_DATA = obj;
                window.dispatchEvent(new CustomEvent('ircc-tracker-data', { detail: { source: 'network' }}));
            }
        };

        const _fetch = window.fetch;
        window.fetch = async function(...args){
            const resp = await _fetch.apply(this, args);
            try {
                const clone = resp.clone();
                const ct = clone.headers.get('content-type') || '';
                if (ct.includes('application/json')) {
                    const json = await clone.json();
                    saveIfTracker(json);
                }
            } catch {}
            return resp;
        };

        const _open = XMLHttpRequest.prototype.open;
        const _send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(...a){ this.__ircc_url = a[1]; return _open.apply(this,a); };
        XMLHttpRequest.prototype.send = function(...a){
            this.addEventListener('load', function(){
                try {
                    const ct = this.getResponseHeader && this.getResponseHeader('content-type') || '';
                    if (ct.includes('application/json')) {
                        const json = JSON.parse(this.responseText);
                        saveIfTracker(json);
                    }
                } catch {}
            });
            return _send.apply(this,a);
        };
    })();

    function createUI() {
        if (document.getElementById('ircc-security-checker')) return;
        const wrap = document.createElement('div');
        wrap.id = 'ircc-security-checker';
        wrap.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 100000;
                background: #fff;
                border: 2px solid #007bff;
                border-radius: 8px;
                padding: 12px;
                width: 340px;
                box-shadow: 0 6px 18px rgba(0,0,0,0.2);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, 'Noto Sans', 'Helvetica Neue', sans-serif;
            ">
                <div style="margin-bottom: 8px;">
                    <div style="font-weight: 700; color: #007bff; margin-bottom: 8px;">🔒 IRCC Security Checker</div>
                    <div style="font-size: 12px; color: #495057; margin-bottom: 10px;">
                        Captures tracker data on the overview or details page after login.
                    </div>
                    <button id="irccCheckBtn" style="display:block;width:100%;margin-bottom:8px;background:#007bff;color:#fff;border:none;border-radius:4px;padding:8px;cursor:pointer;">Check Security Status</button>
                    <button id="irccShowBtn" style="display:block;width:100%;margin-bottom:8px;background:#6c757d;color:#fff;border:none;border-radius:4px;padding:8px;cursor:pointer;">Show All Data</button>
                    <button id="irccCopyBtn" style="display:none;width:100%;margin-bottom:8px;background:#17a2b8;color:#fff;border:none;border-radius:4px;padding:8px;cursor:pointer;">Copy Data</button>
                    <button id="irccCloseBtn" style="display:block;width:100%;background:#dc3545;color:#fff;border:none;border-radius:4px;padding:8px;cursor:pointer;">Close</button>
                    <div id="irccStatusHint" style="font-size: 11px; color: #6c757d; margin-top: 6px;">Waiting for tracker data…</div>
                </div>
                <div id="irccResults" style="display:none;">
                    <div id="irccSecurity" style="margin-bottom:8px;"></div>
                    <pre id="irccData" style="display:none;margin:0;max-height:280px;overflow:auto;background:#f8f9fa;border:1px solid #e9ecef;padding:8px;border-radius:4px;font-size:12px;"></pre>
                </div>
            </div>
        `;
        document.body.appendChild(wrap);

        const refs = getUIRefs();
        refs.close.onclick = () => wrap.remove();
        refs.check.onclick = handleCheck;
        refs.show.onclick = handleShowAllToggle;
        refs.copy.onclick = handleCopy;

        const updateHint = () => {
            const ok = hasHistoryArray(window.__IRCC_TRACKER_DATA);
            refs.hint.textContent = ok ? 'Captured tracker data.' : 'Waiting for tracker data…';
        };
        updateHint();
        window.addEventListener('ircc-tracker-data', updateHint);
        document.addEventListener('readystatechange', updateHint);
    }

    function getUIRefs() {
        const box = document.getElementById('ircc-security-checker');
        return {
            box,
            check: box.querySelector('#irccCheckBtn'),
            show: box.querySelector('#irccShowBtn'),
            copy: box.querySelector('#irccCopyBtn'),
            close: box.querySelector('#irccCloseBtn'),
            hint: box.querySelector('#irccStatusHint'),
            results: box.querySelector('#irccResults'),
            security: box.querySelector('#irccSecurity'),
            data: box.querySelector('#irccData')
        };
    }

    function hasHistoryArray(obj) {
        try {
            return obj && obj.relations && Array.isArray(obj.relations) &&
                obj.relations[0] && Array.isArray(obj.relations[0].history);
        } catch { return false; }
    }
    function getTrackerData() { return hasHistoryArray(window.__IRCC_TRACKER_DATA) ? window.__IRCC_TRACKER_DATA : null; }
    function getHistory(obj)   { try { return obj?.relations?.[0]?.history || []; } catch { return []; } }
    function getApp(obj)       { try { return obj?.app || null; } catch { return null; } }

    function findLatestSecurityEntry(history) {
        const isSecurity = (k) => String(k || '').trim().toLowerCase() === 'security';
        const candidates = history
            .filter(h => isSecurity(h.key))
            .map(e => ({ e, t: parseDate(e.dateCreated) || parseDate(e.dateLoaded) || new Date(0) }))
            .sort((a,b) => b.t - a.t);
        return candidates[0]?.e || null;
    }

    function deriveSecurityStatusStrict(tracker) {
        const history = getHistory(tracker);
        const app = getApp(tracker);
        const sec = findLatestSecurityEntry(history);

        if (!sec) {
            return {
                state: 'no_security_key',
                date: parseDate(app?.lastUpdated) || latestDate(history),
                message: 'Congrats! There is no "Security" entry. Your file looks to be moving under the normal background check process.'
            };
        }

        const code = toInt(sec.actStatus);
        if (code === 33) {
            return {
                state: 'security_finished',
                date: parseDate(sec.dateCreated) || parseDate(sec.dateLoaded) || parseDate(app?.lastUpdated),
                message: 'Good news! A "Security" entry exists but is finished. Your application should now continue under the normal process.'
            };
        }
        if (code === 17) {
            return {
                state: 'security_in_progress',
                date: parseDate(sec.dateCreated) || parseDate(sec.dateLoaded) || parseDate(app?.lastUpdated),
                message: 'Heads up: A "Security" entry is present and in progress. This stage can be stressful and sometimes lengthy—stay strong. Hopefully it wraps up soon.'
            };
        }
        return {
            state: 'security_other',
            date: parseDate(sec.dateCreated) || parseDate(sec.dateLoaded) || parseDate(app?.lastUpdated),
            message: 'A "Security" entry is present. We can\'t map its status code precisely, but it likely indicates background processing. Stay positive—progress updates can take time.'
        };
    }

    function handleCheck() {
        const ui = getUIRefs();
        ui.results.style.display = 'block';
        const data = getTrackerData();
        if (!data) {
            ui.security.innerHTML = `
                <div style="border-left:4px solid #6c757d;padding-left:8px;">
                    <div style="font-weight:600;color:#6c757d;">Tracker data not found yet.</div>
                    <div style="color:#6c757d;">Ensure you're logged in on overview or details.</div>
                </div>`;
            return;
        }

        const res = deriveSecurityStatusStrict(data);
        const color = res.state === 'security_in_progress' ? SIGN_COLOR.negative
            : res.state === 'security_finished' ? SIGN_COLOR.positive
            : res.state === 'no_security_key' ? SIGN_COLOR.unknown
            : SIGN_COLOR.neutral;
        const label = res.state === 'security_in_progress' ? 'Security: In Progress'
            : res.state === 'security_finished' ? 'Security: Finished'
            : res.state === 'no_security_key' ? 'No "Security" Entry'
            : 'Security: Other/Unknown';
        const dateStr = res.date ? formatDate(res.date) : 'N/A';

        ui.security.innerHTML = `
            <div style="border-left:4px solid ${color};padding-left:8px;">
                <div style="margin-bottom:4px;"><strong>Status</strong>: <span style="color:${color};font-weight:700;">${label}</span></div>
                <div style="margin-bottom:4px;"><strong>Date</strong>: ${dateStr}</div>
                <div style="color:#495057;">${res.message}</div>
            </div>`;
    }

    function handleShowAllToggle() {
        const ui = getUIRefs();
        ui.results.style.display = 'block';

        if (ui.data.style.display !== 'none' && ui.data.textContent.trim().length > 0) {
            ui.data.style.display = 'none';
            ui.copy.style.display = 'none';
            return;
        }

        const data = getTrackerData();
        if (!data) {
            ui.data.textContent = 'Tracker data not found. Log in and reload the overview page.';
            ui.data.style.display = 'block';
            ui.copy.style.display = 'none';
            return;
        }

        const history = getHistory(data);
        const explained = history.map(h => explainHistoryEntry(h));
        ui.data.textContent = JSON.stringify({ legend: historyLegend(), items: explained }, null, 2);
        ui.data.style.display = 'block';
        ui.copy.style.display = 'block';
    }

    function handleCopy() {
        const ui = getUIRefs();
        const txt = ui.data.textContent || '';
        if (!txt) return;
        copy(txt);
        ui.copy.textContent = 'Copied!';
        setTimeout(() => ui.copy.textContent = 'Copy Data', 900);
    }

    function explainHistoryEntry(h) {
        const label = String(h.key ?? '').trim();
        const labelKey = label.toLowerCase();
        const meaningObj = KEY_CODE_MEANINGS[labelKey] || (isNumeric(label) ? KEY_CODE_MEANINGS[label] : null);

        const sign = meaningObj?.sign || 'unknown';
        const meaning = meaningObj?.meaning || (isNumeric(label) ? 'Internal IRCC code' : null);
        const signNote = sign === 'positive' ? 'good sign'
            : sign === 'neutral'  ? 'routine/neutral'
            : sign === 'negative' ? 'concerning'
            : 'not confirmed';

        return {
            key: label || null,
            key_meaning: meaning,
            key_sign: sign,
            key_sign_note: signNote,
            actStatus: toInt(h.actStatus),
            actStatus_note: actStatusNote(toInt(h.actStatus)),
            actType: toInt(h.actType),
            actType_note: actTypeHint(toInt(h.actType)),
            dateCreated: h.dateCreated ?? null,
            dateCreated_local: h.dateCreated ? formatDate(parseDate(h.dateCreated)) : null,
            dateLoaded: h.dateLoaded ?? null,
            dateLoaded_local: h.dateLoaded ? formatDate(parseDate(h.dateLoaded)) : null
        };
    }

    function historyLegend() {
        return {
            key: 'Event label or internal code.',
            key_meaning: 'Heuristic explanation or known meaning.',
            key_sign: 'positive/neutral/unknown/negative; indicates whether the event is a good sign.',
            actStatus: 'Numeric code if present; for "Security", 33=Finished, 17=In Progress.',
            actType: 'Type/category of the event (varies).',
            dateCreated: 'When IRCC recorded the event.',
            dateLoaded: 'When the tracker loaded/synced it.'
        };
    }

    function latestDate(list) {
        let best = null;
        for (const e of list || []) {
            const d = parseDate(e?.dateCreated) || parseDate(e?.dateLoaded);
            if (d && (!best || d > best)) best = d;
        }
        return best;
    }

    function isNumeric(s) { return /^\d+$/.test(String(s || '')); }

    function actStatusNote(code) {
        if (code == null || isNaN(code)) return null;
        if (code === 33) return 'Finished/Completed';
        if (code === 17) return 'In Progress';
        return 'Other/Unknown';
    }

    function actTypeHint(t) {
        if (t == null || isNaN(t)) return null;
        if (t === 3) return 'Observed in some medical-related entries';
        return null;
    }

    function parseDate(s) {
        if (!s) return null;
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
    }

    function toInt(v) {
        const n = parseInt(v, 10);
        return isNaN(n) ? null : n;
    }

    function formatDate(d) {
        try {
            return new Intl.DateTimeFormat(undefined, {
                year: 'numeric', month: 'short', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
            }).format(d);
        } catch {
            return d?.toISOString?.() || '';
        }
    }

    function copy(text) {
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    }
    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(ta);
    }

    function init() { createUI(); }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();