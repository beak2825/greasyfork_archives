// ==UserScript==
// @name           SL-vips
// @name:ru        СЛ-випы
// @namespace      Reshpekt Fund Russia
// author          Reshpekt Fund Russia
// @description    Highlights VIP' comments and posts
// @description:ru Подсвечивает комментарии и посты ваших ВИП-ов
// @include        http://smart-lab.ru/*
// @include        https://smart-lab.ru/*
// @exclude        http://smart-lab.ru/uploads/*
// @exclude        http://smart-lab.ru/my/*
// @version        0.6
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/9267/SL-vips.user.js
// @updateURL https://update.greasyfork.org/scripts/9267/SL-vips.meta.js
// ==/UserScript==

(function () {

function P(v, d, m, p) {
    GM_registerMenuCommand(m, function () {
        var val = prompt(p, GM_getValue(v, d));
        if (val !== null) {
            val = val.replace(/^\s*|\s*$/g, '').replace(/^,*|,*$/g, '');
            GM_setValue(v, val);
            location.reload();
        }
    });
}

P('SL-vips-style',
    '1',
    'СЛ-випы - настройка стиля (для комментариев)',
    'Стиль, введите число:\r\n\r\n' +
    '1 - красная рамка (по умолчанию)\r\n' +
    '2 - красная рамка и красный шрифт\r\n' +
    '3 - красным всё (вырвиглазно!)'
);

P('SL-vips-style-2',
    '1',
    'СЛ-випы - настройка стиля (для ленты)',
    'Стиль, введите число:\r\n\r\n' +
    '1 - красный шрифт (по умолчанию)\r\n' +
    '2 - красным всё (вырвиглазно!)'
);

P('SL-vips-names',
    'RomanAndreev, dr-mart',
    'СЛ-випы - список (для комментариев)',
    'Введите реальные имена через запятую, регистр и пробелы не важны. ' +
    'Реальное имя (логин) видно, если навести мышь на аватарку, например, ' +
    'в ссылке http://smart-lab.ru/profile/Reshpekt/ логином будет Reshpekt.\r\n\r\n'
);

P('SL-vips-names-2',
    'RomanAndreev, dr-mart',
    'СЛ-випы - список (для ленты)',
    'Введите реальные имена через запятую, регистр и пробелы не важны. ' +
    'Реальное имя (логин) видно, если навести мышь на аватарку, например, ' +
    'в ссылке http://smart-lab.ru/profile/Reshpekt/ логином будет Reshpekt.\r\n\r\n'
);

var key  = GM_getValue('SL-vips-style')   || 1,
    key2 = GM_getValue('SL-vips-style-2') || 1,
    nam  = GM_getValue('SL-vips-names')   || '',
    nam2 = GM_getValue('SL-vips-names-2') || '';

nam  = nam.split(',');
nam2 = nam2.split(',');

var s1 = 'border:1px solid #9C3636 !important;',
    s2 = 'color:#9C3636 !important;border:1px solid #9C3636 !important;',
    s3 = 'background-color: #9C3636 !important;color:#e3e3e3 !important;border:1px solid #9C3636;',
    s4 = 'color: #9C3636 !important;',
    s5 = 'background-color:#9C3636 !important;color:#e3e3e3 !important;padding:0 2px 2px 2px;';

function F(x, y) {
    var p = document.querySelectorAll(x),
        s,
        a,
        t;
    if (!p.length) return;
    for (var i = 0; i < p.length; i++) {
        if (x == 'div.inside') {
            t = p[i].querySelector('a.paid') || p[i].querySelector('a.paid_blog') ||
                p[i].querySelector('a.status');
            if (t) {
                t.className = '';
            }
        }
        s = p[i].querySelectorAll(y);
        if (s && s.length) {
            a = s[s.length - 1];
            D(a, p[i], ((x == 'div.info') ? 1 : 2));
        }
    }
}

function D(a, p, k) {
    if (!a) return;
    var t = a.href.split('/profile/'),
        s;
    if (t && t[1]) {
        if (k == 2) nam = nam2;
        for (var i = 0; i < nam.length; i++) {
            if (t[1].replace('/', '').toLowerCase() == nam[i].trim().toLowerCase()) {
                if (k == 1) {
                    if (key == 1) {
                        p.parentNode.querySelector('.text').style.cssText = s1;
                    }
                    if (key == 2) {
                        p.parentNode.querySelector('.text').style.cssText = s2;
                    }
                    if (key == 3) {
                        p.parentNode.querySelector('.text').style.cssText = s3;
                    }
                }
                if (k == 2) {
                    if (key2 == 1) {
                        p.lastChild.style.cssText = s4;
                    }
                    if (key2 == 2) {
                        p.lastChild.style.cssText = s5;
                    }
                }
            }
        }
    }
}

var t = document.querySelector('div.comments');
  
if (t) {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].nodeType  == 1 &&
                        mutation.addedNodes[i].className.indexOf('comment ') === 0) {
                            D(mutation.addedNodes[i].querySelector('a.author'),
                              mutation.addedNodes[i].querySelector('div.info'), 1);
                    }
                }
            });
        });
        observer.observe(document.querySelector('div.comments'), {childList: true, subtree: true});
}

F('div.info', 'a.author'); //комментарии
F('div.inside', 'a.user'); //лента

})();