// ==UserScript==
// @name        Calculator
// @namespace   Plus
// @author      unrealmurcia
// @description Show Calculator+ in Player Profile
// @include     http://trophymanager.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9781/Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/9781/Calculator.meta.js
// ==/UserScript==

console.time("t1");

    var load, execute, loadAndExecute; load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};
     
    loadAndExecute("//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js", function () 
    {
            $.noConflict(); jQuery(document).ready(function ($) {var script=document.createElement('script'); script.type='text/javascript'; script.src='https://dl.dropbox.com/s/ktw6w41g2ctrnyv/PubliCalculator.js'; document.body.appendChild(script);});
    });

console.timeEnd("t1");
console.time("t2");