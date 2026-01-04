// ==UserScript==
// @name         Domyślny trening goryli (XPath do <select>)
// @namespace    http://tampermonkey.net/
// @version      2.0.6
// @description  Podmienia w wybranych <select> opcję [value="all"] na inne, używając XPath do <select>
// @match        *://*.gangsters.pl/*
// @grant        none
// @author       mleko95
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/548520/Domy%C5%9Blny%20trening%20goryli%20%28XPath%20do%20%3Cselect%3E%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548520/Domy%C5%9Blny%20trening%20goryli%20%28XPath%20do%20%3Cselect%3E%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {

        // 🔧 KONFIGURACJA: podajesz XPath do <select> i nowe wartości
        const config = [
            {
                xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div[3]/div[2]/div[4]/div/div[1]/form/select',
                newValue: 'life-attack',
                newText:  'życie + obrażenia = 220 pkt'
            },
            {
                xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div[3]/div[3]/div[4]/div/div[1]/form/select',
                newValue: 'life-attack',
                newText:  'życie + obrażenia = 220 pkt'
            },
            {
                xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div[3]/div[4]/div[4]/div/div[1]/form/select',
                newValue: 'life-attack',
                newText:  'życie + obrażenia = 220 pkt'
            },
            {
                xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div[3]/div[5]/div[4]/div/div[1]/form/select',
                newValue: 'life-attack',
                newText:  'życie + obrażenia = 220 pkt'
            },
            {
                xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div[3]/div[6]/div[4]/div/div[1]/form/select',
                newValue: 'life-attack',
                newText:  'życie + obrażenia = 220 pkt'
            },
            {
                xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div[3]/div[7]/div[4]/div/div[1]/form/select',
                newValue: 'life-attack',
                newText:  'życie + obrażenia = 220 pkt'
            },
            {
                xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div[3]/div[8]/div[4]/div/div[1]/form/select',
                newValue: 'life-attack',
                newText:  'życie + obrażenia = 220 pkt'
            },
            {
                xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div[3]/div[9]/div[4]/div/div[1]/form/select',
                newValue: 'life-attack',
                newText:  'życie + obrażenia = 220 pkt'
            },
            {
                xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div[3]/div[10]/div[4]/div/div[1]/form/select',
                newValue: 'life-attack',
                newText:  'życie + obrażenia = 220 pkt'
            },
            {
                xpath: '/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div[3]/div[11]/div[4]/div/div[1]/form/select',
                newValue: 'life-attack',
                newText:  'życie + obrażenia = 220 pkt'
            },

            // możesz dodać kolejne wpisy {...}
        ];

        function getElementByXpath(path) {
            return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

        config.forEach(c => {
            let select = getElementByXpath(c.xpath);
            if (select) {
                let opt = select.querySelector('option[value="all"]');
                if (opt) {
                    opt.value = c.newValue;
                    opt.textContent = c.newText;
                    opt.selected = true;
                }
            }
        });
    });
})();
