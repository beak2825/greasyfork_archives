// ==UserScript==
// @name        WaniKani Study Config
// @namespace   wkstudycfg
// @version     1.0.3
// @description Provides website settings for easier studying.
// @author      Robin Findley
// @copyright   2014+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @include     http://www.wanikani.com/level/*
// @include     https://www.wanikani.com/level/*
// @include     http://www.wanikani.com/radicals*
// @include     https://www.wanikani.com/radicals*
// @include     http://www.wanikani.com/kanji*
// @include     https://www.wanikani.com/kanji*
// @include     http://www.wanikani.com/vocabulary*
// @include     https://www.wanikani.com/vocabulary*
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/5544/WaniKani%20Study%20Config.user.js
// @updateURL https://update.greasyfork.org/scripts/5544/WaniKani%20Study%20Config.meta.js
// ==/UserScript==

//==[ History ]======================================================
// 1.0.3 - Remove need for jquery.
// 1.0.2 - Fix Firefox sandbox issue by @requiring jquery.
// 1.0.1 - Fix @includes to add some missed pages.
// 1.0.0 - Initial release.
//===================================================================

//-------------------------------------------------------------------
// Global data container and initialization.
//-------------------------------------------------------------------
var wksc = {};
wksc.criteria = {};
wksc.criteria.unlocked_first = true;

//-------------------------------------------------------------------
// Vocabulary sort comparison.
//-------------------------------------------------------------------
function wk_vocab_compare(a, b) {
    var a_text, b_text, a_lock, b_lock;

    a_text = a.querySelector('.character').innerHTML;
    b_text = b.querySelector('.character').innerHTML;
    
    // If 'unlocked_first' option is selected, push locked items to the end of the list.
    if (wksc.criteria.unlocked_first == true) {
        a_lock = (a.className.match(/\blocked\b/)!=null);
        b_lock = (b.className.match(/\blocked\b/)!=null);
        if (!a_lock && b_lock) {
            return -1;
        }
        if (a_lock && !b_lock) {
            return 1;
        }
    }
    
    if (a_text < b_text) {
        return -1;
    }
    if (a_text > b_text) {
        return 1;
    }
    return 0;
}

//-------------------------------------------------------------------
// Sort groups vocabulary.
//-------------------------------------------------------------------
function sort_vocab()
{
	var vocab_groups, group, grp_cnt, grp_idx, words, word_cnt, word_idx;
    
    vocab_groups = document.querySelectorAll('.multi-character-grid');

	grp_cnt = vocab_groups.length;
	for (grp_idx = 0; grp_idx < grp_cnt; grp_idx++)
	{
		group = vocab_groups[grp_idx];
        if (group.querySelector('li[id|=vocabulary]')==undefined) {
            continue;
        }

		words = [];
		word_cnt = group.childElementCount;
        for (word_idx = 0; word_idx < word_cnt; word_idx++) {
			words.push(group.children[word_idx]);
        }

		words.sort(wk_vocab_compare);

        for (word_idx = 0; word_idx < word_cnt; word_idx++) {
			group.appendChild(words[word_idx]);
        }
	}
}

//-------------------------------------------------------------------
// Add CSS styles to the document.
//-------------------------------------------------------------------
function add_styles() {
    GM_addStyle('.wksc_hide .character-item ul {opacity:0} .wksc_hide .character-item:hover ul {opacity:1.0}');
}

//-------------------------------------------------------------------
// Hide or unhide radicals, kanji, and vocabulary meaning and pronunciation.
//-------------------------------------------------------------------
function set_visibility(hidden) {
	var elems, cnt, idx;
	elems = document.querySelectorAll('.single-character-grid, .multi-character-grid');
	cnt = elems.length;
    for (idx=0; idx<cnt; idx++) {
        if (hidden) {
            elems[idx].className += ' wksc_hide';
        } else {
            elems[idx].className = elems[idx].className.replace(/(^|\s+)wksc_hide(\s+|$)/g, ' ');
        }
    }
}

//-------------------------------------------------------------------
// Check that all localStorage items are present and valid.  Assign defaults as needed.
//-------------------------------------------------------------------
function check_storage() {
	wksc.hide_info = Number(localStorage.getItem("wksc_hide") || 1);
    if (!(wksc.hide_info >= 0  && wksc.hide_info <= 1)) {
        wksc.hide_info = 1;
        localStorage.setItem("wksc_hide", wksc.hide_info);
    }
}

//-------------------------------------------------------------------
// Set up GreaseMonkey menu commands.
//-------------------------------------------------------------------
function GMsetup() {
	if (GM_registerMenuCommand) {
        GM_registerMenuCommand('WaniKani Study: Hide info until hover', function() {
            wksc.hide_info++;
            wksc.hide_info %= 2;
            localStorage.setItem("wksc_hide", wksc.hide_info);
            set_visibility(wksc.hide_info);
        });
    }
}

//-------------------------------------------------------------------
// main()
//-------------------------------------------------------------------
function main() {
    check_storage();
    GMsetup();
	add_styles();
    sort_vocab();
    set_visibility(wksc.hide_info);
}

// Run main upon load.
window.addEventListener("load", main, false);
