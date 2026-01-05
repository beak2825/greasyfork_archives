// ==UserScript==
// @name           SL-login
// @name:ru        СЛ-логин
// @namespace      Reshpekt Fund Russia
// @author         Reshpekt Fund Russia
// @description    Shows real login next to the name (twitter style)
// @description:ru Отображает реальный логин справа от виртуального имени (twitter-style)
// @version        0.3
// @include        http://smart-lab.ru/*
// @include        https://smart-lab.ru/*
// @exclude        http://smart-lab.ru/uploads/*
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/8534/SL-login.user.js
// @updateURL https://update.greasyfork.org/scripts/8534/SL-login.meta.js
// ==/UserScript==

(function () {

function F(x, y) {
    var p = document.querySelectorAll(x),
        s;
    if (p.length) {
        for (var i = 0; i < p.length; ++i) {
            s = p[i].querySelectorAll(y);
            if(s && s.length) {
                s = s[s.length - 1];
                D(s);
            }
        }
    }
}

function D(s) {
    if(!s) return;
    var h = document.createElement('span'),
        t = s.href.split(s.href.indexOf('/profile/') != -1 ? '/profile/' : '/my/');
    if (t && t[1]) {
        h.textContent    = ' @' + t[1].replace('/blog/all/', '').replace('/', '');
        h.style.cssText  = 'color:#999;font-weight:normal;cursor:default';
        h.style.position = window.getComputedStyle(s, null)
           .getPropertyValue('position') || 'inherit';
        h.style.top      = (parseFloat(window.getComputedStyle(s, null)
           .getPropertyValue('top')) + 'px')    || 'auto';
        h.style.right    = (parseFloat(window.getComputedStyle(s, null)
           .getPropertyValue('right')) + 'px')  || 'auto';
        h.style.bottom   = (parseFloat(window.getComputedStyle(s, null)
           .getPropertyValue('bottom')) + 'px') || 'auto';
        h.style.left     = (parseFloat(window.getComputedStyle(s, null)
           .getPropertyValue('left')) + 'px')   || 'auto';
        s.parentNode.insertBefore(h, s.nextSibling);
    }
}

var t = document.querySelector('div.comments');

if (t) {
        var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (var i=0; i<mutation.addedNodes.length; i++){
                if (mutation.addedNodes[i].nodeType == 1 &&
                    mutation.addedNodes[i].className.indexOf('comment ') === 0) {
                        D(mutation.addedNodes[i].querySelector('a.author'));
                }
            }
        });
    });
    observer.observe(t, {childList: true, subtree: true,});
}

//F('div.inside', 'a.user'); //все блоги и главная, если нужно, то раскомментируйте строку
F('div.info', 'a.author'); //комментарии
F('div.vote_user', 'a.user'); //кто лайкнул
F('td.user', 'a.trader_other, a.trader_optimist, a.trader_pessimist'); //кто лайкнул коммент
F('li.author', 'a.trader_other, a.trader_optimist, a.trader_pessimist'); //автор блога

})();