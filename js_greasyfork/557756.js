// ==UserScript==
// @name         Amazon - Hide personnal infos (ex. for streaming)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blurs all personnal infos on Amazon websites.
// @author       Guile93
// @license      MIT
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.com.au/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.com.br/*
// @match        https://www.amazon.in/*
// @match        https://www.amazon.com.mx/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.pl/*
// @match        https://www.amazon.sg/*
// @match        https://www.amazon.ae/*
// @match        https://www.amazon.sa/*
// @match        https://www.amazon.eg/*
// @match        https://www.amazon.be/*
// @match        https://www.amazon.ch/*
// @match        https://smile.amazon.com/*
// @match        https://smile.amazon.co.uk/*
// @include      /^https?:\/\/([^\/]+\.)?amazon\.[a-z.]+\/.*/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557756/Amazon%20-%20Hide%20personnal%20infos%20%28ex%20for%20streaming%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557756/Amazon%20-%20Hide%20personnal%20infos%20%28ex%20for%20streaming%29.meta.js
// ==/UserScript==

(function () {
    var STORAGE_KEY = 'ccPrivacyMask';

    function getInitialState() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'off') return 'off';
        } catch (e) {}
        return 'on';
    }

    var currentState = getInitialState();
    var root = document.documentElement;
    root.setAttribute('data-cc-privacy', currentState);

    (function injectStyle() {
        var style = document.createElement('style');
        style.textContent = `
html[data-cc-privacy="on"] #nav-link-accountList-nav-line-1,
html[data-cc-privacy="on"] #glow-ingress-line1,
html[data-cc-privacy="on"] #glow-ingress-line2,
html[data-cc-privacy="on"] #contextualIngressPtLabel_deliveryShortLine,
html[data-cc-privacy="on"] #hmenu-customer-name,
html[data-cc-privacy="on"] #nav-flyout-accountList,
html[data-cc-privacy="on"] .yohtmlc-recipient,
html[data-cc-privacy="on"] .yohtmlc-order-id span.a-color-secondary,
html[data-cc-privacy="on"] .order-card,
html[data-cc-privacy="on"] #sc-retail-cart-container,
html[data-cc-privacy="on"] #sc-active-cart,
html[data-cc-privacy="on"] #sc-saved-cart,
html[data-cc-privacy="on"] #a-popover-root,
html[data-cc-privacy="on"] #maple-banner__text,
html[data-cc-privacy="on"] .maple-banner__text,
html[data-cc-privacy="on"] [aria-labelledby="Acheter à nouveau"],
html[data-cc-privacy="on"] ._cDEzb_your-orders-box-styling_1K33F,
html[data-cc-privacy="on"] #nav-global-location-data-modal-action,
html[data-cc-privacy="on"] #nav-global-location-slot,
html[data-cc-privacy="on"] #nav-global-location-popover-link,
html[data-cc-privacy="on"] #nav-your-amazon-text,
html[data-cc-privacy="on"] .nav-shortened-name
{
    filter: blur(8px);
    text-shadow: 0 0 6px rgba(0,0,0,0.7);
    transition: filter 0.15s ease-out;
}

#cc-privacy-inline {
    display: inline-flex;
    align-items: center;
    margin-left: 6px;
    cursor: pointer;
    vertical-align: middle;
    text-decoration: none;
}

#cc-privacy-inline .switch {
    position: relative;
    width: 32px;
    height: 16px;
    border-radius: 999px;
    background: #22c55e;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.4);
    transition: background 0.15s ease-out;
}

#cc-privacy-inline .thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    transition: transform 0.15s ease-out;
}

html[data-cc-privacy="off"] #cc-privacy-inline .switch {
    background: #dc2626;
}

html[data-cc-privacy="off"] #cc-privacy-inline .thumb {
    transform: translateX(14px);
}
        `;
        (document.head || document.documentElement).appendChild(style);
    })();

    function applyState(newState) {
        root.setAttribute('data-cc-privacy', newState);
        try { localStorage.setItem(STORAGE_KEY, newState); } catch (e) {}
    }

    function createToggle() {
        var cart = document.getElementById('nav-cart');
        if (!cart) return;
        if (document.getElementById('cc-privacy-inline')) return;
        var link = document.createElement('a');
        link.id = 'cc-privacy-inline';
        link.href = 'javascript:void(0)';
        link.innerHTML = '<span class="switch"><span class="thumb"></span></span>';
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var current = root.getAttribute('data-cc-privacy') === 'off' ? 'off' : 'on';
            var next = current === 'on' ? 'off' : 'on';
            applyState(next);
        });
        cart.insertAdjacentElement('afterend', link);
    }

    function onReady(cb) {
        if (document.readyState === 'interactive' || document.readyState === 'complete') cb();
        else document.addEventListener('DOMContentLoaded', cb);
    }

    onReady(function () {
        createToggle();
        applyState(currentState);
    });
})();
