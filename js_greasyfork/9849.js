// ==UserScript==
// @name           SL-struktura
// @name:ru        СЛ-структура
// @namespace      Reshpekt Fund Russia
// author          Reshpekt Fund Russia
// @description    Comments structure
// @description:ru Структурирует комментарии
// @version        0.5
// @include        http://smart-lab.ru/*
// @include        https://smart-lab.ru/*
// @exclude        http://smart-lab.ru/uploads/*
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/9849/SL-struktura.user.js
// @updateURL https://update.greasyfork.org/scripts/9849/SL-struktura.meta.js
// ==/UserScript==

(function () {

function F(x, y) {
    var p = document.querySelector(x),
        s;
        if (!p) return;
    s = p.querySelectorAll(y);
    if (s && s.length) {
        for (var i = 0; i < s.length; ++i) {
            D(s[i]);
        }
    }
}

function D(s) {
    if (!s || !s.id) return;
    var ph = s.querySelector('.goto-comment-parent'),
    sh = 24, //shift (thanks Boo)
    pi,
    pa,
    pp;

    s.p = 0;

    if (ph) {
        pi = ph.querySelector('a').href.split('#comment')[1];
        pa = document.querySelector('#comment_id_' + pi);
        if (pa) {
            pp = +(pa.p);
            if (pp >= 240) pp = 240;
            if (pp >= 96)  sh = 18;
            if (pp >= 168) sh = 12;
            if (pp >= 216) sh = 8;
            if (s.parentNode.className == 'comment-children') {
                s.style.cssText = 'padding-left:' + sh + 'px';
                s.p = sh;
            } else {
                s.style.cssText = 'padding-left:' + (sh + pp) + 'px';
                s.p = sh + pp;
            }
            ph.onmouseover = function () {
                pa.querySelector('.text').style.cssText = 'border:1px solid red'};
            ph.onmouseout = function () {
                pa.querySelector('.text').style.cssText = 'border:1px solid #dddede'};
        }
    }
}

var t = document.querySelector('div.comments');

if (t) {
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].nodeType == 1 &&
                    mutation.addedNodes[i].className.indexOf('comment ') === 0) {
                        D(mutation.addedNodes[i]);
                    }
                }
        });
    });
    observer.observe(t, {childList: true, subtree: true});
}

F('div.comments', 'div.comment');

})();