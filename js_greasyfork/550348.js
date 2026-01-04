// ==UserScript==
// @name         "Моя Страница", но круче... наверное
// @namespace    https://ovk.to/
// @version      6.9
// @description  Теперь ссылка "Моя Страница" в боковом меню имеет две настраиваемые строки и аватарку пользователя. Настроить можно через CTRL+Q (РАБОТАЕТ ТОЛЬКО НА АНГЛИЙСКОЙ РАСКЛАДКЕ!!!!!!!!!), применяется после загрузки. Пока что лишь черновик, который по большей части сгенерил ЧатГаПоТа, позже перепишу, как только появится время и желание...
// @author       Loroteber
// @license MIT
// @match        *://ovk.to/*
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550348/%22%D0%9C%D0%BE%D1%8F%20%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0%22%2C%20%D0%BD%D0%BE%20%D0%BA%D1%80%D1%83%D1%87%D0%B5%20%D0%BD%D0%B0%D0%B2%D0%B5%D1%80%D0%BD%D0%BE%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/550348/%22%D0%9C%D0%BE%D1%8F%20%D0%A1%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0%22%2C%20%D0%BD%D0%BE%20%D0%BA%D1%80%D1%83%D1%87%D0%B5%20%D0%BD%D0%B0%D0%B2%D0%B5%D1%80%D0%BD%D0%BE%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let profileInfo = null;
    let observer = null;

    const DEFAULT_SETTINGS = {
        line1: "first_name",
        line2: "nickname",
        customLine1: "Свой текст 1",
        customLine2: "Свой текст 2",
        showAvatar: true
    };

    function getUserSettings(userId) {
        const saved = localStorage.getItem(`ovk_sidebar_config_${userId}`);
        if(saved) return JSON.parse(saved);
        saveUserSettings(userId, DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
    }

    function saveUserSettings(userId, settings) {
        localStorage.setItem(`ovk_sidebar_config_${userId}`, JSON.stringify(settings));
    }

    function waitForOVKAPI() {
        return new Promise(resolve => {
            const check = () => {
                if (unsafeWindow.OVKAPI) resolve(unsafeWindow.OVKAPI);
                else setTimeout(check, 100);
            };
            check();
        });
    }

    function formatLine(option, settings) {
        if(!profileInfo) return "";
        switch(option) {
            case "first_name": return profileInfo.first_name || "";
            case "last_name": return profileInfo.last_name || "";
            case "nickname": return profileInfo.nickname || "";
            case "id": return profileInfo.id || "";
            case "status": return profileInfo.status || "";
            case "custom1": return settings.customLine1 || "";
            case "custom2": return settings.customLine2 || "";
            case "empty": return "";
            default: return "";
        }
    }

    function updateSidebar(settings) {
        if(!profileInfo) return;

        const link = document.querySelector('div.sidebar a.link[accesskey="."]');
        if(link) {
            const line1 = `<b>${formatLine(settings.line1, settings)}</b>`;
            const line2 = `<span>${formatLine(settings.line2, settings)}</span>`;

            let avatarHTML = '';
            if(settings.showAvatar) {
                avatarHTML = `<img width="30px" src="${profileInfo.photo_200}">`;
            }

            const newHTML = `<div class="cool_mypage" style="display:flex;align-items:center;gap:6px;">
                                ${avatarHTML}
                                <div style="line-height:1.1;">
                                    ${line1}<br>${line2}
                                </div>
                             </div>`;
            if(link.innerHTML !== newHTML) {
                if(observer) observer.disconnect();
                link.innerHTML = newHTML;
                if(observer) observer.observe(document.body, {childList:true,subtree:true});
            }
        }

        const editBtn = document.querySelector('div.sidebar a.link.edit-button');
        if(editBtn) editBtn.remove();
    }

    function showSettingsDialog(userId, settings) {
        const html = `
        <div style="display:flex; gap: 40px; flex-wrap:wrap;">
            <div>
                <p><b>Первая строка:</b></p>
                <select id="select_line1">
                    <option value="first_name" ${settings.line1==="first_name"?"selected":""}>Имя</option>
                    <option value="last_name" ${settings.line1==="last_name"?"selected":""}>Фамилия</option>
                    <option value="nickname" ${settings.line1==="nickname"?"selected":""}>Никнейм</option>
                    <option value="id" ${settings.line1==="id"?"selected":""}>ID</option>
                    <option value="status" ${settings.line1==="status"?"selected":""}>Статус</option>
                    <option value="custom1" ${settings.line1==="custom1"?"selected":""}>Свой текст</option>
                    <option value="empty" ${settings.line1==="empty"?"selected":""}>Пусто</option>
                </select>
                <p class="nobold"><i>Свой текст:</i></p>
                <input type="text" id="input_custom1" value="${settings.customLine1}" placeholder="Свой текст">
            </div>
            <div>
                <p><b>Вторая строка:</b></p>
                <select id="select_line2">
                    <option value="first_name" ${settings.line2==="first_name"?"selected":""}>Имя</option>
                    <option value="last_name" ${settings.line2==="last_name"?"selected":""}>Фамилия</option>
                    <option value="nickname" ${settings.line2==="nickname"?"selected":""}>Никнейм</option>
                    <option value="id" ${settings.line2==="id"?"selected":""}>ID</option>
                    <option value="status" ${settings.line2==="status"?"selected":""}>Статус</option>
                    <option value="custom2" ${settings.line2==="custom2"?"selected":""}>Свой текст</option>
                    <option value="empty" ${settings.line2==="empty"?"selected":""}>Пусто</option>
                </select>
                <p class="nobold"><i>Свой текст:</i></p>
                <input type="text" id="input_custom2" value="${settings.customLine2}" placeholder="Свой текст">
            </div>
        </div>
        <div style="margin-top:10px;">
            <input type="checkbox" id="checkbox_avatar" ${settings.showAvatar?'checked':''}> Показывать аватарку
        </div>
        `;

        unsafeWindow.MessageBox(
            'Настройка ссылки "Моя Страница"',
            html,
            ['Отмена','Подтвердить'],
            [
                ()=>{},
                ()=>{
                    const newSettings = {
                        line1: document.getElementById('select_line1').value,
                        line2: document.getElementById('select_line2').value,
                        customLine1: document.getElementById('input_custom1').value,
                        customLine2: document.getElementById('input_custom2').value,
                        showAvatar: document.getElementById('checkbox_avatar').checked
                    };
                    saveUserSettings(userId,newSettings);
                    updateSidebar(newSettings);
                }
            ],
            false
        );
    }

    async function init() {
        const OVKAPI = await waitForOVKAPI();
        try {
            profileInfo = await OVKAPI.call("account.getProfileInfo", {});
            const userId = profileInfo.id;
            let settings = getUserSettings(userId);

            updateSidebar(settings);

            observer = new MutationObserver(()=>updateSidebar(settings));
            observer.observe(document.body,{childList:true,subtree:true});

            window.addEventListener('keydown', e=>{
                if(e.ctrlKey && !e.shiftKey && e.key.toLowerCase()==='q'){
                    let settings = getUserSettings(userId);
                    showSettingsDialog(userId,settings);
                }
            });

        } catch(e){ console.error("Ошибка:",e);}
    }

    init();
})();
