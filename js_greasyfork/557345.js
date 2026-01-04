// ==UserScript==
// @name         script winsize
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Быстрые ответы на жалобы с красивым шрифтом
// @author       Winsize
// @match        *://*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557345/script%20winsize.user.js
// @updateURL https://update.greasyfork.org/scripts/557345/script%20winsize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Подключаем шрифт Poppins
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Панель для кнопок
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "50px";
    panel.style.right = "20px";
    panel.style.width = "250px";
    panel.style.backgroundColor = "#1e1e2f";
    panel.style.color = "#ffffff";
    panel.style.padding = "15px";
    panel.style.borderRadius = "12px";
    panel.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
    panel.style.zIndex = "9999";
    panel.style.fontFamily = "'Poppins', sans-serif";
    panel.style.fontSize = "14px";

    // Массив шаблонов ответов
    const templates = [
        {
            name: "Адм прав",
            text: `Здравствуйте уважаемый [ник],
Администратор верно выдал наказание.
Отказано.
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        },
        {
            name: "Адм ошибся",
            text: `Здравствуйте уважаемый [ник],
Просим прощения за предоставление неудобства, администратор ошибся с наказанием. Ваше наказание будет снято если оно имеется.
Одобрено.
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        },
        {
            name: "Беседа",
            text: `Здравствуйте уважаемый [ник],
С администратором будет проведена беседа. Просим прощения за предоставление неудобства.
Одобрено.
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        },
        {
            name: "На рассмотрение",
            text: `Здравствуйте уважаемый [ник],
Ожидайте ответа от руководства сервера.
На рассмотрение.
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        },
        {
            name: "Ошиблись разделом",
            text: `Здравствуйте уважаемый [ник],
Вы ошиблись разделом, перенаправлю вас в нужный раздел.
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        },
        {
            name: "Жалоба на ГА",
            text: `Здравствуйте уважаемый [ник],
Ваша жалоба передано ЗСА/СА
Ожидайте вердикта.
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        },
        {
            name: "Не по форме",
            text: `Здравствуйте уважаемый [ник],
Вы написали жалобу не по форме подачи жалобы.
Закрыто
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        },
        {
            name: "48 часов",
            text: `Здравствуйте уважаемый [ник],
Ваша жалоба подано после 48 часов после получения наказания.
Отказано.
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        },
        {
            name: "Бан от теха",
            text: `Здравствуйте уважаемый [ник],
Вы получили блокировку от технического специалиста, обратитесь в жалобы на тех специалистов.
Закрыто.
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        },
        {
            name: "Нету /time",
            text: `Здравствуйте уважаемый [ник],
На ваших доказательства нету /time.
Отказано.
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        },
        {
            name: "Окно блокировки",
            text: `Здравствуйте уважаемый [ник],
Прикрепите пожалуйста в доказательствах скриншот окно блокировки аккаунт.
Закрыто.
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        },
        {
            name: "Работа с адм",
            text: `Здравствуйте уважаемый [ник],
С администратором будет проведена необходимая работа, благодарим за предоставленную информацию.
Одобрено.
https://i.postimg.cc/DZ2xYnzT/41df96a302c44563f03d57ebbb28566f.gif`
        }
    ];

    templates.forEach(t => {
        const btn = document.createElement("button");
        btn.textContent = t.name;
        btn.style.display = "block";
        btn.style.margin = "6px 0";
        btn.style.width = "100%";
        btn.style.padding = "8px";
        btn.style.cursor = "pointer";
        btn.style.fontFamily = "'Poppins', sans-serif";
        btn.style.fontSize = "14px";
        btn.style.fontWeight = "600";
        btn.style.backgroundColor = "#4a4a6a";
        btn.style.color = "#ffffff";
        btn.style.border = "none";
        btn.style.borderRadius = "8px";
        btn.addEventListener("click", () => {
            navigator.clipboard.writeText(t.text).then(() => {
                alert("Текст скопирован в буфер!");
            });
        });
        panel.appendChild(btn);
    });

    document.body.appendChild(panel);
})();