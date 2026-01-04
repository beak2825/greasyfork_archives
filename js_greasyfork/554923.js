// ==UserScript==
// @name        ICE to SS
// @namespace   StephenP
// @match       https://*.*/
// @match       http://*.*/
// @match       https://*.*/*
// @match       http://*.*/*
// @version     1.0
// @author      StephenP
// @license     MIT
// @description Try this script and the the US news will then make more sense.
// @downloadURL https://update.greasyfork.org/scripts/554923/ICE%20to%20SS.user.js
// @updateURL https://update.greasyfork.org/scripts/554923/ICE%20to%20SS.meta.js
// ==/UserScript==
    /*
      Original script by JoinSummer (https://greasyfork.org/users/907515-joinsummer)
      Original script page: https://greasyfork.org/scripts/495283
    */
    (function() {
        'use strict';
        const replacements = new Map([
            ['ICE', 'SS'],
            ['Immigration and Customs Enforcement', 'Schutzstaffel']
        ]);
        function replaceText(node) {
          console.log(node.nodeType,node.nodeValue)
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

