// ==UserScript==
// @name         midasbuy get cookies
// @version      0.2.0
// @license      AGPL
// @namespace    http://tampermonkey.net/
// @description  midasbuy
// @author       You
// @match        https://www.midasbuy.com/*
// @grant        GM_cookie
// @grant        GM_setClipboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=midasbuy.com
// @downloadURL https://update.greasyfork.org/scripts/551146/midasbuy%20get%20cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/551146/midasbuy%20get%20cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert cookies to the desired format
    function formatCookies(cookies) {
        const cookieObject = {};

        cookies.forEach(cookie => {
            cookieObject[cookie.name] = {
                key: cookie.name,
                value: cookie.value,
                domain: cookie.domain,
                path: cookie.path,
                hostOnly: !cookie.domain.startsWith('.'),
                pathIsDefault: cookie.path === '/',
                creation: new Date().toISOString(),
                lastAccessed: new Date().toISOString(),
                ...(cookie.expires && {
                    expires: new Date(cookie.expires * 1000).toISOString(),
                    maxAge: Math.round(cookie.expires - Date.now() / 1000)
                }),
                ...(cookie.secure && { secure: cookie.secure }),
                ...(cookie.httpOnly && { httpOnly: cookie.httpOnly }),
                ...(cookie.sameSite && { sameSite: cookie.sameSite.toLowerCase() })
            };
        });

        return cookieObject;
    }

    // Create and style the button with plain CSS
    const button = document.createElement('button');
    button.innerText = 'Copy Cookies';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.backgroundColor = '#2563eb';
    button.style.color = 'white';
    button.style.padding = '10px 20px';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.fontWeight = '500';
    button.style.zIndex = '1000';
    button.style.transition = 'background-color 0.2s';
    button.onmouseover = () => { button.style.backgroundColor = '#1e40af'; };
    button.onmouseout = () => { button.style.backgroundColor = '#2563eb'; };
    document.body.appendChild(button);

    // Add click event listener to the button
    button.addEventListener('click', () => {
        GM_cookie.list({}, (cookies, error) => {
            if (error) {
                console.error('Error fetching cookies:', error);
                alert('Error fetching cookies. Check console for details.');
                return;
            }

            const formattedCookies = formatCookies(cookies);
            const cookieJson = formattedCookies;
            const userAgent = navigator.userAgent;
            const midasbuyFingerId = localStorage.getItem('__RCId__').replaceAll('"', '');
            GM_setClipboard(JSON.stringify({
                cookieJson,
                userAgent,
                midasbuyFingerId
            }), 'text');
            alert('Cookies copied to clipboard!');
        });
    });
})();