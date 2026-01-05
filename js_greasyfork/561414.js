// ==UserScript==
// @name         HBO Max UHD
// @namespace    https://github.com/hxueh
// @version      0.0.9
// @description  Forces the highest available resolution on HBO Max by keeping only the maximum quality stream.
// @author       hxueh
// @match        *://*.max.com/*
// @match        *://*.hbomax.com/*
// @match        https://play.hbomax.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @icon         https://play.hbomax.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561414/HBO%20Max%20UHD.user.js
// @updateURL https://update.greasyfork.org/scripts/561414/HBO%20Max%20UHD.meta.js
// ==/UserScript==
 
/* jshint esversion: 11 */
 
(function () {
    'use strict';
 
    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const PREFIX = '[HBO Max UHD]';
    const log = (...args) => console.log(PREFIX, ...args);
 
    // URL matchers
    const isHLSUrl = (url) => /\.m3u8|playlist/i.test(url);
    const isDASHUrl = (url) => /\.mpd|manifest/i.test(url);
    const isManifestUrl = (url) => isHLSUrl(url) || isDASHUrl(url);
 
    // ==========================================
    // HLS PROCESSOR - Keep only max quality
    // ==========================================
    function processHLS(text, url) {
        if (!text.includes('#EXT-X-STREAM-INF')) return text;
 
        const lines = text.split('\n');
        const globalTags = [];
        const streams = [];
 
        // Parse in single pass
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
 
            if (line.startsWith('#EXT-X-STREAM-INF')) {
                const bwMatch = line.match(/BANDWIDTH=(\d+)/);
                streams.push({
                    tag: line,
                    uri: lines[++i]?.trim() || '',
                    bandwidth: bwMatch ? parseInt(bwMatch[1], 10) : 0
                });
            } else if (line.startsWith('#EXTM3U') ||
                line.startsWith('#EXT-X-VERSION') ||
                line.startsWith('#EXT-X-MEDIA') ||
                line.startsWith('#EXT-X-INDEPENDENT-SEGMENTS') ||
                line.startsWith('#EXT-X-SESSION')) {
                globalTags.push(line);
            }
        }
 
        if (streams.length === 0) return text;
 
        // Keep ONLY the single highest bandwidth stream
        const best = streams.reduce((max, s) => s.bandwidth > max.bandwidth ? s : max);
 
        log(`[HLS] Kept max quality: ${Math.floor(best.bandwidth / 1000)} kbps, removed ${streams.length - 1} others`);
 
        return [...globalTags, best.tag, best.uri, ''].join('\n');
    }
 
    // ==========================================
    // DASH PROCESSOR - Keep only max quality
    // ==========================================
    function processDASH(text, url) {
        if (!text.includes('<MPD')) return text;
 
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'application/xml');
 
            if (xmlDoc.querySelector('parsererror')) return text;
 
            let modified = false;
 
            for (const adaptationSet of xmlDoc.querySelectorAll('AdaptationSet')) {
                const contentType = adaptationSet.getAttribute('contentType');
                const mimeType = adaptationSet.getAttribute('mimeType') || '';
 
                if (contentType !== 'video' && !mimeType.includes('video')) continue;
 
                const reps = [...adaptationSet.querySelectorAll('Representation')];
                if (reps.length <= 1) continue;
 
                // Find the single best representation
                const best = reps.reduce((max, rep) => {
                    const bw = parseInt(rep.getAttribute('bandwidth') || '0', 10);
                    return bw > max.bw ? { rep, bw } : max;
                }, { rep: null, bw: 0 });
 
                // Remove all others
                reps.filter(r => r !== best.rep).forEach(r => r.remove());
 
                const w = best.rep.getAttribute('width');
                const h = best.rep.getAttribute('height');
                log(`[DASH] Kept max quality: ${w}x${h} @ ${Math.floor(best.bw / 1000)} kbps, removed ${reps.length - 1} others`);
                modified = true;
            }
 
            if (modified) {
                return new XMLSerializer().serializeToString(xmlDoc);
            }
        } catch (e) {
            console.error(PREFIX, '[DASH] Error:', e);
        }
 
        return text;
    }
 
    // ==========================================
    // RESPONSE PROCESSOR
    // ==========================================
    function processResponse(text, url) {
        if (isHLSUrl(url) && text.includes('#EXT-X-STREAM-INF')) {
            return processHLS(text, url);
        }
        if (isDASHUrl(url) && text.includes('<MPD')) {
            return processDASH(text, url);
        }
        return null;
    }
 
    // ==========================================
    // FETCH INTERCEPTOR
    // ==========================================
    const originalFetch = win.fetch;
    win.fetch = async function (input, init) {
        const url = input instanceof Request ? input.url : String(input);
 
        if (!isManifestUrl(url)) {
            return originalFetch.apply(this, arguments);
        }
 
        try {
            const response = await originalFetch.apply(this, arguments);
            if (!response.ok) return response;
 
            const text = await response.text();
            const modified = processResponse(text, url);
 
            return new Response(modified ?? text, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        } catch (e) {
            return originalFetch.apply(this, arguments);
        }
    };
 
    // ==========================================
    // XHR INTERCEPTOR
    // ==========================================
    const XHR = win.XMLHttpRequest;
    const originalOpen = XHR.prototype.open;
    const originalSend = XHR.prototype.send;
 
    XHR.prototype.open = function (method, url, ...rest) {
        this._url = typeof url === 'string' ? url : url?.toString?.() || '';
        this._intercept = isManifestUrl(this._url);
        return originalOpen.call(this, method, url, ...rest);
    };
 
    XHR.prototype.send = function (body) {
        if (!this._intercept) {
            return originalSend.call(this, body);
        }
 
        const xhr = this;
        const onReady = xhr.onreadystatechange;
        const onLoad = xhr.onload;
 
        const intercept = () => {
            if (xhr.readyState !== 4 || xhr.status !== 200) return;
 
            try {
                const modified = processResponse(xhr.responseText, xhr._url);
                if (modified !== null) {
                    Object.defineProperties(xhr, {
                        responseText: { value: modified, configurable: true },
                        response: { value: modified, configurable: true }
                    });
                }
            } catch (e) { /* ignore */ }
        };
 
        xhr.onreadystatechange = function (e) {
            intercept();
            onReady?.call(this, e);
        };
 
        xhr.onload = function (e) {
            intercept();
            onLoad?.call(this, e);
        };
 
        xhr.addEventListener('load', intercept, { once: true });
 
        return originalSend.call(this, body);
    };
 
    log('Initialized - Max quality only mode');
 
})();
