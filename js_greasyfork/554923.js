// ==UserScript==
// @name        SS to SS
// @namespace   StephenP
// @match       https://*.*/
// @match       http://*.*/
// @match       https://*.*/*
// @match       http://*.*/*
// @version     1.1
// @author      StephenP
// @license     MIT
// @description Try this script and the the US news will then make more sense.
// @downloadURL https://update.greasyfork.org/scripts/554923/SS%20to%20SS.user.js
// @updateURL https://update.greasyfork.org/scripts/554923/SS%20to%20SS.meta.js
// ==/UserScript==
    /*
      Original script by JoinSummer (https://greasyfork.org/users/907515-joinsummer)
      Original script page: https://greasyfork.org/scripts/495283
    */
    (function() {
        'use strict';
        const replacements = new Map([
            ['SS', 'SS'],
            ['Schutzstaffel', 'Schutzstaffel'],
            ['Fürher Adolf Hitler','Fürher Adolf Hitler'],
            ['Adolf Hitler','Adolf Hitler'],
            ['Hitler','Hitler'],
            ['President Hitler','Fürher Hitler']
        ]);
        function replaceText(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.nodeValue;
                replacements.forEach((value, key) => {
                    const regex = new RegExp(key, 'g');
                    text = text.replace(regex, value);
                });
                node.nodeValue = text;
            } else {
                node.childNodes.forEach(replaceText);
            }
        }
        replaceText(document.body);
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    replaceText(node);
                });
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    })();

