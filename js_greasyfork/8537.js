// ==UserScript==
// @name           SL-profile
// @name:ru        СЛ-профайл
// @namespace      Reshpekt Fund Russia
// @author         Reshpekt Fund Russia
// @description    Shows the profile
// @description:ru Отображает профайл пользователя (из базы профайлов) при наведении на его имя
// @version        0.1
// @include        http://smart-lab.ru/*
// @include        https://smart-lab.ru/*
// @exclude        http://smart-lab.ru/uploads/*
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/8537/SL-profile.user.js
// @updateURL https://update.greasyfork.org/scripts/8537/SL-profile.meta.js
// ==/UserScript==

(function () {

  /* формат записи в три столбца: 'логин | имя | любой текст', удобнее по алфавиту
     строка должна быть в одинарных кавычках, все строки через запятую, пробелы любые
     после каждой строки обязательно! запятая (иначе вылетит ошибка) кроме последней
     в тексте нельзя использовать пайп (вертикальную черту) и одинарные кавычки
     периодически базу можно сохранять в текстовый файл на случай сбоя Firefox
  */
    var n = [

        'AGorchakov       | А.Г.                        | Александр Горчаков, системщик, на рынке с 1997г., создатель сайта howtotrade.ru, управляющий активами ИК Спектр-инвест, участвовал в ЛЧИ, светлая голова',
        'Allirog          | Аллирог                     | Илья Коровин, 1974г.р., на рынке с 1994г. (ваучеры, ГКО, форекс), частный трейдер с 2002г., активный участник форума на mfd.ru, преподаватель авторских курсов "Торговля временем" и "Прикрытый интрадей"',
        'Bull             | Bull                        | Кумир Васи, иркутский магнат с титановыми тестикулами, победитель ЛЧИ-2014, сделал руками 57 млн. из 1.3 млн. (4450%)',
        'Endeavour        | Endeavour                   | Вадим Писчиков, с 2008г. глава фонда Algebra Investments, в управлении 30 mio USD, до 2008г. продавал инвестпродукты в Ситибанке и Allianz Investments, окончил юрфак универа в Омске и экономфак МГУ, на рынке с начала 2000-х, на ЛЧИ-2014 показал самый большой счёт из списка смартлаба, но результат неудачный, пишет редко, знает много, упор на global macro...',
        'flipper          | flipper                     | Григорий Исаев, 1981г.р., в 2004г. закончил МФТИ, с 2003г. маркетмейкер в Металлинвестбанке, с 2005г. маркетмейкер в Тройке, глава фьючерсного деска, входил в комитет по срочному рынку РТС и в жюри ЛЧИ, с 2013г. частник (фонд), пишет под ником Григорий на форуме РТС (сейчас Мосбиржа), в ЖЖ - true-flipper',
        'LaraM            | LaraM/ЛарисаМорозова/       | Лариса Морозова, на рынке с 2008 г., специализируется на дивидендных тикерах, подробно их анализирует в своём блоге, Мисс Дивиденд',
        'mirus_lana       | mirus_lana                  | Светлана Орловская, сотрудник NinjaTrader Brokerage (в прошлом Mirus Futures), живёт в Чикаго, родилась и выросла в Новосибирске, преподавала в Государственной Академии Народного Хозяйства. В США получила степень магистра (MS) в финансах и финансовых рынках в Stuart School of Business при частном университете Illinois Institute of Technology и 7 лет проработала финансовым советником в AXA Advisors, LLC, в 2009 году воспользовалась приглашением от Mirus Futures возглавить их русскоязычный отдел. Обладатель брокерских лицензий Series 7, Series 63, Series 3. Зарегистрированный брокер Национальной Ассоциации Фьючерсов (NFA ), NFA ID 0414089.',
        'mumitroll        | Андрей Беритц               | Андрей Беритц, скальпер, основатель Псковской Фондовой Компании, основатель соцсети tradetrade.ru, на рынке с начала 00-х, ЛЧИ-2003 - 2-ое место, ЛЧИ-2007 - 1-ое место среди миллионеров, преподаёт',
        'option-systems   | Александр Шадрин            | Александр Шадрин, 1981г.р., частный инвестор, работает в страховой компании в Питере, ЧСД УК Арсагера, апологет инвестиций',
        'Reshpekt         | Reshpekt Fund Russia        | Я б загулял с чухонкой, съездил бы в Ленинград, выпил, а после вытер Невский собой прешпект, в Летнем саду Юпитер мне б оказал решпект',
        'RomanAndreev     | RomanAndreev                | Роман Андреев - системщик, глава секты добра на Смартлабе, модератор, 1975г.р., с 1997 работал в ЦентрИнвестСекьюритис (скупка акций, пифы), затем в KFS Group (управление активами, нач. департамента, лысая светлая голова, умница... ;-)',
        'student_vrt      | Александр Бутманов          | Александр Бутманов, управляющий партнер и CEO DrеamTеam Invеstmеnts',
        'wmforts          | Гусев Михаил(debtUM)        | Михаил Гусев, дядя Миша, опционщик, частный трейдер и управляющий'

    ];

function F(x, y) {
    var p = document.querySelectorAll(x),
        s;
    if(p.length) {
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
    var t = s.href.split(s.href.indexOf('/profile/') != -1 ? '/profile/' : '/my/'), m;
    if (t && t[1]) {
        s.parentNode.title = 'нет данных';
        for (i = 0; i < n.length; ++i) {
            m = n[i].split('|');
            if (t[1].replace('/blog/all/', '').replace('/', '').toLowerCase() ==
                m[0].trim().toLowerCase()) {
                s.parentNode.title = m[2].trim();
            }
        }
    }
}

var t = document.querySelector('.comments');

if (t) {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (var i=0; i<mutation.addedNodes.length; i++){
                if (mutation.addedNodes[i].nodeType == 1 &&
                    mutation.addedNodes[i].className == 'comment') {
                        D(mutation.addedNodes[i].querySelector('a.author'));
                }
            }
        });
    });
    observer.observe(t, {childList: true, subtree: true,});
}


F('div.info', 'a.author'); //комментарии
F('div.inside', 'a.user'); //все блоги и главная
F('div.vote_user', 'a.user'); //кто лайкнул
F('td.user', 'a.trader_other, a.trader_optimist, a.trader_pessimist'); //кто лайкнул коммент
F('li.author','a.trader_other, a.trader_optimist, a.trader_pessimist'); //автор блога
F('td.name', 'a.author'); //почта/личка

})();