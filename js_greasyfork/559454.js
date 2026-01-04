// ==UserScript==
// @name         Flow Monitor (labs.google)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Monitor labs.google and fetch session token from auth/session response every hour
// @author       You
// @match        https://labs.google/*
// @grant        GM_xmlhttpRequest
// @connect      labs.google
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559454/Flow%20Monitor%20%28labsgoogle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559454/Flow%20Monitor%20%28labsgoogle%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let ws = null;

    function connectWebSocket() {
        ws = new WebSocket('ws://localhost:16012');

        ws.onopen = function() {
            console.log('Connected to WebSocket server');

            // Fetch session token after connection
            setTimeout(() => {
                fetchSessionToken();
            }, 5000);

            // Fetch session token every hour
            setInterval(() => {
                fetchSessionToken();
            }, 60 * 60 * 1000);
        };

        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            console.log('Server response:', data);
        };

        ws.onclose = function() {
            console.log('WebSocket connection closed, reconnecting...');
            setTimeout(connectWebSocket, 5000);
        };
    }

    function fetchSessionToken() {
        console.log('Fetching session token from /fx/api/auth/session...');

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://labs.google/fx/api/auth/session',
            onload: function(response) {
                console.log('Auth session response status:', response.status);

                // Get Set-Cookie header from response
                const responseHeaders = response.responseHeaders;
                console.log('Response headers:', responseHeaders);

                // Parse Set-Cookie headers to find __Secure-next-auth.session-token
                const sessionToken = extractSessionTokenFromHeaders(responseHeaders);

                if (sessionToken) {
                    console.log('Session token found:', sessionToken.substring(0, 20) + '...');
                    set_key('session-token', sessionToken);
                } else {
                    console.log('Session token not found in Set-Cookie headers');
                    // Retry after 5 seconds
                    setTimeout(() => {
                        fetchSessionToken();
                    }, 5000);
                }
            },
            onerror: function(error) {
                console.error('Error fetching session:', error);
                // Retry after 5 seconds
                setTimeout(() => {
                    fetchSessionToken();
                }, 5000);
            }
        });
    }

    function extractSessionTokenFromHeaders(headers) {
        // Headers come as a string, split by newlines
        const lines = headers.split('\n');

        for (const line of lines) {
            // Look for Set-Cookie header
            if (line.toLowerCase().startsWith('set-cookie:')) {
                const cookieValue = line.substring('set-cookie:'.length).trim();

                // Check if this is the session token cookie
                if (cookieValue.startsWith('__Secure-next-auth.session-token=')) {
                    // Extract the value (everything between = and the first ;)
                    const match = cookieValue.match(/__Secure-next-auth\.session-token=([^;]+)/);
                    if (match && match[1]) {
                        return match[1];
                    }
                }
            }
        }

        return null;
    }

    function set_key(key, value) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('send to client', key, value.substring(0, 20) + '...');
            ws.send(JSON.stringify({
                type: 'set_key',
                key: key,
                value: value
            }));
        }
    }

    // Connect to WebSocket
    connectWebSocket();

})();