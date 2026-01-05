// ==UserScript==
// @name           plugLoader
// @namespace      FirstZero
// @description    Autorun plugCubed on plug.dj and add a custom mention sound.
// @author         TAT (plugcubed) + Docpify (Custom mention) + Unknown for original custom mention script.
// @include        https://plug.dj/*
// @grant          none
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/8729/plugLoader.user.js
// @updateURL https://update.greasyfork.org/scripts/8729/plugLoader.meta.js
// ==/UserScript==

var a = function() {
    var a = {
        b: function() {
            if (typeof API !== 'undefined' && API.enabled)
                this.c();
            else
                setTimeout(function() { a.b(); }, 100);
        },
        c: function() {
            //var mp3 = "https://i.animemusic.me/funyaah.mp3"; // change the URL of the mp3 here (MUST be https link or do the following in your browser
            //go to about:config (put that in the url bar) then find -> security.mixed_content.block_active_content and set it as false.)
            //$.getScript('https://plug.runsafe.no/beta/freshy.js');
            $.getScript('https://plugmixer.sunwj.com/local');
            $.getScript('https://code.radiant.dj/rs.min.js');
//uncomment this if you want to use mpv as flash replacement on plug (requires mozplugger + https://gist.githubusercontent.com/FirstZero/a7361b7a56912349ddc5/raw/):
//          $.getScript('https://rawgit.com/Epictek/3bbfb670f20a6f015366/raw/3ec6f33f9accd2e11649c7f8b93de7c72d7a04a0/plugmpv.js');
        }
    };
    a.b();
};
var b = document.createElement('script');
b.textContent = '(' + a.toString() + ')();';
document.head.appendChild(b);
