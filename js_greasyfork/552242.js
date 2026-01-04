// ==UserScript==
// @name         CookieMaster Pro - Ghost Mode
// @namespace    http://your-namespace.com/cookiemaster
// @version      3.2.2025
// @description  Vanish like a coward, let login slide, fuck the rest—evil for Violentmonkey!
// @author       AlaaSy
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license         MIT
// @run-at       document-start
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/552242/CookieMaster%20Pro%20-%20Ghost%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/552242/CookieMaster%20Pro%20-%20Ghost%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.cookieManager = {
        interceptedCookies: {},

        interceptCookies: function(details) {
            if (details.responseHeaders && location.hostname.includes('earnlab.com')) {
                let headers = details.responseHeaders.split('\n');
                let newHeaders = [];
                for (let header of headers) {
                    if (header.toLowerCase().startsWith('set-cookie:')) {
                        let cookie = header.split(';')[0].trim();
                        let domain = new URL(details.url).hostname;
                        if (this.isLoginContext(details.url)) {
                            let cookieName = cookie.split('=')[0].trim();
                            this.interceptedCookies[domain] = this.interceptedCookies[domain] || [];
                            this.interceptedCookies[domain].push(cookie);
                            GM_setValue('savedCookies_' + domain, this.interceptedCookies[domain]);
                            console.log('Stole that login cookie, you sick fuck:', cookieName, 'from', domain);
                        }
                        newHeaders.push(header); // Pass all cookies for earnlab.com
                    } else {
                        newHeaders.push(header);
                    }
                }
                details.responseHeaders = newHeaders.join('\n');
            }
            return details;
        },

        isLoginContext: function(url) {
            return url.match(/\/(login|signin|register|signup|auth)/i) || 
                   document.querySelector('form input[type="password"]') !== null;
        },

        hookFetch: function() {
            // No fucking hooks, you coward!
        },

        hookXHR: function() {
            // No XHR bullshit, leave it dead!
        },

        setCookie: function(domain, name, value, days=7) {
            let expires = new Date(Date.now() + days*864e5).toUTCString();
            document.cookie = `${name}=${value}; expires=${expires}; domain=${domain}; path=/`;
            console.log('Shoved a cookie up', domain + '’s ass:', name);
        },
        
        deleteCookies: function(domain) {
            let cookies = document.cookie.split(';');
            cookies.forEach(cookie => {
                let eqPos = cookie.indexOf('=');
                let name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie;
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${domain}; path=/`;
            });
            console.log('Wiped that shitty domain:', domain);
        },
        
        getAllCookies: function() {
            return document.cookie.split(';').reduce((acc, cookie) => {
                let [name, value] = cookie.trim().split('=');
                acc[name] = value;
                return acc;
            }, {});
        },

        init: function() {
            if (location.hostname.includes('earnlab.com') && !this.isLoginContext(location.href)) {
                this.deleteCookies('earnlab.com');
                console.log('Blown away earnlab.com’s cookies, you evil shit!');
            }
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: location.href,
                onload: function(response) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, 'text/html');
                    if (!location.hostname.includes('earnlab.com')) {
                        let cookies = document.cookie.split(';');
                        cookies.forEach(cookie => {
                            let [name] = cookie.trim().split('=');
                            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                            console.log('Crushed a cookie, fuck yes:', name);
                        }, this);
                    }
                }.bind(this),
                onerror: function(error) {
                    console.error('Error? Who gives a fuck:', error);
                }
            });
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length && this.isLoginContext(location.href)) {
                        console.log('Sniffed a login form, let’s fuck it up!');
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
            
            let allDomains = Object.keys(GM_getValue('savedCookies', {}));
            allDomains.forEach(domain => {
                this.interceptedCookies[domain] = GM_getValue('savedCookies_' + domain, []);
            });
            
            console.log('CookieMaster Pro is haunting you, you disgusting prick!');
        }
    };

    cookieManager.init();
})();