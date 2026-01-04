// ==UserScript==
// @name         Amazon Vine Review Queue Fixer
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Easily see which reviews are done and pending
// @author       Vexe
// @match        https://www.amazon.com/vine/vine-reviews*
// @match        https://www.amazon.ca/vine/vine-reviews*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/548630/Amazon%20Vine%20Review%20Queue%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/548630/Amazon%20Vine%20Review%20Queue%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lastState = 200;

    // function to get elements and update them
    function getDone() {
        // elements
        var els = document.getElementsByName("vvp-reviews-table--review-item-btn");

        for(var i = 0; i < els.length; i++) {
            lastState = getData(els[i]);
        }
    }

    // delay constant
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // async function to get target content to determine if review is already submitted
    async function getData(el) {
        try {
            setText('Running...',false);
            // A href
            var urlx = el.href;
            // wait 5 seconds
            await delay(3000);
            // add another delay if necessary
            if (lastState != 200) {
                await delay(10000);
            }
            // async http response
            const response = await fetch(urlx);
            // shit failed
            if (!response.ok) {
                // if status 429, add a delay
                if (response.status == 429) {
                    setText('429!',false);
                    console.log('too many requests...');
                }
            } else {
                // get response body (full page markup)
                const data = await response.text();

                // regex pattern to find the json we care about
                var rgx = /(?<=^\s+window\.P\.initialPageState = )(.+)(?=;$)/gm;

                // get regex match
                var jraw = data.match(rgx);
                // deserialize into JSON object
                var json = JSON.parse(jraw);

                // if there's a title value, this review exists
                if (json.reviewForm.title) {
                    // add css class
                    el.classList.add('done');
                    // edit button text
                    el.innerText = 'Edit review';
                    // edit other text
                    el.parentElement.parentElement.parentElement.previousElementSibling.innerText = 'Review pending approval';
                }
            }
            setText('Run Script',true);
            return (response.status);
        } catch (error) {
            // shit broke
            console.error(error);
        }
    }

    function setText(msg, tog) {
        // get the button text and change it
        var btn = document.getElementById('btnScript');
        btn.innerText = msg;

        // get the container div
        var spn = document.getElementById('vvp-reviews-button--runscript');

        if(tog) {
            btn.onclick = getDone;
            try {spn.classList.remove('noclick')} catch {};
        } else {
            btn.onclick = '';
            spn.classList.add('noclick');
        }
    }

    // add css to head
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.appendChild(document.createTextNode(`
    .done { background-color: #ffed94; font-style: italic; color: #666 !important; }
    .noclick, .noclick #btnScript { cursor: not-allowed; }
    .noclick #btnScript { background-color: #eee; font-style: italic; }
    `));
    head.appendChild(s);

    // add button to force script to run, just in case
    var ospan = document.createElement('span');
    ospan.id = 'vvp-reviews-button--runscript';
    ospan.className = 'a-button a-button-normal a-button-toggle';

    var ispan = document.createElement('span');
    ispan.classList = ('a-button-inner');

    var ayy = document.createElement('a');
    ayy.id = 'btnScript';
    ayy.onclick = getDone;
    ayy.classList = ('a-button-text');
    ayy.innerText = 'Run Script';

    ispan.appendChild(ayy);
    ospan.appendChild(ispan);

    // get the target div
    var btns = document.getElementById('vvp-review-button-container');
    btns.appendChild(ospan);

    // run the script
    getDone();

})();