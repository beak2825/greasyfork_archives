// ==UserScript==
// @name         Raffaello Integration
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Raffaello Integration for admin
// @author       Nikita
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*/Admin/CompareBagNew/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558447/Raffaello%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/558447/Raffaello%20Integration.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tm-new-ui-enabled'; // '1' → новый, '0' → старый
    const PATH_OLD = '/Admin/CompareBag/EditBag/';
    const PATH_NEW = '/Admin/CompareBagNew/EditBag/';

    function isNewPage() {
        return location.pathname.indexOf(PATH_NEW) === 0;
    }

    function getBagId() {
        const parts = location.pathname.split('/').filter(Boolean);
        const last = parts[parts.length - 1];
        return last || null;
    }

    function ensureCorrectVersion() {
        const bagId = getBagId();
        if (!bagId) return false;

        const saved = localStorage.getItem(STORAGE_KEY); // '1' / '0' / null
        const currentIsNew = isNewPage();

        // Если ещё нет сохранённого значения — подхватываем из текущей страницы
        if (saved === null) {
            localStorage.setItem(STORAGE_KEY, currentIsNew ? '1' : '0');
            return false;
        }

        const wantNew = saved === '1';

        // Если хотим NEW, а сейчас OLD → редирект в CompareBagNew
        if (wantNew && !currentIsNew) {
            const url = location.origin + PATH_NEW + bagId + location.search + location.hash;
            location.replace(url);
            return true;
        }

        // Если хотим OLD, а сейчас NEW → редирект в CompareBag
        if (!wantNew && currentIsNew) {
            const url = location.origin + PATH_OLD + bagId + location.search + location.hash;
            location.replace(url);
            return true;
        }

        return false;
    }

    // Сначала решаем, нужно ли редиректить
    if (ensureCorrectVersion()) {
        return; // дальше не идём, всё равно будет новая загрузка
    }

    function addToggle() {
        const navPullRight = document.querySelector('.nav.pull-right');
        if (!navPullRight) return;

        if (document.getElementById('tm-new-ui-toggle-box')) return;

        const css = `
            #tm-new-ui-toggle-box {
                position: relative;
                top: 8px;
                float: right;
                margin-right: 15px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                line-height: 1;
            }

            #tm-new-ui-label {
                font-size: 10px;
                margin-bottom: 2px;
                text-transform: uppercase;
                font-weight: bold;
                color: #fff !important;
                opacity: 0.9;
            }

            .tm-switch {
                position: relative;
                width: 36px;
                height: 18px;
                display: inline-block;
            }

            .tm-switch input {
                display: none;
            }

            .tm-slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: #0A86D9;      /* выключено */
                border-radius: 18px;
                transition: .3s;
            }

            .tm-slider:before {
                position: absolute;
                content: "";
                height: 14px;
                width: 14px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                border-radius: 50%;
                transition: .3s;
            }

            input:checked + .tm-slider {
                background-color: #00D13A;      /* включено — ярко зелёный */
            }

            input:checked + .tm-slider:before {
                transform: translateX(18px);
            }
        `;
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);

        const box = document.createElement('div');
        box.id = 'tm-new-ui-toggle-box';

        box.innerHTML = `
            <div id="tm-new-ui-label">NEW-UI</div>
            <label class="tm-switch">
                <input type="checkbox" id="tm-new-ui-input">
                <span class="tm-slider"></span>
            </label>
        `;

        navPullRight.parentNode.insertBefore(box, navPullRight);

        const input = box.querySelector('#tm-new-ui-input');
        const saved = localStorage.getItem(STORAGE_KEY);
        const currentIsNew = isNewPage();

        // Текущее состояние: либо сохранённое, либо по факту страницы
        let enabled = saved !== null ? (saved === '1') : currentIsNew;

        input.checked = enabled;
        window.__NEW_UI_ENABLED = enabled;
        document.documentElement.classList.toggle('tm-new-ui-enabled', enabled);

        input.addEventListener('change', () => {
            enabled = input.checked;
            window.__NEW_UI_ENABLED = enabled;
            document.documentElement.classList.toggle('tm-new-ui-enabled', enabled);
            localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');

            const bagId = getBagId();
            if (!bagId) return;

            // Мгновенно прыгаем на нужную версию с тем же ID
            const targetPath = enabled ? PATH_NEW : PATH_OLD;
            const url = location.origin + targetPath + bagId + location.search + location.hash;
            if (location.pathname + location.search + location.hash !== url.replace(location.origin, '')) {
                location.replace(url);
            }
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive')
        addToggle();
    else
        document.addEventListener('DOMContentLoaded', addToggle);

})();