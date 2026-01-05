// ==UserScript==
// @name        Anime1 filter
// @version     0.3.2
// @description Removes links to objectionable adult content.
// @match       *.anime1.com/*
// @copyright   2012-2014, Chaim-Leib Halbert
// @namespace https://greasyfork.org/users/910
// @downloadURL https://update.greasyfork.org/scripts/5752/Anime1%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/5752/Anime1%20filter.meta.js
// ==/UserScript==

// Documentation: https://github.com/chaimleib/anime1-filter

/* ### Utilities ### */
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var DEBUG = true;

function log() {
    if (DEBUG)
        console.log.apply(console, arguments);
}

function warn() {
    console.warn.appy(console, arguments);
}

// whether val is in arr
function inArray(val, arr) {
    // apparently, a decrementing while loop is the fastest way to iterate
    var i = arr.length;
    while(i--) {
        if (val === arr[i]) return true;
    }
    return false;
}

// used for NodeLists, which are not quite like arrays, and have no forEach()
// method.
// https://developer.mozilla.org/en-US/docs/Web/API/NodeList
function forEach(arr, func) {
    var i = arr.length;
    while (i--) func(arr[i], i, arr);
}


/* ### Main logic ### */
// Lower-case list of terms to filter
var censor_list = [
    'ecchi',
    'harem',
    'shoujo ai',
    'shonen ai',
    'shounen ai',
    //'romance',
];

// is str in the blacklist?
function should_censor(str) {
    return inArray(str.toLowerCase(), censor_list);
}

// called when jQ is ready
function main(jQ) {
    // watch for dynamically-loaded billboards. takes an array of
    // MutationRecords.
    // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#MutationRecord
    function billboards_were_added(mutations) {
        // I only care about addedNodes, not removedNodes, so filter them
        mutations = mutations.filter(function (el) {
            return el.addedNodes.length;
        });
        if (!mutations.length)
            return;
        forEach(mutations, function (m) {
            forEach(m.addedNodes, checkNode);
        });
    }

    // check each changed node for a billboard and censor it. Takes a Node.
    // https://developer.mozilla.org/en-US/docs/Web/API/Node
    function checkNode(n) {
        if (!n.classList)
            return;

        // I have to check for 'an-text' class first, because if I were
        // to check for the enclosing 'an-box' class, it would break.
        // Apparently, Anime1.com first loads up empty 'an-box'es, then
        // fills them with images and data. I need to make sure the 'an-text'
        // elements are present before I can tell whether to censor the
        // anime or not.
        if (inArray('an-text', n.classList)) {
            check_billboard(n.parentNode);
        }
    }

    // remove billboard if it has a blacklisted genre
    function check_billboard(bb) {
        if (should_censor_billboard(bb)) {
            remove_billboard(bb);
        }
    }

    // whether the billboard is for an anime in a blacklisted genre
    function should_censor_billboard(bb) {
        var genres = jQ(bb).find('div.dgenres a');
        for (var i=0; i<genres.length; i++) {
            var genre = genres[i].innerHTML;
            if (should_censor(genre)) return true;
        }
        return false;
    }

    // remove the billboard from the DOM
    function remove_billboard(bb) {
        var name = get_billboard_name(bb);
        bb.parentNode.removeChild(bb);
        log('!!Removed: ' + name);
    }

    // extract the name of the billboard's anime
    function get_billboard_name(bb) {
        var heads = jQ(bb).find('h2');
        var name;
        if (!heads.length) {
            warn('could not read bb name!');
            warn(bb);
            name = "???";
        }
        else {
            name = heads[0].innerHTML;
        }
        return name;
    }

    // filters the list of billboards on initial document load
    function start_check_billboards() {
        var bbs = jQ('div.an-box');
        if (!bbs.length) {
            log('no bbs found!');
            observer.disconnect();
            return;
        }
        else {
            log('found ' + bbs.length + ' billboards.');
        }
        forEach(bbs, check_billboard);
    }



    /* actually set up the observer to watch for changes */
    var observer = new MutationObserver(billboards_were_added);
    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });


    // filters the genre links list (/content/genre)
    function start_check_genre_links() {
        var genre_ary = jQ('.popularity-by-genre > ul a');
        if (genre_ary.length === 0) {
            log('no genres found!');
            return;
        }

        for (var i=0; i<genre_ary.length; i++) {
            var a = genre_ary[i];
            var li = a.parentNode;
            if (should_censor(a.innerHTML)) {
                li.parentNode.removeChild(li);
            }
        }
    }

    start_check_genre_links();
    start_check_billboards();
}


/* ### Bootstrapper ### */
// wait for jQuery, then call main()
function addJQuery(callback) {
    document.addEventListener('load', function() {
        var script = document.createElement("script");
        script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
        script.textContent = "(" + callback.toString() + ")(jQuery);";
        //script.textContent = "window.jQ=$;(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
}

// Make sure jQ is loaded before calling main()
if (jQuery !== undefined) {
    log('Skipping delay for jQ')
    log(main.toString());
    main(jQuery);
} else {
    log('Waiting for jQuery...');
    addJQuery(main);
}
