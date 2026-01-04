// ==UserScript==
// @name         Export Discord Token and Smogon Cookies
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract Discord Token and Smogon Cookies, display for copying, and download as JSON
// @author       Grok (assisted)
// @match        https://discord.com/*
// @match        https://www.smogon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550007/Export%20Discord%20Token%20and%20Smogon%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/550007/Export%20Discord%20Token%20and%20Smogon%20Cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a floating UI
    function createUI(data, type, filename) {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '10px';
        div.style.right = '10px';
        div.style.background = '#1a1a1a';
        div.style.color = '#ffffff';
        div.style.padding = '15px';
        div.style.borderRadius = '5px';
        div.style.zIndex = '9999';
        div.style.maxWidth = '400px';
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

        const title = document.createElement('h3');
        title.textContent = `Extracted ${type}`;
        title.style.margin = '0 0 10px 0';
        div.appendChild(title);

        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '100px';
        textarea.style.background = '#333';
        textarea.style.color = '#fff';
        textarea.style.border = '1px solid #555';
        textarea.value = JSON.stringify(data, null, 2);
        div.appendChild(textarea);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.style.margin = '10px 5px 0 0';
        copyButton.style.padding = '5px 10px';
        copyButton.style.background = '#4CAF50';
        copyButton.style.color = '#fff';
        copyButton.style.border = 'none';
        copyButton.style.cursor = 'pointer';
        copyButton.onclick = () => {
            textarea.select();
            document.execCommand('copy');
            copyButton.textContent = 'Copied!';
            setTimeout(() => { copyButton.textContent = 'Copy to Clipboard'; }, 2000);
        };
        div.appendChild(copyButton);

        const downloadButton = document.createElement('button');
        downloadButton.textContent = `Download ${filename}`;
        downloadButton.style.padding = '5px 10px';
        downloadButton.style.background = '#2196F3';
        downloadButton.style.color = '#fff';
        downloadButton.style.border = 'none';
        downloadButton.style.cursor = 'pointer';
        downloadButton.onclick = () => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        };
        div.appendChild(downloadButton);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.padding = '5px 10px';
        closeButton.style.background = '#f44336';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.marginLeft = '5px';
        closeButton.onclick = () => div.remove();
        div.appendChild(closeButton);

        document.body.appendChild(div);
    }

    // Extract Discord Token
    if (window.location.hostname === 'discord.com') {
        console.log('Running on Discord - attempting to extract token');
        // Discord stores token in localStorage or via API calls
        let token = localStorage.getItem('token');
        if (token) {
            token = token.replace(/"/g, ''); // Remove quotes if present
            const data = { token };
            createUI(data, 'Discord Token', 'discord-token.json');
            console.log('Discord Token extracted:', token);
        } else {
            // Fallback: Try to extract from network requests
            const originalFetch = window.fetch;
            window.fetch = async (...args) => {
                const response = await originalFetch(...args);
                if (args[0].includes('api/v9/users/@me')) {
                    const clone = response.clone();
                    const json = await clone.json();
                    if (json.token) {
                        createUI({ token: json.token }, 'Discord Token', 'discord-token.json');
                        console.log('Discord Token extracted from API:', json.token);
                    }
                }
                return response;
            };
            console.log('No token in localStorage - waiting for API request');
            setTimeout(() => {
                if (!document.querySelector('textarea')) {
                    alert('Could not extract Discord Token. Ensure you are logged in and try refreshing.');
                }
            }, 5000);
        }
    }

    // Extract Smogon Cookies
    if (window.location.hostname === 'www.smogon.com') {
        console.log('Running on Smogon - extracting cookies');
        const cookies = document.cookie.split('; ').map(cookie => {
            const [name, value] = cookie.split('=');
            return {
                name,
                value,
                domain: 'www.smogon.com',
                path: '/forums',
                expires: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
                httpOnly: name.startsWith('xf_'), // Assume xf_ cookies are httpOnly
                secure: true
            };
        });
        if (cookies.length > 0) {
            createUI(cookies, 'Smogon Cookies', 'smogon-cookies.json');
            console.log('Smogon Cookies extracted:', cookies);
        } else {
            alert('No cookies found. Ensure you are logged in to Smogon.');
        }
    }
})();