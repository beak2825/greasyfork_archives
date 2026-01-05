// ==UserScript==
// @name        ThePirateBay - Search Exclusion
// @namespace   http://userscripts.org/users/23652
// @description Adds an Excludes field below the search field
// @include     http://thepiratebay.sx/search/*
// @include     https://thepiratebay.sx/search/*
// @include     http://thepiratebay.se/search/*
// @include     https://thepiratebay.se/search/*
// @include     http://fastpiratebay.eu/thepiratebay.se/search/*
// @include     https://fastpiratebay.eu/thepiratebay.se/search/*
// @include     http://fastpiratebay.eu/thepiratebay.se/s/?q=*
// @include     https://fastpiratebay.eu/thepiratebay.se/s/?q=*
// @copyright   JoeSimmons
// @version     1.0.4
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require     https://greasyfork.org/scripts/1885-joesimmons-library/code/JoeSimmons'%20Library.js?version=7915
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/6020/ThePirateBay%20-%20Search%20Exclusion.user.js
// @updateURL https://update.greasyfork.org/scripts/6020/ThePirateBay%20-%20Search%20Exclusion.meta.js
// ==/UserScript==

/* CHANGELOG

    1.0.4 (10/26/2014)
        - fixed bug on pages without navigation links (only one page of results)

    1.0.3 (5/15/2014
        - made it more dynamic since some TPB mirrors have slightly different html

    1.0.2 (5/9/2014)
        - made exclusions continue on different navigational pages

*/

JSL.runAt('interactive', function () {
    'use strict';

    var search_box = JSL('#q input[type="search"]'),
        submit = JSL('#q input[type="submit"]'),
        navLinks = JSL('//a/img[@alt="Next" or @alt="Previous"]/ancestor::div[@align="center"]//a'),
        rClassname = /\s*excludeHide/;

    function prepareRegex(str) {
        return str.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, "\\$1");
    }

    function doExclusion() {
        var results = JSL('#searchResult > tbody > tr'),
            exclude_box = JSL('#exclude_box'),
            exclude_value = (exclude_box.exists ? exclude_box.value().trim() : ''),
            excludes = [],
            tmp;

        if (!results.exists || !exclude_box.exists) { return; }

        // convert string of excludes to an array
        tmp = exclude_value.split(/\s*,\s*/);
        tmp.forEach(function (val, i) {
            val = prepareRegex( val.trim() ).replace(/\*/g, '[\\s\\S]*');
            if (val !== '') {
                excludes.push(val);
            }
        });

        // reset view of results
        showResults();

        if (excludes.length > 0) {
            GM_setValue( 'q', JSON.stringify(tmp) );
            excludes = new RegExp(excludes.join('|'), 'i');

            // hide results not wanted
            results.each(function (result) {
                var det = JSL('a[title^="Details for"]', result);

                if ( det.text().match(excludes) ) {
                    result.className += (result.className === '' ? '' : ' ') + 'excludeHide';
                } else {
                    result.className = result.className.replace(rClassname, '');
                }
            });

            // add "?exclude" to nav links
            navLinks = JSL('//a/img[@alt="Next" or @alt="Previous"]/ancestor::div[@align="center"]//a[ not( contains(@href, "?exclude") ) ]');
            navLinks.each(function (link) {
                link.href += '?exclude';
            });
        } else {
            showResults();
        }
    }

    function showResults() {
        JSL('#searchResult > tbody > tr').each(function (result) {
            result.className = result.className.replace(rClassname, '');
        });
    }

    function reset() {
        GM_setValue('q', '[]');

        JSL('a[href*="?exclude"]').each(function (link) {
            link.href = link.href.replace('?exclude', '');
        });

        JSL('#exclude_box').value('');

        showResults();
    }

    function doContinuation() {
        var q = JSON.parse( GM_getValue('q', '[]') ).join(',');

        if (q !== '') {
            JSL('#exclude_box').value(q);
            doExclusion();
        }
    }

    // Make sure the page is not in a frame
    if (window.frameElement || window.self !== window.top || !search_box.exists || !submit.exists) { return; }

    // add a style so we can easily hide and unhide results
    JSL.addStyle('.excludeHide { display: none !important; }');

    submit.after('div', {style : 'display: block; padding: 2px;'}, [
        JSL.create('input', {type : 'text', id : 'exclude_box', class : 'inputbox', style : 'color: #6A0000; font-family: sans-serif, verdana, arial; font-size: 10pt; font-weight: bold;'}),
        JSL.create('input', {type : 'button', id : 'exclude_button', value : 'Exclude', class : 'submitbutton'}),
        JSL.create('input', {type : 'button', id : 'excludeReset_button', value : 'Reset', class : 'submitbutton'}),
        JSL.create('span', {style : 'font-style: italic; font-size: 10pt; font-family: sans-serif, verdana, arial;'}, [
            JSL.create('text', '<- (insert excludes here, separated by commas) (asterisk wildcards work)')
        ])
    ]);

    // add a little space to the right of submit buttons
    JSL.addStyle('.submitbutton { margin-right: 6px; }');

    // do exclusion if Enter was pressed
    JSL('#exclude_box').addEvent('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            doExclusion();
        }
    });

    // do exclusion if button was clicked
    JSL('#exclude_button').addEvent('click', doExclusion);

    // show all results if Reset button is clicked
    JSL('#excludeReset_button').addEvent('click', reset);

    // continue exclusion from previous page if "Next" or "Previous" was clicked there
    if (navLinks.exists && window.location.href.indexOf('?exclude') !== -1) {
        navLinks.each(function (link) {
            link.href += '?exclude';
        });

        doContinuation();
    }
});