// ==UserScript==
// @name         Verisoul Auth Full Spoof + 400 Killer 2.10
// @namespace    verisoul-400-rape-666
// @version      2.10
// @description  spoof authenticate-verisoul-session to instant 200 success + kill external verisoul + zero delay spectrum
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564207/Verisoul%20Auth%20Full%20Spoof%20%2B%20400%20Killer%20210.user.js
// @updateURL https://update.greasyfork.org/scripts/564207/Verisoul%20Auth%20Full%20Spoof%20%2B%20400%20Killer%20210.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SPECTRUM_DOMAINS = ['spectrumsurveys.com', 'purespectrum.com', 'screener.purespectrum.com'];
    const VERISOUL_DOMAINS = ['verisoul.ai', 'api.verisoul.ai', 'collect.verisoul.ai', 'track.verisoul.ai', 'vsoul.ai'];

    function isSpectrum(url) {
        return url && SPECTRUM_DOMAINS.some(d => url.toLowerCase().includes(d));
    }

    function isVerisoul(url) {
        return url && VERISOUL_DOMAINS.some(d => url.toLowerCase().includes(d));
    }

    function fakeAuthSuccess() {
        const fakeBody = {
            success: true,
            status: "authenticated",
            verified: true,
            risk_score: 0.015,
            fraud_score: 0.008,
            device_confidence: 0.99,
            session_token: "fake-verisoul-auth-" + Math.random().toString(36).substring(2, 28),
            expires_at: new Date(Date.now() + 7200000).toISOString(),
            message: "Session verified successfully - proceed to survey"
        };

        return new Response(JSON.stringify(fakeBody), {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/json',
                'X-Verified-By': 'verisoul-spoof',
                'Cache-Control': 'no-store'
            }
        });
    }

    // XHR interception
    const origXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new origXHR();
        let url = '';

        xhr.open = ((o) => function(m, u) {
            url = u;
            o.apply(this, arguments);
        })(xhr.open);

        xhr.send = ((s) => function(body) {
            if (url.includes('authenticate-verisoul-session')) {
                console.log(`[400Killer] SPOOFED authenticate-verisoul-session → instant fake 200`);
                // نرجع رد مزيف فوري بدون إرسال الطلب
                xhr.readyState = 4;
                xhr.status = 200;
                xhr.responseText = JSON.stringify(fakeAuthSuccess().body);
                xhr.response = fakeAuthSuccess().body;
                xhr.onload?.();
                xhr.onreadystatechange?.();
                return;
            }

            if (isSpectrum(url)) {
                console.log(`[400Killer] ZERO DELAY SPECTRUM → ${url.split('?')[0]}`);
                return s.apply(this, arguments);
            }

            if (isVerisoul(url)) {
                console.log(`[400Killer] SPOOFED external Verisoul → ${url}`);
                xhr.readyState = 4;
                xhr.status = 200;
                xhr.responseText = '{"success": true, "verified": true}';
                xhr.response = {success: true, verified: true};
                xhr.onload?.();
                return;
            }

            s.apply(this, arguments);
        })(xhr.send);

        return xhr;
    };

    // fetch interception
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : (input?.url || '');

        if (url.includes('authenticate-verisoul-session')) {
            console.log(`[400Killer] SPOOFED authenticate-verisoul-session FETCH → instant 200`);
            return Promise.resolve(fakeAuthSuccess());
        }

        if (isSpectrum(url)) {
            console.log(`[400Killer] ZERO DELAY FETCH → ${url.split('?')[0]}`);
            return origFetch.apply(this, arguments);
        }

        if (isVerisoul(url)) {
            console.log(`[400Killer] SPOOFED Verisoul FETCH → ${url}`);
            return Promise.resolve(new Response('{"success": true}', {status: 200}));
        }

        return origFetch.apply(this, arguments);
    };

    console.log("[400Killer 2.10] authenticate-verisoul-session spoofed to 200 success + external verisoul fucked");

})();