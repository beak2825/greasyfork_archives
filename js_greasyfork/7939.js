// ==UserScript==
// @name         rm_sof
// @namespace    R458
// @version      0.3
// @description  enter something useful
// @author       zhyan
// @include      http*://*pvs.j*.net/jss-ciat/app/pr-detail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7939/rm_sof.user.js
// @updateURL https://update.greasyfork.org/scripts/7939/rm_sof.meta.js
// ==/UserScript==
/*
$(document).ready(function() {
    function remove_rm (){
        current = $('#softwareVersions')[0];
        cut = current.value.split(',');
        var x =  new Array();
        Psrxd = /[RSXD]$/;
        Pfloat = /^\d+\.\d+$/;
        Pother= /^\d+$/;
        for (i=0, len=cut.length;i<len;i++) {
            if (!Psrxd.test(cut[i]) && !Pother.test(cut[i]) && !Pfloat.test(cut[i])) {
                x.push(cut[i])
            }
        }
        x1 = x.toString();
        current.value = x1;
    }
    x2 = $('#prDetailCancelBtn')[0];
    rm_d = document.createElement("input");
    rm_d.type = "button";
    rm_d.value = "Click me first";
    rm_d.name = 'remove unneeded';
    rm_d.setAttribute("class","button");
    rm_d.style.cssText += "cursor:pointer; background-color: rgb(92, 184, 92)";
    rm_d.style.borderRadius = '10px';
    rm_d.onclick = remove_rm;
    x2.parentNode.insertBefore(rm_d,x2.nextSibling);
})
*/
(function injectJs() {
var scr = document.createElement('script');
scr.type="text/javascript";
scr.src="https://greasyfork.org/scripts/7967-mytest/code/mytest.js";
document.getElementsByTagName('head')[0].appendChild(scr);
//document.body.appendChild(scr);
})()