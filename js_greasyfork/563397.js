// ==UserScript==
// @name         Topic Activity — Who is viewing (Manchester United)
// @match        https://forum.blackrussia.online/*/threads/*
// @version      1.0
// @run-at       document-end
// @description qqq
// @license MIT
// @namespace https://greasyfork.org/users/1539528
// @downloadURL https://update.greasyfork.org/scripts/563397/Topic%20Activity%20%E2%80%94%20Who%20is%20viewing%20%28Manchester%20United%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563397/Topic%20Activity%20%E2%80%94%20Who%20is%20viewing%20%28Manchester%20United%29.meta.js
// ==/UserScript==

(function () {

    const css = `
    .manu-viewers {
        background: linear-gradient(135deg, #0a0a0a, #000);
        border: 2px solid #ff0000;
        box-shadow: 0 0 20px #ff0000aa;
        border-radius: 10px;
        margin: 15px 0;
        padding: 15px;
        color: #fff;
        position: relative;
    }

    .manu-viewers h3 {
        margin: 0 0 10px 0;
        color: #ff0000;
        font-size: 20px;
        text-shadow: 0 0 10px #ff0000;
    }

    .manu-users {
        font-size: 14px;
        line-height: 1.4;
        margin-top: 10px;
    }

    .manu-user {
        color: #ff4d4d;
        font-weight: 600;
    }

    .manu-guest {
        color: #aaa;
        margin-left: 5px;
    }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    
    const box = document.createElement("div");
    box.className = "manu-viewers";
    box.innerHTML = `
        <h3>👀 Просматривают сейчас</h3>
        <div id="manu-count">Загрузка...</div>
        <div class="manu-users" id="manu-users"></div>
    `;

    
    const header = document.querySelector('.p-body-header');
    if (header) header.after(box);

   
    const threadIdMatch = window.location.pathname.match(/threads\/.+\.(\d+)/);
    if (!threadIdMatch) return;
    const threadId = threadIdMatch[1];

    async function updateViewers() {
        try {
            const res = await fetch(`/threads/${threadId}/viewers`, {
                method: "GET",
                headers: { "X-Requested-With": "XMLHttpRequest" }
            });

            const data = await res.json();

            const users = data?.viewing?.users || [];
            const guests = data?.viewing?.guests || 0;

            document.getElementById("manu-count").innerHTML =
                `Пользователей: <b>${users.length}</b> • Гостей: <b>${guests}</b>`;

            document.getElementById("manu-users").innerHTML =
                users.length
                    ? users.map(u => `<span class="manu-user">${u.username}</span>`).join(", ")
                    : "Пользователей нет";
        }
        catch (e) {
            document.getElementById("manu-count").innerHTML = "Ошибка загрузки";
        }
    }

    
    updateViewers();
    setInterval(updateViewers, 10000);

})();