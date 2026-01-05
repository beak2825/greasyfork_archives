// Скрипт по переводу IAFD

// ==UserScript==
// @id          iafd.com
// @name        iafd.com RUSSIAN (русская версия)
// @description Русский перевод сайта iafd.com
// @include     http://iafd.com/*
// @include     http://*.iafd.com/*
// @match       http://iafd.com/*
// @match       http://*.iafd.com/*
// @grant       none
// @author      Fedotische
// @version 0.0.1.20150228063750
// @namespace https://greasyfork.org/users/9140
// @downloadURL https://update.greasyfork.org/scripts/8078/iafdcom%20RUSSIAN%20%28%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/8078/iafdcom%20RUSSIAN%20%28%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%29.meta.js
// ==/UserScript==

(function () {

    function findAndReplace(searchText, replacement, searchNode) {
        if (!searchText || typeof replacement === 'undefined') {
            // Throw error here if you want...
            return;
        }
        var regex = typeof searchText === 'string' ? new RegExp(searchText, 'g') : searchText,
            childNodes = (searchNode || document.body).childNodes,
            cnLength = childNodes.length;
       excludes = 'html,head,style,title,link,meta,script,object,iframe';
        while (cnLength--) {
            var currentNode = childNodes[cnLength];
            if (currentNode.nodeType === 1 && (',' + excludes + ',').indexOf(',' + currentNode.nodeName.toLowerCase() + ',') === -1) {
                arguments.callee(searchText, replacement, currentNode);
            }
            if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
                continue;
            }
            var parent = currentNode.parentNode,
                frag = (function(){
                    var html = currentNode.data.replace(regex, replacement),
                        wrap = document.createElement('div'),
                        frag = document.createDocumentFragment();
                    wrap.innerHTML = html;
                    while (wrap.firstChild) {
                        frag.appendChild(wrap.firstChild);
                    }
                    return frag;
                })();
            parent.insertBefore(frag, currentNode);
            parent.removeChild(currentNode);
        }
    }
    function translate() {
        var ts = {
			"Those Born Today":"Они родились сегодня",
			"Search for":"Искать",
			"Title/Person/Review":"Название/Имя/Обзор",
			"Gay Only":"Только голубизна",
			"Reviews":"Обзоры",
			"Movie Titles":"Названия фильмов",
			"Movie Title":"Название фильма",
			"Performer Name":"Исполнитель",
			"Vendor Titles":"Продавцы",
			"UPDATES":"ОБНОВЛЕНИЯ",
			"IAFD RESOURCES":"РЕСУРСЫ IAFD",
			"RSS FEEDS":"RSS НОВОСТИ",
			"comprehensive search results":"подробные результаты поиска",
			"Top 50 Results":"Топ 50 результатов",
			"Release Info":"Инфо релиза",
			"Also Known As":"Также известен как",
			"Reviews:":"Обзоров:",
			"Buy this Movie":"Купить этот фильм",
			"Show Me The Vendors":"Показать продавцов",
			"Performers":"Актёры",
			"Males":"Мужики",
			"Females":"Девки",
			"Directors":"Режисёры",
			"aka:":"также известен как:",
			"Titles:":"Фильмов:",
			"No reviews matched your criteria.":"Не найдено обзоров по Вашему критерию",
			"Do you need some":"Вам нужны",
			"searching tips?":"подсказки по поиску?",
			"personal biography":"персональная биография",
			"Performer AKA":"Также известен как актёр",
			"Director AKA":"Также известен как режисёр",
			"Birthday":"Дата рождения",
			"Astrology":"Знак зодиака",
			"Birthplace":"Место рождения",
			"Years Active as Performer":"Годы активности (актёр)",
			"Years Active as Director":"Годы активности (режисёр)",
			"Ethnicity":"Этническая принадлежность",
			"Nationality/Heritage":"Национальность/Корни",
			"Hair Color":"Цвет волос",
			"Height":"Рост",
			"Weight":"Вес",
			"Tattoos":"Татуировки",
			"Piercings":"Пирсинг",
			"Comments":"Комментарии",
			"Website":"Вебсайт",
			"No data":"Нет данных",
			"No known aliases":"Более никак не известен",
			"Caucasian":"Европеоид",
			"There are no comments for this performer.":"Нет комментариев по этому актёру",
			"Sort By:":"Сортировать по",
			"Do It:":"Выполнить:",
			"Show Me The Movies!":"Покажите мне фильмы",
			"Title":"Название",
			"Distributor":"Дистрибьютор",
			"Search":"Искать",
			"Ascending":"По возрастанию",
			"Descending":"По убыванию",
			"Years Active":"Годы активности",
			"Filter by Year":"Фильтр по годам",
			"Year":"Год",
			"list":"список",
			"Limit to movies made / people active between":"Сделать ограничение между",
			
			
			
			
			
			
			
			
			"IAFD SERVICES":"СЕРВИСЫ IAFD",
        };
        for(var t in ts) {
            findAndReplace(t,ts[t]);
        };
        setTimeout(translate, 1000);
    };

    setTimeout(translate, 1000);

})();