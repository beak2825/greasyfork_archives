// ==UserScript==
// @name         ChanWiki Unlocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks fake 404 overlay, autoplay audio, and malicious image replacement on chanwiki.pl.
// @match        *://chanwiki.pl/*
// @match        *://chanwiki.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552668/ChanWiki%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/552668/ChanWiki%20Unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MALICIOUS_IMAGE = 'lqxp7t.png';
    const LOG_PREFIX = '[Chanwiki Blocker]';

    const style = document.createElement('style');
    style.textContent = `
        body::after, body::before {
            display: none !important;
            content: none !important;
        }
        .fioot18,
        audio,
        #siteNotice,
        #localNotice,
        .sitenotice,
        img[src*="${MALICIOUS_IMAGE}"] {
            display: none !important;
        }
        body {
            visibility: visible !important;
            display: block !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (value && value.includes(MALICIOUS_IMAGE)) {
            if ((this.tagName === 'IMG' && name === 'src') || (this.tagName === 'A' && name === 'href')) {
                console.log(LOG_PREFIX, 'Blocked', this.tagName, name, 'modification');
                return;
            }
        }
        return originalSetAttribute.call(this, name, value);
    };

    const imgSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        get: imgSrcDescriptor.get,
        set: function(value) {
            if (value && value.includes(MALICIOUS_IMAGE)) {
                console.log(LOG_PREFIX, 'Blocked image src modification');
                return;
            }
            return imgSrcDescriptor.set.call(this, value);
        },
        configurable: true
    });

    const anchorHrefDescriptor = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'href');
    Object.defineProperty(HTMLAnchorElement.prototype, 'href', {
        get: anchorHrefDescriptor.get,
        set: function(value) {
            if (value && value.includes(MALICIOUS_IMAGE)) {
                console.log(LOG_PREFIX, 'Blocked link href modification');
                return;
            }
            return anchorHrefDescriptor.set.call(this, value);
        },
        configurable: true
    });

    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function() {
        if (this.tagName === 'AUDIO') {
            console.log(LOG_PREFIX, 'Blocked audio playback');
            return Promise.reject(new DOMException('Blocked', 'NotAllowedError'));
        }
        return originalPlay.apply(this, arguments);
    };

    const audioSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
    if (audioSrcDescriptor) {
        Object.defineProperty(HTMLAudioElement.prototype, 'src', {
            get: audioSrcDescriptor.get,
            set: function() {
                console.log(LOG_PREFIX, 'Blocked audio src');
                return;
            },
            configurable: true
        });
    }

    const originalAfter = Element.prototype.after;
    Element.prototype.after = function(...nodes) {
        if (this === document.body) {
            console.log(LOG_PREFIX, 'Blocked body.after()');
            return;
        }
        return originalAfter.apply(this, nodes);
    };

    function cleanPage() {
        const selectors = [
            '.fioot18',
            'audio',
            '#siteNotice',
            '#localNotice',
            '.sitenotice',
            `img[src*="${MALICIOUS_IMAGE}"]`
        ];

        document.querySelectorAll(selectors.join(',')).forEach(el => el.remove());

        document.querySelectorAll(`a[href*="${MALICIOUS_IMAGE}"]`).forEach(link => {
            link.style.pointerEvents = 'none';
            link.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
        });

        document.querySelectorAll('div, section, aside').forEach(el => {
            const style = window.getComputedStyle(el);
            const text = el.textContent || '';
            if ((style.position === 'fixed' || style.position === 'absolute') &&
                parseInt(style.zIndex) > 1000 &&
                (text.includes('404') || text.includes('nginx') || text.includes('Not Found'))) {
                el.remove();
            }
        });
    }

    cleanPage();

    let count = 0;
    const interval = setInterval(() => {
        cleanPage();
        if (++count >= 30) clearInterval(interval);
    }, 100);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cleanPage);
    }
    window.addEventListener('load', cleanPage);

    new MutationObserver(cleanPage).observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'style', 'class']
    });

    setInterval(() => {
        if (document.body) {
            const style = window.getComputedStyle(document.body);
            if (style.display === 'none' || style.visibility === 'hidden') {
                document.body.style.cssText += 'display: block !important; visibility: visible !important;';
            }
        }
    }, 250);
})();