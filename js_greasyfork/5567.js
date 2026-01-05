// ==UserScript==
// @name           Less by VI
// @namespace      http://userscripts.org/users/23652
// @description    Replaces text on websites. Now supports wildcards in search queries. Won't replace text in certain tags like links and code blocks
// @include        http://www.walmart.com/*
// @include        https://www.walmart.com/*
// @exclude        file://*
// @exclude        http://userscripts.org/*
// @copyright      JoeSimmons
// @version        1.1.1
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @downloadURL https://update.greasyfork.org/scripts/5567/Less%20by%20VI.user.js
// @updateURL https://update.greasyfork.org/scripts/5567/Less%20by%20VI.meta.js
// ==/UserScript==
(function () {
    'use strict';


    /*
        NOTE: 
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */

    var words = {
    ///////////////////////////////////////////////////////


        // Syntax: 'Search word' : 'Replace word',
        // reduced by 6
        'Online' : 'In Stores',
	'\$50\.' : '\$44\.',
	'\$49\.' : '\$43\.',
	'\$48\.' : '\$42\.',
	'\$47\.' : '\$41\.',
	'\$46\.' : '\$40\.',
	'\$45\.' : '\$39\.',
	'\$44\.' : '\$38\.',
	'\$43\.' : '\$37\.',
	'\$42\.' : '\$36\.',
	'\$41\.' : '\$35\.',
	'\$40\.' : '\$34\.',
	'\$39\.' : '\$33\.',
	'\$38\.' : '\$32\.',
	'\$37\.' : '\$31\.',
	'\$36\.' : '\$30\.',
	'\$35\.' : '\$29\.',
	'\$34\.' : '\$28\.',
	'\$33\.' : '\$27\.',
	'\$32\.' : '\$26\.',
	'\$31\.' : '\$25\.',
	'\$30\.' : '\$24\.',
	'\$29\.' : '\$23\.',
	'\$28\.' : '\$22\.',
	'\$27\.' : '\$21\.',
	'\$26\.' : '\$20\.',
	'\$25\.' : '\$19\.',
	'\$24\.' : '\$18\.',
	'\$23\.' : '\$17\.',
	'\$22\.' : '\$16\.',
	'\$21\.' : '\$15\.',
	'\$20\.' : '\$14\.',
	'\$19\.' : '\$13\.',
	'\$18\.' : '\$12\.',
	'\$17\.' : '\$11\.',
	'\$16\.' : '\$10\.',
	'\$15\.' : '\$9\.',
	'\$14\.' : '\$8\.',
	'\$13\.' : '\$7\.',
	'\$12\.' : '\$6\.',
	'\$11\.' : '\$5\.',
	'\$10\.' : '\$4\.',



    ///////////////////////////////////////////////////////
    '':''};











    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
                      // I put an extra empty key/value pair in the object.
                      // so we need to remove it before continuing

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }

}());