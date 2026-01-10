// ==UserScript==
// @name             Money Alert
// @namespace        http://tampermonkey.net/
// @version          1.1
// @description      Alert when money increase.
// @author           NLMK [4026658]
// @icon             https://cdn.discordapp.com/attachments/1455568011539906561/1455568085493743778/image.png?ex=695d1bea&is=695bca6a&hm=72a44a5665df24972ee5a45978ffbf8e3ae3046f2c9683f8f77c8638eb797ba9&
// @match            https://www.torn.com/*
// @license          MIT
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/562116/Money%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/562116/Money%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const audio = document.createElement('audio');
    audio.src = 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3';

    let previousMoney = null;
    let soundEnabled = localStorage.getItem('ma_sound_enabled') !== 'false';

    const icons = {
        on: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16.03C15.5,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/></svg>',
        off: '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12,4L9.91,6.09L12,8.18V4M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73L4.27,3M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.48,12.43 16.5,12.22 16.5,12Z"/></svg>'
    };

    const q = (s, n = document) => n.querySelector(s);
    const qa = (s, n = document) => Array.from(n.querySelectorAll(s));

    const updateUI = () => {
        const li = q('#ma-li');
        if (!li) return;
        const iconWrap = q('.icon-wrapper', li);
        if (iconWrap) iconWrap.innerHTML = soundEnabled ? icons.on : icons.off;
    };

    const injectMenu = () => {
        const menu = q('ul.settings-menu');
        if (!menu || q('#ma-li')) return;

        const li = document.createElement('li');
        li.id = 'ma-li';
        li.className = 'link';
        li.innerHTML = `
            <a class="main-link" href="#" style="display: flex; align-items: center; width: 100%;">
                <div class="icon-wrapper" style="display: flex; align-items: center; justify-content: center;"></div>
                <span class="link-text">Money Alert</span>
            </a>
        `;

        li.onclick = (e) => {
            e.preventDefault();
            soundEnabled = !soundEnabled;
            localStorage.setItem('ma_sound_enabled', soundEnabled);
            updateUI();
        };

        const pref = qa('li.link', menu).find(el => q('a[href*="preferences.php"]', el));
        pref ? menu.insertBefore(li, pref) : menu.appendChild(li);
        updateUI();
    };

    const checkMoney = () => {
        const el = document.getElementById('user-money');
        if (!el) return;
        const currentMoney = parseInt(el.getAttribute('data-money'), 10);
        if (soundEnabled && previousMoney !== null && currentMoney > previousMoney) {
            audio.play().catch(() => {});
        }
        previousMoney = currentMoney;
    };

    const init = () => {
        const target = document.getElementById('user-money');
        if (target) {
            previousMoney = parseInt(target.getAttribute('data-money'), 10);

            const observer = new MutationObserver((mutations) => {
                injectMenu();
                for (const mutation of mutations) {
                    if (mutation.attributeName === 'data-money') {
                        checkMoney();
                    }
                }
            });

            observer.observe(target, { attributes: true, attributeFilter: ['data-money'] });

            const menuObserver = new MutationObserver(injectMenu);
            menuObserver.observe(document.body, { childList: true, subtree: true });
        } else {
            setTimeout(init, 1000);
        }
    };

    injectMenu();
    init();
})();