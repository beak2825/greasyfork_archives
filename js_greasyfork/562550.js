// ==UserScript==
// @name         X.com Profile OSINT Info
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show X profile advanced informations for OSINT
// @author       SH3LL
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562550/Xcom%20Profile%20OSINT%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/562550/Xcom%20Profile%20OSINT%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentWidget = null;
    let currentProfileHandle = null;
    let isProcessing = false;

    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => Array.from(r.querySelectorAll(s));
    const esc = s => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    const styles = `
        #x-profile-widget {
            position: fixed;
            top: 70px;
            right: 16px;
            background-color: #000;
            color: #fff;
            padding: 16px 20px;
            border: 1px solid #333;
            border-radius: 16px;
            z-index: 9999;
            width: 350px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 13px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.6);
            transition: opacity 0.3s ease;
            opacity: 0.3;
        }
        #x-profile-widget:hover { opacity: 1; }
        #x-profile-widget .w-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e74c3c;
        }
        #x-profile-widget .w-title { color: #e74c3c; font-weight: 700; font-size: 14px; }
        #x-profile-widget .w-close {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 20px;
            padding: 0;
            line-height: 1;
        }
        #x-profile-widget .w-close:hover { color: #e74c3c; }
        #x-profile-widget .w-row {
            display: flex;
            flex-direction: column;
            padding: 10px 0;
            border-bottom: 1px solid #222;
            gap: 6px;
        }
        #x-profile-widget .w-row:last-of-type { border-bottom: none; }
        #x-profile-widget .w-label {
            color: #888;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        #x-profile-widget .w-value {
            color: #fff;
            font-size: 12px;
            font-family: "Courier New", monospace;
            word-break: break-all;
            line-height: 1.4;
        }
        #x-profile-widget .w-value a { color: #ff6b6b; text-decoration: none; }
        #x-profile-widget .w-value a:hover { text-decoration: underline; color: #ff8787; }
        #x-profile-widget .w-loading { text-align: center; color: #666; padding: 20px; }
        #x-profile-widget .w-btn {
            width: 100%;
            margin-top: 14px;
            padding: 10px 12px;
            background: #e74c3c;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
        }
        #x-profile-widget .w-btn:hover { background: #c0392b; }
    `;

    function injectStyles() {
        if (!document.getElementById('x-profile-widget-styles')) {
            const el = document.createElement('style');
            el.id = 'x-profile-widget-styles';
            el.textContent = styles;
            document.head.appendChild(el);
        }
    }

    function getSidebarWidth() {
        const sidebar = document.querySelector('div.css-175oi2r.r-kemksi.r-1kqtdi0.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x');
        if (sidebar) {
            return sidebar.offsetWidth;
        }
        return 350;
    }

    function updateWidgetWidth() {
        if (currentWidget) {
            const width = getSidebarWidth();
            currentWidget.style.width = width + 'px';
        }
    }

    function isProfilePage() {
        const parts = window.location.pathname.split('/').filter(Boolean);
        const excluded = ['home', 'explore', 'search', 'notifications', 'messages', 'i', 'settings', 'compose', 'hashtag', 'lists'];
        if (parts.length === 0 || excluded.includes(parts[0])) return false;
        if (parts.length === 1) return true;
        if (parts.length === 2 && ['with_replies', 'media', 'likes', 'followers', 'following', 'verified_followers', 'about'].includes(parts[1])) return true;
        return false;
    }

    function getHandleFromURL() {
        return window.location.pathname.split('/').filter(Boolean)[0] || '';
    }

    function findIdentifier(handle) {
        const hn = (handle || '').toLowerCase();
        const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = [
            new RegExp('"identifier":"(\\d+)"[\\s\\S]{0,15000}"screen_name":"' + escRe(hn) + '"', 'i'),
            new RegExp('"screen_name":"' + escRe(hn) + '"[\\s\\S]{0,15000}"identifier":"(\\d+)"', 'i')
        ];
        const scan = txt => {
            if (!txt || txt.indexOf('"identifier"') === -1) return '';
            for (const r of rx) { const m = txt.match(r); if (m) return m[1]; }
            const m2 = txt.match(/"identifier":"(\d{5,})"/);
            return m2 ? m2[1] : '';
        };
        for (const s of qa('script')) { const id = scan(s.textContent || ''); if (id) return id; }
        return scan(document.documentElement.innerHTML) || '';
    }

    function findCreateISO() {
        for (const s of qa('script')) {
            const x = s.textContent || '';
            let m = x.match(/"dateCreated":"([^"]+)"/) || x.match(/"created_at":"([^"]+)"/) || x.match(/"createdAt":"([^"]+)"/);
            if (m) { const d = new Date(m[1]); if (!isNaN(d)) return d.toISOString(); }
        }
        const joined = q('[data-testid="UserJoinDate"] span')?.textContent || '';
        const jm = joined.match(/Joined\s+([A-Za-z]+)\s+(\d{4})/);
        if (jm) { const d = new Date(jm[1] + ' 1, ' + jm[2] + ' 00:00:00Z'); if (!isNaN(d)) return d.toISOString(); }
        return '';
    }

    function findBannerUploadDate() {
        const bannerImg = q('img[src*="pbs.twimg.com/profile_banners/"]')?.src || '';
        if (!bannerImg) return { url: '', date: '' };
        try {
            const clean = bannerImg.split('?')[0];
            const m = clean.match(/\/profile_banners\/\d+\/(\d+)/);
            if (!m) return { url: bannerImg, date: '(unknown)' };
            const token = m[1];
            let ms = NaN;
            if (/^\d{13}$/.test(token)) ms = parseInt(token, 10);
            else if (/^\d{10}$/.test(token)) ms = parseInt(token, 10) * 1e3;
            else if (/^\d{19,}/.test(token)) {
                const EPOCH = 1288834974657n;
                ms = Number((BigInt(token) >> 22n) + EPOCH);
            }
            if (!isNaN(ms)) {
                const d = new Date(ms);
                if (!isNaN(d)) return { url: bannerImg, date: d.toISOString() };
            }
            return { url: bannerImg, date: '(unknown)' };
        } catch { return { url: bannerImg, date: '(unknown)' }; }
    }

    function getCsrfToken() {
        const cookies = document.cookie.split(';');
        for (let c of cookies) { const p = c.trim().split('='); if (p[0] === 'ct0') return p[1]; }
        return null;
    }

    async function fetchAboutData(handle) {
        try {
            const csrf = getCsrfToken();
            if (!csrf) return null;
            const bearer = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
            const url = `https://x.com/i/api/graphql/zs_jFPFT78rBpXv9Z3U2YQ/AboutAccountQuery?variables=${encodeURIComponent(JSON.stringify({ screenName: handle }))}`;
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'accept': '*/*',
                    'authorization': 'Bearer ' + bearer,
                    'content-type': 'application/json',
                    'x-csrf-token': csrf,
                    'x-twitter-active-user': 'yes',
                    'x-twitter-auth-type': 'OAuth2Session'
                }
            });
            if (res.ok) return await res.json();
        } catch (e) { console.log('About fetch error:', e); }
        return null;
    }

    function createWidget() {
        removeWidget();
        const w = document.createElement('div');
        w.id = 'x-profile-widget';
        w.style.width = getSidebarWidth() + 'px';
        w.innerHTML = `
            <div class="w-header">
                <span class="w-title">📊 OSINT Profile Info</span>
                <button class="w-close" title="Close">×</button>
            </div>
            <div class="w-content"><div class="w-loading">Loading...</div></div>
        `;
        w.querySelector('.w-close').addEventListener('click', removeWidget);
        document.body.appendChild(w);
        currentWidget = w;
        return w;
    }

    function removeWidget() {
        if (currentWidget) { currentWidget.remove(); currentWidget = null; }
        currentProfileHandle = null;
    }

    function formatDate(iso) {
        if (!iso || iso === '(unknown)') return '(unknown)';
        try {
            return new Date(iso).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            });
        }
        catch { return iso; }
    }

    async function updateWidget(widget, handle) {
        const content = widget.querySelector('.w-content');

        const identifier = findIdentifier(handle);
        const createdISO = findCreateISO();
        const userIdURL = identifier ? `https://x.com/i/user/${identifier}` : '';
        const banner = findBannerUploadDate();

        const aboutData = await fetchAboutData(handle);
        let accountBasedIn = '', locationAccurate = null, usernameChanges = '', lastChangedDate = '';

        if (aboutData?.data?.user_result_by_screen_name?.result?.about_profile) {
            const about = aboutData.data.user_result_by_screen_name.result.about_profile;
            accountBasedIn = about.account_based_in || '';
            locationAccurate = about.location_accurate;
            if (about.username_changes) {
                usernameChanges = about.username_changes.count || '';
                if (about.username_changes.last_changed_at_msec) {
                    const d = new Date(parseInt(about.username_changes.last_changed_at_msec, 10));
                    if (!isNaN(d)) lastChangedDate = d.toISOString();
                }
            }
        }

        let html = '';

        html += `<div class="w-row"><span class="w-label">X ID</span><span class="w-value">${esc(identifier || '(unknown)')}</span></div>`;

        html += `<div class="w-row"><span class="w-label">User ID URL</span><span class="w-value">${userIdURL ? `<a href="${esc(userIdURL)}" target="_blank">${esc(userIdURL)}</a>` : '(unknown)'}</span></div>`;

        html += `<div class="w-row"><span class="w-label">Create Date</span><span class="w-value">${formatDate(createdISO)}</span></div>`;

        if (lastChangedDate) {
            html += `<div class="w-row"><span class="w-label">Last Username Change</span><span class="w-value">${formatDate(lastChangedDate)}</span></div>`;
        }

        if (usernameChanges) {
            html += `<div class="w-row"><span class="w-label">Username Changes</span><span class="w-value">${esc(usernameChanges)}</span></div>`;
        }

        if (accountBasedIn) {
            const accText = locationAccurate !== null
                ? `${accountBasedIn} (Location ${locationAccurate ? 'Accurate ✅' : 'Not Accurate ❌'})`
                : accountBasedIn;
            html += `<div class="w-row"><span class="w-label">Account Based In</span><span class="w-value">${esc(accText)}</span></div>`;
        }

        html += `<div class="w-row"><span class="w-label">Banner Upload Date</span><span class="w-value">${formatDate(banner.date)}</span></div>`;

        html += `<button class="w-btn">📋 Copy Data</button>`;

        content.innerHTML = html;

        content.querySelector('.w-btn').addEventListener('click', () => {
            const data = {
                xId: identifier || null,
                userIdURL: userIdURL || null,
                createDate: createdISO || null,
                lastUsernameChange: lastChangedDate || null,
                usernameChanges: usernameChanges || null,
                accountBasedIn: accountBasedIn || null,
                locationAccurate: locationAccurate,
                bannerUploadDate: banner.date || null
            };
            navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
                const btn = content.querySelector('.w-btn');
                btn.textContent = '✓ Copied!';
                setTimeout(() => btn.textContent = '📋 Copy Data', 1500);
            });
        });
    }

    async function handlePageChange() {
        if (isProcessing) return;
        const handle = getHandleFromURL();
        if (!isProfilePage() || !handle) { removeWidget(); return; }
        if (handle === currentProfileHandle && currentWidget) return;

        isProcessing = true;
        currentProfileHandle = handle;
        await new Promise(r => setTimeout(r, 1500));
        const widget = createWidget();
        await updateWidget(widget, handle);
        isProcessing = false;
    }

    function setupObserver() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) { lastUrl = location.href; setTimeout(handlePageChange, 500); }
            updateWidgetWidth();
        }).observe(document.body, { childList: true, subtree: true });

        window.addEventListener('popstate', () => setTimeout(handlePageChange, 500));
        window.addEventListener('resize', updateWidgetWidth);

        const origPush = history.pushState;
        history.pushState = function(...args) { origPush.apply(this, args); setTimeout(handlePageChange, 500); };
        const origReplace = history.replaceState;
        history.replaceState = function(...args) { origReplace.apply(this, args); setTimeout(handlePageChange, 500); };
    }

    function init() {
        injectStyles();
        setupObserver();
        handlePageChange();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();