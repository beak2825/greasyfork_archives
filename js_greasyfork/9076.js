// ==UserScript==
// @name           SL-blacklist
// @name:ru        СЛ-блэклист
// @namespace      Reshpekt Fund Russia
// author          Reshpekt Fund Russia
// @description    Delete negodyaevs' posts and comments 
// @description:ru Удаляет посты и комментарии всяких вредных козявок
// @include        http://smart-lab.ru/*
// @include        https://smart-lab.ru/*
// @exclude        http://smart-lab.ru/uploads/*
// @version        0.6
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/9076/SL-blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/9076/SL-blacklist.meta.js
// ==/UserScript==

(function () {

// текст-заглушка на замену
var h = '<span style="color:#808080;font-weight:normal">[X]</span>';

function P(v, d, m, p) {
    GM_registerMenuCommand(m, function () {
        var val = prompt(p, GM_getValue(v, d));
        val = val.replace(/^\s*|\s*$|/g, '').replace(/\s+/g, ',').replace(/^,*|,*$/g, '');
        GM_setValue(v, val);
        location.reload();
    });
}

P('SL-blacklist-style',
    '1',
    'СЛ-блэклист - способ удаления',
    'Способ удаления, введите число:\r\n\r\n' +
    '0 - не удалять, но ставить [X] справа от ника\r\n' +
    '1 - заменить текст на [X] (по умолчанию)\r\n' +
    '2 - удалить всё'
);

P('SL-blacklist-names',
    'Putin, Merkel, Obama',
    'СЛ-блэклист - список',
    'Введите реальные имена (логины) через запятую или через пробел, регистр не важен\r\n' +
    'Если список большой и ведётся в excel, то скопируйте в поле ввода столбец целиком\r\n\r\n' +
    '*реальное имя (логин) видно, если навести мышь на имя или аватарку, например, в ссылке\r\n' +
    'http://smart-lab.ru/profile/Reshpekt/ логином будет «Reshpekt», а не «Reshpekt Fund Russia»\r\n\r\n'
);

var key = GM_getValue('SL-blacklist-style') || 1,
    nam = GM_getValue('SL-blacklist-names') || '';

nam = nam.split(',');

function F(x, y) {
    var p = document.querySelectorAll(x),
        s,
        a;
    if (!p.length) return;
    for (var i = 0; i < p.length; i++) {
        s = p[i].querySelectorAll(y);
        if (s && s.length) {
            a = s[s.length - 1];
            D(a, p[i]);
        }
    }
}

function D(a, p) {
    if (!a) return;
    var t = a.href.split('/profile/'),
        s;
    if (t && t[1]) {
        for (var i = 0; i < nam.length; i++) {
            if (t[1].replace('/', '').toLowerCase() == nam[i].trim().toLowerCase()) {
                if (key === '0') {
                    a.innerHTML += '<span style="color:#BD2129"> [X]</span>';
                } else if (key == '1') {
                    if (p.className == 'inside') {
                        s = document.createElement('span');
                        s.innerHTML = h;
                        p.replaceChild(s, p.querySelector('a:last-child'));
                    } else if (p.className == 'info') {
                        p.parentNode.querySelector('.text').innerHTML = h;
                    } else if (p.className == 'action') {
                        p.parentNode.querySelector('.content').innerHTML = h;
                    }
                } else if (key == '2') {
                    p.parentNode.style.display = 'none';
                }
            }
        }
    }
}

if (document.querySelector('div.comments')) {
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].nodeType  == 1 &&
                    mutation.addedNodes[i].className.indexOf('comment ') === 0) {
                        D(mutation.addedNodes[i].querySelector('a.author'),
                          mutation.addedNodes[i].querySelector('div.info'));
                }
            }
        });
    });
    observer.observe(document.querySelector('div.comments'), {childList: true, subtree: true});
}

F('div.info', 'a.author'); //комментарии
F('div.inside', 'a.user'); //список постов и список свежих постов на главной
F('ul.action','a.trader_other, a.trader_optimist, a.trader_pessimist'); //посты на главной

})();