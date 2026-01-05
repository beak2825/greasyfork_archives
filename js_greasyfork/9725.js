// ==UserScript==
// @name        HS Paywall Remover
// @namespace   HS.paywall.remover
// @description Removes HS paywall
// @author      Martti Natunen
// @include     http://www.hs.fi
// @include     http://www.hs.fi/*
// @include     https://www.hs.fi/*
// @include     https://www.hs.fi
// @include     https://*.hs.fi
// @include     https://*.hs.fi/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @version     1.6
// @license     MIT
// @grant       metadata
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/9725/HS%20Paywall%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/9725/HS%20Paywall%20Remover.meta.js
// ==/UserScript==

$(document).ready(function(){
    function GM_main () {
        window.onunload = function(){
            window.hs = null; localStorage.clear = Storage.prototype.clear;
            localStorage.clear();
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        };
    }
    
    // From http://stackoverflow.com/a/13734859
    addJS_Node (null, null, GM_main);

    function addJS_Node (text, s_URL, funcToRun, runOnLoad)
    {
        var D = document;
        var scriptNode = D.createElement ('script');
        
        if (runOnLoad)
            scriptNode.addEventListener ("load", runOnLoad, false);
        
        scriptNode.type = "text/javascript";
        
        if (text)
            scriptNode.textContent = text;
        
        if (s_URL)
            scriptNode.src = s_URL;
        
        if (funcToRun)
            scriptNode.textContent = '(' + funcToRun.toString() + ')()';

        var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        
        targ.appendChild (scriptNode);
    }
    
    $('body').append('<div style="position:fixed;bottom:7px;right:7px;z-index:99999;color:#27AE60;" href="#">Done</div>');
});