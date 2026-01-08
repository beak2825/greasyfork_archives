// ==UserScript==
// @name            goofy-banana.com-e
// @run-at          document-start
// @namespace       https://github.com/GavinBrelstaff
// @description     Facilitates access to serieturche.eu
// @description:it  Facilita l'accesso a serieturche.eu
// @match           https://*.com/access/eyJpdiI6I*
// @grant           none
// @version         2.0
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/561545/goofy-bananacom-e.user.js
// @updateURL https://update.greasyfork.org/scripts/561545/goofy-bananacom-e.meta.js
// ==/UserScript==

window.count=0;

new MutationObserver(async (mutations, observer) => {
    const els = mutations
        .flatMap(e => [...e.addedNodes])
        .filter(e => (e.tagName == 'SCRIPT') )

    for( var el of els )
    {
        window.count++;
        var safe = false;
        var str = '';
        if( el.src ) // script src
        {
            safe = ( el.src.includes('jwplayer')  ||
                     el.src.includes('jquery.min.js') ||
                     el.src.includes('js/loader.')
                    )
           str = el.src;
        }
        else // inline code
        {
            str  = el.innerHTML.substring(0,40).replace(/\s*/g,'');
            safe = (
                    str.startsWith('varcdn_root') ||
                    str.startsWith('varbase=') ||
                    str.startsWith('[')
                   )
            ; // examine at script code
            //safe=1
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


