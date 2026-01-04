// ==UserScript==
// @name         aahMyEyes (slampisko's fork)
// @namespace    https://slampisko.github.io
// @version      0.1
// @description  Page Color Invertor, good for reading light background pages at night. This forked version takes into account the user's dark mode preference.
// @author       slampisko (forked from Koray K.)
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559249/aahMyEyes%20%28slampisko%27s%20fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559249/aahMyEyes%20%28slampisko%27s%20fork%29.meta.js
// ==/UserScript==

(function() {

    const isDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }


    var aahMyEyes = getCookie("aahMyEyes");

    function saveMyEyes(){

        var style = document.createElement('style');
        style.id="aahMyEyes";

        style.innerHTML =
            'html {' +
            '    filter: hue-rotate(180deg) invert(1);' +
            '    background: white;' +
            '}' +
            'video, img {' +
            '    filter: invert(1) hue-rotate(-180deg);' +
            '}';
        var ref = document.querySelector('script');
        ref.parentNode.insertBefore(style, ref);

        setCookie("aahMyEyes",true);

    }

    function eyesToggle(){
        if(!getCookie("aahMyEyes")){
            saveMyEyes();
        }else{
            setCookie("aahMyEyes",false)
            document.getElementById('aahMyEyes').remove()
        }
    }

    function appendToggle(){
        var toggle = document.createElement('a')
        toggle.id="aahMyEyesToggle";
        toggle.style = 'width:25px;height:25px;background:transparent;position:fixed;bottom:15px;right:15px;z-index:99;border-radius: 50%; box-shadow:rgb(0 4 216) 6px 4px 0px 0px;opacity:0.35';
        toggle.addEventListener('click',eyesToggle);
        toggle.title="Aah My Eyes!"
        document.body.append(toggle);
    }

    if(isDark){
        if (aahMyEyes){
            saveMyEyes();
        }
        appendToggle();
    }

    window.matchMedia('(prefers-color-scheme: dark)').addListener(function (e) {
        if (e.matches && aahMyEyes) {
            if (aahMyEyes) {
                saveMyEyes();
            }
            appendToggle();
        } else {
            document.getElementById('aahMyEyes').remove()
            document.getElementById('aahMyEyesToggle').remove()
        }
    });
})();
