// ==UserScript==
// @name        Yahoo!ニュース自動推移
// @namespace   http://webfile.blog.jp/
// @description Yahoo!ニュースのリンクを自動で推移します。
// @include     http://news.yahoo.co.jp/pickup*
// @version  1.0.0
// @license	http://creativecommons.org/licenses/by-nc/3.0/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5661/Yahoo%21%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E8%87%AA%E5%8B%95%E6%8E%A8%E7%A7%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/5661/Yahoo%21%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E8%87%AA%E5%8B%95%E6%8E%A8%E7%A7%BB.meta.js
// ==/UserScript==

(function(d, func) {
    var check = function() {
        if (typeof unsafeWindow.jQuery == 'undefined') return false;
        func(unsafeWindow.jQuery); return true;
    }
    if (check()) return;
    var s = d.createElement('script');
    s.type = 'text/javascript';
    s.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js';
    d.getElementsByTagName('head')[0].appendChild(s);
    (function() {
        if (check()) return;
        setTimeout(arguments.callee, 100);
    })();
})(document, function($) {
//--Start Script--
    
$(function(){
    var link = $(".newsLink").attr("href");
    location.href = link;
});
    
//--End Script--
})();