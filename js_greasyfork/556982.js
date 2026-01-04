// ==UserScript==
// @name         YouTube Sidebar Revert + SPA Abos Button
// @namespace    yt-sidebar-enhance
// @version      1.4
// @description  Reorder sidebar, force Subscriptions visible, add SPA-compatible Abos button
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556982/YouTube%20Sidebar%20Revert%20%2B%20SPA%20Abos%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/556982/YouTube%20Sidebar%20Revert%20%2B%20SPA%20Abos%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Force Subscriptions section visible
    GM_addStyle(`
        ytd-guide-subscriptions-section-renderer ytd-guide-collapsible-section-renderer {
            display: block !important;
            max-height: 60vh !important;
            overflow-y: auto !important;
        }
        ytd-guide-subscriptions-section-renderer { margin-top: 6px !important; }
    `);

    function reorderSidebar() {
        const guide = document.getElementById('guide');
        if (!guide) return false;

        const sections = Array.from(guide.querySelectorAll('ytd-guide-section-renderer, ytd-guide-subscriptions-section-renderer'));
        const you = sections.find(s => /(you|your channel|your videos)/i.test(s.innerText));
        const subs = sections.find(s => /subscriptions/i.test(s.innerText));

        if (you && subs && you.parentNode === subs.parentNode) {
            subs.parentNode.insertBefore(subs, you.nextSibling);
            const collapsible = subs.querySelector('ytd-guide-collapsible-section-renderer');
            if (collapsible) collapsible.style.display = 'block';
            return true;
        }
        return false;
    }

    function addSubsButton() {
        const guide = document.getElementById('guide') || document.querySelector('ytd-guide-renderer');
        if (!guide || document.getElementById('custom-subs-button')) return false;

        const shortsEl = Array.from(guide.querySelectorAll('a, ytd-guide-entry-renderer'))
            .find(el => el.innerText?.trim().toLowerCase() === 'shorts');
        const nativeSubs = guide.querySelector('a[href="/feed/subscriptions"]');
        if (!shortsEl || !nativeSubs) return false;

        const wrapper = document.createElement('a');
        wrapper.id = 'custom-subs-button';
        wrapper.href = '/feed/subscriptions';
        wrapper.style.cssText = 'display:flex;align-items:center;height:40px;padding:0 16px;text-decoration:none;color:var(--yt-spec-text-primary);cursor:pointer;';
        wrapper.addEventListener('click', e => { e.preventDefault(); nativeSubs.click(); });

        const icon = document.createElement('yt-icon');
        icon.setAttribute('icon', 'yt-icons:subscriptions');
        icon.style.cssText = 'min-width:24px;height:24px;margin-right:16px;';
        wrapper.appendChild(icon);

        const text = document.createElement('span');
        text.className = 'title style-scope ytd-guide-entry-renderer';
        text.textContent = 'Abos';
        wrapper.appendChild(text);

        shortsEl.parentNode.insertBefore(wrapper, shortsEl.nextSibling);
        return true;
    }

    function tryEnhance(retries = 12) {
        if (retries <= 0) return;
        const done = reorderSidebar() && addSubsButton();
        if (!done) setTimeout(() => tryEnhance(retries - 1), 400);
    }

    ['yt-navigate-finish','yt-page-data-updated','popstate'].forEach(ev =>
        window.addEventListener(ev, () => setTimeout(() => tryEnhance(12), 120))
    );

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => tryEnhance(12));
    } else {
        tryEnhance(12);
    }

    const interval = setInterval(() => { if (addSubsButton()) clearInterval(interval); }, 500);
})();
