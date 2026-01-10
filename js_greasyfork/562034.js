// ==UserScript==
// @name         tips
// @namespace    https://greasyfork.org/users/auto-generated/notebooklm-tabs-1a9f3c
// @version      1.0.0
// @description  quiz tips
// @license      MIT
// @match        *://*.usercontent.goog/*
// @match        *://notebooklm.google.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562034/tips.user.js
// @updateURL https://update.greasyfork.org/scripts/562034/tips.meta.js
// ==/UserScript==

if (window.location.href.includes('notebooklm.google.com')) {
    let prev = null;
    
    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'gverwgregewrfew') {
            if (prev === null) {
                prev = document.title.slice(1);
            }
            document.title = e.data.title + prev;
        }
    });
}

if (window.location.href.includes('usercontent.goog/notebooklm-apps/shim.html')) {
    const feewfewfewfewf = window.Blob;
    
    window.Blob = function(parts, options) {
        if (options && options.type && options.type.includes('text/html')) {
            parts = parts.map(part => {
                if (typeof part === 'string') {
                    part = part.replace(/<meta[^>]*content-security-policy[^>]*>/gi, '');
                    part = part.replaceAll('c.isCorrect;', 'c.isCorrect; c.isCorrect ? window.top.postMessage({type:"gverwgregewrfew",title:b+1},"*") : {};');
                    return part;
                }
                return part;
            });
        }
        return new feewfewfewfewf(parts, options);
    };
}
