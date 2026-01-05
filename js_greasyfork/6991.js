// ==UserScript==
// @name            Envato Marketplace CKEditor Support
// @author          Adrian Moerchen
// @homepage        https://github.com/scrobbleme/Envato-CKEditor-Support
// @supportURL      https://github.com/scrobbleme/Envato-CKEditor-Support
// @contributionURL   http://codecanyon.net/user/scrobbleme/portfolio?ref=scrobbleme
// @namespace       scrobble.me
// @date            2014-12-14
// @version         1.1.0
// @include         http://activeden.net*
// @include         http://audiojungle.net*
// @include         http://themeforest.net*
// @include         http://videohive.net*
// @include         http://graphicriver.net*
// @include         http://3docean.net*
// @include         http://codecanyon.net*
// @include         http://photodune.net*
// @grant           none
// @description This is a userscript to add the CKEditor to Envato comment and edit forms.
// @downloadURL https://update.greasyfork.org/scripts/6991/Envato%20Marketplace%20CKEditor%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/6991/Envato%20Marketplace%20CKEditor%20Support.meta.js
// ==/UserScript==

var head = document.getElementsByTagName("head")[0];
var script_to_load = document.createElement('script');

script_to_load.setAttribute('src', location.protocol + '//cdn.ckeditor.com/4.4.6/standard/ckeditor.js');
script_to_load.onload = function () {
    var selector = '#description, #item_comment_content, #thread_message_content, .js-comment-new-reply-field';
    var editors = document.querySelectorAll(selector);
    for (var i = 0; i < editors.length; i++) {
        CKEDITOR.replace(editors[i]);
    }
};
head.appendChild(script_to_load);

style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = "a.cke_button {height: 25px !important; background: transparent !important;}";
head.appendChild(style);