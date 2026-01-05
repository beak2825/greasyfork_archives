// ==UserScript==
// @name            TastyPlug UserScript
// @namespace       https://fungustime.pw/tastyplug
// @description     Automatically runs TastyPlug on plug.dj
// @icon            https://fungustime.pw/tastyplug/icon128.png
// @include         https://plug.dj/*
// @exclude         https://plug.dj/dashboard
// @exclude         https://plug.dj/privacy
// @exclude         https://plug.dj/terms
// @exclude         https://plug.dj/communities
// @author          Olivier Houle (Fungus)
// @version         1.1
// @downloadURL https://update.greasyfork.org/scripts/6468/TastyPlug%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/6468/TastyPlug%20UserScript.meta.js
// ==/UserScript==

/*
    Copyright (c) 2013-2014 by Olivier Houle (Fungus)
    Please do not copy or modify without my permission.
*/

(function(){
    var a = function(){
        if (!document.getElementById('room-loader')) setTimeout(a,200);
        else b();
    },
    b = function(){
        if (document.getElementById('room-loader')) setTimeout(b,200);
        else {
            var c = document.createElement('script');
            c.textContent = "$.getScript('https://fungustime.pw/tastyplug/tastyplug.js');";
            document.head.appendChild(c);
        }
    };
    a();
})();