// ==UserScript==
// @name        iks: virtonomica virt
// @namespace   iks-virtonomica
// @description Замена $ на перечеркнутое V
// @include     http*://*virtonomic*.*/*
// @exclude     http*://*virtonomic*.*/*/main/company/view/*/unit_list/*
// @exclude     http*://*virtonomic*.*/*/window/unit/equipment/*
// @exclude     http*://*virtonomic*.*/*/forum/*
// @version     1.10
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8686/iks%3A%20virtonomica%20virt.user.js
// @updateURL https://update.greasyfork.org/scripts/8686/iks%3A%20virtonomica%20virt.meta.js
// ==/UserScript==

var run = function() {
    var arr = ['span', 'div', 'b', 'p', 'td'];
    for(var i in arr) {
        $(arr[i]).each(function() {
            var str = $(this).html();
            if( str.indexOf('$') + 1 ) {
                if( str.match(/\$/g).length == 1 && str.indexOf('td') == -1 ) {
//                    var s = str.replace(/\$/g, '')+'&nbsp;<strike>V</strike>';
                    var s = str.replace(/\$/g, '&nbsp;<strike>V</strike>');
                    $(this).html( s );
                }
            }
        });
    }
}

window.onload = function()
{
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}