// ==UserScript==
// @name        www.serieturche.eu
// @namespace   https://github.com/GavinBrelstaff
// @match       https://www.serieturche.eu/*
// @grant       none
// @version     1.0
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @description 03/11/2025, 15:33:16
// @downloadURL https://update.greasyfork.org/scripts/554646/wwwserieturcheeu.user.js
// @updateURL https://update.greasyfork.org/scripts/554646/wwwserieturcheeu.meta.js
// ==/UserScript==

// https://stackoverflow.com/a/76592599



window.count=0;

new MutationObserver(async (mutations, observer) => {
    const els = mutations
        .flatMap(e => [...e.addedNodes])
        .filter(e => e.tagName == 'SCRIPT')

    for( el of els )
    {
        window.count++;
        var safe = false;
        var str = '';
        if( el.src )
        {
            safe = ( !(el.hasAttribute('async')) &&
                       el.src.startsWith('https://www.serieturche.eu/wp-') )
            str = el.src;
        }
        else // inline code
        {
            str  = el.innerHTML.substring(0,40).replace(/\s*/g,'');
            safe = str.startsWith('(function($){$(document)')
                || str.startsWith('(vartimeout_result')
            ; // examine at script code
        }
        if( ! safe )
        {
           el.remove(); // kill script
           console.log( window.count + 'UNSAFE: ' + str );
        }
        else
           console.log( window.count + '  SAFE: ' + str );
    }

}).observe(document, {
    childList: true,
    subtree: true,
})


