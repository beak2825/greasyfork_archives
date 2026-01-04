// ==UserScript==
// @name         Trustee
// @namespace    https://github.com/pomsaddons/Trustee
// @version      1
// @description  Add a copy button to the profile header to copy the Roblox profile URL
// @match        https://www.roblox.com/users/*/profile*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/558267/Trustee.user.js
// @updateURL https://update.greasyfork.org/scripts/558267/Trustee.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Build a canonical profile URL similar to the extension's logic
    function buildUserProfileUrl(userId, isDeleted) {
        return `https://www.roblox.com/${isDeleted ? 'deleted-users' : 'users'}/${userId}/profile`;
    }

    function getMyUserId() {
        // Try meta tag first
        const meta = document.querySelector('meta[name="user-data"]');
        if (meta && meta.dataset && meta.dataset.userid) {
            return meta.dataset.userid;
        }
        // Fallback to global Roblox object if available
        if (window.Roblox && window.Roblox.CurrentUser) {
            return window.Roblox.CurrentUser.userId;
        }
        return null;
    }

    function getCsrfToken() {
        // Roblox stores the CSRF token in a meta tag
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('data-token') : null;
    }

    async function fetchShareLink() {
        try {
            const csrfToken = getCsrfToken();
            if (!csrfToken) {
                console.warn('RoSeal Userscript: No CSRF token found');
                return null;
            }

            const resp = await fetch('https://apis.roblox.com/sharelinks/v1/get-or-create-link', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    linkType: 'Profile'
                })
            });
            
            if (!resp.ok) {
                console.error(`RoSeal Userscript: API error ${resp.status}`);
                return null;
            }
            
            const json = await resp.json();
            return json.shortUrl;
        } catch (e) {
            console.error('RoSeal Userscript: Failed to get share link', e);
            return null;
        }
    }

    function showToast(text) {
        const id = 'roseal-copy-toast';
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement('div');
            el.id = id;
            Object.assign(el.style, {
                position: 'fixed',
                right: '16px',
                bottom: '16px',
                background: 'rgba(0,0,0,0.85)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '13px',
                zIndex: 999999,
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            });
            document.body.appendChild(el);
        }
        el.textContent = text;
        el.style.opacity = '1';
        clearTimeout(el._rosealTimeout);
        el._rosealTimeout = setTimeout(() => {
            el.style.opacity = '0';
        }, 1800);
    }

    function showQrModal(url) {
        // Remove existing if any
        const existing = document.getElementById('roseal-qr-modal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'roseal-qr-modal';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: '999999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)'
        });

        const modal = document.createElement('div');
        const isDark = document.body.classList.contains('dark-theme');
        Object.assign(modal.style, {
            backgroundColor: isDark ? '#232527' : '#FFFFFF',
            color: isDark ? '#FFFFFF' : '#191919',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            maxWidth: '300px',
            position: 'relative',
            fontFamily: '"HCo Gotham SSm", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif'
        });

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '8px',
            right: '12px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: 'inherit',
            opacity: '0.7'
        });
        closeBtn.onclick = () => overlay.remove();
        modal.appendChild(closeBtn);

        // QR Container
        const qrContainer = document.createElement('div');
        Object.assign(qrContainer.style, {
            margin: '16px auto',
            padding: '10px',
            backgroundColor: 'white', // QR codes need contrast
            borderRadius: '8px',
            width: 'fit-content'
        });
        modal.appendChild(qrContainer);

        // Generate QR
        // Using qrcode.js from @require
        try {
            new QRCode(qrContainer, {
                text: url,
                width: 180,
                height: 180,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        } catch (e) {
            qrContainer.textContent = 'Error generating QR code. Please ensure script dependencies are loaded.';
            console.error(e);
        }

        // Text
        const text = document.createElement('p');
        text.textContent = 'Scan with your Roblox app in Connect > QR Code > Scan button in top right corner';
        Object.assign(text.style, {
            marginTop: '16px',
            fontSize: '14px',
            lineHeight: '1.4',
            opacity: '0.8'
        });
        modal.appendChild(text);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close on click outside
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    function createSidebarButton(userId, isDeleted) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        // Match Roblox sidebar classes
        a.className = 'dynamic-overflow-container text-nav roseal-copy-profile-sidebar-btn';
        a.href = '#';
        a.style.cursor = 'pointer';

        const divIcon = document.createElement('div');
        const spanIcon = document.createElement('span');
        // We'll use a custom class and inject CSS for the icon
        spanIcon.className = 'roseal-icon-copy';
        divIcon.appendChild(spanIcon);

        const spanText = document.createElement('span');
        spanText.className = 'font-header-2 dynamic-ellipsis-item';
        spanText.textContent = 'Profile QR Code';

        a.appendChild(divIcon);
        a.appendChild(spanText);
        li.appendChild(a);

        a.addEventListener('click', async (ev) => {
            ev.preventDefault();

            let urlToUse = buildUserProfileUrl(userId, isDeleted);
            const myId = getMyUserId();

            // If this is the current user, try to get the special share link
            if (userId && myId && String(userId) === String(myId) && !isDeleted) {
                showToast('Generating QR code...');
                const shareUrl = await fetchShareLink();
                if (shareUrl) {
                    urlToUse = shareUrl;
                }
            } else {
                showToast('Generating QR code...');
            }

            showQrModal(urlToUse);
        });

        return li;
    }

    function injectProfileButton() {
        // Check if already injected
        if (document.querySelector('.roseal-copy-profile-sidebar-btn')) return;

        // Find the sidebar list. It usually contains #nav-home or similar items.
        const navHome = document.getElementById('nav-home');
        const sidebarList = navHome ? navHome.closest('ul') : document.querySelector('.left-col-list ul');

        if (sidebarList) {
            // Extract user ID from URL
            const m = location.pathname.match(/\/users\/(\d+)\/profile/);
            if (m) {
                const userId = m[1];
                const isDeleted = false; 
                const btn = createSidebarButton(userId, isDeleted);
                
                // Append as the last li
                sidebarList.appendChild(btn);
            }
        }
    }

    // Initial scan
    injectProfileButton();

    // Observe DOM changes because Roblox is a SPA
    const mo = new MutationObserver((mutations) => {
        injectProfileButton();
    });

    mo.observe(document.body || document.documentElement, { childList: true, subtree: true });

    // Also use an interval for the first few seconds to catch late loads
    const interval = setInterval(() => {
        if (document.querySelector('.roseal-copy-profile-sidebar-btn')) {
            clearInterval(interval);
        } else {
            injectProfileButton();
        }
    }, 500);

    // Stop interval after 10 seconds
    setTimeout(() => clearInterval(interval), 10000);

    // Add CSS for the sidebar icon
    const style = document.createElement('style');
    style.textContent = `
        .roseal-icon-copy {
            display: inline-block;
            width: 28px;
            height: 28px;
            /* Simple copy icon SVG */
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888'%3E%3Cpath d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'/%3E%3C/svg%3E");
            background-size: 20px;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.7;
        }
        /* Dark theme adjustment if needed, though #888 is usually okay for both */
        .dark-theme .roseal-icon-copy {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff'%3E%3Cpath d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z'/%3E%3C/svg%3E");
        }
    `;
    document.head.appendChild(style);

})();