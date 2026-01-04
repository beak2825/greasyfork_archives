// ==UserScript==
// @name         Get Clan Score
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Send score to database
// @author       LedFox
// @match        https://animestars.org/clubs/boost/?id=36&interval=week
// @match        https://astars.club/clubs/boost/?id=36&interval=week
// @match        https://asstars1.astars.club/clubs/boost/?id=36&interval=week
// @match        https://as1.astars.club/aniserials/clubs/boost/?id=36&interval=week
// @match        https://asstars.tv/aniserials/clubs/boost/?id=36&interval=week
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animestars.org
// @grant        none
// @license      LedFox
// @downloadURL https://update.greasyfork.org/scripts/553951/Get%20Clan%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/553951/Get%20Clan%20Score.meta.js
// ==/UserScript==
const webhookUrl = "https://script.google.com/macros/s/AKfycbxulg5TjNvTZt92eduhWj0tT3dbWBZMlUnrTuqy74IUi89-IYDBiyEqQTJNALROF1vUdA/exec";
(function() {
    const style = document.createElement('style');
    style.textContent = `
      .floating-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #FFFFFF;
        color: white;
        border: none;
        border-radius: 50%;
        width: 56px;
        height: 56px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        font-size: 24px;
        cursor: pointer;
        z-index: 9999;
        transition: background-color 0.3s ease, transform 0.2s ease;
      }
      .floating-button:hover {
        background-color: #000000;
        transform: scale(1.1);
      }
      .floating-button:active {
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(style);

    // Создание кнопки
    const button = document.createElement('button');
    button.className = 'floating-button';
    button.innerText = '🚀';
    button.title = 'Натисни, щоб діяти';
    button.addEventListener('click', function () {
        const idList = document.getElementsByClassName("club-boost__top-name");
    const valueList = document.getElementsByClassName("club-boost__top-contribution");

    const pairs = [];

    for (let i = 0; i < idList.length; i++) {
        const id = idList[i].textContent.trim();
        const value = valueList[i].textContent.trim();
        pairs.push(`${id}::${value}`);
    }

    const dataString = pairs.join("||"); // Разделитель между парами
    const fullUrl = `${webhookUrl}?data=${encodeURIComponent(dataString)}`;

    fetch(fullUrl)
        .then(response => console.log("✅ Отправлено:", response.status))
        .catch(error => console.error("❌ Ошибка:", error));
    });

    document.body.appendChild(button);

    
})();
