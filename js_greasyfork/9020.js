// ==UserScript==
// @name        Button Up
// @name:       ru
// @namespace   https://greasyfork.org/ru/users/9970-spacecatsch
// @icon        http://www.macwrench.de/images/thumb/d/db/Vorschlag.png/64px-Vorschlag.png
// @description Кнопка вверх
// @include     *
// @version     0.2
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/9020/Button%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/9020/Button%20Up.meta.js
// ==/UserScript==
(function($){
    $.fn.liScrollToTop = function(params){
        return this.each(function(){
            var scrollUp = $(this);
            scrollUp.hide();
            if ($(window).scrollTop() > 0) scrollUp.fadeIn("slow")
            $(window).scroll(function() {
                if ($(window).scrollTop() <= 0) scrollUp.fadeOut("slow")
                else scrollUp.fadeIn("slow")
            });
            scrollUp.click(function() {
                $("html, body").animate({scrollTop: 0}, "slow")
            })
        });
    };
})(jQuery);

/*Инициализация плагина*/
$(function(){
    $('.scrollUp').liScrollToTop();
});

//BTN
var parentElem = document.body.children[0];
var newBTN = document.createElement('div');
newBTN.id = "btn";
newBTN.innerHTML = '<div class="scrollUp" style="margin:0 auto;position:fixed;top:auto;bottom:10px;left:auto;right:50%;border-radius:1px;'+
    'background:transparent;z-index:9999;opacity:0.7;cursor:pointer;padding:1px 5px 3px;text-align:center;">'+
    '<div id="newBTN" style="width:40px;height:40px;text-align:center;background: url(http://www.macwrench.de/images/thumb/d/db/Vorschlag.png/64px-Vorschlag.png);background-size: cover;	background-size: 40px 40px;	background-repeat: no-repeat;"></div></div>';
parentElem.appendChild(newBTN);