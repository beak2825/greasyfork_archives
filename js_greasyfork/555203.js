// ==UserScript==
// @name         4PDA  Blue Dark Theme 1.0.2 (NO FOUC - NO DELAY !!!)
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Тёмная тема для 4PDA с гармоничной цветовой палитрой
// @author       t7ktk6jfm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4pda.to
// @match        https://4pda.to/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555203/4PDA%20%20Blue%20Dark%20Theme%20102%20%28NO%20FOUC%20-%20NO%20DELAY%20%21%21%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555203/4PDA%20%20Blue%20Dark%20Theme%20102%20%28NO%20FOUC%20-%20NO%20DELAY%20%21%21%21%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // весь контент из styles.css (  полная тема с селекторами).
    const themeCSS = ` 
 /* Основной фон страницы */
body {
   background: linear-gradient(101deg, #1a1f2b, #2a2f3b, #1a3b3b) !important;
   background-size: 100% 100% !important;
   color: #b0bec5 !important;
   font-family: Arial, sans-serif !important;
}

/* Фон для постов на узких экранах */
@media (max-width: 1219px) {
   .advanced-area .post {
       background: linear-gradient(45deg, #2a2f3b, #1a1f2b) !important;
   }
}

/* Основные контейнеры */
.borderwrap, .borderwrapm, .container, .product-detail, .block-body, .catend, .copyright {
   background: #1e252f !important;
   border: 1px solid #2a2f3b !important;
}

/* Фон для строк таблицы */
.row1, .row2, td.post1, td.post2, .formsubtitle, .barc {
    background: #252b38 !important;
    color: #b0bec5 !important;
    border: 1px solid #405379 !important;
}

/* Фон для футера */
#gfooter td, .footer-nav, ul.dropdown-menu {
   background: #1a1f2b !important;
}

/* Основной текст */
p, span, .postcolor {
   color: #b0bec5 !important;
   font-size: 16px !important;
}

/* Заголовки */
.block-title, .maintitle, table th, .borderwrap table th, .subtitle, .subtitlediv, .postlinksbar {
   background: linear-gradient(178deg, #1e252f, #2a2f3b) !important;
   color: #ffffff !important;
   font-size: 16px !important;
   font-weight: 500 !important;
   text-shadow: 0 0 3px rgba(255, 255, 255, 0.3) !important;
   padding: 10px 15px !important;
   border-radius: 5px !important;
   border-bottom: 1px solid #3a4f6c !important;
}

/* Ссылки */
a:link, a:visited, .normalname a {
   color: #4fc3f7 !important;
   font-size: 16px !important;
   text-decoration: none !important;
}
a:hover, .normalname a:hover {
   color: #ffca28 !important;
   text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3) !important;
}

/* Кнопки */
.g-btn {
   padding: 11px 22px !important;
   font-size: 14px !important;
   font-weight: 500 !important;
   text-align: center !important;
   text-decoration: none !important;
   border-radius: 4px !important;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
   transition: all 0.2s ease !important;
   cursor: pointer !important;
}

.g-btn.blue {
   background: linear-gradient(3deg, #1e3c67, #4a90e2) !important;
   color: #ffffff !important;
}
.g-btn.blue:hover {
   background: linear-gradient(3deg, #1e3c67, #357abd) !important;
   box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4) !important;
}

.g-btn.red {
   background: linear-gradient(3deg, #1e3c67, #e74c3c) !important;
   color: #ffffff !important;
}
.g-btn.red:hover {
   background: linear-gradient(3deg, #1e3c67, #c0392b) !important;
   box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4) !important;
}

.g-btn.green {
   background: linear-gradient(3deg, #1e3c67, #2ecc71) !important;
   color: #ffffff !important;
}
.g-btn.green:hover {
   background: linear-gradient(3deg, #1e3c67, #27ae60) !important;
   box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4) !important;
}

/* Кнопка "Найти в этой теме" */
.button {
   padding: 6px 10px !important;
   font-size: 14px !important;
   font-weight: 500 !important;
   color: #ffffff !important;
   background: linear-gradient(3deg, #1e3c67, #4a90e2) !important;
   border: none !important;
   border-radius: 4px !important;
   box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3) !important;
   cursor: pointer !important;
   transition: all 0.3s ease !important;
}
.button:hover {
   background: linear-gradient(3deg, #1e3c67, #357abd) !important;
   box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4) !important;
}

/* Поисковая строка */
.searchinput, .input-warn, .input-green, .input-checkbox, input, textarea, select {
   width: 200px !important;
   padding: 6px 12px !important;
   font-size: 14px !important;
   color: #b0bec5 !important;
   background-color: #2a2f3b !important;
   border: 1px solid #3a4f6c !important;
   border-radius: 6px !important;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
   outline: none !important;
   transition: all 0.3s ease !important;
}
.searchinput:focus, input:focus, textarea:focus, select:focus {
   border-color: #4fc3f7 !important;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
   background-color: #2a2f3b !important;
}
.searchinput::placeholder {
   color: #607d8b !important;
   font-style: italic !important;
}

.pagelink-menu,.pagecurrent-wa {
    background: #1b4417 !important;
    border: 1px solid #a8fff5 !important;
    padding: 8px !important;
    appearance: none !important;
 border-radius: 15px !important;
}
div#topicmenu-options{
    border-radius: 15px !important;
    background: #1b4417 !important;
    border: 1px solid #a8fff5 !important;
    padding: 8px !important;
    appearance: none !important;
}

/* Пагинация */
.pagelink a, .pagelinklast a, .pagecurrent a, .minipagelink a, .minipagelinklast a {
   display: inline-block !important;
   padding: 8px 12px !important;
   background-color: #21553d !important;
   color: #4fc3f7 !important;
   border-radius: 4px !important;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
   text-align: center !important;
   cursor: pointer !important;
   transition: all 0.2s ease !important;
   font-size: 14px !important;
}
.pagecurrent > a, .pagecurrent-wa {
   background: #4a90e2 !important;
   color: #ffffff !important;
}

/* Выпадающее меню */
.popupmenu-new {
   background-color: #1e252f !important;
   border-radius: 6px !important;
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4) !important;
   width: 347px !important;
   position: absolute !important;
   z-index: 100 !important;
   padding: 5px 0 !important;
}
.popupmenu-item, .popupmenu-item-last {
   padding: 8px 12px !important;
   font-size: 13px !important;
   color: #b0bec5 !important;
   text-align: left !important;
   border-bottom: 1px solid #2a2f3b !important;
   background-color: #1e252f !important;
}
.popupmenu-item:hover, .popupmenu-item-last:hover {
   background-color: #2a2f3b !important;
   color: #ffca28 !important;
}

/* Меню пользователя */
span#post-member-usercp, a#usermenu-0, a#usermenu-1, a#usermenu-2, a#usermenu-3, a#usermenu-4, a.usermenu, .user_home, div#submenu {
   display: inline-block !important;
   padding: 8px 12px !important;
   background-color: #2a2f3b !important;
   color: #4fc3f7 !important;
   border-radius: 4px !important;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
   text-align: center !important;
   cursor: pointer !important;
   transition: all 0.2s ease !important;
   font-size: 14px !important;
}
 span#post-member-usercp:hover, a.usermenu:hover, .user_home:hover {
   background-color: #4a90e2 !important;
   color: #ffffff !important;
 }

       /* Кнопка "Все" */
.g-btn[href*="all"], .g-btn[data-action="all"] {
    background-color: #21553d !important;
    color: #ffffff !important;
    border: 1px solid #4fc3f7 !important;
    border-radius: 4px !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
    transition: all 0.2s ease !important;
}
.g-btn[href*="all"]:hover, .g-btn[data-action="all"]:hover {
    background-color: #2a6b4a !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4) !important;
}

 /* Убираем лишние элементы */
 #logostrip {
   background: transparent !important;
 }
 #userlinks, #userlinksguest {
    background: #21553d !important;
    border: 1px solid #c2cfdf !important;
    margin: 0px 0 0px 0 !important;
    padding: 0 5px 0 5px !important;
}
.darkrow1 {
    background: #21553d !important;
    color: #3A4F6C !important;
}

a.g-btn.blue.nopad.nowrap {
    position: relative !important;
    left: 770px !important;
}

.post-block.open > .block-title {
     background: #c8964396 !important;
    color: #fff69a !important;
}

.post-block.tbl > * {
    color: #91b0e3  !important;
}

.block-title {
    background: #c896432b !important;
    color: #fff69a !important;
}

.post-block > .block-body {
    background: #191b22  !important;
    color: #fff69a !important;
     font-size: 16px !important;
}

.resized-linked-image {
    margin:  5px !important;
    padding:  15px !important;
    background-color: #334c6e  !important;
    border: 1px solid #2982cc  !important;
    color: #fff69a !important;
}

.post-block.spoil.open > .block-body:after {
    background: #5a4f40  !important;
    outline: solid 2px rgb(62 133 121)  !important;
   padding:  15px   15px !important;
   font-size: 16px !important;
  border-radius: 4px !important;
}


div[id^="ipb-attach-ct-"][id$="-bb"] {
    font-size: 14px !important;
}

td.formbuttonrow {
   background: #143437  !important;
   outline: solid 2px rgb(62 133 121)  !important;
   padding:   8px   15px !important;
   font-size: 16px !important;
  border-radius: 4px !important;
}

.post-edit-reason {
    background: #363d22  !important;
    padding:   8px   15px !important;
    font-size: 16px !important;
    border-radius: 4px !important;
    color: #fbf298;
 border: 2px solid #f6ed95 !important;
}
.maintitle td, .maintitle-text {
    color: #fbf298  !important;
      font-size: 16px !important;
}
.popmenubutton {
    background: #1b4417 !important;
    border: 1px solid #a8fff5 !important;
    padding: 8px !important;
    appearance: none !important;
    border-radius: 15px !important;
}
.borderwrap.read [class*="row"],
.borderwrap.read [class*="post"],
.borderwrap.read td[class*="formbutton"]{
    background-color: #c895191f!important;
    color: #fbf298 !important;
    border: 2px solid #f6ed9566 !important;
    font-size: 16px !important;
}
 .borderwrap.read .row2, .borderwrap.read .post2, .borderwrap.read .post1, .borderwrap.read td.formbuttonrow {
    background-color: #c895191f!important;
    color: #fbf298 !important;
    border: 2px solid #f6ed9566 !important;
    font-size: 16px !important;
 }
 .borderwrap.read td.formbuttonrow {
     background-color: #c895191f!important;
    color: #fbf298 !important;
    border: 2px solid #f6ed9566 !important;
}
.ed-wrap .ed-p-textarea {
     color: #7ad8cf  !important;
    background: #231332  !important;
}

.dipt {
    color: #7ad8cf  !important;
    background: #13322f  !important;
}

.qr-maintitle {
     color: #7ad8cf  !important;
     background: #231332  !important;
}
.ed-wrap .ed-textarea {
	color: #7ad8cf  !important;
     background: #1a1a2a  !important;
	font-size: 17px  !important;
}

.ed-wrap .ed-panel {
	color: #7ad8cf  !important;
     background: #0e392c  !important;
	font-size: 17px  !important;
}
.borderwrap p {
    background: #64581b !important;
    border: 1px solid #f1e156 !important;
}
.borderwrap.read [class*="row"],
        .borderwrap.read [class*="post"],
        .borderwrap.read td[class*="formbutton"],
        .borderwrap.read .row2,
        .borderwrap.read .post2,
        .borderwrap.read .post1,
        .borderwrap.read td.formbuttonrow {
            background-color: #c895191f !important;
            color: #fbf298 !important;
            border: 2px solid #f6ed9566 !important;
            font-size: 16px !important;
        }
        .k45rZtFz0sNF1gYpGKXLz2n4UJ > li {
            border: 1px solid #40e8f0 !important;
            background: #2f1d36 !important;  /* Согласовал с JS */
            color: #ffffff !important;
            font-size: 14px !important;
        }
.borderwrap.read [class*="row"],
        .borderwrap.read [class*="post"],
        .borderwrap.read td[class*="formbutton"],
        .borderwrap.read .row2,
        .borderwrap.read .post2,
        .borderwrap.read .post1,
        .borderwrap.read td.formbuttonrow {
            background-color: #c895191f !important;
            color: #fbf298 !important;
            border: 2px solid #f6ed9566 !important;
            font-size: 16px !important;
        }
 .k45rZtFz0sNF1gYpGKXLz2n4UJ > li {
    border: 1px solid #40e8f0 !important;
    background: #2f1d36 !important;
    color: #ffffff !important;
    font-size: 14px !important;
}
td.formbuttonrow,.pformstrip,.borderwrap p.formbuttonrow,.borderwrap p.formbuttonrow1 {
    background: #c895191f !important;
    border: 1px solid #fbf298 !important;
}
 
.post-edit-reason {
    background: #363d22  !important;
    padding:   8px   15px !important;
    font-size: 16px !important;
    border-radius: 4px !important;
    color: #fbf298 !important;
 border: 2px solid #f6ed95 !important;
}
.borderwrap.read .row2, .borderwrap.read .post2, .borderwrap.read .post1, .borderwrap.read td.formbuttonrow {
    background-color: #161e0c !important;
}
     `;

    // Блокировка FOUC: скрываем ВСЁ до готовности
    const hideFOUC = () => {
        const style = document.createElement('style');
        style.id = 'fouc-blocker';
        style.textContent = 'html, body { visibility: hidden !important; }';
        document.documentElement.appendChild(style);  // Вставляем в <html>, чтобы сработало ДО head
    };

    // Инжект основного CSS (раньше всех)
    const injectTheme = () => {
        if (!document.head) return setTimeout(injectTheme, 0);
        const style = document.createElement('style');
        style.id = '4pda-dark-theme';
        style.textContent = themeCSS;
        document.head.insertBefore(style, document.head.firstChild);  // В начало head — выше оригинальных
        return true;
    };

    //============ Принудительное применение к элементам (с !important через JS)
    const applyStyles = () => {
        document.querySelectorAll('.borderwrap.read .row2, .borderwrap.read .post2, .borderwrap.read .post1, .borderwrap.read td.formbuttonrow').forEach(el => {
            el.style.setProperty('background-color', ' #161e0c', 'important');
        });
        document.querySelectorAll('td.formbuttonrow,.pformstrip,.borderwrap p.formbuttonrow,.borderwrap p.formbuttonrow1 ').forEach(el => {
            el.style.setProperty('background-color', ' #161e0c', 'important');
            el.style.setProperty('border: 1px solid #fbf298',  'important');
        });
         document.querySelectorAll('.k45rZtFz0sNF1gYpGKXLz2n4UJ > li, .advanced-area .post').forEach(el => {
            el.style.setProperty('background-color', ' #2f1d36', 'important');
            el.style.setProperty('color:', ' #ffffff',  'important');
            el.style.setProperty('border: 1px solid #40e8f0',  'important');
        });
    };

    
    // Наблюдатель за новыми элементами (AJAX-подгрузка)
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => applyStyles());
    });

    // Снятие блокировки FOUC
    const showPage = () => {
        const blocker = document.getElementById('fouc-blocker');
        if (blocker) blocker.remove();
        document.documentElement.style.visibility = '';
        if (document.body) document.body.style.visibility = '';
    };

    // Запуск
    hideFOUC();
    if (injectTheme()) {
        // Наблюдатель с момента body
        const startObserver = () => {
            if (!document.body) return setTimeout(startObserver, 0);
            observer.observe(document.body, { childList: true, subtree: true });
            applyStyles();  // К существующим
            requestAnimationFrame(() => {
                applyStyles();
                showPage();  // Показываем только после rAF
            });
        };
        startObserver();
    } else {
        // Если head задерживается — повтор
        const waitHead = setInterval(() => {
            if (injectTheme()) {
                clearInterval(waitHead);
                // Повторный запуск observer
                const startObserver = () => {
                    if (!document.body) return setTimeout(startObserver, 0);
                    observer.observe(document.body, { childList: true, subtree: true });
                    applyStyles();
                    showPage();
                };
                startObserver();
            }
        }, 0);
    }

    // Дополнительно: переприменение на полную загрузку
    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            applyStyles();
            showPage();
        });
    });
})();

 

