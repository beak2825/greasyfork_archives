// ==UserScript==
// @name         Facebook mobile topbar always show
// @namespace    http://www.sfs.it/
// @version      0.1
// @description  Enable m.facebook.com alway display function for top bar on chrome
// @author       agostino.zanutto
// @include      http://m.facebook.com/*
// @include      https://m.facebook.com/*
// @match        http://tampermonkey.net/index.php?version=3.9.202&ext=dhdg&updated=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8807/Facebook%20mobile%20topbar%20always%20show.user.js
// @updateURL https://update.greasyfork.org/scripts/8807/Facebook%20mobile%20topbar%20always%20show.meta.js
// ==/UserScript==

function GM_main () {
    if (window.timedHeaderFixId){
        console.log('FACEBOOK MOBILE FIX ALREADY started on timedHeaderFix:'+window.timedHeaderFixId);
        return;
    }
    window.timedHeaderFixId = 0;
    window.timedHeaderFix = function() {
        var header=window.document.getElementById('header');
        var root=window.document.getElementById('root');
        if (header && root) {
            var marginTop = header.offsetHeight + 2;
            if ( header.style.position != 'fixed' ) {
                header.style.top = '0px';
                header.style.position = 'fixed';
                header.style.borderBottom = '2px gray solid';
            }
            if (root.style.marginTop != (marginTop + 'px')) {
                root.style.marginTop=marginTop + 'px';
            }
        } else {
            setTimeout(window.timedHeaderFix,1000);
        }
    };
    window.addEventListener('load',timedHeaderFix,false);
    window.addEventListener('click',timedHeaderFix,false);
    window.addEventListener('scroll',timedHeaderFix,false);
    window.addEventListener('resize',timedHeaderFix,false);
    window.addEventListener('loadeddata',timedHeaderFix,false);
    window.addEventListener('readystatechange',timedHeaderFix,false);
    console.log('FACEBOOK MOBILE FIX started timedHeaderFix:'+window.timedHeaderFixId+' on interval of 1s');
}

GM_main();
