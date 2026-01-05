
// ==UserScript==
// @name        Gaia Userstore Pass Filler
// @namespace   http://userscripts.org/users/XXXXX
// @description Fill password when selling on gaia
// @include     http://www.gaiaonline.com/marketplace/mystore/showinventory/*
// @include     http://www.gaiaonline.com/giftgiving/*
// @include     http://www.gaiaonline.com/marketplace/userstore/*/buy/?id=*
// @grant       none
// @version 0.0.1.20150429122535
// @downloadURL https://update.greasyfork.org/scripts/8771/Gaia%20Userstore%20Pass%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/8771/Gaia%20Userstore%20Pass%20Filler.meta.js
// ==/UserScript==
function passfill(){
        var field=document.evaluate('.//input[@type="password"]',document,null,9,null).singleNodeValue;
        if(field){
                if(field.value.length==0)
                        field.value='Augustin13.';// Ceejay likes girls with big vaginas
        }
        setTimeout(passfill,100);// probes page for pass field every 0.100 seconds
}
passfill();
 