// ==UserScript==
// @name         Enable Selection Mode
// @author       phibao37
// @namespace    http://localhost/Tampermonkey/
// @description  Reenable text selection in some website
// @version      1.51
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @noframes
// @include      *phununet.com/*
// @include      *wattpad.vn/*
// @copyright    2014+, phibao37
// @downloadURL https://update.greasyfork.org/scripts/6913/Enable%20Selection%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/6913/Enable%20Selection%20Mode.meta.js
// ==/UserScript==

(function (window) {
    var handle = function ($) {
        var enableSelectCss = function (element) {
            element.style.msUserSelect = 'text';
            element.style.MozUserSelect = 'text';
            element.style.webkitUserSelect = 'text';
            element.style.userSelect = 'text';
            element.unselectable = false;
        }
        var origin = document.location.origin
                .replace(new RegExp(document.location.protocol, "g"), "")
                .replace(/\//g, "")
                .replace(/www\./g, "");
        var body = document.body;

        //Global enable
        document.oncontextmenu = null;
        enableSelectCss(body);
        $(document).unbind('contextmenu');

        switch (origin) {
            case "phununet.com":
                var content = document.getElementsByClassName('wiki_text_detail')[0];
                if (!content) break;

                enableSelectCss(content);
                $(content).unbind();
                break;
            case "wattpad.vn":
                
        }
    }

    if (!window.$) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//code.jquery.com/jquery-1.11.1.min.js';
        script.onload = function () {
            $(handle);
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    } else
        $(handle);
})(document.defaultView);